/**
 * Send a Discord notification via webhook.
 */
export async function sendDiscordNotification(webhookUrl, data) {
  if (!webhookUrl) return;

  const isRecovered = data.type === "payment_recovered";

  const embed = {
    title: isRecovered ? "✅ Payment Recovered" : "🚨 Payment Failed",
    color: isRecovered ? 0x10b981 : 0xb91c1c,
    fields: [
      { name: "Customer", value: data.customerName || "Unknown", inline: true },
      { name: "Email", value: data.customerEmail || "N/A", inline: true },
      {
        name: "Amount",
        value: `$${data.amount?.toFixed(2) || "0.00"}`,
        inline: true,
      },
      { name: "Processor", value: data.processor || "Unknown", inline: true },
      ...(data.reason
        ? [
            {
              name: "Reason",
              value: data.reason.replace(/_/g, " "),
              inline: true,
            },
          ]
        : []),
    ],
    footer: {
      text: "Churnfix",
    },
    timestamp: new Date().toISOString(),
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [embed],
      }),
    });
  } catch (err) {
    console.error("[Churnfix] Discord notification failed:", err.message);
  }
}
