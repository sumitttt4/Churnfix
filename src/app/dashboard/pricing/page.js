"use client";

import React from "react";
import { useDashboard } from "../layout";
import PricingView from "@/app/components/PricingView";

export default function PricingPage() {
  const { currentTier, addToast, fetchSettings } = useDashboard();

  const handleSelectTier = async (tier) => {
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: tier }),
      });

      addToast({
        title: "Plan Updated",
        message: `Your plan has been changed to ${tier.charAt(0).toUpperCase() + tier.slice(1)}.`,
        type: "success",
      });

      await fetchSettings();
    } catch (err) {
      addToast({
        title: "Error",
        message: "Failed to update plan",
        type: "error",
      });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] font-display leading-tight">
            Manage Plan
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Compare subscription levels and upgrade your recovery limits.
          </p>
        </div>
      </div>

      <PricingView
        currentTier={currentTier}
        onSelectTier={handleSelectTier}
        addToast={addToast}
      />
    </>
  );
}
