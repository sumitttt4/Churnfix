import React, { useState } from "react";
import { 
  Check, 
  Award, 
  ArrowRight, 
  Layers, 
  Activity, 
  Mail, 
  AlertTriangle, 
  Clock, 
  Terminal, 
  Bell, 
  Users, 
  TrendingUp, 
  Sparkles, 
  Share2 
} from "lucide-react";

export default function PricingView({ currentTier, onSelectTier, addToast }) {
  const [billingPeriod, setBillingPeriod] = useState("monthly"); // "monthly" or "yearly"

  const plans = [
    {
      id: "free",
      name: "Free",
      monthlyPrice: 0,
      desc: "For small projects bootstrapping recurring revenue.",
      features: [
        { text: "1 Billing Provider", icon: Layers },
        { text: "Failed Monitoring", icon: Activity },
        { text: "Email Alerts", icon: Mail },
        { text: "At-Risk Overview", icon: AlertTriangle },
        { text: "7-Day History", icon: Clock },
        { text: "10 Events / Month", icon: Terminal }
      ]
    },
    {
      id: "growth", // Maps to Pro for state compatibility
      name: "Pro",
      monthlyPrice: 19,
      desc: "Built for growing SaaS products with recurring revenue.",
      features: [
        { text: "Everything in Free", icon: Check },
        { text: "Unlimited Monitoring", icon: Activity },
        { text: "Slack Alerts", icon: Bell },
        { text: "Discord Alerts", icon: Terminal },
        { text: "Recovery Analytics", icon: TrendingUp },
        { text: "Activity Feed", icon: Users },
        { text: "90-Day History", icon: Clock },
        { text: "Priority Support", icon: Check }
      ],
      popular: true
    },
    {
      id: "pro", // Maps to Growth for state compatibility
      name: "Growth",
      monthlyPrice: 49,
      desc: "For teams managing larger subscription businesses.",
      features: [
        { text: "Everything in Pro", icon: Check },
        { text: "Unlimited Providers", icon: Layers },
        { text: "Team Members", icon: Users },
        { text: "Advanced Reporting", icon: TrendingUp },
        { text: "Recovery Insights", icon: Sparkles },
        { text: "Custom Dunning Sequences", icon: Share2 },
        { text: "API Access", icon: Terminal },
        { text: "Recovery Automation", icon: Sparkles },
        { text: "Priority Support", icon: Check }
      ],
      popular: false
    }
  ];

  const handleSelectTier = (tierId, tierName) => {
    onSelectTier(tierId);
    if (addToast) {
      addToast({
        title: "Plan Changed",
        message: `Your active tier has been switched to ${tierName}. Tier features and limits updated.`,
        type: "success"
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto py-4 font-sans text-left">
      
      {/* Badge & Typography Header */}
      <div className="text-center max-w-2xl mx-auto mb-4">
        <span className="inline-block bg-primary-light text-primary text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
          PRICING
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-navy font-display leading-[1.15] tracking-tight">
          Protect revenue before it becomes churn.
        </h2>
        <p className="text-sm text-muted-text mt-3 font-medium leading-relaxed">
          Get instant failed payment alerts, recovery tracking, and customer risk monitoring across your billing stack.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-4 select-none">
        <div className="inline-flex items-center bg-neutral-200/50 p-1 rounded-full text-xs font-semibold relative">
          <button
            className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              billingPeriod === "monthly" ? "bg-white text-navy shadow-sm" : "text-muted-text hover:text-navy bg-transparent"
            }`}
            onClick={() => setBillingPeriod("monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              billingPeriod === "yearly" ? "bg-white text-navy shadow-sm" : "text-muted-text hover:text-navy bg-transparent"
            }`}
            onClick={() => setBillingPeriod("yearly")}
          >
            Yearly
          </button>
        </div>
        <span className="bg-primary-light text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sharp">
          Save 20%
        </span>
      </div>

      {/* Pricing Cards Grid (Replicating Screenshot Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
        {plans.map((plan) => {
          const isActive = currentTier === plan.id;
          const displayPrice = billingPeriod === "monthly" 
            ? plan.monthlyPrice 
            : Math.round(plan.monthlyPrice * 0.8);

          return (
            <div 
              key={plan.id} 
              className={`rounded-[24px] p-5 flex flex-col justify-between transition-all duration-300 relative ${
                plan.popular 
                  ? "border-primary border-2 bg-[#FAF8F5] md:scale-[1.03] z-10" 
                  : "border-[#EFECE6] border bg-[#FBF9F6]"
              }`}
            >
              {/* Stacked Container 1: The Main White Info Card */}
              <div className="bg-white border border-[#F2EFE9] rounded-[20px] p-7 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-bold text-[20px] text-navy">
                      {plan.name}
                    </span>
                    {plan.popular && (
                      <span className="bg-primary text-white text-[9px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full">
                        MOST POPULAR
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-text leading-relaxed min-h-[32px] mb-6">
                    {plan.desc}
                  </p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-black text-navy font-display tracking-tight">
                      ${displayPrice}
                    </span>
                    <span className="text-xs text-muted-text font-semibold">/mo</span>
                  </div>
                </div>

                <div>
                  <button
                    className={`w-full py-3.5 rounded-[12px] text-xs font-bold transition-colors border-none uppercase tracking-wider font-display cursor-pointer ${
                      isActive 
                        ? "bg-neutral-100 text-muted-text/50 cursor-not-allowed" 
                        : "bg-primary hover:bg-primary-hover text-white"
                    }`}
                    onClick={() => handleSelectTier(plan.id, plan.name)}
                    disabled={isActive}
                  >
                    {isActive ? "Active Plan" : "Start Free Trial"}
                  </button>
                  <div className="text-center text-[10px] text-muted-text mt-3">
                    Free for 14 days • Cancel anytime
                  </div>
                </div>
              </div>

              {/* Stacked Container 2: Features Grid Card */}
              <div className="bg-white border border-[#F2EFE9] rounded-[20px] p-6 mt-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <feature.icon 
                        size={13} 
                        className={plan.popular ? "text-primary flex-shrink-0" : "text-slate-400 flex-shrink-0"} 
                      />
                      <span className="text-[11px] text-muted-text font-medium leading-tight">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>


      {/* Refund Guarantee */}
      <div className="bg-neutral-50 border border-border-clean rounded-[8px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-4">
          <Award size={20} className="text-primary flex-shrink-0" />
          <div className="text-xs text-muted-text leading-relaxed">
            <span className="font-bold text-navy">30-Day Money-Back Guarantee:</span> If Churnfix doesn't recover more than its cost in 30 days, get a full refund. No questions asked.
          </div>
        </div>
      </div>

    </div>
  );
}
