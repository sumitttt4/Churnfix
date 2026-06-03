import React from "react";
import { AlertCircle, CheckCircle2, Users, TrendingUp, ArrowRight, Play, Server, Clock, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function DashboardView({ events, onNavigateToFeed, onOpenSimulator }) {
  // Calculate KPI Metrics
  const failedEvents = events.filter((e) => e.status === "failed" || e.status === "retrying");
  const recoveredEvents = events.filter((e) => e.status === "recovered");

  const atRiskAmount = failedEvents.reduce((sum, e) => sum + e.amount, 0);
  const recoveredAmount = recoveredEvents.reduce((sum, e) => sum + e.amount, 0);

  // Affected customers (unique emails for active failed/retrying events)
  const uniqueAffectedEmails = new Set(failedEvents.map((e) => e.customerEmail.toLowerCase()));
  const affectedCustomersCount = uniqueAffectedEmails.size;

  // Recovery rate
  const totalClosedEvents = failedEvents.length + recoveredEvents.length;
  const recoveryRate = totalClosedEvents > 0 
    ? (recoveredEvents.length / totalClosedEvents) * 100 
    : 32;

  // SVG Chart Data (7 Days Trend)
  const get7DaysData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dayEvents = events.filter((e) => {
        const eventDate = new Date(e.timestamp);
        return eventDate.getDate() === date.getDate() && eventDate.getMonth() === date.getMonth();
      });
      
      const failed = dayEvents
        .filter((e) => e.status === "failed" || e.status === "retrying")
        .reduce((sum, e) => sum + e.amount, 0);
      const recovered = dayEvents
        .filter((e) => e.status === "recovered")
        .reduce((sum, e) => sum + e.amount, 0);
      
      data.push({ label: dateStr, failed, recovered });
    }
    return data;
  };

  const chartData = get7DaysData();
  const maxVal = Math.max(...chartData.map((d) => Math.max(d.failed, d.recovered, 100))) * 1.2;

  // Generate SVG coordinates for lines
  const width = 600;
  const height = 200;
  const paddingX = 40;
  const paddingY = 20;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const getPoints = (type) => {
    return chartData.map((d, index) => {
      const x = paddingX + (index / (chartData.length - 1)) * chartW;
      const val = type === "failed" ? d.failed : d.recovered;
      const y = height - paddingY - (val / maxVal) * chartH;
      return { x, y };
    });
  };

  const failedPoints = getPoints("failed");
  const recoveredPoints = getPoints("recovered");

  const buildPath = (points) => {
    if (points.length === 0) return "";
    return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
  };

  const buildAreaPath = (points) => {
    if (points.length === 0) return "";
    const linePath = buildPath(points);
    return `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;
  };

  // Get recent 4 events
  const recentEvents = [...events]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* At Risk Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">At-Risk Revenue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#B91C1C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-navy leading-none">
              ${atRiskAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#B91C1C] font-semibold mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C] pulse-red" />
              {failedEvents.length} active failures
            </div>
          </CardContent>
        </Card>

        {/* Recovered Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">Recovered Revenue</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-[#0F9D76]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-navy leading-none">
              ${recoveredAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#0F9D76] font-semibold mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D76] pulse-green" />
              Saved subscription value
            </div>
          </CardContent>
        </Card>

        {/* Affected Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">Affected Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-navy leading-none">
              {affectedCustomersCount}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Dunning alerts active
            </div>
          </CardContent>
        </Card>

        {/* Recovery Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">Recovery Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#0F9D76]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-navy leading-none">
              {recoveryRate.toFixed(1)}%
            </div>
            <div className="text-xs text-[#0F9D76] font-semibold mt-2">
              Industry average: 32%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Preview Grid */}
      <div className="grid gap-6 md:gap-8 lg:grid-cols-12">
        
        {/* SVG Area Chart */}
        <Card className="lg:col-span-8">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2">
            <div className="grid gap-1">
              <CardTitle>Recovery Pipeline</CardTitle>
              <CardDescription>Comparing failed payments against recovered revenue over the past 7 days</CardDescription>
            </div>
            <div className="flex gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2.5 h-0.5 bg-[#B91C1C]" />
                At-Risk ($)
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2.5 h-0.5 bg-[#0F9D76]" />
                Recovered ($)
              </span>
            </div>
          </CardHeader>
          <CardContent className="h-[280px] w-full relative pt-2">
            <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
              <defs>
                <linearGradient id="failed-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B91C1C" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#B91C1C" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="recovered-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F9D76" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#0F9D76" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#F1F5F9" strokeWidth="1" />
              <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#E2E8F0" strokeWidth="1.5" />

              {/* Area paths */}
              <path d={buildAreaPath(failedPoints)} className="chart-area-failed" fill="url(#failed-gradient)" />
              <path d={buildAreaPath(recoveredPoints)} className="chart-area-recovered" fill="url(#recovered-gradient)" />

              {/* Line paths */}
              <path d={buildPath(failedPoints)} fill="none" stroke="#B91C1C" strokeWidth="2.5" strokeLinecap="round" />
              <path d={buildPath(recoveredPoints)} fill="none" stroke="#0F9D76" strokeWidth="2.5" strokeLinecap="round" />

              {/* Data Points */}
              {failedPoints.map((p, i) => (
                <circle key={`f-${i}`} cx={p.x} cy={p.y} r="3.5" fill="#FFFFFF" stroke="#B91C1C" strokeWidth="2" />
              ))}
              {recoveredPoints.map((p, i) => (
                <circle key={`r-${i}`} cx={p.x} cy={p.y} r="3.5" fill="#FFFFFF" stroke="#0F9D76" strokeWidth="2" />
              ))}

              {/* X Axis Labels */}
              {chartData.map((d, index) => {
                const x = paddingX + (index / (chartData.length - 1)) * chartW;
                return (
                  <text
                    key={index}
                    x={x}
                    y={height - 4}
                    fill="#94A3B8"
                    fontSize="9px"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {d.label}
                  </text>
                );
              })}

              {/* Y Axis Labels */}
              <text x={paddingX - 8} y={paddingY + 3} fill="#94A3B8" fontSize="9px" fontWeight="700" textAnchor="end">
                ${Math.round(maxVal)}
              </text>
              <text x={paddingX - 8} y={height / 2 + 3} fill="#94A3B8" fontSize="9px" fontWeight="700" textAnchor="end">
                ${Math.round(maxVal / 2)}
              </text>
              <text x={paddingX - 8} y={height - paddingY + 3} fill="#94A3B8" fontSize="9px" fontWeight="700" textAnchor="end">
                $0
              </text>
            </svg>
          </CardContent>
        </Card>

        {/* Live Feed Summary */}
        <Card className="lg:col-span-4 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Live Activity</CardTitle>
            <CardDescription>Active failed payment recovery monitors</CardDescription>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col justify-between gap-4">
            {recentEvents.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8 text-muted-foreground gap-3">
                <Server size={28} className="opacity-40" />
                <p className="text-xs">No active events logged yet.</p>
                <Button 
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={onOpenSimulator}
                >
                  Open Simulator
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {recentEvents.map((event) => {
                  const nameInitials = event.customerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();
                  return (
                    <div key={event.id} className="flex items-center gap-4 border-b border-border/40 pb-3 last:border-b-0 last:pb-0">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{nameInitials}</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-semibold leading-none text-navy">{event.customerName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <span className="capitalize">{event.processor}</span>
                          <span>•</span>
                          <span suppressHydrationWarning className="flex items-center gap-0.5">
                            <Clock size={10} />
                            {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-sm font-bold text-navy">${event.amount.toFixed(2)}</p>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full capitalize mt-0.5 ${
                          event.status === "recovered" 
                            ? "bg-[#0F9D76]/10 text-[#0F9D76]" 
                            : event.status === "retrying" 
                            ? "bg-amber-500/10 text-amber-600" 
                            : "bg-red-500/10 text-red-600"
                        }`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <Button
              variant="outline"
              className="w-full mt-4 flex items-center justify-center gap-2 cursor-pointer"
              onClick={onNavigateToFeed}
            >
              View Activity Feed <ArrowRight size={14} />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
