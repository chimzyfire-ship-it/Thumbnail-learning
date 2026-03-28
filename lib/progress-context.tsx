"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { courseData } from "@/lib/course-data";
import { createClient } from "@/lib/supabase/client";

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────

interface ProgressData {
  /** Set of topic IDs the user has at least opened */
  startedTopics: string[];
  /** Set of completed topic IDs, e.g. "topic-1", "topic-5" */
  completedTopics: string[];
  /** ISO date strings of each day the user learned something */
  activityDates: string[];
}

interface ProgressContextType {
  /** Check if a topic is started */
  isTopicStarted: (topicId: string) => boolean;
  /** Check if a topic is completed */
  isTopicCompleted: (topicId: string) => boolean;
  /** Record that a user has opened a topic */
  startTopic: (topicId: string) => void;
  /** Mark a topic as completed — awards XP, updates streak */
  completeTopic: (topicId: string) => void;
  /** Number of modules where ALL topics are done */
  coursesCompleted: number;
  /** Consecutive calendar days of learning, ending today or yesterday */
  learningStreak: number;
  /** Number of modules where at least 1 topic is done but not all */
  activeCourses: number;
  /** 50 XP per topic completed */
  totalXp: number;
  /** Overall % progress across ALL topics */
  overallProgress: number;
  /** Get progress % for a specific module */
  moduleProgress: (moduleId: string) => number;
}

const ProgressContext = createContext<ProgressContextType>({
  isTopicStarted: () => false,
  isTopicCompleted: () => false,
  startTopic: () => {},
  completeTopic: () => {},
  coursesCompleted: 0,
  learningStreak: 0,
  activeCourses: 0,
  totalXp: 0,
  overallProgress: 0,
  moduleProgress: () => 0,
});

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────

const XP_PER_TOPIC = 50;

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function calcStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const unique = [...new Set(dates)].sort().reverse();

  const today = todayStr();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (unique[0] !== today && unique[0] !== yesterdayStr) return 0;

  let streak = 1;
  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1]);
    const curr = new Date(unique[i]);
    const diffMs = prev.getTime() - curr.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function getAllModules() {
  return courseData.flatMap((tier) => tier.modules);
}

function getAllTopicIds() {
  return courseData.flatMap((tier) =>
    tier.modules.flatMap((mod) => mod.topics.map((t) => t.id))
  );
}

// ─────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ProgressData>({ startedTopics: [], completedTopics: [], activityDates: [] });
  const [mounted, setMounted] = useState(false);
  const [storageKey, setStorageKey] = useState("tt_progress_guest");

  useEffect(() => {
    const userId = localStorage.getItem("tt_user_id") || "guest";
    const key = `tt_progress_${userId}`;
    setStorageKey(key);

    const loadData = async () => {
      // 1. Instantly Hydrate from Local Storage
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw) as ProgressData;
          if (!parsed.startedTopics) parsed.startedTopics = [...(parsed.completedTopics || [])];
          setData(parsed);
        }
      } catch {}

      // 2. Fetch from Supabase (if logged in) for latest source of truth
      if (userId !== "guest") {
        try {
          const supabase = createClient();
          const { data: dbData, error } = await supabase
            .from("user_progress")
            .select("started_topics, completed_topics, activity_dates")
            .eq("user_id", userId)
            .single();

          if (dbData) {
            setData({
              startedTopics: dbData.started_topics || [],
              completedTopics: dbData.completed_topics || [],
              activityDates: dbData.activity_dates || [],
            });
          }
        } catch (err) {
          console.error("Failed to sync with Supabase cloud:", err);
        }
      }
      setMounted(true);
    };

    loadData();
  }, []);

  // Bi-directional sync back to Cloud
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(storageKey, JSON.stringify(data));

    const userId = localStorage.getItem("tt_user_id");
    if (userId && userId !== "guest") {
      const syncToSupabase = async () => {
        const supabase = createClient();
        await supabase.from("user_progress").upsert({
          user_id: userId,
          started_topics: data.startedTopics,
          completed_topics: data.completedTopics,
          activity_dates: data.activityDates,
          last_synced_at: new Date().toISOString(),
        });
      };

      // Debounce the network request by 1s to prevent spamming the DB on fast clicks
      const timeoutId = setTimeout(syncToSupabase, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [data, mounted, storageKey]);

  const isTopicStarted = useCallback(
    (topicId: string) => data.startedTopics.includes(topicId) || data.completedTopics.includes(topicId),
    [data.startedTopics, data.completedTopics]
  );

  const isTopicCompleted = useCallback(
    (topicId: string) => data.completedTopics.includes(topicId),
    [data.completedTopics]
  );

  const startTopic = useCallback((topicId: string) => {
    setData((prev) => {
      if (prev.startedTopics.includes(topicId) || prev.completedTopics.includes(topicId)) return prev;
      return {
        ...prev,
        startedTopics: [...prev.startedTopics, topicId],
      };
    });
  }, []);

  const completeTopic = useCallback((topicId: string) => {
    setData((prev) => {
      if (prev.completedTopics.includes(topicId)) return prev;
      
      const newStarted = prev.startedTopics.includes(topicId) 
        ? prev.startedTopics // keep it
        : [...prev.startedTopics, topicId]; // add it if somehow missed

      return {
        startedTopics: newStarted,
        completedTopics: [...prev.completedTopics, topicId],
        activityDates: [...prev.activityDates, todayStr()],
      };
    });
  }, []);

  const completedSet = new Set(data.completedTopics);

  const allModules = getAllModules();
  const allTopicIds = getAllTopicIds();
  const totalTopics = allTopicIds.length;

  const coursesCompleted = allModules.filter((mod) =>
    mod.topics.length > 0 && mod.topics.every((t) => completedSet.has(t.id))
  ).length;

  const activeCourses = allModules.filter((mod) => {
    const done = mod.topics.filter((t) => completedSet.has(t.id)).length;
    return done > 0 && done < mod.topics.length;
  }).length;

  const totalXp = completedSet.size * XP_PER_TOPIC;
  const learningStreak = calcStreak(data.activityDates);
  const overallProgress = totalTopics > 0 ? Math.round((completedSet.size / totalTopics) * 100) : 0;

  const moduleProgress = useCallback(
    (moduleId: string) => {
      const mod = allModules.find((m) => m.id === moduleId);
      if (!mod || mod.topics.length === 0) return 0;
      const done = mod.topics.filter((t) => completedSet.has(t.id)).length;
      return Math.round((done / mod.topics.length) * 100);
    },
    [data.completedTopics]
  );

  return (
    <ProgressContext.Provider
      value={{
        isTopicStarted,
        isTopicCompleted,
        startTopic,
        completeTopic,
        coursesCompleted,
        learningStreak,
        activeCourses,
        totalXp,
        overallProgress,
        moduleProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}
