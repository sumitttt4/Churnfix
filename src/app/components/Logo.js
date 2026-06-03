import React from "react";

export default function Logo({ darkBg = false }) {
  return (
    <div className="flex items-center gap-2.5 text-decoration-none select-none">
      <svg
        className={`w-8 h-8 ${darkBg ? "text-[#00E87A]" : "text-[#0F9D76]"} flex items-center justify-center`}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* glyph-premium-skeleton: curved_boomerang */}
        <g>
          <path d="M 50,125 C 80,110 100,75 100,75 C 100,75 120,110 150,125 C 110,100 100,95 100,95 C 100,95 90,100 50,125 Z" fill="currentColor"/>
          <path d="M 60,135 C 85,123 100,92 100,92 C 100,92 115,123 140,135 C 110,113 100,108 100,108 C 100,108 90,113 60,135 Z" fill="#036348" opacity="0.5"/>
        </g>
      </svg>
      <span className={`font-display text-[19px] font-bold tracking-[-0.03em] ${darkBg ? "text-white" : "text-[#0F172A]"}`}>
        churnfix
      </span>
    </div>
  );
}
