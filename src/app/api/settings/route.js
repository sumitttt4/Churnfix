import { db } from "@/lib/db";
import { getServerSession, getOrCreateOrganization } from "@/lib/auth-server";

export async function GET(request) {
  const session = await getServerSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await getOrCreateOrganization(session.user.id, session.user.name);

  const [integrations, alertConfig, emailTemplate] = await Promise.all([
    db.integrationConfig.findMany({
      where: { organizationId: org.id },
    }),
    db.alertConfig.findFirst({
      where: { organizationId: org.id },
    }),
    db.emailTemplate.findFirst({
      where: { organizationId: org.id },
    }),
  ]);

  // Build connectedProcessors map
  const connectedProcessors = {};
  integrations.forEach((i) => {
    connectedProcessors[i.processor] = i.connected;
  });

  return Response.json({
    organization: {
      id: org.id,
      name: org.name,
      plan: org.plan,
    },
    connectedProcessors,
    alertSettings: alertConfig || {
      slackEnabled: false,
      slackWebhook: "",
      discordEnabled: false,
      discordWebhook: "",
      emailEnabled: true,
      emailAddress: "",
    },
    emailTemplate: emailTemplate || {
      subject: "Action Required: Failed payment for your subscription",
      body: "Hi {{customer_name}},\n\nWe were unable to process your recent monthly payment of {{amount}} on {{billing_platform}}.\n\nTo keep your account active and avoid any interruptions, please update your billing details here:\n{{recovery_link}}\n\nThank you,\nThe Billing Team",
    },
  });
}

export async function PUT(request) {
  const session = await getServerSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await getOrCreateOrganization(session.user.id, session.user.name);
  const body = await request.json();

  // Update alert config
  if (body.alertSettings) {
    await db.alertConfig.upsert({
      where: { organizationId: org.id },
      create: {
        organizationId: org.id,
        ...body.alertSettings,
      },
      update: body.alertSettings,
    });
  }

  // Update email template
  if (body.emailTemplate) {
    await db.emailTemplate.upsert({
      where: { organizationId: org.id },
      create: {
        organizationId: org.id,
        ...body.emailTemplate,
      },
      update: body.emailTemplate,
    });
  }

  // Update organization plan
  if (body.plan) {
    await db.organization.update({
      where: { id: org.id },
      data: { plan: body.plan },
    });
  }

  return Response.json({ success: true });
}
