"use client";

import React, { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import Link from "next/link";
import { Play, ArrowRight, ShieldCheck, Clock, Bell, AlertTriangle, Layers, Activity, Mail, Terminal, Sparkles, Star, Check, TrendingUp, Share2, Users, AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";
import { motion, useInView, useAnimation } from "framer-motion";

// ─── Animation Helpers ─────────────────────────────────────────
const springEase = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.6, delay, ease: springEase },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, filter: "blur(4px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  transition: { duration: 0.5, delay, ease: springEase },
});

// Count-up hook
function useCountUp(target, duration = 1200, startDelay = 600) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const animate = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased * 100) / 100);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [inView, target, duration, startDelay]);

  return { value, ref };
}

// ─── DashKPI Card with Count-Up ────────────────────────────────
function DashKPI({ label, value: targetValue, prefix = "", suffix = "", color, icon }) {
  const { value: animatedValue, ref } = useCountUp(targetValue, 1000, 700);

  const displayValue = suffix === "%"
    ? animatedValue.toFixed(1)
    : Number.isInteger(targetValue)
    ? Math.round(animatedValue)
    : animatedValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div ref={ref} className="border border-[#F1F5F9] rounded-xl p-4 bg-[#FAFBFC] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="text-[22px] font-bold font-display tracking-[-0.02em] text-[#0F172A]">
        {prefix}{displayValue}{suffix}
      </div>
    </div>
  );
}

// ─── Hero SVG Chart ────────────────────────────────────────────
function HeroChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const width = 560;
  const height = 160;
  const pad = { top: 20, right: 20, bottom: 24, left: 20 };

  const failedData = [120, 90, 150, 80, 130, 95, 110];
  const recoveredData = [40, 60, 70, 100, 90, 120, 130];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const maxVal = Math.max(...failedData, ...recoveredData) * 1.2;
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  const toPoints = (data) =>
    data.map((v, i) => ({
      x: pad.left + (i / (data.length - 1)) * chartW,
      y: pad.top + chartH - (v / maxVal) * chartH,
    }));

  const failedPts = toPoints(failedData);
  const recoveredPts = toPoints(recoveredData);

  const line = (pts) => `M ${pts.map((p) => `${p.x} ${p.y}`).join(" L ")}`;
  const area = (pts) =>
    `${line(pts)} L ${pts[pts.length - 1].x} ${pad.top + chartH} L ${pts[0].x} ${pad.top + chartH} Z`;

  return (
    <div ref={ref} className="w-full h-[160px]">
      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="hero-fail-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-rec-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {[0, 0.5, 1].map((f, i) => (
          <line
            key={i}
            x1={pad.left}
            y1={pad.top + chartH * f}
            x2={width - pad.right}
            y2={pad.top + chartH * f}
            stroke="#F1F5F9"
            strokeWidth={f === 1 ? 1.5 : 1}
            strokeDasharray={f === 0.5 ? "4 4" : undefined}
          />
        ))}

        {/* Areas */}
        <path
          d={area(failedPts)}
          fill="url(#hero-fail-grad)"
          opacity={inView ? 1 : 0}
          style={{ transition: "opacity 0.6s ease 0.8s" }}
        />
        <path
          d={area(recoveredPts)}
          fill="url(#hero-rec-grad)"
          opacity={inView ? 1 : 0}
          style={{ transition: "opacity 0.6s ease 0.9s" }}
        />

        {/* Lines */}
        <path
          d={line(failedPts)}
          fill="none"
          stroke="#EF4444"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1000"
          strokeDashoffset={inView ? 0 : 1000}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1) 0.6s" }}
        />
        <path
          d={line(recoveredPts)}
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1000"
          strokeDashoffset={inView ? 0 : 1000}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1) 0.7s" }}
        />

        {/* Data points */}
        {failedPts.map((p, i) => (
          <circle
            key={`f${i}`}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="white"
            stroke="#EF4444"
            strokeWidth="1.5"
            opacity={inView ? 1 : 0}
            style={{ transition: `opacity 0.3s ease ${0.8 + i * 0.06}s` }}
          />
        ))}
        {recoveredPts.map((p, i) => (
          <circle
            key={`r${i}`}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="white"
            stroke="#10B981"
            strokeWidth="1.5"
            opacity={inView ? 1 : 0}
            style={{ transition: `opacity 0.3s ease ${0.9 + i * 0.06}s` }}
          />
        ))}

        {/* X-axis labels */}
        {days.map((d, i) => (
          <text
            key={d}
            x={pad.left + (i / (days.length - 1)) * chartW}
            y={height - 4}
            textAnchor="middle"
            fontSize="9"
            fontWeight="600"
            fill="#94A3B8"
          >
            {d}
          </text>
        ))}
      </svg>
    </div>
  );
}

// Local SVG for Slack icon since brand icons are not exported in this lucide-react version
const SlackIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="currentColor"
    {...props}
  >
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.824a2.528 2.528 0 0 1-2.52-2.52v-5.042zM8.824 5.043a2.528 2.528 0 0 1-2.52-2.522A2.528 2.528 0 0 1 8.824 0a2.528 2.528 0 0 1 2.52 2.521v2.522H8.824zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.52 2.522H3.782a2.528 2.528 0 0 1-2.522-2.522V8.824a2.528 2.528 0 0 1 2.522-2.52h5.042zm10.134 3.761a2.528 2.528 0 0 1 2.522-2.52 2.528 2.528 0 0 1 2.52 2.52 2.528 2.528 0 0 1-2.52 2.522h-2.522v-2.522zm-1.262 0a2.528 2.528 0 0 1-2.52 2.52H10.13a2.528 2.528 0 0 1-2.52-2.52V5.043a2.528 2.528 0 0 1 2.52-2.522h5.044a2.528 2.528 0 0 1 2.52 2.522v5.042zm-3.76 10.134a2.528 2.528 0 0 1 2.52 2.522 2.528 2.528 0 0 1-2.52 2.522 2.522-2.522v-2.522h2.522zm0-1.262a2.528 2.528 0 0 1-2.522-2.52v-5.043a2.528 2.528 0 0 1 2.522-2.52h5.042a2.528 2.528 0 0 1 2.522 2.52v5.043a2.528 2.528 0 0 1-2.522 2.52h-5.042z" />
  </svg>
);

