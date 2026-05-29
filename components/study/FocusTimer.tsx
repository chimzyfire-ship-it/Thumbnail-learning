"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Flame, Clock, Trophy, Target, ChevronRight, Coffee, Minus, Plus } from "lucide-react";
import { useFocus } from "@/lib/focus-context";
import { computeStats, type StudyStats } from "@/lib/study-stats";
import { useIsMobile } from "@/hooks/use-mobile";

// ── Circular Progress Ring ─────────────────────────────────────────────────────
function Ring({ progress, color, size = 240 }: { progress: number; color: string; size?: number }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);
  const tipX = size / 2 + r * Math.cos(2 * Math.PI * progress - Math.PI / 2);
  const tipY = size / 2 + r * Math.sin(2 * Math.PI * progress - Math.PI / 2);
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1f2b3e" strokeWidth={8} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={8} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.4s ease" }}
      />
      {progress > 0.01 && progress < 0.99 && (
        <circle cx={tipX} cy={tipY} r={5} fill={color}
          style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "cx 1s linear, cy 1s linear" }}
        />
      )}
    </svg>
  );
}

// ── Stats Panel ───────────────────────────────────────────────────────────────
function StatsPanel({ stats }: { stats: StudyStats }) {
  const fmt = (m: number) => m < 60 ? `${m}m` : `${Math.floor(m / 60)}h${m % 60 > 0 ? ` ${m % 60}m` : ""}`;
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const maxM = Math.max(...stats.weekHeatmap.map(d => d.minutes), 1);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-3.5">
      {/* Streak */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#1a1200] to-[#0d1424] border border-[#c9a84c]/25 p-4 sm:p-5">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl sm:text-[64px] font-black text-[#c9a84c]/8 leading-none select-none">{stats.currentStreak}</div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#c9a84c]/15 flex items-center justify-center">
            <Flame className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#c9a84c]" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-white">{stats.currentStreak} {stats.currentStreak === 1 ? "day" : "days"}</p>
            <p className="text-[10px] sm:text-xs text-[#7a8194]">Streak · Best: {stats.longestStreak}d</p>
          </div>
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {[
          { icon: <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, label: "Today", value: fmt(stats.todayMinutes) },
          { icon: <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, label: "Sessions", value: String(stats.todaySessions) },
          { icon: <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />, label: "This week", value: fmt(stats.weekMinutes) },
        ].map(s => (
          <div key={s.label} className="bg-[#111827] border border-[#1f2b3e] rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-center">
            <div className="text-[#c9a84c] flex justify-center mb-1">{s.icon}</div>
            <p className="text-sm sm:text-base font-black text-white">{s.value}</p>
            <p className="text-[9px] sm:text-[10px] text-[#7a8194] uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Weekly heatmap */}
      <div className="bg-[#111827] border border-[#1f2b3e] rounded-xl sm:rounded-2xl p-3.5 sm:p-4">
        <p className="text-[10px] sm:text-xs text-[#7a8194] uppercase tracking-wider font-semibold mb-2 sm:mb-3">This week</p>
        <div className="flex items-end gap-1 justify-between">
          {stats.weekHeatmap.map(day => {
            const pct = day.minutes / maxM;
            const isToday = day.date === today;
            return (
              <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full flex items-end" style={{ height: 36 }}>
                  <div className="w-full rounded transition-all duration-700"
                    style={{
                      height: day.minutes > 0 ? `${Math.max(6, pct * 36)}px` : "3px",
                      background: day.minutes > 0 ? "linear-gradient(to top, #c9a84c, #d4b95e)" : "#1f2b3e",
                      opacity: day.minutes > 0 ? 1 : 0.4,
                      boxShadow: day.minutes > 0 ? "0 0 8px rgba(201,168,76,0.3)" : "none",
                    }}
                  />
                </div>
                <p className={`text-[9px] sm:text-[10px] font-bold ${isToday ? "text-[#c9a84c]" : "text-[#7a8194]"}`}>
                  {days[new Date(day.date + "T12:00:00").getDay()]}
                </p>
                {day.minutes > 0 && <p className="text-[8px] sm:text-[9px] text-[#c9a84c]/60">{fmt(day.minutes)}</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily goal */}
      {(() => {
        const pct = Math.min(100, Math.round((stats.todayMinutes / 120) * 100));
        return (
          <div className="bg-[#111827] border border-[#1f2b3e] rounded-xl sm:rounded-2xl p-3.5 sm:p-4">
            <div className="flex justify-between mb-1.5 sm:mb-2">
              <p className="text-xs sm:text-sm font-semibold text-white">Daily Goal (2h)</p>
              <p className="text-xs sm:text-sm font-bold text-[#c9a84c]">{pct}%</p>
            </div>
            <div className="h-1.5 sm:h-2 bg-[#1f2b3e] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${pct}%`,
                  background: pct >= 100 ? "linear-gradient(90deg,#22d3ee,#818cf8)" : "linear-gradient(90deg,#c9a84c,#d4b95e)",
                  boxShadow: pct >= 100 ? "0 0 12px rgba(34,211,238,0.4)" : "0 0 10px rgba(201,168,76,0.3)",
                }}
              />
            </div>
            <p className="text-[10px] sm:text-xs text-[#7a8194] mt-1.5">
              {pct >= 100 ? "Goal reached! Keep going!" : `${fmt(120 - stats.todayMinutes)} left to reach your daily goal`}
            </p>
          </div>
        );
      })()}

      {/* All-time */}
      <div className="bg-[#111827] border border-[#1f2b3e] rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex justify-between items-center">
        <div>
          <p className="font-bold text-white text-xs sm:text-sm">All-time focus</p>
          <p className="text-[10px] sm:text-xs text-[#7a8194]">{stats.totalSessions} sessions</p>
        </div>
        <p className="text-lg sm:text-xl font-black text-[#c9a84c]">{fmt(stats.totalMinutes)}</p>
      </div>
    </div>
  );
}

// ── Custom Time Picker ─────────────────────────────────────────────────────────
function TimePicker() {
  const { customMinutes, setCustomMinutes, running } = useFocus();
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(String(customMinutes));

  function commit(raw: string) {
    const n = parseInt(raw, 10);
    if (!isNaN(n) && n >= 1) setCustomMinutes(n);
    setEditing(false);
  }

  const presets = [25, 50, 90];

  return (
    <div className="flex flex-col items-center gap-2.5">
      <p className="text-[10px] sm:text-xs text-[#7a8194] uppercase tracking-wider font-semibold">Focus Duration</p>
      <div className="flex items-center gap-3">
        <button onClick={() => setCustomMinutes(customMinutes - 5)} disabled={running || customMinutes <= 5}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#111827] border border-[#1f2b3e] text-[#c9a84c] hover:bg-[#c9a84c]/10 disabled:opacity-30 flex items-center justify-center transition-colors">
          <Minus className="w-4 h-4" />
        </button>

        {editing ? (
          <input autoFocus value={inputVal} onChange={e => setInputVal(e.target.value)}
            onBlur={() => commit(inputVal)}
            onKeyDown={e => { if (e.key === "Enter") commit(inputVal); if (e.key === "Escape") setEditing(false); }}
            className="w-16 sm:w-20 text-center bg-[#080c16] border border-[#c9a84c]/50 rounded-lg sm:rounded-xl px-2 py-1 sm:py-1.5 text-base sm:text-lg font-black text-[#c9a84c] focus:outline-none"
          />
        ) : (
          <button onClick={() => { if (!running) { setInputVal(String(customMinutes)); setEditing(true); } }}
            disabled={running}
            className="w-16 sm:w-20 text-center text-xl sm:text-2xl font-black text-white hover:text-[#c9a84c] transition-colors disabled:cursor-default tabular-nums"
            title="Click to set custom time">
            {customMinutes}<span className="text-xs sm:text-sm text-[#7a8194] font-semibold ml-1">min</span>
          </button>
        )}

        <button onClick={() => setCustomMinutes(customMinutes + 5)} disabled={running || customMinutes >= 480}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#111827] border border-[#1f2b3e] text-[#c9a84c] hover:bg-[#c9a84c]/10 disabled:opacity-30 flex items-center justify-center transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Quick presets */}
      {!running && (
        <div className="flex gap-1.5 sm:gap-2">
          {presets.map(p => (
            <button key={p} onClick={() => setCustomMinutes(p)}
              className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold transition-colors ${customMinutes === p ? "bg-[#c9a84c] text-[#0a0e1a]" : "bg-[#111827] border border-[#1f2b3e] text-[#7a8194] hover:text-white"}`}>
              {p}m
            </button>
          ))}
          <button onClick={() => { setInputVal(String(customMinutes)); setEditing(true); }}
            disabled={running}
            className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-[#111827] border border-[#1f2b3e] text-[#7a8194] hover:text-[#c9a84c] transition-colors disabled:opacity-30">
            Custom
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function FocusTimer() {
  const { mode, setMode, running, secondsLeft, totalSeconds, topic, setTopic,
    sessionCount, toggle, reset, lastSession } = useFocus();
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [statsKey, setStatsKey] = useState(0);
  const isMobile = useIsMobile();

  // Refresh stats when sessionCount changes
  useEffect(() => { setStats(computeStats()); }, [sessionCount, statsKey]);

  // Also refresh on focus (user might come back from another tab)
  useEffect(() => {
    const onFocus = () => setStatsKey(k => k + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const progress = (totalSeconds - secondsLeft) / totalSeconds;
  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  const modeColor = mode === "focus" ? "#c9a84c" : mode === "short" ? "#22d3ee" : "#818cf8";
  const ringSize = isMobile ? 210 : 240;

  const MODES = [
    { id: "focus" as const, label: "Focus",        icon: null },
    { id: "short" as const, label: "Short Break",  icon: <Coffee className="w-3.5 h-3.5" /> },
    { id: "long"  as const, label: "Long Break",   icon: null },
  ];

  return (
    <div className="space-y-5 pb-10">

      {/* Explainer — only before first session */}
      {sessionCount === 0 && !running && (
        <div className="bg-gradient-to-r from-[#0d1200]/80 to-[#0a0e1a] border border-[#c9a84c]/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex gap-3.5 sm:gap-4 animate-in fade-in duration-500">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#c9a84c] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-white text-sm sm:text-base mb-0.5 sm:mb-1">How Focus Timer works</p>
            <p className="text-xs sm:text-sm text-[#7a8194] leading-relaxed">
              Work in focused blocks, then take a break. Set <span className="text-[#c9a84c] font-semibold">what you&apos;re studying</span> before you start — sessions without a topic won&apos;t count toward your stats. The timer runs in the background even while you write notes or chat to the AI.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* ── Left: Timer ── */}
        <div className="flex flex-col items-center gap-4 sm:gap-5">

          {/* Session dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`h-1.5 w-6 sm:h-2 sm:w-8 rounded-full transition-all duration-500 ${i < sessionCount % 4 ? "bg-[#c9a84c] shadow-[0_0_8px_rgba(201,168,76,0.5)]" : "bg-[#1f2b3e]"}`} />
            ))}
            <span className="text-[10px] sm:text-xs text-[#7a8194] ml-1.5 font-semibold">Session {sessionCount + 1}</span>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-1 bg-[#111827] border border-[#1f2b3e] rounded-xl p-1">
            {MODES.map(m => (
              <button key={m.id} onClick={() => setMode(m.id)}
                className={`flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${mode === m.id ? "text-[#0a0e1a] shadow-md" : "text-[#7a8194] hover:text-white"}`}
                style={mode === m.id ? { background: modeColor } : {}}>
                {m.icon}{m.label}
              </button>
            ))}
          </div>

          {/* Ring */}
          <div className="relative flex items-center justify-center">
            <Ring progress={progress} color={modeColor} size={ringSize} />
            <div className="absolute flex flex-col items-center gap-0.5 select-none animate-in fade-in zoom-in duration-300">
              <span className={`${isMobile ? "text-4xl" : "text-5xl"} font-black tracking-tight tabular-nums`}
                style={{ color: modeColor, textShadow: `0 0 30px ${modeColor}40` }}>
                {mins}:{secs}
              </span>
              <span className="text-[10px] text-[#7a8194] font-semibold uppercase tracking-widest leading-none">
                {mode === "focus" ? "Focus" : mode === "short" ? "Short Break" : "Long Break"}
              </span>
            </div>
          </div>

          {/* Custom time picker — only for focus mode */}
          {mode === "focus" && <TimePicker />}

          {/* Topic input */}
          {mode === "focus" && (
            <div className="w-full max-w-sm">
              <label className="text-[10px] sm:text-xs text-[#7a8194] uppercase tracking-wider font-semibold block mb-1.5 sm:mb-2">
                What are you focusing on?
                {!topic && !running && <span className="text-amber-400/80 ml-1">(required to log stats)</span>}
              </label>
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Biology Chapter 4, JAMB Maths past questions…"
                disabled={running}
                className="w-full bg-[#111827] border border-[#1f2b3e] focus:border-[#c9a84c]/50 disabled:opacity-60 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-[#7a8194] focus:outline-none transition-colors"
              />
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button onClick={reset}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#1f2b3e] bg-[#111827] hover:border-[#c9a84c]/30 text-[#7a8194] hover:text-white flex items-center justify-center transition-all"
              title="Reset">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button onClick={toggle}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-[#0a0e1a] shadow-xl transition-all hover:scale-105 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${modeColor}, #d4b95e)`, boxShadow: `0 0 40px ${modeColor}40` }}>
              {running ? <Pause className="w-6 h-6 sm:w-8 sm:h-8" /> : <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1" />}
            </button>

            <button
              onClick={() => { const idx = MODES.findIndex(m => m.id === mode); setMode(MODES[(idx + 1) % MODES.length].id); }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#1f2b3e] bg-[#111827] hover:border-[#c9a84c]/30 text-[#7a8194] hover:text-white flex items-center justify-center transition-all"
              title="Skip">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Last session */}
          {lastSession && (
            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#7a8194] bg-[#111827] border border-[#1f2b3e] rounded-xl px-4 py-2.5 max-w-sm w-full">
              <span className="text-[#c9a84c]">✓ Last:</span>
              <span className="truncate font-medium text-white">{lastSession.topic}</span>
              <span className="shrink-0 text-[#c9a84c]/60">{lastSession.durationMinutes}m</span>
            </div>
          )}

          {/* Context tip */}
          <p className="text-[10px] sm:text-xs text-[#7a8194] text-center max-w-sm">
            {mode === "focus" ? "Close distracting tabs. One task only." : mode === "short" ? "Step away. Stretch, drink water." : "You earned this. Rest fully."}
          </p>
        </div>

        {/* ── Right: Stats ── */}
        {stats && <StatsPanel stats={stats} />}
      </div>
    </div>
  );
}
