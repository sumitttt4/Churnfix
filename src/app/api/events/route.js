import { db } from "@/lib/db";
import { getServerSession, getOrCreateOrganization } from "@/lib/auth-server";

export async function GET(request) {
  const session = await getServerSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await getOrCreateOrganization(session.user.id, session.user.name);

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const processor = searchParams.get("processor");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where = {
    organizationId: org.id,
    ...(status && status !== "all" ? { status } : {}),
    ...(processor && processor !== "all" ? { processor } : {}),
    ...(search
      ? {
          OR: [
            { customerName: { contains: search } },
            { customerEmail: { contains: search } },
            { invoiceId: { contains: search } },
            { id: { contains: search } },
          ],
        }
      : {}),
  };

  const [events, total] = await Promise.all([
    db.paymentEvent.findMany({
      where,
      orderBy: { timestamp: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.paymentEvent.count({ where }),
  ]);

  return Response.json({
    events,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request) {
  const session = await getServerSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await getOrCreateOrganization(session.user.id, session.user.name);
  const body = await request.json();

  const event = await db.paymentEvent.create({
    data: {
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      processor: body.processor || "stripe",
      amount: parseFloat(body.amount) || 0,
      status: body.status || "failed",
      reason: body.reason || "insufficient_funds",
      invoiceId: body.invoiceId || `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      attempts: body.attempts || 1,
      organizationId: org.id,
      rawPayload: body.rawPayload ? JSON.stringify(body.rawPayload) : null,
    },
  });

  return Response.json({ event }, { status: 201 });
}