const StripeLogo = (props) => (
  <svg viewBox="0 0 80 33" fill="currentColor" {...props}>
    <path d="M41.4 13.9c0-3.3 2.1-5.1 5.6-5.1 2.8 0 4.7 1.1 4.7 1.1l-.9 3.2s-1.5-.7-3.4-.7c-1.6 0-2.3.7-2.3 1.7 0 2.5 7.4 1.3 7.4 6.7 0 3.6-2.5 5.5-6.2 5.5-3.1 0-5.4-1.3-5.4-1.3l1-3.2s1.9.9 4 .9c1.6 0 2.5-.7 2.5-1.7.1-2.9-7.1-1.4-7.1-7.1zm-8.8 8c0 1.9 1.2 2.8 2.8 2.8 1.4 0 2.3-.5 2.3-.5V19c-.8-.2-1.7-.3-2.5-.3-1.6 0-2.6.9-2.6 3.2zm-.1-12.8l3.7-.8v2.9h2.3v3h-2.3V26c0 1 .5 1.4 1.3 1.4.6 0 1.1-.1 1.1-.1l.3 3.1s-.9.3-2.1.3c-2.7 0-4.3-1.4-4.3-4.5V14.2h-1.6V11.1h1.6V9.1zm-8.8 6.4c0-2 .9-3.5 2.2-3.5.7 0 1.4.3 1.8.8v5.5c-.4.5-1.1.7-1.8.7-1.3 0-2.2-1.5-2.2-3.5zm-3.8 0c0-4.2 2.7-6.8 6.2-6.8 1.9 0 3 .9 3.4 1.4V9.1h3.7v17.4h-3.7v-1.1c-.5.6-1.6 1.4-3.4 1.4-3.5 0-6.2-2.6-6.2-6.8zM12 9.1h3.7v17.4H12V9.1zm1.8-5.3c1.2 0 2.2 1 2.2 2.2 0 1.2-1 2.2-2.2 2.2-1.2 0-2.2-1-2.2-2.2 0-1.2 1-2.2 2.2-2.2zm-7.6 18c0 1.6 1 2.4 2.4 2.4 1.4 0 2.2-.6 2.2-.6v-5.2c-.8-.2-1.7-.3-2.4-.3-1.4 0-2.2.8-2.2 3.7zm-3.8-6c0-2.9 5.8-1.5 5.8-5.1 0-2.2-1.6-3.2-3.9-3.2-2 0-3.6.8-3.6.8l.7 2.6s1.3-.5 2.6-.5c1 0 1.4.4 1.4 1 0 2-5.8.9-5.8 5.1 0 2.9 1.8 4 4.3 4 2.1 0 3.6-.9 3.6-.9v-3s-1.2.7-2.9.7c-1.4.1-2.2-.6-2.2-1.5z" />
  </svg>
);

const PaddleLogo = (props) => (
  <svg viewBox="0 0 90 28" fill="currentColor" {...props}>
    <path d="M12.2 5.5v17.4H8.7v-2c-.5.7-1.6 1.6-3.4 1.6C2.2 22.5 0 20 0 15.6c0-4.4 2.2-6.9 5.3-6.9 1.8 0 2.9.9 3.4 1.6v-7c0-1.5 1-2.3 2.5-2.3.5 0 .8.1 1 .2v4.3zm-6.6 7.6c-1.5 0-2.5 1.2-2.5 3.2 0 2 1 3.2 2.5 3.2s2.5-1.2 2.5-3.2c0-2-1-3.2-2.5-3.2zm19.8-7.6v17.4h-3.5v-2c-.5.7-1.6 1.6-3.4 1.6-3.1 0-5.3-2.5-5.3-6.9 0-4.4 2.2-6.9 5.3-6.9 1.8 0 2.9.9 3.4 1.6V9.1c0-.4.3-.7.7-.7h2.8zm-6.6 7.6c-1.5 0-2.5 1.2-2.5 3.2 0 2 1 3.2 2.5 3.2s2.5-1.2 2.5-3.2c0-2-1-3.2-2.5-3.2zm19.8-7.6v17.4h-3.5v-2c-.5.7-1.6 1.6-3.4 1.6-3.1 0-5.3-2.5-5.3-6.9 0-4.4 2.2-6.9 5.3-6.9 1.8 0 2.9.9 3.4 1.6V9.1c0-.4.3-.7.7-.7h2.8zm-6.6 7.6c-1.5 0-2.5 1.2-2.5 3.2 0 2 1 3.2 2.5 3.2s2.5-1.2 2.5-3.2c0-2-1-3.2-2.5-3.2zm8.7-7.6h3.5v17.4H74v-17.4zm8.9 8.2c.2-2.3 1.9-3.7 4.1-3.7 2.1 0 3.7 1.2 4 3.4h-8.1zm8.2 2.5c0-4.2-2.5-6.8-6.1-6.8-3.5 0-6.1 2.6-6.1 6.8 0 4.2 2.7 6.8 6.3 6.8 2.6 0 4.5-1 5.3-2.2.3-.4.1-.9-.3-1.1l-1.3-.8c-.3-.2-.7-.1-.9.2-.5.6-1.5 1.2-2.8 1.2-1.7.1-2.8-.8-2.8-2.9l10.7-1.2zm12.3-10.7c.3 0 .7.1.9.3l2.8 2.8c.2.2.2.6 0 .8L83 14.8c-.2.2-.6.2-.8 0l-2.8-2.8c-.2-.2-.2-.6 0-.8l2.9-2.9c.2-.2.6-.2.8 0z" />
  </svg>
);

const PolarLogo = (props) => (
  <svg viewBox="0 0 75 24" fill="currentColor" {...props}>
    <path d="M10 2.5L12 8h5.5l-4.5 3.5 1.5 5.5-4.5-3.5-4.5 3.5 1.5-5.5L2.5 8H8l2-5.5z M25 7h4c2.5 0 4 1.5 4 3.5s-1.5 3.5-4 3.5h-4v4h-3V7zm4 4.5c1 0 1.5-.5 1.5-1s-.5-1-1.5-1h-4v2h4zm14-5c3.5 0 6 2.5 6 6.5s-2.5 6.5-6 6.5-6-2.5-6-6.5 2.5-6.5 6-6.5zm0 10c1.8 0 3-1.5 3-3.5s-1.2-3.5-3-3.5-3 1.5-3 3.5 1.2 3.5 3 3.5zm10-9.5h3v12h-3v-12zm10 0v1.5c.5-1 1.5-1.8 3-1.8 2.5 0 4 1.5 4 4.5v7.8h-3v-7.3c0-1.5-.7-2.2-2-2.2s-2.2.8-2.2 2.2v7.3h-3v-12h3.2z" />
  </svg>
);

