import { db } from "@/lib/db";
import { getServerSession, getOrCreateOrganization } from "@/lib/auth-server";

export async function GET(request, { params }) {
  const session = await getServerSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const org = await getOrCreateOrganization(session.user.id, session.user.name);

  const event = await db.paymentEvent.findFirst({
    where: { id, organizationId: org.id },
  });

  if (!event) {
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  return Response.json({ event });
}

export async function PATCH(request, { params }) {
  const session = await getServerSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const org = await getOrCreateOrganization(session.user.id, session.user.name);
  const body = await request.json();

  const existing = await db.paymentEvent.findFirst({
    where: { id, organizationId: org.id },
  });

  if (!existing) {
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  const updated = await db.paymentEvent.update({
    where: { id },
    data: {
      status: body.status || existing.status,
      reason: body.reason || existing.reason,
      attempts: body.attempts || existing.attempts,
    },
  });

  return Response.json({ event: updated });
}
