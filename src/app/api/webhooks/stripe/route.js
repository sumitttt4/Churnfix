import Stripe from "stripe";
import { db } from "@/lib/db";
import { sendSlackNotification } from "@/lib/notifications/slack";
import { sendDiscordNotification } from "@/lib/notifications/discord";
import { sendDunningEmail } from "@/lib/notifications/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event;

  // Verify webhook signature if secret is configured
  if (process.env.STRIPE_WEBHOOK_SECRET && process.env.STRIPE_WEBHOOK_SECRET !== "whsec_placeholder") {
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Stripe webhook signature verification failed:", err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
  } else {
    // In dev without webhook secret, parse the raw body
    try {
      event = JSON.parse(body);
    } catch (err) {
      return new Response("Invalid JSON", { status: 400 });
    }
  }

  // Find the organization with Stripe connected
  const stripeIntegration = await db.integrationConfig.findFirst({
    where: {
      processor: "stripe",
      connected: true,
    },
    include: {
      organization: {
        include: {
          alertConfig: true,
          emailTemplate: true,
        },
      },
    },
  });

  if (!stripeIntegration) {
    console.log("No organization with Stripe connected found");
    return Response.json({ received: true, processed: false });
  }

  const org = stripeIntegration.organization;

  try {
    switch (event.type) {
      case "invoice.payment_failed": {
        const invoice = event.data.object;

        // Create payment event record
        const paymentEvent = await db.paymentEvent.create({
          data: {
            externalId: event.id,
            customerName: invoice.customer_name || invoice.customer_email || "Unknown",
            customerEmail: invoice.customer_email || "",
            processor: "stripe",
            amount: (invoice.amount_due || 0) / 100,
            currency: invoice.currency || "usd",
            status: "failed",
            reason: invoice.last_payment_error?.code || "payment_failed",
            invoiceId: invoice.id,
            attempts: invoice.attempt_count || 1,
            stripeCustomerId: invoice.customer,
            rawPayload: JSON.stringify(event),
            organizationId: org.id,
          },
        });

        // Send notifications
        if (org.alertConfig?.slackEnabled && org.alertConfig?.slackWebhook) {
          await sendSlackNotification(org.alertConfig.slackWebhook, {
            type: "payment_failed",
            customerName: paymentEvent.customerName,
            customerEmail: paymentEvent.customerEmail,
            amount: paymentEvent.amount,
            reason: paymentEvent.reason,
            processor: "Stripe",
          });
        }

        if (org.alertConfig?.discordEnabled && org.alertConfig?.discordWebhook) {
          await sendDiscordNotification(org.alertConfig.discordWebhook, {
            type: "payment_failed",
            customerName: paymentEvent.customerName,
            customerEmail: paymentEvent.customerEmail,
            amount: paymentEvent.amount,
            reason: paymentEvent.reason,
            processor: "Stripe",
          });
        }

        // Send dunning recovery email
        if (org.alertConfig?.emailEnabled && org.emailTemplate) {
          await sendDunningEmail({
            to: paymentEvent.customerEmail,
            customerName: paymentEvent.customerName,
            amount: paymentEvent.amount,
            processor: "Stripe",
            template: org.emailTemplate,
            stripeCustomerId: paymentEvent.stripeCustomerId,
          });
        }

        console.log(`[Churnfix] Payment failed event processed: ${paymentEvent.id}`);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;

        // Find and update any failed events for this customer
        const failedEvents = await db.paymentEvent.findMany({
          where: {
            organizationId: org.id,
            customerEmail: invoice.customer_email || "",
            status: { in: ["failed", "retrying"] },
          },
        });

        if (failedEvents.length > 0) {
          // Mark the most recent failed event as recovered
          await db.paymentEvent.update({
            where: { id: failedEvents[0].id },
            data: {
              status: "recovered",
              reason: "payment_succeeded",
            },
          });

          // Create a recovery event record
          await db.paymentEvent.create({
            data: {
              externalId: event.id,
              customerName: invoice.customer_name || invoice.customer_email || "Unknown",
              customerEmail: invoice.customer_email || "",
              processor: "stripe",
              amount: (invoice.amount_paid || 0) / 100,
              currency: invoice.currency || "usd",
              status: "recovered",
              reason: "resolved",
              invoiceId: invoice.id,
              attempts: (failedEvents[0].attempts || 1) + 1,
              stripeCustomerId: invoice.customer,
              rawPayload: JSON.stringify(event),
              organizationId: org.id,
            },
          });

          // Send recovery notifications
          if (org.alertConfig?.slackEnabled && org.alertConfig?.slackWebhook) {
            await sendSlackNotification(org.alertConfig.slackWebhook, {
              type: "payment_recovered",
              customerName: invoice.customer_name || invoice.customer_email,
              customerEmail: invoice.customer_email,
              amount: (invoice.amount_paid || 0) / 100,
              processor: "Stripe",
            });
          }

          console.log(`[Churnfix] Payment recovered for: ${invoice.customer_email}`);
        }
        break;
      }

      default:
        console.log(`[Churnfix] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("[Churnfix] Error processing webhook:", err);
    return new Response("Internal error", { status: 500 });
  }

  return Response.json({ received: true });
}
