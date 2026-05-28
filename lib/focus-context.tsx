"use client";

import {
  createContext, useContext, useState, useEffect,
  useRef, useCallback, ReactNode,
} from "react";
import { addSession } from "@/lib/study-stats";

// ── Types ─────────────────────────────────────────────────────────────────────
export type FocusMode = "focus" | "short" | "long";

export interface FocusCtx {
  // State
  mode: FocusMode;
  running: boolean;
  secondsLeft: number;
  totalSeconds: number;
  customMinutes: number;
  topic: string;
  sessionCount: number;
  pendingLog: boolean;       // session finished but no topic yet
  lastSession: { topic: string; durationMinutes: number; date: string } | null;
  // Actions
  setMode: (m: FocusMode) => void;
  setCustomMinutes: (n: number) => void;
  setTopic: (t: string) => void;
  toggle: () => void;
  reset: () => void;
  confirmLog: (topic: string) => void;  // log with topic after prompt
  dismissLog: () => void;               // discard unlogged session
}

const Ctx = createContext<FocusCtx | null>(null);
export const useFocus = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useFocus must be used inside FocusProvider");
  return c;
};

// ── Audio helpers ─────────────────────────────────────────────────────────────
type ACtx = typeof AudioContext;
const getACtx = () =>
  new (window.AudioContext ||
    (window as unknown as { webkitAudioContext: ACtx }).webkitAudioContext)();

function tone(freqs: [number, number][], vol = 0.10) {
  try {
    const ctx = getACtx();
    freqs.forEach(([freq, delay]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine"; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.55);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.6);
    });
  } catch { /* ignore */ }
}

export const sounds = {
  start:   () => tone([[440, 0], [523, 0.13], [659, 0.24]]),
  pause:   () => tone([[659, 0], [523, 0.14], [392, 0.26]], 0.08),
  chime:   () => tone([[523, 0], [659, 0.18], [784, 0.36], [1047, 0.54]], 0.16),
};

// ── Duration per mode ─────────────────────────────────────────────────────────
const modeTotalSeconds = (mode: FocusMode, customMinutes: number) => {
  if (mode === "focus") return customMinutes * 60;
  if (mode === "short") return 10 * 60;
  return 20 * 60;
};

// ── Provider ──────────────────────────────────────────────────────────────────
export function FocusProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<FocusMode>("focus");
  const [customMinutes, setCustomMinutesState] = useState(50);
  const [secondsLeft, setSecondsLeft] = useState(50 * 60);
  const [running, setRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [topic, setTopicState] = useState("");
  const [pendingLog, setPendingLog] = useState(false);
  const [lastSession, setLastSession] = useState<FocusCtx["lastSession"]>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedMinutesRef = useRef(0);

  const totalSeconds = modeTotalSeconds(mode, customMinutes);

  const doLog = useCallback((t: string, minutes: number) => {
    const date = new Date().toISOString().slice(0, 10);
    addSession({
      id: crypto.randomUUID(),
      date,
      completedAt: new Date().toISOString(),
      durationMinutes: minutes,
      type: "focus",
      topic: t,
    });
    setLastSession({ topic: t, durationMinutes: minutes, date });
  }, []);

  // ── Tick ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) { clearInterval(intervalRef.current!); return 0; }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  // ── Completion handler ───────────────────────────────────────────────────────
  useEffect(() => {
    if (secondsLeft === 0 && running) {
      setRunning(false);
      sounds.chime();
      completedMinutesRef.current = mode === "focus" ? customMinutes : (mode === "short" ? 10 : 20);

      if (mode === "focus") {
        if (topic.trim()) {
          // Topic was set — log immediately
          doLog(topic.trim(), customMinutes);
        } else {
          // No topic — ask user before logging
          setPendingLog(true);
        }
        setSessionCount(c => c + 1);
      }
    }
  }, [customMinutes, doLog, mode, running, secondsLeft, topic]);

  // ── Browser title ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (running) {
      const m = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
      const s = String(secondsLeft % 60).padStart(2, "0");
      document.title = `${m}:${s} — ${topic || "Focus"} | Aethel`;
    } else {
      document.title = "Aethel Solutions";
    }
    return () => { document.title = "Aethel Solutions"; };
  }, [running, secondsLeft, topic]);

  // ── Public actions ───────────────────────────────────────────────────────────
  const toggle = useCallback(() => {
    setRunning(r => {
      const next = !r;
      if (next) sounds.start(); else sounds.pause();
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current!);
    setRunning(false);
    setPendingLog(false);
    setSecondsLeft(modeTotalSeconds(mode, customMinutes));
  }, [mode, customMinutes]);

  const setMode = useCallback((m: FocusMode) => {
    clearInterval(intervalRef.current!);
    setRunning(false); setPendingLog(false);
    setModeState(m);
    setSecondsLeft(modeTotalSeconds(m, customMinutes));
  }, [customMinutes]);

  const setCustomMinutes = useCallback((n: number) => {
    const clamped = Math.max(1, Math.min(480, n));
    setCustomMinutesState(clamped);
    if (mode === "focus" && !running) setSecondsLeft(clamped * 60);
  }, [mode, running]);

  const setTopic = useCallback((t: string) => setTopicState(t), []);

  const confirmLog = useCallback((t: string) => {
    doLog(t.trim() || "Untitled Session", completedMinutesRef.current);
    setPendingLog(false);
  }, [doLog]);

  const dismissLog = useCallback(() => setPendingLog(false), []);

  return (
    <Ctx.Provider value={{
      mode, running, secondsLeft, totalSeconds, customMinutes,
      topic, sessionCount, pendingLog, lastSession,
      setMode, setCustomMinutes, setTopic,
      toggle, reset, confirmLog, dismissLog,
    }}>
      {children}
    </Ctx.Provider>
  );
}
