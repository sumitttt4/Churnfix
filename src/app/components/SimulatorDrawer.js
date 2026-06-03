import React, { useState } from "react";
import { X, Play, RefreshCw, AlertTriangle, CheckCircle, Info } from "lucide-react";

export default function SimulatorDrawer({
  isOpen,
  onClose,
  events,
  onAddEvent,
  alertSettings,
  connectedProcessors,
  currentTier,
  onUpgradePrompt,
  addToast
}) {
  const [customerName, setCustomerName] = useState("Sumit Kumar");
  const [customerEmail, setCustomerEmail] = useState("sumit@example.com");
  const [amount, setAmount] = useState("29.00");
  const [processor, setProcessor] = useState("stripe");
  const [eventType, setEventType] = useState("payment_failed");
  const [reason, setReason] = useState("insufficient_funds");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeFailedCustomers = events.filter(
    (e) => e.status === "failed" || e.status === "retrying"
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!connectedProcessors[processor]) {
      addToast({
        title: "Processor Not Connected",
        message: `Please connect ${processor.charAt(0).toUpperCase() + processor.slice(1)} under the Billing Stacks tab first.`,
        type: "warning"
      });
      return;
    }

    const connectedList = Object.keys(connectedProcessors).filter(k => connectedProcessors[k]);
    if (currentTier === "free" && connectedList.indexOf(processor) > 0) {
      onUpgradePrompt(`The Free plan is limited to 1 connected billing provider. Upgrade to Growth to monitor multiple billing stacks.`);
      return;
    }

    setIsSubmitting(true);

    const eventAmount = parseFloat(amount) || 0;
    const newEvent = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: new Date().toISOString(),
      customerName,
      customerEmail,
      processor,
      amount: eventAmount,
      status: eventType === "payment_failed" ? "failed" : "recovered",
      reason: eventType === "payment_failed" ? reason : "resolved",
      invoiceId: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      attempts: eventType === "payment_failed" ? 1 : 0
    };

    if (eventType === "payment_recovered") {
      const matchingFailed = events.find(
        (ev) => ev.customerEmail.toLowerCase() === customerEmail.toLowerCase() && ev.status !== "recovered"
      );
      if (matchingFailed) {
        newEvent.customerName = matchingFailed.customerName;
        newEvent.amount = matchingFailed.amount;
        newEvent.processor = matchingFailed.processor;
      }
    }

    let alertReport = [];
    
    // Slack Webhook Dispatch
    if (alertSettings.slackEnabled && alertSettings.slackWebhook && eventType === "payment_failed") {
      try {
        const text = `⚠️ *Payment Failed* | Churnfix Revenue Alert\n• *Customer*: ${newEvent.customerName} (${newEvent.customerEmail})\n• *Amount*: $${newEvent.amount.toFixed(2)}\n• *Platform*: ${newEvent.processor.toUpperCase()}\n• *Reason*: ${reason.replace("_", " ")}`;
        
        fetch(alertSettings.slackWebhook, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text })
        }).catch(() => {});
        
        alertReport.push("Slack");
      } catch (err) {}
    }

    // Discord Webhook Dispatch
    if (alertSettings.discordEnabled && alertSettings.discordWebhook && eventType === "payment_failed") {
      try {
        const payload = {
          embeds: [
            {
              title: "⚠️ Revenue Alert: Payment Failed",
              description: `Churnfix intercepted a failed payment on **${newEvent.processor.toUpperCase()}** before it turned to churn.`,
              color: 1023350, // primary green tone representation in decimal
              fields: [
                { name: "Customer", value: `${newEvent.customerName}\n(${newEvent.customerEmail})`, inline: true },
                { name: "Amount Affected", value: `$${newEvent.amount.toFixed(2)}`, inline: true },
                { name: "Declined Reason", value: reason.replace("_", " "), inline: true }
              ],
              footer: { text: "Churnfix • Active Revenue Recovery" },
              timestamp: new Date().toISOString()
            }
          ]
        };

        fetch(alertSettings.discordWebhook, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }).catch(() => {});

        alertReport.push("Discord");
      } catch (err) {}
    }

    if (alertSettings.emailEnabled && alertSettings.emailAddress && eventType === "payment_failed") {
      alertReport.push("Dunning Email");
    }

    onAddEvent(newEvent);

    addToast({
      title: eventType === "payment_failed" ? "Payment Failure Logged" : "Revenue Restored",
      message: eventType === "payment_failed" 
        ? `Logged $${eventAmount} failure for ${customerName}.${alertReport.length > 0 ? ` Alerts sent: ${alertReport.join(", ")}` : ""}`
        : `Customer ${newEvent.customerName} recovered! Revenue added to dashboard.`,
      type: eventType === "payment_failed" ? "error" : "success"
    });

    setIsSubmitting(false);
    onClose();
  };

  const handleSelectFailedCustomer = (email) => {
    const selected = events.find((e) => e.customerEmail === email);
    if (selected) {
      setCustomerEmail(selected.customerEmail);
      setCustomerName(selected.customerName);
      setAmount(selected.amount.toString());
      setProcessor(selected.processor);
    }
  };

  return (
    <>
      <div 
        className={`drawer-backdrop ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />
      <div className={`drawer ${isOpen ? "open" : ""}`}>
        <div className="flex items-center justify-between">
          <h2 className="font-display font-extrabold text-xl text-navy">Webhook Simulator</h2>
          <button 
            className="text-muted-text hover:text-navy bg-transparent border-none cursor-pointer p-1" 
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="border border-primary/20 bg-primary-light text-primary p-4 rounded-sharp flex gap-3 text-xs leading-relaxed">
          <Info size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Interactive Webhook Simulator</div>
            <div className="opacity-90 mt-0.5">
              Simulate events sent by billing provider webhooks. You can trigger payment failures to test alerts or recoveries to see metrics update.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-navy uppercase tracking-wider">Simulation Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`py-2 px-3 text-xs font-bold rounded-sharp border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  eventType === "payment_failed" 
                    ? "bg-[#B91C1C] text-neutral-surface border-[#B91C1C]" 
                    : "bg-neutral-surface text-navy border-border-clean hover:border-navy"
                }`}
                onClick={() => setEventType("payment_failed")}
              >
                <AlertTriangle size={12} /> Failed Payment
              </button>
              <button
                type="button"
                className={`py-2 px-3 text-xs font-bold rounded-sharp border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  eventType === "payment_recovered" 
                    ? "bg-primary text-neutral-surface border-primary" 
                    : "bg-neutral-surface text-navy border-border-clean hover:border-navy"
                }`}
                onClick={() => setEventType("payment_recovered")}
              >
                <CheckCircle size={12} /> Recovery
              </button>
            </div>
          </div>

          {eventType === "payment_recovered" && activeFailedCustomers.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-navy uppercase tracking-wider" htmlFor="select-failed-customer">Select Customer to Recover</label>
              <select
                id="select-failed-customer"
                className="w-full border border-border-clean rounded-sharp p-2 text-sm bg-neutral-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                onChange={(e) => handleSelectFailedCustomer(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>-- Select at-risk customer --</option>
                {activeFailedCustomers.map((cust) => (
                  <option key={cust.id} value={cust.customerEmail}>
                    {cust.customerName} - ${cust.amount.toFixed(2)} ({cust.processor})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-navy uppercase tracking-wider" htmlFor="customer-name">Customer Name</label>
            <input
              id="customer-name"
              type="text"
              className="w-full border border-border-clean rounded-sharp p-2 text-sm bg-neutral-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:bg-neutral-100 disabled:cursor-not-allowed"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              disabled={eventType === "payment_recovered" && activeFailedCustomers.length > 0}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-navy uppercase tracking-wider" htmlFor="customer-email">Customer Email</label>
            <input
              id="customer-email"
              type="email"
              className="w-full border border-border-clean rounded-sharp p-2 text-sm bg-neutral-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:bg-neutral-100 disabled:cursor-not-allowed"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
              disabled={eventType === "payment_recovered" && activeFailedCustomers.length > 0}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-navy uppercase tracking-wider" htmlFor="billing-amount">Amount (USD)</label>
              <input
                id="billing-amount"
                type="number"
                step="0.01"
                min="1"
                className="w-full border border-border-clean rounded-sharp p-2 text-sm bg-neutral-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:bg-neutral-100 disabled:cursor-not-allowed"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={eventType === "payment_recovered" && activeFailedCustomers.length > 0}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-navy uppercase tracking-wider" htmlFor="payment-processor">Billing Stack</label>
              <select
                id="payment-processor"
                className="w-full border border-border-clean rounded-sharp p-2 text-sm bg-neutral-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:bg-neutral-100 disabled:cursor-not-allowed"
                value={processor}
                onChange={(e) => setProcessor(e.target.value)}
                disabled={eventType === "payment_recovered" && activeFailedCustomers.length > 0}
              >
                <option value="stripe">Stripe</option>
                <option value="polar">Polar</option>
                <option value="lemonsqueezy">LemonSqueezy</option>
                <option value="paddle">Paddle</option>
              </select>
            </div>
          </div>

          {eventType === "payment_failed" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-navy uppercase tracking-wider" htmlFor="failure-reason">Failure Reason</label>
              <select
                id="failure-reason"
                className="w-full border border-border-clean rounded-sharp p-2 text-sm bg-neutral-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="insufficient_funds">Insufficient Funds</option>
                <option value="card_expired">Card Expired</option>
                <option value="generic_decline">Generic Bank Decline</option>
                <option value="authentication_required">SCA Authentication Required</option>
                <option value="incorrect_details">Incorrect Card Details</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-neutral-surface text-sm font-bold py-3 rounded-sharp flex items-center justify-center gap-2 cursor-pointer transition-colors mt-4 border-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="animate-spin" size={14} /> Sending Webhook...
              </>
            ) : (
              <>
                <Play size={14} /> Fire Webhook
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
}
