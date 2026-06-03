"use client";

import React from "react";
import { useDashboard } from "../layout";
import ActivityFeedView from "@/app/components/ActivityFeedView";

export default function FeedPage() {
  const { events } = useDashboard();

  return (
    <>
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] font-display leading-tight">
            Dunning Webhook Monitor
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Inspecting active payment events, failure reasons, and customer recoveries.
          </p>
        </div>
      </div>

      <ActivityFeedView events={events} />
    </>
  );
}
