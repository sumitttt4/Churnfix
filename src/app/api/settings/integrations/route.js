import { db } from "@/lib/db";
import { getServerSession, getOrCreateOrganization } from "@/lib/auth-server";

export async function POST(request) {
  const session = await getServerSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await getOrCreateOrganization(session.user.id, session.user.name);
  const body = await request.json();
  const { processor, action } = body; // action: "connect" | "disconnect"

  if (!processor) {
    return Response.json({ error: "Processor is required" }, { status: 400 });
  }

  // Check tier limits
  if (action === "connect") {
    const connectedCount = await db.integrationConfig.count({
      where: { organizationId: org.id, connected: true },
    });

    if (org.plan === "free" && connectedCount >= 1) {
      return Response.json(
        { error: "Free tier is limited to 1 billing stack. Upgrade to Growth ($29/mo) to connect up to 3 stacks." },
        { status: 403 }
      );
    }
    if (org.plan === "growth" && connectedCount >= 3) {
      return Response.json(
        { error: "Growth tier supports up to 3 billing stacks. Upgrade to Scale ($59/mo) for unlimited stacks." },
        { status: 403 }
      );
    }
  }

  const integration = await db.integrationConfig.upsert({
    where: {
      organizationId_processor: {
        organizationId: org.id,
        processor,
      },
    },
    create: {
      organizationId: org.id,
      processor,
      connected: action === "connect",
      apiKey: body.apiKey || null,
      webhookSecret: body.webhookSecret || null,
    },
    update: {
      connected: action === "connect",
      ...(body.apiKey ? { apiKey: body.apiKey } : {}),
      ...(body.webhookSecret ? { webhookSecret: body.webhookSecret } : {}),
    },
  });

  return Response.json({ integration });
}
