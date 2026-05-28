// lib/study-stats.ts
// Tracks focus sessions in localStorage and computes streaks/stats

export interface StudySession {
  id: string;
  date: string;          // "YYYY-MM-DD"
  completedAt: string;   // ISO datetime
  durationMinutes: number;
  type: "focus" | "break";
  topic?: string;
}

const KEY = "aethel_focus_sessions";

export function getSessions(): StudySession[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function addSession(session: StudySession) {
  const sessions = getSessions();
  sessions.unshift(session);
  // Keep max 500 sessions
  localStorage.setItem(KEY, JSON.stringify(sessions.slice(0, 500)));
}

function toDateStr(date: Date) {
  return date.toISOString().slice(0, 10);
}

export interface StudyStats {
  todayMinutes: number;
  todaySessions: number;
  weekMinutes: number;
  weekSessions: number;
  totalMinutes: number;
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  weekHeatmap: { date: string; minutes: number }[]; // last 7 days
}

export function computeStats(): StudyStats {
  const sessions = getSessions().filter(s => s.type === "focus");
  const today = toDateStr(new Date());

  // Build date → minutes map
  const byDate: Record<string, number> = {};
  for (const s of sessions) {
    byDate[s.date] = (byDate[s.date] || 0) + s.durationMinutes;
  }

  // Today
  const todayMinutes = byDate[today] || 0;
  const todaySessions = sessions.filter(s => s.date === today).length;

  // This week (last 7 days)
  const weekDates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    weekDates.push(toDateStr(d));
  }
  const weekMinutes = weekDates.reduce((sum, d) => sum + (byDate[d] || 0), 0);
  const weekSessions = sessions.filter(s => weekDates.includes(s.date)).length;

  // Streak — count consecutive days with at least 1 session ending today or yesterday
  const sortedDates = [...new Set(sessions.map(s => s.date))].sort().reverse();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const d = new Date(dateStr);
    if (!prevDate) {
      // Must be today or yesterday to start the streak
      const diff = Math.floor((new Date().setHours(0,0,0,0) - d.setHours(0,0,0,0)) / 86400000);
      if (diff <= 1) { tempStreak = 1; }
      else break;
    } else {
      const diff = Math.floor((prevDate.setHours(0,0,0,0) - new Date(dateStr).setHours(0,0,0,0)) / 86400000);
      if (diff === 1) { tempStreak++; }
      else break;
    }
    prevDate = new Date(dateStr);
    if (tempStreak > longestStreak) longestStreak = tempStreak;
  }
  currentStreak = tempStreak;

  // All-time longest
  tempStreak = 0;
  prevDate = null;
  for (const dateStr of sortedDates) {
    const d = new Date(dateStr);
    if (!prevDate) { tempStreak = 1; }
    else {
      const diff = Math.floor((prevDate.getTime() - d.getTime()) / 86400000);
      if (diff === 1) tempStreak++;
      else tempStreak = 1;
    }
    if (tempStreak > longestStreak) longestStreak = tempStreak;
    prevDate = d;
  }

  return {
    todayMinutes, todaySessions,
    weekMinutes, weekSessions,
    totalMinutes: sessions.reduce((sum, s) => sum + s.durationMinutes, 0),
    totalSessions: sessions.length,
    currentStreak, longestStreak,
    weekHeatmap: weekDates.map(date => ({ date, minutes: byDate[date] || 0 })),
  };
}