const LemonSqueezyLogo = (props) => (
  <svg viewBox="0 0 130 26" fill="currentColor" {...props}>
    <path d="M12 2C8 2 4 4.5 2.5 8.5c-2 5 0 10.5 4.5 13 4 2.5 9 2.5 12.5-.5 3-2.5 4-7.5 2-12C19.5 5 16.5 2 12 2zm-1 15c-1.5 0-3-.8-3.5-2.2-.4-.9-.2-2 .5-2.7.7-.7 1.8-.9 2.7-.5 1.4.5 2.3 2 2.3 3.5s-.8 1.9-2 1.9z" />
    <path d="M28 6.5h3v12h-3v-12zm11 0c2 0 3.5 1.2 3.8 3.2h-7.6c.2-2 1.8-3.2 3.8-3.2zm4.1 5.7c-.1-3.5-2.5-5.7-5.9-5.7-3.5 0-5.9 2.5-5.9 6.2 0 3.7 2.4 6.2 6.1 6.2 2.6 0 4.5-1 5.3-2.2.3-.4.1-.9-.3-1.1l-1.3-.8c-.3-.2-.7-.1-.9.2-.5.6-1.5 1.2-2.8 1.2-1.7 0-2.8-.9-2.8-3l10.7-1zM58 8v1.5c.5-1 1.5-1.8 3-1.8 1.5 0 2.8.8 3.3 2.2.5-1.4 1.8-2.2 3.5-2.2 2.5 0 4 1.5 4 4.5v6.3h-3v-5.8c0-1.5-.7-2.2-2-2.2s-2 1-2 2.2v5.8h-3v-5.8c0-1.5-.7-2.2-2-2.2s-2 1-2 2.2v5.8h-3v-10.5h3.2zm23-1.5c3.5 0 6 2.5 6 6.5s-2.5 6.5-6 6.5-6-2.5-6-6.5 2.5-6.5 6-6.5zm0 10c1.8 0 3-1.5 3-3.5s-1.2-3.5-3-3.5-3 1.5-3 3.5 1.2 3.5 3 3.5zm10-9.5v1.5c.5-1 1.5-1.8 3-1.8 2.5 0 4 1.5 4 4.5v6.3h-3v-5.8c0-1.5-.7-2.2-2-2.2s-2.2.8-2.2 2.2v5.8h-3v-10.5h3.2zm14 3c-1-1-2.5-1.5-4-1.5-3.5 0-6 2.5-6 6.5s2.5 6.5 6 6.5c1.5 0 3-.5 4-1.5v1c0 2-1 3-3 3-1.5 0-2.5-.5-2.8-1.1-.2-.3-.5-.4-.8-.3l-1.3.4c-.4.1-.5.6-.3.9 1 1.8 2.8 2.6 5.2 2.6 3.8 0 6-2 6-5.5V8c0-.4-.3-.7-.7-.7h-2.8v1.7zm-4 7.5c-1.8 0-3-1.5-3-3.5s1.2-3.5 3-3.5 3 1.5 3 3.5-1.2 3.5-3 3.5zm15-10.5c.2 2.3 1.9 3.7 4.1 3.7 2.1 0 3.7-1.2 4-3.4H121zm8.2 2.5c0-4.2-2.5-6.8-6.1-6.8-3.5 0-6.1 2.6-6.1 6.8 0 4.2 2.7 6.8 6.3 6.8 2.6 0 4.5-1 5.3-2.2.3-.4.1-.9-.3-1.1l-1.3-.8c-.3-.2-.7-.1-.9.2-.5.6-1.5 1.2-2.8 1.2-1.7 0-2.8-.9-2.8-3l10.7-1zm11 0c.2-2.3 1.9-3.7 4.1-3.7 2.1 0 3.7-1.2 4-3.4h-8.1zm8.2 2.5c0-4.2-2.5-6.8-6.1-6.8-3.5 0-6.1 2.6-6.1 6.8 0 4.2 2.7 6.8 6.3 6.8 2.6 0 4.5-1 5.3-2.2.3-.4.1-.9-.3-1.1l-1.3-.8c-.3-.2-.7-.1-.9.2-.5.6-1.5 1.2-2.8 1.2-1.7 0-2.8-.9-2.8-3l10.7-1zm11-10.5h3.2l-5.3 7 5.7 6.5h-3.4l-4.1-5-1.4 1.8v3.2h-3v-15.5h3v7.3l4.9-5.8zm11 0l-5 11.5-4.8-11.5H161l6.4 13.8-1.5 3.5h-3.2l-.3.8.3.3.4.1.3-.1.3-.2.3-.3v-.5l.4-.9 6.2-16.1h-3.3zm-111 0h3.5v12h-3.5v-12z" />
  </svg>
);

const DodoPaymentsLogo = (props) => (
  <svg viewBox="0 0 130 30" fill="currentColor" {...props}>
    {/* Stylized Dodo bird logo */}
    <g transform="translate(2, 3)">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M 6.5,14.5 C 7,16 9,17.5 11.5,17.5 C 14.5,17.5 16.5,15 16.5,12 C 16.5,8.5 13,7.5 11,7.5 C 8,7.5 6.5,10.5 6.5,12.5 C 6.5,13.2 6.8,13.8 7.2,14.2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="11.5" cy="11.5" r="1.2" fill="currentColor" />
      <path d="M 12.5,7.8 Q 15,5 17.5,8.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </g>
    <text x="28" y="19" fontFamily="var(--font-display)" fontWeight="800" fontSize="13.5" letterSpacing="-0.03em">
      dodo payments
    </text>
  </svg>
);

const LOGOS = [
  { name: "Stripe", component: StripeLogo, width: "w-24" },
  { name: "Dodo Payments", component: DodoPaymentsLogo, width: "w-32" },
  { name: "Polar", component: PolarLogo, width: "w-24" },
  { name: "Lemon Squeezy", component: LemonSqueezyLogo, width: "w-28" }
];

