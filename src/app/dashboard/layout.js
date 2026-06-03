"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import {
  LayoutDashboard,
  Activity,
  Settings,
  CreditCard,
  Terminal,
  LogOut,
  AlertTriangle,
  X,
  Loader2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import SimulatorDrawer from "@/app/components/SimulatorDrawer";
import { signOut, useSession } from "@/lib/auth-client";

// ─── Dashboard Context ─────────────────────────────────────────
const DashboardContext = createContext(null);

export function useDashboard() {
  return useContext(DashboardContext);
}

// ─── Dashboard Layout Component ────────────────────────────────
export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: sessionData, isPending } = useSession();

  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [events, setEvents] = useState([]);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
    fetchEvents();
  }, []);

  // Auto-close toasts
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events?limit=100");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  const addToast = (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const handleAddEvent = async (newEvent) => {
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      if (res.ok) {
        await fetchEvents(); // Refresh events
      }
    } catch (err) {
      console.error("Failed to add event:", err);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const currentTier = settings?.organization?.plan || "growth";

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, segment: null },
    { href: "/dashboard/feed", label: "Activity Feed", icon: Activity, segment: "feed" },
    { href: "/dashboard/integrations", label: "Billing Stacks", icon: Settings, segment: "integrations" },
    { href: "/dashboard/pricing", label: "Pricing Plans", icon: CreditCard, segment: "pricing" },
  ];

  const getActiveSegment = () => {
    if (pathname === "/dashboard") return null;
    const parts = pathname.split("/");
    return parts[2] || null;
  };

  const activeSegment = getActiveSegment();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <Loader2 size={32} className="animate-spin text-[#10B981]" />
      </div>
    );
  }

  const contextValue = {
    events,
    settings,
    currentTier,
    addToast,
    handleAddEvent,
    fetchEvents,
    fetchSettings,
    setIsSimulatorOpen,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="min-h-screen flex flex-col md:flex-row bg-[#FAFAFA] text-[#0F172A] antialiased">
        {/* Sidebar */}
        <aside className="w-full md:w-[260px] bg-white border-b md:border-b-0 md:border-r border-[#E2E8F0] flex flex-col h-auto md:h-screen md:sticky md:top-0 z-10 p-6">
          <Link href="/" className="mb-8 no-underline block">
            <Logo />
          </Link>

          <nav className="flex-1">
            <ul className="flex flex-row md:flex-col gap-2 list-none flex-wrap md:flex-nowrap p-0 m-0">
              {navItems.map((item) => {
                const isActive = activeSegment === item.segment;
                const Icon = item.icon;
                return (
                  <li key={item.href} className="flex-1 md:flex-none">
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-semibold no-underline transition-colors ${
                        isActive
                          ? "bg-[#10B981]/10 text-[#10B981]"
                          : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#FAFAFA]"
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Simulator trigger */}
          <div className="mt-4 md:mt-6">
            <button
              className="w-full justify-center border border-[#10B981] text-[#10B981] hover:bg-[#10B981]/10 text-xs font-bold py-2.5 rounded-md flex items-center gap-2 cursor-pointer transition-colors bg-transparent"
              onClick={() => setIsSimulatorOpen(true)}
              id="trigger-simulator"
            >
              <Terminal size={14} /> Webhook Simulator
            </button>
          </div>

          {/* Sidebar Footer */}
          <div className="mt-auto pt-6 border-t border-[#E2E8F0] hidden md:flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center font-bold text-sm">
                {sessionData?.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-[#0F172A]">
                  {sessionData?.user?.name || "User"}
                </span>
                <span className="text-xs text-[#64748B] capitalize">
                  {currentTier} Plan
                </span>
              </div>
            </div>
            <button
              className="text-xs text-[#64748B] hover:text-[#B91C1C] flex items-center gap-2 font-semibold bg-transparent border-none cursor-pointer transition-colors text-left"
              onClick={handleLogout}
            >
              <LogOut size={12} /> Sign out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {/* Free Tier Banner */}
          {currentTier === "free" && (
            <div className="border border-amber-200 bg-amber-50 text-amber-800 px-4 py-3 rounded-md text-sm mb-8 flex items-start gap-3">
              <AlertTriangle size={18} className="mt-0.5 text-amber-700 flex-shrink-0" />
              <div>
                <div className="font-bold">Free Tier Active</div>
                <div className="text-xs opacity-90 mt-0.5">
                  Integrations are capped at 1 billing processor.{" "}
                  <Link
                    href="/dashboard/pricing"
                    className="text-[#10B981] font-bold underline"
                  >
                    Upgrade Plan
                  </Link>
                  .
                </div>
              </div>
            </div>
          )}

          {children}
        </main>

        {/* Simulator Drawer */}
        <SimulatorDrawer
          isOpen={isSimulatorOpen}
          onClose={() => setIsSimulatorOpen(false)}
          events={events}
          onAddEvent={handleAddEvent}
          alertSettings={settings?.alertSettings || {}}
          connectedProcessors={settings?.connectedProcessors || { stripe: true }}
          currentTier={currentTier}
          onUpgradePrompt={(text) => {
            addToast({ title: "Upgrade Required", message: text, type: "warning" });
          }}
          addToast={addToast}
        />

        {/* Toast Notifications */}
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`flex items-start gap-3 p-4 rounded-md shadow-lg border bg-white ${
                toast.type === "success"
                  ? "border-[#10B981]/30"
                  : toast.type === "error"
                  ? "border-red-300"
                  : toast.type === "warning"
                  ? "border-amber-300"
                  : "border-[#E2E8F0]"
              }`}
              style={{ animation: "slideIn 0.3s ease-out" }}
            >
              <div style={{ flex: 1 }}>
                <div className="font-bold text-sm text-[#0F172A]">
                  {toast.title}
                </div>
                <div className="text-xs text-[#64748B] mt-0.5">
                  {toast.message}
                </div>
              </div>
              <button
                className="text-[#64748B] hover:text-[#0F172A] bg-transparent border-none cursor-pointer"
                onClick={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
