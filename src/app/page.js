"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Activity, 
  Settings, 
  CreditCard, 
  Terminal, 
  Bell, 
  HelpCircle,
  LogOut,
  AlertTriangle,
  X
} from "lucide-react";

// Components
import Logo from "./components/Logo";
import LandingPage from "./components/LandingPage";
import DashboardView from "./components/DashboardView";
import ActivityFeedView from "./components/ActivityFeedView";
import IntegrationsView from "./components/IntegrationsView";
import PricingView from "./components/PricingView";
import SimulatorDrawer from "./components/SimulatorDrawer";
import LoginView from "./components/LoginView";

export default function Home() {
  const [view, setView] = useState("landing"); // "landing" or "dashboard"
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentTier, setCurrentTier] = useState("growth"); 
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  
  // Paywall Modal state
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeModalText, setUpgradeModalText] = useState("");

  // Connected billing stacks
  const [connectedProcessors, setConnectedProcessors] = useState({
    stripe: true,
    polar: false,
    lemonsqueezy: false,
    paddle: false
  });

  // Webhook and Alert configurations
  const [alertSettings, setAlertSettings] = useState({
    slackEnabled: false,
    slackWebhook: "",
    discordEnabled: false,
    discordWebhook: "",
    emailEnabled: true,
    emailAddress: "billing@churnfix.com"
  });

  // Dunning Recovery Email Template
  const [emailTemplate, setEmailTemplate] = useState({
    subject: "Action Required: Failed payment for your subscription",
    body: "Hi {{customer_name}},\n\nWe were unable to process your recent monthly payment of {{amount}} on {{billing_platform}}.\n\nTo keep your account active and avoid any interruptions, please update your billing details here:\n{{recovery_link}}\n\nThank you,\nThe Billing Team"
  });

  // Pre-populate with realistic billing dunning history
  const [events, setEvents] = useState([
    {
      id: "E-108A",
      timestamp: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
      customerName: "Sumit Kumar",
      customerEmail: "sumit@example.com",
      processor: "stripe",
      amount: 49.00,
      status: "failed",
      reason: "insufficient_funds",
      invoiceId: "INV-837492",
      attempts: 1
    },
    {
      id: "E-109B",
      timestamp: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
      customerName: "Sumit Kumar",
      customerEmail: "sumit@example.com",
      processor: "stripe",
      amount: 49.00,
      status: "recovered",
      reason: "resolved",
      invoiceId: "INV-837492",
      attempts: 2
    },
    {
      id: "E-110C",
      timestamp: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
      customerName: "Alex Rivera",
      customerEmail: "alex@rivera.dev",
      processor: "polar",
      amount: 19.00,
      status: "failed",
      reason: "card_expired",
      invoiceId: "INV-920194",
      attempts: 1
    },
    {
      id: "E-111D",
      timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      customerName: "Sarah Chen",
      customerEmail: "sarah@chen.co",
      processor: "lemonsqueezy",
      amount: 99.00,
      status: "failed",
      reason: "generic_decline",
      invoiceId: "INV-472019",
      attempts: 1
    },
    {
      id: "E-112E",
      timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      customerName: "John Doe",
      customerEmail: "john@example.com",
      processor: "stripe",
      amount: 29.00,
      status: "failed",
      reason: "insufficient_funds",
      invoiceId: "INV-109284",
      attempts: 1
    },
    {
      id: "E-113F",
      timestamp: new Date().toISOString(),
      customerName: "John Doe",
      customerEmail: "john@example.com",
      processor: "stripe",
      amount: 29.00,
      status: "retrying",
      reason: "insufficient_funds",
      invoiceId: "INV-109284",
      attempts: 2
    }
  ]);

  // Notifications State (Toasts)
  const [toasts, setToasts] = useState([]);

  // Toast adder
  const addToast = (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  // Autoclose toasts after 5 seconds
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  // Handler to add simulator events
  const handleAddEvent = (newEvent) => {
    if (newEvent.status === "recovered") {
      setEvents((prev) =>
        prev.map((e) =>
          e.customerEmail.toLowerCase() === newEvent.customerEmail.toLowerCase() && e.status !== "recovered"
            ? { ...e, status: "recovered" }
            : e
        ).concat(newEvent)
      );
    } else {
      setEvents((prev) => [...prev, newEvent]);
    }
  };

  // Toggling processors
  const handleToggleProcessor = (processor) => {
    setConnectedProcessors((prev) => ({
      ...prev,
      [processor]: !prev[processor]
    }));
  };

  // Alert upgrade prompts
  const triggerUpgradePrompt = (text) => {
    setUpgradeModalText(text);
    setUpgradeModalOpen(true);
  };

  const handleEnterApp = (viewMode = "dashboard") => {
    setView(viewMode);
    window.scrollTo(0, 0);
  };

  if (view === "landing") {
    return (
      <>
        <LandingPage
          events={events}
          onEnterApp={handleEnterApp}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
          currentTier={currentTier}
          onSelectTier={setCurrentTier}
          onAddEvent={handleAddEvent}
          addToast={addToast}
        />
        
        {/* Simulator Drawer Overlay in Landing Page */}
        <SimulatorDrawer
          isOpen={isSimulatorOpen}
          onClose={() => setIsSimulatorOpen(false)}
          events={events}
          onAddEvent={handleAddEvent}
          alertSettings={alertSettings}
          connectedProcessors={connectedProcessors}
          currentTier={currentTier}
          onUpgradePrompt={triggerUpgradePrompt}
          addToast={addToast}
        />

        {/* Toast Notifications in Landing Page */}
        <div className="toast-container">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`toast ${
                toast.type === "success" 
                  ? "toast-success" 
                  : toast.type === "error" 
                  ? "toast-error" 
                  : toast.type === "warning" 
                  ? "toast-warning" 
                  : ""
              }`}
            >
              <div style={{ flex: 1 }}>
                <div className="toast-title">{toast.title}</div>
                <div className="toast-message">{toast.message}</div>
              </div>
              <button
                className="btn btn-text"
                style={{ padding: "2px", margin: "-4px -4px 0 0" }}
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (view === "login") {
    return (
      <LoginView
        onLogin={() => handleEnterApp("dashboard")}
        onBackToHome={() => handleEnterApp("landing")}
      />
    );
  }

  // Dashboard App View
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-bg text-navy antialiased">
      
      {/* Sidebar Layout */}
      <aside className="w-full md:w-[260px] bg-neutral-surface border-b md:border-b-0 md:border-r border-border-clean flex flex-col h-auto md:h-screen md:sticky md:top-0 z-10 p-6">
        <div className="mb-8 cursor-pointer" onClick={() => handleEnterApp("landing")}>
          <Logo />
        </div>
        
        <nav className="flex-1">
          <ul className="flex flex-row md:flex-col gap-2 list-none flex-wrap md:flex-nowrap">
            <li className="flex-1 md:flex-none">
              <a
                href="#dashboard"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-sharp text-sm font-semibold text-decoration-none transition-colors ${
                  activeTab === "dashboard" 
                    ? "bg-primary-light text-primary" 
                    : "text-muted-text hover:text-navy hover:bg-neutral-bg"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("dashboard");
                }}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </a>
            </li>
            <li className="flex-1 md:flex-none">
              <a
                href="#feed"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-sharp text-sm font-semibold text-decoration-none transition-colors ${
                  activeTab === "feed" 
                    ? "bg-primary-light text-primary" 
                    : "text-muted-text hover:text-navy hover:bg-neutral-bg"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("feed");
                }}
              >
                <Activity size={16} />
                Activity Feed
              </a>
            </li>
            <li className="flex-1 md:flex-none">
              <a
                href="#integrations"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-sharp text-sm font-semibold text-decoration-none transition-colors ${
                  activeTab === "integrations" 
                    ? "bg-primary-light text-primary" 
                    : "text-muted-text hover:text-navy hover:bg-neutral-bg"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("integrations");
                }}
              >
                <Settings size={16} />
                Billing Stacks
              </a>
            </li>
            <li className="flex-1 md:flex-none">
              <a
                href="#pricing"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-sharp text-sm font-semibold text-decoration-none transition-colors ${
                  activeTab === "pricing" 
                    ? "bg-primary-light text-primary" 
                    : "text-muted-text hover:text-navy hover:bg-neutral-bg"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("pricing");
                }}
              >
                <CreditCard size={16} />
                Pricing Plans
              </a>
            </li>
          </ul>
        </nav>

        {/* Webhook simulator trigger button */}
        <div className="mt-4 md:mt-6">
          <button
            className="w-full justify-center border border-primary text-primary hover:bg-primary-light text-xs font-bold py-2.5 rounded-sharp flex items-center gap-2 cursor-pointer transition-colors"
            onClick={() => setIsSimulatorOpen(true)}
            id="trigger-simulator"
          >
            <Terminal size={14} /> Webhook Simulator
          </button>
        </div>

        {/* Sidebar Footer */}
        <div className="mt-auto pt-6 border-t border-border-clean hidden md:flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-sm">
              SK
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-navy">Sumit Kumar</span>
              <span className="text-xs text-muted-text capitalize">
                {currentTier} Plan
              </span>
            </div>
          </div>
          <button 
            className="text-xs text-muted-text hover:text-[#B91C1C] flex items-center gap-2 font-semibold bg-transparent border-none cursor-pointer transition-colors text-left"
            onClick={() => handleEnterApp("landing")}
          >
            <LogOut size={12} /> Log out to landing
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {/* Banner Alert if on Free Tier */}
        {currentTier === "free" && (
          <div className="border border-amber-200 bg-amber-50 text-amber-800 px-4 py-3 rounded-sharp text-sm mb-8 flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 text-amber-700 flex-shrink-0" />
            <div>
              <div className="font-bold">Free Tier Active</div>
              <div className="text-xs opacity-90 mt-0.5">
                You are currently simulating the Free Tier. Integrations are capped at 1 billing processor and Slack alerts are disabled. 
                <a href="#pricing" className="text-primary font-bold underline ml-1" onClick={(e) => { e.preventDefault(); setActiveTab("pricing"); }}>Upgrade Plan</a>.
              </div>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-navy font-display leading-tight" id="main-title">
              {activeTab === "dashboard" && "Recover failed payments before they become churn."}
              {activeTab === "feed" && "Dunning Webhook Monitor"}
              {activeTab === "integrations" && "Connect Stack"}
              {activeTab === "pricing" && "Manage Plan"}
            </h1>
            <p className="text-sm text-muted-text mt-1">
              {activeTab === "dashboard" && "Churnfix tracks failed subscription payments across your billing stack and helps you recover revenue before customers churn."}
              {activeTab === "feed" && "Inspecting active payment events, failure reasons, and customer recoveries."}
              {activeTab === "integrations" && "Link payment stacks and customize notification channels."}
              {activeTab === "pricing" && "Compare subscription levels and upgrade your recovery limits."}
            </p>
          </div>
          
          <div>
            {activeTab === "dashboard" && (
              <button 
                className="btn bg-primary hover:bg-primary-hover text-neutral-surface text-xs font-bold py-2.5 px-4 rounded-sharp flex items-center gap-1.5 cursor-pointer transition-colors"
                onClick={() => setIsSimulatorOpen(true)}
              >
                <Terminal size={14} /> Simulate Event
              </button>
            )}
          </div>
        </div>

        {/* Render Tab Views */}
        {activeTab === "dashboard" && (
          <DashboardView
            events={events}
            onNavigateToFeed={() => setActiveTab("feed")}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
          />
        )}
        {activeTab === "feed" && (
          <ActivityFeedView
            events={events}
          />
        )}
        {activeTab === "integrations" && (
          <IntegrationsView
            connectedProcessors={connectedProcessors}
            onToggleProcessor={handleToggleProcessor}
            alertSettings={alertSettings}
            onSaveAlertSettings={setAlertSettings}
            emailTemplate={emailTemplate}
            onSaveEmailTemplate={setEmailTemplate}
            currentTier={currentTier}
            onUpgradePrompt={triggerUpgradePrompt}
            addToast={addToast}
          />
        )}
        {activeTab === "pricing" && (
          <PricingView
            currentTier={currentTier}
            onSelectTier={setCurrentTier}
            addToast={addToast}
          />
        )}
      </main>

      {/* Simulator Drawer Overlay */}
      <SimulatorDrawer
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        events={events}
        onAddEvent={handleAddEvent}
        alertSettings={alertSettings}
        connectedProcessors={connectedProcessors}
        currentTier={currentTier}
        onUpgradePrompt={triggerUpgradePrompt}
        addToast={addToast}
      />

      {/* Upgrade Paywall Modal Prompt */}
      {upgradeModalOpen && (
        <div className="modal-backdrop" onClick={() => setUpgradeModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-border-clean flex items-center justify-between">
              <h3 className="text-base font-bold text-navy font-display">Upgrade Plan Required</h3>
              <button 
                className="text-muted-text hover:text-navy bg-transparent border-none cursor-pointer"
                onClick={() => setUpgradeModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex gap-4 items-start">
                <div className="bg-primary-light p-2.5 rounded-full text-primary">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="text-sm leading-relaxed text-navy">
                    {upgradeModalText}
                  </p>
                  <p className="text-xs mt-3 text-muted-text">
                    Unlock unlimited billing stacks, webhook endpoints, dunning email customizations, and Slack/Discord alerts today.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-border-clean bg-neutral-bg flex justify-end gap-3">
              <button 
                className="btn border border-border-clean bg-neutral-surface hover:border-navy text-navy text-xs font-bold py-2 px-4 rounded-sharp cursor-pointer" 
                onClick={() => setUpgradeModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn bg-primary hover:bg-primary-hover text-neutral-surface text-xs font-bold py-2 px-4 rounded-sharp cursor-pointer border-none"
                onClick={() => {
                  setUpgradeModalOpen(false);
                  setActiveTab("pricing");
                }}
              >
                View Pricing Plans
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast ${
              toast.type === "success" 
                ? "toast-success" 
                : toast.type === "error" 
                ? "toast-error" 
                : toast.type === "warning" 
                ? "toast-warning" 
                : ""
            }`}
          >
            <div style={{ flex: 1 }}>
              <div className="toast-title font-bold text-sm text-navy">{toast.title}</div>
              <div className="toast-message text-xs text-muted-text mt-0.5">{toast.message}</div>
            </div>
            <button
              className="text-muted-text hover:text-navy bg-transparent border-none cursor-pointer"
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
