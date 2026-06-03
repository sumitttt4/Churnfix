"use client";

import React from "react";
import { useDashboard } from "../layout";
import IntegrationsView from "@/app/components/IntegrationsView";

export default function IntegrationsPage() {
  const { settings, currentTier, addToast, fetchSettings } = useDashboard();

  const connectedProcessors = settings?.connectedProcessors || {
    stripe: true,
    polar: false,
    lemonsqueezy: false,
    paddle: false,
  };

  const alertSettings = settings?.alertSettings || {
    slackEnabled: false,
    slackWebhook: "",
    discordEnabled: false,
    discordWebhook: "",
    emailEnabled: true,
    emailAddress: "",
  };

  const emailTemplate = settings?.emailTemplate || {
    subject: "Action Required: Failed payment for your subscription",
    body: "",
  };

  const handleToggleProcessor = async (processor) => {
    const isCurrentlyConnected = connectedProcessors[processor];

    try {
      const res = await fetch("/api/settings/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          processor,
          action: isCurrentlyConnected ? "disconnect" : "connect",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        addToast({
          title: "Upgrade Required",
          message: data.error || "Could not toggle processor",
          type: "warning",
        });
        return;
      }

      addToast({
        title: isCurrentlyConnected ? "Stack Disconnected" : "Stack Connected",
        message: `${processor.charAt(0).toUpperCase() + processor.slice(1)} dunning webhook monitor has been ${isCurrentlyConnected ? "deactivated" : "activated"}.`,
        type: isCurrentlyConnected ? "warning" : "success",
      });

      await fetchSettings();
    } catch (err) {
      addToast({
        title: "Error",
        message: "Failed to update integration",
        type: "error",
      });
    }
  };

  const handleSaveAlertSettings = async (newAlertSettings) => {
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertSettings: newAlertSettings }),
      });
      await fetchSettings();
    } catch (err) {
      console.error("Failed to save alert settings:", err);
    }
  };

  const handleSaveEmailTemplate = async (newTemplate) => {
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailTemplate: newTemplate }),
      });
      await fetchSettings();
    } catch (err) {
      console.error("Failed to save email template:", err);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] font-display leading-tight">
            Connect Stack
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Link payment stacks and customize notification channels.
          </p>
        </div>
      </div>

      <IntegrationsView
        connectedProcessors={connectedProcessors}
        onToggleProcessor={handleToggleProcessor}
        alertSettings={alertSettings}
        onSaveAlertSettings={handleSaveAlertSettings}
        emailTemplate={emailTemplate}
        onSaveEmailTemplate={handleSaveEmailTemplate}
        currentTier={currentTier}
        onUpgradePrompt={(text) =>
          addToast({ title: "Upgrade Required", message: text, type: "warning" })
        }
        addToast={addToast}
      />
    </>
  );
}
