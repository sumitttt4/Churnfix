import { db } from "@/lib/db";
import { getServerSession, getOrCreateOrganization } from "@/lib/auth-server";

export async function GET(request) {
  const session = await getServerSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await getOrCreateOrganization(session.user.id, session.user.name);

  // Get all events for this org
  const events = await db.paymentEvent.findMany({
    where: { organizationId: org.id },
  });

  const failedEvents = events.filter(
    (e) => e.status === "failed" || e.status === "retrying"
  );
  const recoveredEvents = events.filter((e) => e.status === "recovered");

  const atRiskAmount = failedEvents.reduce((sum, e) => sum + e.amount, 0);
  const recoveredAmount = recoveredEvents.reduce((sum, e) => sum + e.amount, 0);

  const uniqueAffectedEmails = new Set(
    failedEvents.map((e) => e.customerEmail.toLowerCase())
  );

  const totalClosed = failedEvents.length + recoveredEvents.length;
  const recoveryRate =
    totalClosed > 0 ? (recoveredEvents.length / totalClosed) * 100 : 0;

  // 7-day chart data
  const chartData = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const dayEvents = events.filter((e) => {
      const eventDate = new Date(e.timestamp);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });

    const failed = dayEvents
      .filter((e) => e.status === "failed" || e.status === "retrying")
      .reduce((sum, e) => sum + e.amount, 0);
    const recovered = dayEvents
      .filter((e) => e.status === "recovered")
      .reduce((sum, e) => sum + e.amount, 0);

    chartData.push({ label: dateStr, failed, recovered });
  }

  return Response.json({
    atRiskAmount,
    recoveredAmount,
    affectedCustomers: uniqueAffectedEmails.size,
    recoveryRate,
    activeFailures: failedEvents.length,
    totalRecoveries: recoveredEvents.length,
    chartData,
  });
}
