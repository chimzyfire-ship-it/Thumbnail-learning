"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const Jotter       = dynamic(() => import("@/components/study/Jotter"),       { ssr: false });
const MaterialsBank = dynamic(() => import("@/components/study/MaterialsBank"), { ssr: false });
const AIHelper     = dynamic(() => import("@/components/study/AIHelper"),     { ssr: false });
const FocusTimer   = dynamic(() => import("@/components/study/FocusTimer"),   { ssr: false });

type Tab = "focus" | "jotter" | "bank" | "helper";

const TABS: { id: Tab; label: string; icon: string; desc: string }[] = [
  { id: "focus",  label: "Focus Timer",  icon: "/icon-streak.png",   desc: "Pomodoro + stats" },
  { id: "jotter", label: "My Jotter",    icon: "/icon-book.png",     desc: "Write & save notes" },
  { id: "bank",   label: "Materials",    icon: "/icon-bookmark.png", desc: "Files & saved links" },
  { id: "helper", label: "AI Assistant", icon: "/icon-brain.png",    desc: "Powered by Gemini" },
];

export default function StudySpacePage() {
  const [activeTab, setActiveTab] = useState<Tab>("focus");
  // Track which tabs have been visited so we only mount them once they're first accessed
  const [mounted, setMounted] = useState<Set<Tab>>(new Set(["focus"]));

  function switchTab(id: Tab) {
    setActiveTab(id);
    setMounted(prev => new Set([...prev, id]));
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 pb-8 sm:gap-6">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-[2rem] font-extrabold leading-tight tracking-tight text-white md:text-4xl">
          Study Space
        </h1>
        <p className="max-w-xl text-sm leading-6 text-[#7a8194] sm:text-base">
          Your personal learning hub — focus, take notes, save materials, and get instant AI help.
        </p>
      </div>

      {/* Tab Bar */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`phone-tap relative flex items-center gap-2 overflow-hidden rounded-2xl border p-2.5 text-left transition-all duration-200 sm:gap-3 sm:p-3.5 ${
              activeTab === tab.id
                ? "bg-[#c9a84c]/10 border-[#c9a84c]/40 shadow-[0_0_30px_rgba(201,168,76,0.08)]"
                : "bg-[#111827] border-[#1f2b3e] hover:border-[#c9a84c]/20 hover:bg-[#c9a84c]/5"
            }`}
          >
            {activeTab === tab.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#c9a84c]/5 to-transparent pointer-events-none" />
            )}
            <div className={`h-8 w-8 shrink-0 overflow-hidden rounded-xl transition-all sm:h-9 sm:w-9 ${
              activeTab === tab.id ? "shadow-[0_0_20px_rgba(201,168,76,0.3)]" : "opacity-60"
            }`}>
              <img src={tab.icon} alt={tab.label} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <div className={`truncate text-xs font-bold sm:text-sm ${activeTab === tab.id ? "text-[#c9a84c]" : "text-white"}`}>
                {tab.label}
              </div>
              <div className="hidden text-[11px] text-[#7a8194] truncate md:block">{tab.desc}</div>
            </div>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#c9a84c]/60 via-[#c9a84c] to-[#c9a84c]/60" />
            )}
          </button>
        ))}
      </div>

      {/* 
        IMPORTANT: All panels use CSS visibility (display:none / block) instead of 
        conditional rendering. This keeps React components mounted so the Focus Timer 
        interval and all other state survives tab switches.
      */}
      <div>
        {/* Focus Timer — always mounted first, hidden when not active */}
        <div style={{ display: activeTab === "focus" ? "block" : "none" }}>
          <FocusTimer />
        </div>

        {/* Jotter — mount on first visit, then keep alive */}
        {mounted.has("jotter") && (
          <div style={{ display: activeTab === "jotter" ? "block" : "none" }}>
            <Jotter />
          </div>
        )}

        {/* Materials Bank */}
        {mounted.has("bank") && (
          <div style={{ display: activeTab === "bank" ? "block" : "none" }}>
            <MaterialsBank />
          </div>
        )}

        {/* AI Helper */}
        {mounted.has("helper") && (
          <div style={{ display: activeTab === "helper" ? "block" : "none" }}>
            <AIHelper />
          </div>
        )}
      </div>
    </div>
  );
}
