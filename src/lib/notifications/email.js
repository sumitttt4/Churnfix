import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

/**
 * Send a dunning recovery email to a customer whose payment failed.
 */
export async function sendDunningEmail({
  to,
  customerName,
  amount,
  processor,
  template,
  stripeCustomerId,
}) {
  if (!to || !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_placeholder") {
    console.log("[Churnfix] Skipping email — no valid RESEND_API_KEY configured");
    console.log(`[Churnfix] Would send dunning email to: ${to}`);
    return;
  }

  // Build recovery link (Stripe Customer Portal or generic link)
  const recoveryLink = stripeCustomerId
    ? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/update-billing?customer=${stripeCustomerId}`
    : `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/update-billing`;

  // Interpolate template variables
  const subject = interpolate(template.subject, {
    customer_name: customerName,
    amount: `$${amount.toFixed(2)}`,
    billing_platform: processor,
    recovery_link: recoveryLink,
  });

  const body = interpolate(template.body, {
    customer_name: customerName,
    amount: `$${amount.toFixed(2)}`,
    billing_platform: processor,
    recovery_link: recoveryLink,
  });

  try {
    await resend.emails.send({
      from: "Churnfix <billing@churnfix.com>",
      to: [to],
      subject,
      text: body,
      html: buildHtmlEmail(body, customerName, amount, processor, recoveryLink),
    });

    console.log(`[Churnfix] Dunning email sent to: ${to}`);
  } catch (err) {
    console.error("[Churnfix] Email send failed:", err.message);
  }
}

function interpolate(text, vars) {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => vars[key] || match);
}

function buildHtmlEmail(plainText, customerName, amount, processor, recoveryLink) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; padding: 40px 20px;">
      <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
        <div style="background: #0F172A; padding: 24px 32px;">
          <span style="color: #10B981; font-weight: 700; font-size: 16px; letter-spacing: -0.03em;">CHURNFIX</span>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #0F172A; font-size: 20px; margin: 0 0 16px 0;">Payment Update Required</h2>
          <div style="color: #475569; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${plainText.replace(/\n/g, "<br>")}</div>
          <div style="margin-top: 24px;">
            <a href="${recoveryLink}" style="display: inline-block; background: #10B981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Update Payment Method</a>
          </div>
        </div>
        <div style="padding: 16px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
          <span style="color: #94A3B8; font-size: 12px;">Sent by Churnfix on behalf of your service provider</span>
        </div>
      </div>
    </body>
    </html>
  `;
}