export default function LandingPage({ 
  events, 
  onEnterApp, 
  onOpenSimulator, 
  currentTier, 
  onSelectTier,
  onAddEvent,
  addToast
}) {
  const [billingPeriod, setBillingPeriod] = useState("monthly"); // "monthly" or "yearly"
  
  const simulateDecline = (processor) => {
    const names = ["Marcus Aurelius", "Ada Lovelace", "Alan Turing", "Grace Hopper", "Linus Torvalds", "Steve W.", "Sumit Kumar"];
    const emails = ["marcus@roma.edu", "ada@lovelace.org", "turing@enigma.net", "grace@cobol.gov", "torvalds@linux.org", "woz@apple.com", "sumit@churnfix.io"];
    const index = Math.floor(Math.random() * names.length);
    const amount = Math.floor(Math.random() * 80) + 19; // $19 - $99
    
    const newEvent = {
      id: "E-" + Math.random().toString(36).substr(2, 4).toUpperCase(),
      timestamp: new Date().toISOString(),
      customerName: names[index],
      customerEmail: emails[index],
      processor: processor,
      amount: amount,
      status: "failed",
      reason: Math.random() > 0.5 ? "card_expired" : "insufficient_funds",
      invoiceId: "INV-" + Math.floor(Math.random() * 800000 + 100000),
      attempts: 1
    };

    if (onAddEvent) {
      onAddEvent(newEvent);
    }
    
    if (addToast) {
      addToast({
        title: "Webhook Intercepted",
        message: `${processor.toUpperCase()} invoice.payment_failed captured. Slack alert sent.`,
        type: "error"
      });
    }
  };

  const simulateRecover = (failedEvent) => {
    const newEvent = {
      ...failedEvent,
      id: "E-" + Math.random().toString(36).substr(2, 4).toUpperCase(),
      timestamp: new Date().toISOString(),
      status: "recovered",
      reason: "resolved",
      attempts: failedEvent.attempts + 1
    };

    if (onAddEvent) {
      onAddEvent(newEvent);
    }

    if (addToast) {
      addToast({
        title: "Revenue Recovered",
        message: `Restored payment for ${failedEvent.customerName}. Subscription active.`,
        type: "success"
      });
    }
  };
  
  // Calculate stats for the hero preview
  const failedEvents = events.filter((e) => e.status === "failed" || e.status === "retrying");
  const recoveredEvents = events.filter((e) => e.status === "recovered");
  const atRiskAmount = 14250;
  const recoveredAmount = 9840;
  const recoveryRate = 69.1;
  const failedCustomersCount = 124;

  // Mini Chart data coordinates
  const points = [
    { x: 30, y: 120 },
    { x: 80, y: 140 },
    { x: 130, y: 80 },
    { x: 180, y: 110 },
    { x: 230, y: 40 },
    { x: 280, y: 90 },
    { x: 330, y: 95 }
  ];
  const recPoints = [
    { x: 30, y: 140 },
    { x: 80, y: 120 },
    { x: 130, y: 110 },
    { x: 180, y: 130 },
    { x: 230, y: 90 },
    { x: 280, y: 80 },
    { x: 330, y: 80 }
  ];

  const buildPath = (pts) => `M ${pts[0].x} ${pts[0].y} ` + pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");


  return (
    <div className="bg-white text-[#0F172A] min-h-screen relative overflow-x-hidden font-body selection:bg-[#10B981]/20 selection:text-[#0F172A] antialiased flex flex-col">

      {/* ═══ HERO SECTION ═══ */}
      <div className="min-h-screen w-full relative bg-white flex flex-col">
        
        {/* Background Mesh Gradient (Stripe-like shade) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-b-[40px] md:rounded-b-[80px]">
          <div className="absolute inset-0 flex justify-center">
            <div className="absolute top-[-10%] right-[-5%] w-[70%] h-[70%] bg-gradient-to-bl from-[#10B981]/20 via-[#0EA5E9]/15 to-transparent blur-[120px] rounded-full mix-blend-multiply" />
            <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-[#6366F1]/15 to-transparent blur-[120px] rounded-full mix-blend-multiply" />
            <div className="absolute bottom-[20%] left-[10%] w-[60%] h-[60%] bg-gradient-to-t from-[#10B981]/10 to-transparent blur-[140px] rounded-full mix-blend-multiply" />
          </div>
        </div>

        {/* 1. Floating Navbar */}
        <motion.div
          className="sticky top-4 z-50 px-6 w-full pointer-events-none"
          {...fadeUp(0)}
        >
          <header className="pointer-events-auto border border-[#E5E7EB] bg-white/90 backdrop-blur-[12px] px-6 h-16 flex items-center justify-between max-w-[1200px] mx-auto w-full rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]">
            <Logo />

            <nav className="hidden md:flex items-center gap-8 font-medium text-[13px] text-[#64748B]">
              <a href="#features" className="hover:text-[#0F172A] transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-[#0F172A] transition-colors">How It Works</a>
              <a href="#pricing" className="hover:text-[#0F172A] transition-colors">Pricing</a>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login" className="text-[13px] font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors px-3 py-1.5 no-underline">
                Log In
              </Link>
              <Link href="/signup" className="bg-[#0F172A] hover:bg-[#1E293B] text-white text-[12px] px-5 py-2.5 font-bold rounded-full transition-all duration-300 cursor-pointer no-underline shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5">
                Start Free Trial
              </Link>
            </div>
          </header>
        </motion.div>

        {/* 2. Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-start text-center px-6 pt-20 pb-0 max-w-[1200px] mx-auto w-full">

          {/* Badge */}
          <motion.div {...fadeUp(0.1)}>
            <div className="inline-flex items-center gap-2 border border-[#E5E7EB] bg-[#F9FAFB] text-[#64748B] px-4 py-2 rounded-full text-[12px] font-semibold tracking-wide mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              ✨ Now with Lemon Squeezy support
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-[52px] sm:text-[64px] md:text-[76px] lg:text-[84px] font-bold tracking-[-0.04em] text-[#0F172A] leading-[1.02] font-display max-w-[1000px] mb-6"
            {...fadeUp(0.18)}
          >
            Recover failed payments <br className="hidden md:block" />
            before <span className="text-[#10B981]">they become churn.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-[16px] sm:text-[17px] text-[#64748B] leading-relaxed max-w-[620px] mb-8"
            {...fadeUp(0.26)}
          >
            Churnfix tracks failed subscription payments across Stripe, Polar, Paddle, and Lemon Squeezy. Get instant alerts, monitor revenue at risk, and recover lost revenue before customers churn.
          </motion.p>

          {/* CTA Row */}
          <motion.div className="flex flex-wrap items-center justify-center gap-3 mb-6" {...fadeUp(0.34)}>
            <Link href="/signup" className="bg-[#0F172A] hover:bg-[#1E293B] text-white text-[14px] px-8 py-3.5 font-bold rounded-full transition-all duration-300 cursor-pointer flex items-center gap-2 no-underline shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5">
              Start Free Trial <ArrowRight size={15} />
            </Link>
          </motion.div>

          {/* Trust Row */}
          <motion.div className="flex flex-wrap items-center justify-center gap-6 text-[13px] text-[#94A3B8] font-medium mb-12" {...fadeUp(0.42)}>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-[#10B981]" /> 14-day free trial</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-[#10B981]" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-[#10B981]" /> Setup in under 3 minutes</span>
          </motion.div>
        </div>

        {/* 3. Dashboard Preview — The Hero Visual */}
        <motion.div
          className="w-full px-6 pb-0 -mt-8 -mb-[200px] relative z-10"
          initial={{ opacity: 0, y: 48, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.5, ease: springEase }}
        >
          <div className="max-w-[1100px] mx-auto">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04),0_16px_64px_rgba(0,0,0,0.06)] overflow-hidden">

              {/* Dashboard Top Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#FEE2E2]" />
                    <span className="w-3 h-3 rounded-full bg-[#FEF3C7]" />
                    <span className="w-3 h-3 rounded-full bg-[#D1FAE5]" />
                  </div>
                  <div className="h-5 border-l border-[#F1F5F9]" />
                  <span className="font-display font-bold text-[13px] text-[#0F172A] tracking-[-0.02em]">Churnfix Dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-[11px] font-semibold text-[#10B981] tracking-wide">LIVE</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6">

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <DashKPI label="At-Risk Revenue" value={atRiskAmount} prefix="$" color="#EF4444" icon={<AlertCircle size={14} />} />
                  <DashKPI label="Recovered Revenue" value={recoveredAmount} prefix="$" color="#10B981" icon={<CheckCircle2 size={14} />} />
                  <DashKPI label="Recovery Rate" value={recoveryRate} suffix="%" color="#10B981" icon={<TrendingUp size={14} />} />
                  <DashKPI label="Failed Customers" value={failedCustomersCount} color="#F59E0B" icon={<Users size={14} />} />
                </div>

                {/* Chart + Feed Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                  {/* Recovery Chart */}
                  <div className="lg:col-span-8 border border-[#F1F5F9] rounded-xl p-5 bg-[#FAFBFC]">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-display font-bold text-sm text-[#0F172A] tracking-[-0.01em]">Recovery Pipeline</div>
                        <div className="text-[11px] text-[#94A3B8] mt-0.5">Failed vs recovered revenue — 7 day trend</div>
                      </div>
                      <div className="flex gap-4 text-[10px] font-semibold text-[#94A3B8]">
                        <span className="flex items-center gap-1.5"><span className="w-5 h-[2px] bg-[#EF4444] rounded" /> At-Risk</span>
                        <span className="flex items-center gap-1.5"><span className="w-5 h-[2px] bg-[#10B981] rounded" /> Recovered</span>
                      </div>
                    </div>
                    <HeroChart />
                  </div>

                  {/* Live Feed + Provider Tabs */}
                  <div className="lg:col-span-4 flex flex-col gap-4">

                    {/* Provider Tabs */}
                    <div className="border border-[#F1F5F9] rounded-xl p-4 bg-[#FAFBFC]">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-2.5">Monitoring</div>
                      <div className="grid grid-cols-2 gap-2">
                        {["Stripe", "Polar", "Paddle", "LemonSqueezy"].map((name) => (
                          <div key={name} className="border border-[#F1F5F9] bg-white rounded-lg py-2 px-3 text-[11px] font-bold text-[#0F172A] flex items-center gap-2 hover:border-[#10B981]/30 transition-colors cursor-default">
                            <span className={`w-1.5 h-1.5 rounded-full ${name === "Stripe" ? "bg-[#635BFF]" : name === "Polar" ? "bg-[#0066FF]" : name === "Paddle" ? "bg-[#3B3B3B]" : "bg-[#FFC233]"}`} />
                            {name}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Live Activity */}
                    <div className="border border-[#F1F5F9] rounded-xl p-4 bg-[#FAFBFC] flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-3">Live Activity</div>
                      <div className="flex flex-col gap-2.5">
                        {events.slice(-3).reverse().map((e) => (
                          <div key={e.id} className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-[12px] text-[#0F172A]">{e.customerName}</div>
                              <div className="text-[10px] text-[#94A3B8] capitalize mt-0.5">{e.processor} • ${e.amount.toFixed(0)}</div>
                            </div>
                            <span className={`text-[9px] font-bold px-2 py-1 rounded-md capitalize ${
                              e.status === "recovered" ? "bg-[#D1FAE5] text-[#059669]" :
                              e.status === "retrying" ? "bg-[#FEF3C7] text-[#D97706]" :
                              "bg-[#FEE2E2] text-[#DC2626]"
                            }`}>
                              {e.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Spacer for the overflowing dashboard */}
      <div className="h-[200px] bg-[#FAFAFA]" />

      {/* MID SECTION: Light Mode (#FAFAFA) */}
      <div className="bg-[#FAFAFA] text-[#0F172A] relative z-10 pt-16">

        
        {/* 4. Bento Features Grid (All text left, mockups right) */}
        <section id="features" className="max-w-7xl mx-auto w-full px-6 pb-24 relative">
          {/* Subtle background radial shade */}
          <div className="absolute top-[20%] left-[-20%] w-[60%] h-[40%] rounded-full bg-[#0F9D76]/3 filter blur-[120px] pointer-events-none" />
          
          <div className="max-w-3xl mb-16">
            <span className="text-[#0F9D76] text-[11px] font-bold uppercase tracking-widest block mb-3">
              POWERFUL FEATURES
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] font-display leading-[1.1] mb-5">
              A quiet monitoring layer <br />
              for your billing stack.
            </h2>
            <p className="text-[#475569] text-base leading-relaxed max-w-xl">
              No bloated tools. No complex setups. Churnfix watches failed payments and helps you recover subscription value in the background.
            </p>
          </div>

          <div className="flex flex-col gap-10">
            {/* Card 1: Webhook Alerts */}
            <div className="bg-white border border-slate-200/60 rounded-[16px] p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center hover:border-slate-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.02)] transition-all">
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="w-8 h-8 rounded-[6px] bg-[#0F9D76]/10 text-[#0F9D76] flex items-center justify-center">
                  <Bell size={16} />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] font-display">Instant webhook alerts.</h3>
                <p className="text-[#475569] text-sm leading-relaxed">
                  Slack, Discord, and Email alerts trigger the exact second a card payment fails.
                </p>
                <ul className="text-xs text-[#475569] font-semibold flex flex-col gap-2 list-none p-0 mt-2">
                  <li className="flex items-center gap-2">✓ Filters out noise</li>
                  <li className="flex items-center gap-2">✓ Custom links using smart webhooks</li>
                  <li className="flex items-center gap-2">✓ Includes customer context, links & reason</li>
                </ul>
              </div>

              {/* Slack Mockup */}
              <div className="lg:col-span-7 bg-[#0A0C0F] text-slate-100 rounded-[8px] p-6 font-sans text-xs flex flex-col gap-3 shadow-none border border-white/[0.04]">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E01E5A]" />
                    <span className="font-bold text-white/80">#billing-alerts</span>
                  </div>
                  <span className="text-[10px] text-white/40">Slack App</span>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-[#0F9D76] text-[#0A0C0F] rounded-[4px] flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                    CF
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">Churnfix</span>
                      <span className="bg-white/10 text-white/60 text-[9px] px-1.5 py-0.5 rounded-[4px]">APP</span>
                      <span className="text-[10px] text-slate-400">10:42 AM</span>
                    </div>
                    <div className="border-l-[3px] border-red-500 pl-3 py-0.5 flex flex-col gap-1.5 bg-red-500/5 pr-4 rounded-r-[4px]">
                      <div className="font-bold text-slate-200">⚠️ Failed Stripe charge</div>
                      <p className="text-slate-300 leading-relaxed">
                        Amount: <strong>$19.00</strong>. Customer: <strong>sarah@home.com</strong>
                        <br />
                        Reason: Insufficient Funds
                      </p>
                      <button 
                        onClick={() => onEnterApp("dashboard")}
                        className="w-fit bg-[#0F9D76] hover:bg-[#0C8564] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-[4px] cursor-pointer border-none transition-colors mt-1"
                      >
                        Inspect Recovery Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Developer level monitoring */}
            <div className="bg-white border border-slate-200/60 rounded-[16px] p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center hover:border-slate-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.02)] transition-all">
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="w-8 h-8 rounded-[6px] bg-[#0F9D76]/10 text-[#0F9D76] flex items-center justify-center">
                  <Terminal size={16} />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] font-display">Full Transparency.</h3>
                <p className="text-[#475569] text-sm leading-relaxed">
                  See exactly why a payment failed without digging through multiple payment provider dashboards. Deep payload inspection made easy.
                </p>
                <button 
                  onClick={() => onEnterApp("dashboard")}
                  className="w-fit border border-slate-200 hover:border-slate-800 text-[#0F172A] text-xs font-bold py-2.5 px-4 rounded-[6px] cursor-pointer bg-white transition-all shadow-sm"
                >
                  View live feed →
                </button>
              </div>

              {/* JSON Mockup */}
              <div className="lg:col-span-7 bg-[#0A0C0F] rounded-[8px] p-6 font-mono text-[11px] leading-relaxed overflow-hidden text-slate-300 select-all border border-white/[0.04] h-[220px] relative">
                <div className="flex items-center justify-between text-slate-500 border-b border-white/[0.04] pb-2 mb-4">
                  <span className="text-[10px] text-white/30">Webhook payload</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-[4px]">200 OK</span>
                </div>
                <div className="scrolling-code flex flex-col gap-1">
                  <span className="text-yellow-500">{"{"}</span>
                  <div className="pl-4">
                    <span className="text-teal-400">"event"</span>: <span className="text-emerald-400">"invoice.payment_failed"</span>,<br />
                    <span className="text-teal-400">"data"</span>: <span className="text-yellow-500">{"{"}</span>
                    <div className="pl-4">
                      <span className="text-teal-400">"object"</span>: <span className="text-yellow-500">{"{"}</span>
                      <div className="pl-4">
                        <span className="text-teal-400">"id"</span>: <span className="text-amber-400">"in_1Ni..."</span>,<br />
                        <span className="text-teal-400">"customer"</span>: <span className="text-amber-400">"cus_O7l..."</span>,<br />
                        <span className="text-teal-400">"amount_due"</span>: <span className="text-amber-400">1900</span>,<br />
                        <span className="text-teal-400">"currency"</span>: <span className="text-amber-400">"usd"</span>,<br />
                        <span className="text-teal-400">"email_attempt"</span>: <span className="text-emerald-400">1713011200</span>
                      </div>
                      <span className="text-yellow-500">{"}"}</span>
                    </div>
                    <span className="text-yellow-500">{"}"}</span>
                  </div>
                  <span className="text-yellow-500">{"}"}</span>
                </div>
              </div>
            </div>

            {/* Card 3: Automated dunning flows */}
            <div className="bg-white border border-slate-200/60 rounded-[16px] p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center hover:border-slate-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.02)] transition-all">
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="w-8 h-8 rounded-[6px] bg-[#0F9D76]/10 text-[#0F9D76] flex items-center justify-center">
                  <Mail size={16} />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] font-display">Automated dunning flows.</h3>
                <p className="text-[#475569] text-sm leading-relaxed">
                  Send conversion-optimized recovery templates immediately on card declines. Customizable playbooks map recovery links accurately, increasing success.
                </p>
                <button 
                  onClick={() => onEnterApp("dashboard")}
                  className="w-fit border border-slate-200 hover:border-slate-800 text-[#0F172A] text-xs font-bold py-2.5 px-4 rounded-[6px] cursor-pointer bg-white transition-all shadow-sm"
                >
                  Pre-built templates →
                </button>
              </div>

              {/* Email Mockup */}
              <div className="lg:col-span-7 border border-slate-200 rounded-[8px] overflow-hidden flex flex-col bg-[#FAFAFA] shadow-none p-4">
                <div className="p-3 bg-white border border-slate-200/60 rounded-t-[6px] text-[11px] leading-relaxed text-[#475569]">
                  <div>
                    <span className="font-bold mr-1">From:</span>
                    <span className="text-[#0F172A]/80">team@yourSaaS.com</span>
                  </div>
                  <div className="mt-0.5">
                    <span className="font-bold mr-1">Subject:</span>
                    <span className="font-semibold text-[#0F172A]">Action required: update payment to keep subscription</span>
                  </div>
                </div>
                <div className="p-5 bg-white border-x border-b border-slate-200/60 rounded-b-[6px] text-xs text-[#475569] leading-relaxed">
                  <p className="mb-3">Hi Sarah,</p>
                  <p className="mb-4 text-[#475569]/80">
                    We were unable to process your recent monthly payment of <strong>$19.00</strong>. 
                    To keep your account active and avoid any interruptions, please update your payment method:
                  </p>
                  <button 
                    onClick={() => onEnterApp("dashboard")}
                    className="bg-[#0F9D76] hover:bg-[#0C8564] text-white font-bold text-xs py-2 px-6 rounded-[4px] border-none cursor-pointer transition-colors block mx-auto text-center my-4 glow-btn-hover"
                  >
                    Update Payment Method →
                  </button>
                  <p className="text-xs text-[#475569]/50">
                    Thank you,<br />
                    The Billing Team
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. How It Works Banner (Dark Card Block) */}
        <section id="how-it-works" className="max-w-7xl mx-auto w-full px-6 pb-20 relative">
          <div className="bg-[#0B0D10] text-white p-10 rounded-[24px] border border-white/[0.05] relative overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
            {/* Ambient background glow for steps banner */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute top-[-20%] right-[-10%] w-[35%] h-[70%] rounded-full bg-[#00E87A] opacity-[0.05] filter blur-[90px]" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 flex flex-col gap-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white font-display leading-tight">
                  Active in less than 3 minutes.
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Start listening to webhook events immediately. Zero code or developer intervention required.
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#00E87A]/15 text-[#00E87A] flex items-center justify-center text-xs font-bold font-mono">
                      01
                    </div>
                    <span className="font-bold text-sm text-white">Connect billing provider</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed mt-1">
                    Authenticate Stripe, Paddle, Polar, or Lemon Squeezy securely.
                  </p>
                </div>
                {/* Step 2 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#00E87A]/15 text-[#00E87A] flex items-center justify-center text-xs font-bold font-mono">
                      02
                    </div>
                    <span className="font-bold text-sm text-white">Monitor failed payments</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed mt-1">
                    Churnfix instantly captures payment failed events and triggers notifications.
                  </p>
                </div>
                {/* Step 3 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#00E87A]/15 text-[#00E87A] flex items-center justify-center text-xs font-bold font-mono">
                      03
                    </div>
                    <span className="font-bold text-sm text-white">Recover revenue before churn</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed mt-1">
                    Track recoveries, send dunning flows and win back revenue automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* 7. Why Founders Switch: The Recovery Loop (Light Mode Horizontal Flow) */}
        <section className="max-w-7xl mx-auto w-full px-6 py-24 border-b border-slate-200/60 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#0F9D76] text-[11px] font-bold uppercase tracking-widest block mb-3">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] font-display mb-4">
              Why founders switch: The Recovery Loop
            </h2>
            <p className="text-[#475569] text-sm leading-relaxed">
              What happens from the millisecond a payment declines until the recovered revenue is back in your account.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* Step 1 */}
            <div 
              className="bg-white border border-slate-200/60 p-5 rounded-[16px] flex flex-col justify-between hover:border-[#00E87A]/40 hover:shadow-[0_12px_30px_rgba(0,232,122,0.06)] hover:translate-y-[-2px] transition-all duration-300"
              style={{
                background: "radial-gradient(circle at 50% 25%, rgba(16, 185, 129, 0.08), transparent 70%), #FFFFFF",
              }}
            >
              <div>
                {/* Visual section */}
                <div className="w-full h-40 rounded-xl bg-slate-50/50 border border-slate-100/80 flex items-center justify-center relative overflow-hidden mb-4">
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Webhook Console mockup */}
                    <div className="w-[85%] bg-[#0A0C10] border border-white/[0.06] rounded-lg p-3 text-[10px] font-mono text-slate-300 shadow-md">
                      <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-2">
                        <span className="text-slate-500 text-[8px] tracking-wider uppercase">Stripe Webhook</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      </div>
                      <div className="flex flex-col gap-1 text-left text-[9px]">
                        <div><span className="text-[#00E87A]">event:</span> "invoice.payment_failed"</div>
                        <div><span className="text-[#00E87A]">status:</span> <span className="text-red-400">"failed"</span></div>
                        <div><span className="text-[#00E87A]">customer:</span> "sarah@home.com"</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-[#0F9D76] text-xs font-bold font-mono tracking-widest mb-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#0F9D76]/10 flex items-center justify-center text-[10px]">01</span>
                  CAPTURE
                </div>
                <h3 className="text-sm font-bold text-[#0F172A] mb-1.5">Capture Decline</h3>
                <p className="text-[#6B7280] text-[11px] leading-relaxed">
                  Stripe or Paddle registers a card decline. Churnfix captures the billing webhook in real time.
                </p>
              </div>
              <div className="bg-slate-100 text-[9px] font-mono font-bold text-[#475569] px-2 py-0.5 rounded-full mt-4 w-fit">
                invoice.payment_failed
              </div>
            </div>

            {/* Step 2 */}
            <div 
              className="bg-white border border-slate-200/60 p-5 rounded-[16px] flex flex-col justify-between hover:border-[#00E87A]/40 hover:shadow-[0_12px_30px_rgba(0,232,122,0.06)] hover:translate-y-[-2px] transition-all duration-300"
              style={{
                background: "radial-gradient(circle at 50% 25%, rgba(16, 185, 129, 0.08), transparent 70%), #FFFFFF",
              }}
            >
              <div>
                {/* Visual section */}
                <div className="w-full h-40 rounded-xl bg-slate-50/50 border border-slate-100/80 flex items-center justify-center relative overflow-hidden mb-4">
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Node connection network mockup */}
                    <div className="w-7 h-7 rounded-full bg-[#00E87A] shadow-[0_0_15px_rgba(0,232,122,0.4)] flex items-center justify-center z-10">
                      <Bell className="text-black" size={12} />
                    </div>
                    
                    {/* Dotted paths */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 120">
                      <path d="M 100 60 Q 120 40, 140 30" stroke="#00E87A" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.6" />
                      <path d="M 100 60 L 140 60" stroke="#00E87A" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.6" />
                      <path d="M 100 60 Q 120 80, 140 90" stroke="#00E87A" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.6" />
                    </svg>
                    
                    {/* Alert destinations */}
                    <div className="absolute left-[125px] top-[16px] bg-white border border-slate-200/80 px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm text-[8px] font-semibold text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E]" />
                      Slack
                    </div>
                    <div className="absolute left-[132px] top-[48px] bg-white border border-slate-200/80 px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm text-[8px] font-semibold text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E]" />
                      Discord
                    </div>
                    <div className="absolute left-[125px] top-[80px] bg-white border border-slate-200/80 px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm text-[8px] font-semibold text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E]" />
                      Email
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#0F9D76] text-xs font-bold font-mono tracking-widest mb-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#0F9D76]/10 flex items-center justify-center text-[10px]">02</span>
                  ALERT
                </div>
                <h3 className="text-sm font-bold text-[#0F172A] mb-1.5">Instant Broadcast</h3>
                <p className="text-[#6B7280] text-[11px] leading-relaxed">
                  A dedicated alert notifies you on Slack, Discord, and Email with customer details and reason.
                </p>
              </div>
              <div className="bg-slate-100 text-[9px] font-mono font-bold text-[#475569] px-2 py-0.5 rounded-full mt-4 w-fit">
                Payment Failed
              </div>
            </div>

            {/* Step 3 */}
            <div 
              className="bg-white border border-slate-200/60 p-5 rounded-[16px] flex flex-col justify-between hover:border-[#00E87A]/40 hover:shadow-[0_12px_30px_rgba(0,232,122,0.06)] hover:translate-y-[-2px] transition-all duration-300"
              style={{
                background: "radial-gradient(circle at 50% 25%, rgba(16, 185, 129, 0.08), transparent 70%), #FFFFFF",
              }}
            >
              <div>
                {/* Visual section */}
                <div className="w-full h-40 rounded-xl bg-slate-50/50 border border-slate-100/80 flex items-center justify-center relative overflow-hidden mb-4">
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Email overlay mockup */}
                    <div className="w-[85%] h-[80%] bg-white border border-slate-200/80 rounded-lg shadow-sm p-3 flex flex-col justify-between">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                          <Mail size={10} className="text-[#00E87A]" />
                          <span className="text-[8px] font-bold text-slate-700">Recovery Email</span>
                        </div>
                        <div className="flex flex-col gap-1 mt-0.5">
                          <div className="w-full h-1.5 bg-slate-100 rounded-full" />
                          <div className="w-[90%] h-1.5 bg-slate-100 rounded-full" />
                          <div className="w-[60%] h-1.5 bg-slate-100 rounded-full" />
                        </div>
                      </div>
                      <div className="w-full bg-[#00E87A] text-black font-extrabold text-[8px] py-1 rounded text-center shadow-sm">
                        Update Card
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#0F9D76] text-xs font-bold font-mono tracking-widest mb-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#0F9D76]/10 flex items-center justify-center text-[10px]">03</span>
                  DUNNING
                </div>
                <h3 className="text-sm font-bold text-[#0F172A] mb-1.5">Auto-Dunning</h3>
                <p className="text-[#6B7280] text-[11px] leading-relaxed">
                  An automated email sequence or checkout recovery link is sent to the customer.
                </p>
              </div>
              <div className="bg-slate-100 text-[9px] font-mono font-bold text-[#475569] px-2 py-0.5 rounded-full mt-4 w-fit">
                dunning_sequence_executed
              </div>
            </div>

            {/* Step 4 */}
            <div 
              className="bg-white border border-slate-200/60 p-5 rounded-[16px] flex flex-col justify-between hover:border-[#00E87A]/40 hover:shadow-[0_12px_30px_rgba(0,232,122,0.06)] hover:translate-y-[-2px] transition-all duration-300"
              style={{
                background: "radial-gradient(circle at 50% 25%, rgba(16, 185, 129, 0.08), transparent 70%), #FFFFFF",
              }}
            >
              <div>
                {/* Visual section */}
                <div className="w-full h-40 rounded-xl bg-slate-50/50 border border-slate-100/80 flex items-center justify-center relative overflow-hidden mb-4">
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Success metrics mockup */}
                    <div className="w-[85%] h-[80%] bg-white border border-slate-200/80 rounded-lg shadow-sm p-3 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-bold text-slate-400">Recovery Status</span>
                        <span className="w-3.5 h-3.5 rounded-full bg-[#00E87A]/20 text-[#0F9D76] flex items-center justify-center text-[8px] font-bold font-mono">✓</span>
                      </div>
                      
                      <div className="my-0.5 text-left">
                        <div className="text-[8px] text-slate-400 font-semibold">Recovered Revenue</div>
                        <div className="text-[15px] font-black text-[#0F9D76] tracking-tight font-display">+$19.00</div>
                      </div>
                      
                      <div className="h-5 w-full">
                        <svg className="w-full h-full" viewBox="0 0 120 30">
                          <path d="M 10 25 Q 35 15, 60 20 T 110 5" fill="none" stroke="#00E87A" strokeWidth="2" strokeLinecap="round" />
                          <path d="M 10 25 Q 35 15, 60 20 T 110 5 L 110 30 L 10 30 Z" fill="url(#restoredGrad)" opacity="0.15" />
                          <defs>
                            <linearGradient id="restoredGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#00E87A" />
                              <stop offset="100%" stopColor="#FFFFFF" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#0F9D76] text-xs font-bold font-mono tracking-widest mb-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#0F9D76]/10 flex items-center justify-center text-[10px]">04</span>
                  SUCCESS
                </div>
                <h3 className="text-sm font-bold text-[#0F172A] mb-1.5">Revenue Restored</h3>
                <p className="text-[#6B7280] text-[11px] leading-relaxed">
                  The customer updates their billing information, the payment goes through, and revenue is back.
                </p>
              </div>
              <div className="bg-[#0F9D76]/10 border border-[#0F9D76]/20 text-[9px] font-mono font-bold text-[#0F9D76] px-2 py-0.5 rounded-full mt-4 w-fit">
                Payment Recovered
              </div>
            </div>
          </div>
        </section>

        {/* 8. Pricing Section (Do NOT touch pricing cards, structure, or styles - kept exactly as is) */}
        <section id="pricing" className="max-w-7xl mx-auto w-full px-6 py-24 border-b border-slate-200/60 relative">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex justify-center mb-4">
              <span className="bg-primary-light text-primary text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                PRICING
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy font-display mb-4">
              Protect revenue before it becomes churn.
            </h2>
            <p className="text-muted-text text-sm">
              Get instant failed payment alerts, recovery tracking, and customer risk monitoring across your billing stack.
            </p>
          </div>

          {/* Monthly/Yearly Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12 select-none">
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

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
            {[
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
            ].map((plan) => {
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
                        className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3.5 rounded-[12px] transition-colors border-none uppercase tracking-wider font-display cursor-pointer"
                        onClick={() => {
                          onSelectTier(plan.id);
                          onEnterApp("login");
                        }}
                      >
                        Start Free Trial
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
        </section>

        {/* 9. Final CTA (Dark Card Block with Quote) */}
        <section className="max-w-7xl mx-auto w-full px-6 py-20 relative">
          <div className="border border-[#E5E7EB] bg-[#0F172A] text-white p-8 md:p-16 rounded-[24px] text-center flex flex-col items-center gap-6 relative overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.15)]">
            {/* Background glow overlay */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute top-[20%] left-[30%] w-[40%] h-[60%] rounded-full bg-[#10B981] opacity-[0.08] filter blur-[100px]" />
            </div>

            <h2 className="relative z-10 text-3xl md:text-5xl font-bold font-display tracking-tight max-w-3xl leading-[1.1] text-white/95">
              Every failed payment <br />
              <span className="text-[#10B981]">is a customer on the way out.</span>
            </h2>
            <p className="relative z-10 text-slate-400 max-w-md text-sm md:text-base leading-relaxed">
              Stop losing subscription revenue to silent card declines. Start monitoring and recovering today.
            </p>
            <Link
              href="/signup"
              className="relative z-10 bg-[#10B981] hover:bg-[#059669] text-white text-[15px] px-8 py-4 font-bold rounded-full transition-all duration-300 mt-4 flex items-center gap-2 cursor-pointer border-none font-display no-underline shadow-[0_1px_3px_rgba(16,185,129,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-0.5"
            >
              Start Monitoring Revenue Loss <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* 10. Footer */}
        <footer className="border-t border-slate-200/60 bg-[#FAFAFA] py-16 px-6 relative">
          <div className="max-w-7xl mx-auto w-full flex flex-col gap-16">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
              <div className="md:col-span-2 flex flex-col gap-4">
                <Logo />
                <p className="text-[13px] text-[#64748B] leading-relaxed max-w-[240px]">
                  Clean, calm billing reliability for founders. Recover revenue on autopilot across all your payment providers.
                </p>
              </div>
              
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-[13px] text-[#0F172A]">Product</h4>
                <a href="#features" className="text-[13px] text-[#64748B] hover:text-[#10B981] transition-colors no-underline">Features</a>
                <a href="#pricing" className="text-[13px] text-[#64748B] hover:text-[#10B981] transition-colors no-underline">Pricing</a>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-[13px] text-[#0F172A]">Legal</h4>
                <a href="#" className="text-[13px] text-[#64748B] hover:text-[#10B981] transition-colors no-underline">Privacy Policy</a>
                <a href="#" className="text-[13px] text-[#64748B] hover:text-[#10B981] transition-colors no-underline">Terms of Service</a>
              </div>
              
              {/* Empty column for layout balance */}
              <div className="hidden md:block"></div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between border-t border-[#E5E7EB] pt-8 gap-4">
              <p className="text-[12px] text-[#64748B]">
                © {new Date().getFullYear()} Churnfix. All rights reserved.
              </p>
              {/* 50% opacity Churnfix wordmark */}
              <span className="font-display text-xl font-black tracking-[-0.03em] text-[#0F172A] opacity-20 select-none">
                churnfix
              </span>
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}
