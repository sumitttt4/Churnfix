"use client";

import React from "react";
import { Terminal } from "lucide-react";
import { useDashboard } from "./layout";
import DashboardView from "@/app/components/DashboardView";

export default function DashboardPage() {
  const { events, setIsSimulatorOpen } = useDashboard();

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] font-display leading-tight" id="main-title">
            Recover failed payments before they become churn.
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Churnfix tracks failed subscription payments across your billing stack and helps you recover revenue before customers churn.
          </p>
        </div>
        <div>
          <button
            className="bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold py-2.5 px-4 rounded-md flex items-center gap-1.5 cursor-pointer transition-colors border-none"
            onClick={() => setIsSimulatorOpen(true)}
          >
            <Terminal size={14} /> Simulate Event
          </button>
        </div>
      </div>

      <DashboardView
        events={events}
        onNavigateToFeed={() => {}}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
      />
    </>
  );
}
