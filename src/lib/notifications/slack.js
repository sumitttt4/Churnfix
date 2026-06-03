/**
 * Send a Slack notification via incoming webhook.
 */
export async function sendSlackNotification(webhookUrl, data) {
  if (!webhookUrl) return;

  const isRecovered = data.type === "payment_recovered";

  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: isRecovered
          ? `:white_check_mark: *Payment Recovered*`
          : `:rotating_light: *Payment Failed*`,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Customer:*\n${data.customerName}`,
        },
        {
          type: "mrkdwn",
          text: `*Email:*\n${data.customerEmail}`,
        },
        {
          type: "mrkdwn",
          text: `*Amount:*\n$${data.amount?.toFixed(2)}`,
        },
        {
          type: "mrkdwn",
          text: `*Processor:*\n${data.processor}`,
        },
        ...(data.reason
          ? [
              {
                type: "mrkdwn",
                text: `*Reason:*\n${data.reason.replace(/_/g, " ")}`,
              },
            ]
          : []),
      ],
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `Churnfix • ${new Date().toLocaleString()}`,
        },
      ],
    },
  ];

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: isRecovered
          ? `✅ Payment recovered: ${data.customerName} ($${data.amount?.toFixed(2)})`
          : `🚨 Payment failed: ${data.customerName} ($${data.amount?.toFixed(2)}) - ${data.reason}`,
        blocks,
      }),
    });
  } catch (err) {
    console.error("[Churnfix] Slack notification failed:", err.message);
  }
}
