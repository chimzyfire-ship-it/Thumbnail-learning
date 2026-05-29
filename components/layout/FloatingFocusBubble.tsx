"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pause, Play, X, Timer } from "lucide-react";
import { useFocus } from "@/lib/focus-context";

export default function FloatingFocusBubble() {
  const { running, secondsLeft, totalSeconds, topic, toggle, reset, pendingLog, confirmLog, dismissLog } = useFocus();
  const router = useRouter();
  const [pendingTopic, setPendingTopic] = useState("");
  const [minimised, setMinimised] = useState(false);

  const progress = (totalSeconds - secondsLeft) / totalSeconds;
  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");
  const circumference = 2 * Math.PI * 20; // r=20
  const offset = circumference * (1 - progress);

  // Only show if running OR if there's a pending log prompt
  if (!running && !pendingLog) return null;

  // ── Pending log prompt (session finished, no topic) ───────────────────────
  if (pendingLog) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-[#0d1424] border border-[#c9a84c]/40 rounded-2xl shadow-2xl p-5 w-80"
          style={{ boxShadow: "0 0 40px rgba(201,168,76,0.15)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#c9a84c]/15 flex items-center justify-center">
              <Timer className="w-5 h-5 text-[#c9a84c]" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Session complete!</p>
              <p className="text-xs text-[#7a8194]">Add a topic to log this session</p>
            </div>
            <button onClick={dismissLog} className="ml-auto text-[#7a8194] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            autoFocus
            value={pendingTopic}
            onChange={e => setPendingTopic(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && pendingTopic.trim()) { confirmLog(pendingTopic); setPendingTopic(""); } }}
            placeholder="e.g. Biology Chapter 4, JAMB Maths…"
            className="w-full bg-[#080c16] border border-[#1f2b3e] focus:border-[#c9a84c]/50 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-[#7a8194] focus:outline-none mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={() => { confirmLog(pendingTopic); setPendingTopic(""); }}
              disabled={!pendingTopic.trim()}
              className="flex-1 bg-[#c9a84c] hover:bg-[#d4b95e] disabled:opacity-40 text-[#0a0e1a] font-bold py-2 rounded-xl text-sm transition-colors"
            >
              Log Session
            </button>
            <button
              onClick={dismissLog}
              className="px-4 py-2 bg-[#111827] border border-[#1f2b3e] text-[#7a8194] hover:text-white rounded-xl text-sm transition-colors"
            >
              Skip
            </button>
          </div>
          <p className="text-[10px] text-[#7a8194]/60 text-center mt-2">Skipping won&apos;t count this session toward your stats</p>
        </div>
      </div>
    );
  }

  // ── Minimised pill ────────────────────────────────────────────────────────
  if (minimised) {
    return (
      <button
        onClick={() => setMinimised(false)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#0d1424] border border-[#c9a84c]/40 rounded-full px-4 py-2.5 shadow-xl transition-all hover:scale-105 animate-in slide-in-from-bottom-2"
        style={{ boxShadow: "0 0 20px rgba(201,168,76,0.2)" }}
      >
        <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
        <span className="text-sm font-black text-[#c9a84c] tabular-nums">{mins}:{secs}</span>
      </button>
    );
  }

  // ── Full bubble ───────────────────────────────────────────────────────────
  return (
    <div
      className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300"
      style={{ filter: "drop-shadow(0 0 24px rgba(201,168,76,0.20))" }}
    >
      <div className="bg-[#0d1424] border border-[#c9a84c]/30 rounded-2xl shadow-2xl overflow-hidden w-64">

        {/* Gold progress bar at top */}
        <div className="h-0.5 bg-[#1f2b3e]">
          <div
            className="h-full bg-gradient-to-r from-[#c9a84c] to-[#d4b95e] transition-all duration-1000"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="p-4">
          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {/* Mini ring */}
              <svg width="48" height="48" className="rotate-[-90deg] shrink-0">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#1f2b3e" strokeWidth="3" />
                <circle cx="24" cy="24" r="20" fill="none" stroke="#c9a84c" strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <div>
                <p className="text-xl font-black text-[#c9a84c] tabular-nums leading-none">{mins}:{secs}</p>
                <p className="text-[10px] text-[#7a8194] uppercase tracking-wider mt-0.5">Focusing</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMinimised(true)}
                className="w-7 h-7 rounded-lg bg-[#111827] text-[#7a8194] hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
                title="Minimise"
              >—</button>
            </div>
          </div>

          {/* Topic */}
          {topic && (
            <div className="mb-3 px-2.5 py-1.5 bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-lg">
              <p className="text-xs text-[#c9a84c] font-semibold truncate">{topic}</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-sm transition-all"
              style={{ background: "linear-gradient(135deg, #c9a84c, #d4b95e)", color: "#0a0e1a" }}
            >
              {running ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Resume</>}
            </button>
            <button
              onClick={() => router.push("/study-space")}
              className="w-9 h-9 rounded-xl bg-[#111827] border border-[#1f2b3e] hover:border-[#c9a84c]/30 text-[#c9a84c] flex items-center justify-center transition-colors"
              title="Open Focus Timer"
            >
              <Timer className="w-4 h-4" />
            </button>
            <button
              onClick={() => { reset(); setMinimised(false); }}
              className="w-9 h-9 rounded-xl bg-[#111827] border border-[#1f2b3e] hover:border-red-500/30 text-[#7a8194] hover:text-red-400 flex items-center justify-center transition-colors"
              title="End session"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
