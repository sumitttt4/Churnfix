import React, { useState } from "react";
import { Search, Filter, Calendar, ChevronDown, ChevronUp, FileCode } from "lucide-react";

export default function ActivityFeedView({ events }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [processorFilter, setProcessorFilter] = useState("all");
  const [expandedEventId, setExpandedEventId] = useState(null);

  const toggleExpand = (id) => {
    if (expandedEventId === id) {
      setExpandedEventId(null);
    } else {
      setExpandedEventId(id);
    }
  };

  const getMockWebhookPayload = (event) => {
    const timeUnix = Math.floor(new Date(event.timestamp).getTime() / 1000);
    
    if (event.processor === "stripe") {
      if (event.status === "recovered") {
        return {
          id: `evt_rec_${event.id.toLowerCase()}`,
          object: "event",
          api_version: "2023-10-16",
          created: timeUnix,
          type: "invoice.payment_succeeded",
          data: {
            object: {
              id: `in_${event.id}`,
              customer: "cus_Hk82jdK9sL",
              customer_email: event.customerEmail,
              customer_name: event.customerName,
              amount_paid: event.amount * 100,
              currency: "usd",
              status: "paid",
              charge: "ch_92ksjDk8aLp",
              attempt_count: 2,
              billing_reason: "subscription_cycle"
            }
          }
        };
      } else {
        return {
          id: `evt_fail_${event.id.toLowerCase()}`,
          object: "event",
          api_version: "2023-10-16",
          created: timeUnix,
          type: "invoice.payment_failed",
          data: {
            object: {
              id: `in_${event.id}`,
              customer: "cus_Hk82jdK9sL",
              customer_email: event.customerEmail,
              customer_name: event.customerName,
              amount_due: event.amount * 100,
              currency: "usd",
              status: "open",
              attempt_count: event.attempts,
              next_payment_attempt: timeUnix + 86400,
              billing_reason: "subscription_cycle",
              last_payment_error: {
                code: event.reason,
                message: event.reason.replace("_", " "),
                type: "card_error"
              }
            }
          }
        };
      }
    } else if (event.processor === "polar") {
      return {
        event: event.status === "recovered" ? "subscription.active" : "subscription.payment_failed",
        timestamp: event.timestamp,
        data: {
          id: `sub_${event.id.toLowerCase()}`,
          status: event.status === "recovered" ? "active" : "past_due",
          amount: event.amount,
          currency: "USD",
          user: {
            email: event.customerEmail,
            name: event.customerName
          },
          organization_id: "org_28ksjdKf8A",
          last_failure_reason: event.status === "recovered" ? null : event.reason
        }
      };
    } else if (event.processor === "lemonsqueezy") {
      return {
        meta: {
          event_name: event.status === "recovered" ? "subscription_payment_recovered" : "subscription_payment_failed",
          custom_data: {
            organization: "churnfix"
          }
        },
        data: {
          type: "subscription-payments",
          id: event.id,
          attributes: {
            user_name: event.customerName,
            user_email: event.customerEmail,
            amount: (event.amount * 100).toString(),
            currency: "USD",
            status: event.status === "recovered" ? "paid" : "failed",
            error_code: event.status === "recovered" ? null : event.reason
          }
        }
      };
    } else {
      return {
        event_id: `evt_${event.id.toLowerCase()}`,
        event_type: event.status === "recovered" ? "subscription.payment_succeeded" : "subscription.payment_failed",
        occurred_at: event.timestamp,
        data: {
          id: `sub_${event.id}`,
          status: event.status === "recovered" ? "active" : "past_due",
          customer_id: "ctm_01h7xyz89",
          customer: {
            name: event.customerName,
            email: event.customerEmail
          },
          transaction: {
            id: `txn_${event.id}`,
            amount: event.amount.toString(),
            currency_code: "USD",
            billing_period: {
              starts_at: event.timestamp,
              ends_at: new Date(new Date(event.timestamp).setMonth(new Date(event.timestamp).getMonth() + 1)).toISOString()
            }
          }
        }
      };
    }
  };

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    const matchesProcessor = processorFilter === "all" || e.processor === processorFilter;

    return matchesSearch && matchesStatus && matchesProcessor;
  });

  return (
    <div className="bg-neutral-surface border border-border-clean rounded-sharp p-6">
      <div className="border-b border-border-clean pb-4 mb-6">
        <h3 className="font-display font-bold text-lg text-navy">Activity Feed</h3>
        <p className="text-xs text-muted-text mt-0.5 font-medium">Complete real-time log of failed payments, dunning alerts, and recoveries</p>
      </div>

      {/* Filters and Search Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text"
          />
          <input
            id="feed-search"
            type="text"
            className="w-full border border-border-clean rounded-sharp py-2 pl-9 pr-4 text-sm bg-neutral-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Search by customer, email, or invoice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-navy uppercase tracking-wider" htmlFor="status-filter">Status</label>
            <select
              id="status-filter"
              className="border border-border-clean rounded-sharp py-1.5 px-3 text-xs bg-neutral-surface focus:border-primary focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="failed">Failed</option>
              <option value="retrying">Retrying</option>
              <option value="recovered">Recovered</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-navy uppercase tracking-wider" htmlFor="processor-filter">Billing Stack</label>
            <select
              id="processor-filter"
              className="border border-border-clean rounded-sharp py-1.5 px-3 text-xs bg-neutral-surface focus:border-primary focus:outline-none"
              value={processorFilter}
              onChange={(e) => setProcessorFilter(e.target.value)}
            >
              <option value="all">All Processors</option>
              <option value="stripe">Stripe</option>
              <option value="polar">Polar</option>
              <option value="lemonsqueezy">LemonSqueezy</option>
              <option value="paddle">Paddle</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Table */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 text-muted-text border border-border-clean border-dashed rounded-sharp flex flex-col items-center justify-center gap-3">
          <Calendar size={36} className="opacity-40" />
          <p className="font-bold text-sm">No matching events found</p>
          <p className="text-xs">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-border-clean rounded-sharp">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-neutral-bg border-b border-border-clean text-[11px] font-bold text-muted-text uppercase tracking-wider">
                <th className="py-3 px-4">Event ID / Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Billing Stack</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-clean">
              {filteredEvents.map((event) => {
                const isExpanded = expandedEventId === event.id;
                return (
                  <React.Fragment key={event.id}>
                    <tr className="hover:bg-neutral-bg/40 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-navy">{event.id}</div>
                        <div className="text-[11px] text-muted-text mt-0.5" suppressHydrationWarning>
                          {new Date(event.timestamp).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-navy">{event.customerName}</div>
                        <div className="text-xs text-muted-text">{event.customerEmail}</div>
                      </td>
                      <td className="py-4 px-4 font-semibold capitalize text-navy">
                        {event.processor}
                      </td>
                      <td className="py-4 px-4 font-bold text-navy">
                        ${event.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-xs text-muted-text font-medium">
                        {event.status === "recovered" ? "Payment Recovered" : event.reason.replace("_", " ")}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-sharp capitalize ${
                          event.status === "recovered" 
                            ? "bg-primary-light text-primary" 
                            : event.status === "retrying" 
                            ? "bg-amber-50 text-amber-800" 
                            : "bg-red-50 text-[#B91C1C]"
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          className="text-primary hover:text-primary-hover bg-transparent border-none cursor-pointer inline-flex items-center gap-1 text-xs font-semibold p-1"
                          onClick={() => toggleExpand(event.id)}
                          title="Inspect Webhook"
                        >
                          <FileCode size={16} />
                          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-neutral-bg/60">
                        <td colSpan="7" className="py-4 px-6">
                          <div className="flex flex-col gap-2.5">
                            <div className="flex items-center justify-between text-xs font-bold text-muted-text">
                              <span className="flex items-center gap-1.5"><FileCode size={14} /> SIMULATED WEBHOOK PAYLOAD ({event.processor.toUpperCase()})</span>
                              <span>Action: HTTP POST /webhooks/{event.processor}</span>
                            </div>
                            <pre className="json-viewer">
                              {JSON.stringify(getMockWebhookPayload(event), null, 2)}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
