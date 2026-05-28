"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { courseData, getTopicById } from "@/lib/course-data";
import { createClient } from "@/lib/supabase/client";

export const XP_PER_TOPIC = 50;
export const MIN_VIDEO_SECONDS = 90;
export const MIN_PAGE_SECONDS = 120;
const MAX_ACTIVITY_ITEMS = 30;

type ActivityType = "started" | "resumed" | "completed";

export interface TopicState {
  startedAt?: string;
  lastOpenedAt?: string;
  completedAt?: string;
  studySeconds: number;
  videoSeconds: number;
  notesOpened: boolean;
  xpAwarded: number;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  topicId: string;
  at: string;
}

interface ProgressData {
  startedTopics: string[];
  completedTopics: string[];
  activityDates: string[];
  topicStates: Record<string, TopicState>;
  activityLog: ActivityItem[];
  lastActiveTopicId?: string;
}

interface ContinueTopic {
  id: string;
  title: string;
  moduleTitle: string;
  progress: number;
}

interface ProgressContextType {
  isTopicStarted: (topicId: string) => boolean;
  isTopicCompleted: (topicId: string) => boolean;
  startTopic: (topicId: string) => void;
  completeTopic: (topicId: string) => void;
  recordStudyTime: (topicId: string, seconds: number) => void;
  recordVideoTime: (topicId: string, seconds: number) => void;
  markNotesOpened: (topicId: string) => void;
  setLastActiveTopic: (topicId: string) => void;
  getTopicState: (topicId: string) => TopicState;
  getTopicProgress: (topicId: string) => number;
  moduleProgress: (moduleId: string) => number;
  coursesCompleted: number;
  learningStreak: number;
  activeCourses: number;
  totalXp: number;
  overallProgress: number;
  totalStudySeconds: number;
  continueTopic: ContinueTopic | null;
  activityLog: ActivityItem[];
  moduleJustCompleted: string | null;
  clearModuleCompletion: () => void;
  isTopicUnlocked: (topicId: string) => boolean;
  getTopicLastSeenAt: (topicId: string) => string | undefined;
}

const emptyTopicState = (): TopicState => ({
  studySeconds: 0,
  videoSeconds: 0,
  notesOpened: false,
  xpAwarded: 0,
});

const defaultValue: ProgressContextType = {
  isTopicStarted: () => false,
  isTopicCompleted: () => false,
  startTopic: () => {},
  completeTopic: () => {},
  recordStudyTime: () => {},
  recordVideoTime: () => {},
  markNotesOpened: () => {},
  setLastActiveTopic: () => {},
  getTopicState: () => emptyTopicState(),
  getTopicProgress: () => 0,
  moduleProgress: () => 0,
  coursesCompleted: 0,
  learningStreak: 0,
  activeCourses: 0,
  totalXp: 0,
  overallProgress: 0,
  totalStudySeconds: 0,
  continueTopic: null,
  activityLog: [],
  moduleJustCompleted: null,
  clearModuleCompletion: () => {},
  isTopicUnlocked: () => true,
  getTopicLastSeenAt: () => undefined,
};

const ProgressContext = createContext<ProgressContextType>(defaultValue);

type TopicMeta = {
  id: string;
  title: string;
  moduleId: string;
  moduleTitle: string;
  hasVideo: boolean;
};

type ServerProgressRow = {
  started_topics?: string[] | null;
  completed_topics?: string[] | null;
  activity_dates?: string[] | null;
  topic_states?: Record<string, Partial<TopicState>> | null;
  activity_log?: ActivityItem[] | null;
  last_active_topic_id?: string | null;
};

function nowIso() {
  return new Date().toISOString();
}

function todayStr(date = new Date()): string {
  return date.toISOString().split("T")[0];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function calcStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const unique = [...new Set(dates)].sort().reverse();
  const today = todayStr();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = todayStr(yesterday);

  if (unique[0] !== today && unique[0] !== yesterdayStr) return 0;

  let streak = 1;
  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1]);
    const curr = new Date(unique[i]);
    const diffMs = prev.getTime() - curr.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

function getAllModules() {
  return courseData.flatMap((tier) => tier.modules);
}

function getTopicCatalog(): Record<string, TopicMeta> {
  const topics = courseData.flatMap((tier) =>
    tier.modules.flatMap((module) =>
      module.topics
        .filter((topic) => Boolean(topic.cheatSheetHtml))
        .map((topic) => ({
          id: topic.id,
          title: topic.title,
          moduleId: module.id,
          moduleTitle: module.title,
          hasVideo: Boolean(topic.videoUrl),
        }))
    )
  );

  return Object.fromEntries(topics.map((topic) => [topic.id, topic]));
}

function pushActivity(prev: ActivityItem[], topicId: string, type: ActivityType, at: string) {
  const latest = prev[0];
  if (latest && latest.topicId === topicId && latest.type === type) {
    return prev;
  }

  return [{ id: `${type}-${topicId}-${at}`, type, topicId, at }, ...prev].slice(0, MAX_ACTIVITY_ITEMS);
}

function ensureTopicState(state?: Partial<TopicState>): TopicState {
  return {
    ...emptyTopicState(),
    ...state,
  };
}

function latestIso(...values: Array<string | undefined>) {
  return values.filter((value): value is string => Boolean(value)).sort().at(-1);
}

function earliestIso(...values: Array<string | undefined>) {
  return values.filter((value): value is string => Boolean(value)).sort()[0];
}

function mergeTopicState(local?: Partial<TopicState>, cloud?: Partial<TopicState>): TopicState {
  const left = ensureTopicState(local);
  const right = ensureTopicState(cloud);

  return {
    startedAt: earliestIso(left.startedAt, right.startedAt),
    lastOpenedAt: latestIso(left.lastOpenedAt, right.lastOpenedAt),
    completedAt: latestIso(left.completedAt, right.completedAt),
    studySeconds: Math.max(left.studySeconds || 0, right.studySeconds || 0),
    videoSeconds: Math.max(left.videoSeconds || 0, right.videoSeconds || 0),
    notesOpened: Boolean(left.notesOpened || right.notesOpened),
    xpAwarded: Math.max(left.xpAwarded || 0, right.xpAwarded || 0),
  };
}

function mergeActivityLog(local: ActivityItem[], cloud: ActivityItem[]) {
  const map = new Map<string, ActivityItem>();

  for (const item of [...local, ...cloud]) {
    const key = item.id || `${item.type}-${item.topicId}-${item.at}`;
    map.set(key, item);
  }

  return [...map.values()]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, MAX_ACTIVITY_ITEMS);
}

function normalizeProgressData(raw: unknown): ProgressData {
  const fallback: ProgressData = {
    startedTopics: [],
    completedTopics: [],
    activityDates: [],
    topicStates: {},
    activityLog: [],
    lastActiveTopicId: undefined,
  };

  if (!raw || typeof raw !== "object") {
    return fallback;
  }

  const value = raw as Partial<ProgressData>;
  const startedTopics = Array.isArray(value.startedTopics) ? value.startedTopics.filter((item): item is string => typeof item === "string") : [];
  const completedTopics = Array.isArray(value.completedTopics) ? value.completedTopics.filter((item): item is string => typeof item === "string") : [];
  const activityDates = Array.isArray(value.activityDates) ? value.activityDates.filter((item): item is string => typeof item === "string") : [];
  const activityLog = Array.isArray(value.activityLog)
    ? value.activityLog.filter(
        (item): item is ActivityItem =>
          Boolean(item) &&
          typeof item.id === "string" &&
          typeof item.topicId === "string" &&
          typeof item.at === "string" &&
          (item.type === "started" || item.type === "resumed" || item.type === "completed")
      )
    : [];

  const topicStatesRaw = value.topicStates && typeof value.topicStates === "object" ? value.topicStates : {};
  const topicStates = Object.fromEntries(
    Object.entries(topicStatesRaw as Record<string, Partial<TopicState>>).map(([topicId, state]) => [topicId, ensureTopicState(state)])
  );

  const next: ProgressData = {
    startedTopics,
    completedTopics,
    activityDates,
    topicStates,
    activityLog,
    lastActiveTopicId: typeof value.lastActiveTopicId === "string" ? value.lastActiveTopicId : undefined,
  };

  for (const topicId of startedTopics) {
    next.topicStates[topicId] = ensureTopicState(next.topicStates[topicId]);
    next.topicStates[topicId].startedAt ||= nowIso();
  }

  for (const topicId of completedTopics) {
    next.topicStates[topicId] = ensureTopicState(next.topicStates[topicId]);
    next.topicStates[topicId].startedAt ||= nowIso();
    next.topicStates[topicId].completedAt ||= nowIso();
    next.topicStates[topicId].xpAwarded = XP_PER_TOPIC;
    if (!next.startedTopics.includes(topicId)) {
      next.startedTopics.push(topicId);
    }
  }

  for (const [topicId, state] of Object.entries(next.topicStates)) {
    if (state.startedAt && !next.startedTopics.includes(topicId)) {
      next.startedTopics.push(topicId);
    }

    if (state.completedAt && !next.completedTopics.includes(topicId)) {
      next.completedTopics.push(topicId);
    }
  }

  return next;
}

function normalizeServerProgress(server: ServerProgressRow): ProgressData {
  return normalizeProgressData({
    startedTopics: server.started_topics || [],
    completedTopics: server.completed_topics || [],
    activityDates: server.activity_dates || [],
    topicStates: server.topic_states || {},
    activityLog: server.activity_log || [],
    lastActiveTopicId: server.last_active_topic_id || undefined,
  });
}

function mergeServerProgress(prev: ProgressData, row: ServerProgressRow) {
  const cloud = normalizeServerProgress(row);
  const startedTopics = [...new Set([...(prev.startedTopics || []), ...(cloud.startedTopics || [])])];
  const completedTopics = [...new Set([...(prev.completedTopics || []), ...(cloud.completedTopics || [])])];
  const activityDates = [...new Set([...(prev.activityDates || []), ...(cloud.activityDates || [])])];
  const allTopicIds = new Set([
    ...startedTopics,
    ...completedTopics,
    ...Object.keys(prev.topicStates),
    ...Object.keys(cloud.topicStates),
  ]);
  const topicStates: Record<string, TopicState> = {};

  for (const topicId of allTopicIds) {
    topicStates[topicId] = mergeTopicState(prev.topicStates[topicId], cloud.topicStates[topicId]);
  }

  return normalizeProgressData({
    startedTopics,
    completedTopics,
    activityDates,
    topicStates,
    activityLog: mergeActivityLog(prev.activityLog, cloud.activityLog),
    lastActiveTopicId: latestIso(
      prev.topicStates[prev.lastActiveTopicId || ""]?.lastOpenedAt,
      cloud.topicStates[cloud.lastActiveTopicId || ""]?.lastOpenedAt
    ) === prev.topicStates[prev.lastActiveTopicId || ""]?.lastOpenedAt
      ? prev.lastActiveTopicId
      : cloud.lastActiveTopicId || prev.lastActiveTopicId,
  });
}

function getTotalStudySeconds(topicStates: Record<string, TopicState>) {
  return Object.values(topicStates).reduce((sum, topic) => sum + topic.studySeconds, 0);
}

function getLatestCompletedTopic(data: ProgressData) {
  return Object.entries(data.topicStates)
    .filter((entry): entry is [string, TopicState & { completedAt: string }] => Boolean(entry[1].completedAt))
    .sort((a, b) => b[1].completedAt.localeCompare(a[1].completedAt))[0];
}

async function saveProgressToCloud(userId: string, data: ProgressData, syncedAt = nowIso()) {
  const latestCompleted = getLatestCompletedTopic(data);
  const supabase = createClient();

  await supabase.from("user_progress").upsert({
    user_id: userId,
    started_topics: data.startedTopics,
    completed_topics: data.completedTopics,
    activity_dates: data.activityDates,
    topic_states: data.topicStates,
    activity_log: data.activityLog,
    last_active_topic_id: data.lastActiveTopicId || null,
    total_study_seconds: getTotalStudySeconds(data.topicStates),
    last_completed_topic_id: latestCompleted?.[0] || null,
    last_completed_at: latestCompleted?.[1].completedAt || null,
    last_synced_at: syncedAt,
  }, { onConflict: "user_id" });
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const topicCatalog = useMemo(() => getTopicCatalog(), []);
  const modules = useMemo(() => getAllModules(), []);
  const [data, setData] = useState<ProgressData>(() => normalizeProgressData(null));
  const [mounted, setMounted] = useState(false);
  const [storageKey, setStorageKey] = useState("tt_progress_guest");
  const [cloudUserId, setCloudUserId] = useState<string | null>(null);
  const [moduleJustCompleted, setModuleJustCompleted] = useState<string | null>(null);

  // Build a flat ordered list of all topic IDs (for sequential unlock)
  const orderedTopicIds = useMemo(
    () => courseData.flatMap((tier) => tier.modules.flatMap((mod) => mod.topics.filter((t) => Boolean(t.cheatSheetHtml)).map((t) => t.id))),
    []
  );

  // Map each topic to its module id (for completion detection)
  const topicToModuleId = useMemo(() => {
    const map: Record<string, string> = {};
    courseData.forEach((tier) => tier.modules.forEach((mod) => mod.topics.forEach((t) => { map[t.id] = mod.id; })));
    return map;
  }, []);

  const clearModuleCompletion = useCallback(() => setModuleJustCompleted(null), []);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id || localStorage.getItem("tt_user_id") || "guest";
      const key = `tt_progress_${userId}`;

      if (user?.id) {
        localStorage.setItem("tt_user_id", user.id);
      }

      setCloudUserId(user?.id || null);
      setStorageKey(key);

      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          setData(normalizeProgressData(JSON.parse(raw)));
        }
      } catch {}

      if (user?.id) {
        try {
          const { data: dbData, error } = await supabase
            .from("user_progress")
            .select("started_topics, completed_topics, activity_dates, topic_states, activity_log, last_active_topic_id")
            .eq("user_id", user.id)
            .single();

          if (!error && dbData) {
            setData((prev) => mergeServerProgress(prev, dbData));
          }
        } catch (err) {
          console.error("Failed to sync with Supabase cloud:", err);
        }
      }

      setMounted(true);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(storageKey, JSON.stringify(data));

    if (cloudUserId) {
      const timeoutId = setTimeout(async () => {
        await saveProgressToCloud(cloudUserId, data);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [cloudUserId, data, mounted, storageKey]);

  const setLastActiveTopic = useCallback((topicId: string) => {
    setData((prev) => {
      if (prev.lastActiveTopicId === topicId) return prev;
      return {
        ...prev,
        lastActiveTopicId: topicId,
      };
    });
  }, []);

  const startTopic = useCallback((topicId: string) => {
    const stamp = nowIso();
    const day = todayStr();

    setData((prev) => {
      const current = ensureTopicState(prev.topicStates[topicId]);
      const alreadyStarted = Boolean(current.startedAt) || prev.startedTopics.includes(topicId) || prev.completedTopics.includes(topicId);
      const startedTopics = prev.startedTopics.includes(topicId) ? prev.startedTopics : [...prev.startedTopics, topicId];
      const topicStates = {
        ...prev.topicStates,
        [topicId]: {
          ...current,
          startedAt: current.startedAt || stamp,
          lastOpenedAt: stamp,
        },
      };

      return {
        ...prev,
        startedTopics,
        topicStates,
        lastActiveTopicId: topicId,
        activityDates: prev.activityDates.includes(day) ? prev.activityDates : [...prev.activityDates, day],
        activityLog: pushActivity(prev.activityLog, topicId, alreadyStarted ? "resumed" : "started", stamp),
      };
    });
  }, []);

  const completeTopic = useCallback((topicId: string) => {
    const stamp = nowIso();
    const day = todayStr();

    setData((prev) => {
      if (prev.completedTopics.includes(topicId)) return prev;

      const current = ensureTopicState(prev.topicStates[topicId]);
      const startedTopics = prev.startedTopics.includes(topicId) ? prev.startedTopics : [...prev.startedTopics, topicId];
      const newCompletedTopics = [...prev.completedTopics, topicId];

      // Check if completing this topic finishes its module
      const moduleId = topicToModuleId[topicId];
      if (moduleId) {
        const moduleMeta = modules.find((m) => m.id === moduleId);
        const readyTopics = moduleMeta?.topics.filter((t) => Boolean(t.cheatSheetHtml)) || [];
        const allModuleTopicsNowDone = readyTopics.length > 0 && readyTopics.every((t) => newCompletedTopics.includes(t.id));
        if (allModuleTopicsNowDone) {
          setTimeout(() => setModuleJustCompleted(moduleId), 300);
        }
      }

      const nextData = {
        ...prev,
        startedTopics,
        completedTopics: newCompletedTopics,
        activityDates: prev.activityDates.includes(day) ? prev.activityDates : [...prev.activityDates, day],
        lastActiveTopicId: topicId,
        topicStates: {
          ...prev.topicStates,
          [topicId]: {
            ...current,
            startedAt: current.startedAt || stamp,
            lastOpenedAt: stamp,
            completedAt: stamp,
            notesOpened: true,
            xpAwarded: XP_PER_TOPIC,
          },
        },
        activityLog: pushActivity(prev.activityLog, topicId, "completed", stamp),
      };

      if (cloudUserId) {
        saveProgressToCloud(cloudUserId, nextData, stamp).catch(() => {});
      }

      return nextData;
    });
  }, [cloudUserId, modules, topicToModuleId]);

  const recordStudyTime = useCallback((topicId: string, seconds: number) => {
    if (seconds <= 0) return;
    const day = todayStr();
    const stamp = nowIso();

    setData((prev) => {
      const current = ensureTopicState(prev.topicStates[topicId]);
      const nextStudySeconds = current.studySeconds + seconds;
      const startedTopics = prev.startedTopics.includes(topicId) ? prev.startedTopics : [...prev.startedTopics, topicId];

      return {
        ...prev,
        startedTopics,
        activityDates: prev.activityDates.includes(day) ? prev.activityDates : [...prev.activityDates, day],
        lastActiveTopicId: topicId,
        topicStates: {
          ...prev.topicStates,
          [topicId]: {
            ...current,
            startedAt: current.startedAt || stamp,
            lastOpenedAt: stamp,
            studySeconds: nextStudySeconds,
          },
        },
      };
    });
  }, []);

  const recordVideoTime = useCallback((topicId: string, seconds: number) => {
    if (seconds <= 0) return;
    const day = todayStr();
    const stamp = nowIso();

    setData((prev) => {
      const current = ensureTopicState(prev.topicStates[topicId]);
      const startedTopics = prev.startedTopics.includes(topicId) ? prev.startedTopics : [...prev.startedTopics, topicId];

      return {
        ...prev,
        startedTopics,
        activityDates: prev.activityDates.includes(day) ? prev.activityDates : [...prev.activityDates, day],
        lastActiveTopicId: topicId,
        topicStates: {
          ...prev.topicStates,
          [topicId]: {
            ...current,
            startedAt: current.startedAt || stamp,
            lastOpenedAt: stamp,
            videoSeconds: current.videoSeconds + seconds,
          },
        },
      };
    });
  }, []);

  const markNotesOpened = useCallback((topicId: string) => {
    const day = todayStr();
    const stamp = nowIso();

    setData((prev) => {
      const current = ensureTopicState(prev.topicStates[topicId]);
      if (current.notesOpened) {
        if (prev.lastActiveTopicId === topicId) return prev;
        return {
          ...prev,
          lastActiveTopicId: topicId,
        };
      }

      const startedTopics = prev.startedTopics.includes(topicId) ? prev.startedTopics : [...prev.startedTopics, topicId];

      return {
        ...prev,
        startedTopics,
        activityDates: prev.activityDates.includes(day) ? prev.activityDates : [...prev.activityDates, day],
        lastActiveTopicId: topicId,
        topicStates: {
          ...prev.topicStates,
          [topicId]: {
            ...current,
            startedAt: current.startedAt || stamp,
            lastOpenedAt: stamp,
            notesOpened: true,
          },
        },
      };
    });
  }, []);

  const isTopicStarted = useCallback(
    (topicId: string) => {
      const state = data.topicStates[topicId];
      return Boolean(state?.startedAt) || data.startedTopics.includes(topicId) || data.completedTopics.includes(topicId);
    },
    [data.completedTopics, data.startedTopics, data.topicStates]
  );

  const isTopicCompleted = useCallback(
    (topicId: string) => data.completedTopics.includes(topicId) || Boolean(data.topicStates[topicId]?.completedAt),
    [data.completedTopics, data.topicStates]
  );

  // Sequential unlock: a topic is unlocked if it is the first one OR the previous topic is completed
  const isTopicUnlocked = useCallback(
    (topicId: string) => {
      const idx = orderedTopicIds.indexOf(topicId);
      if (idx <= 0) return true;
      const prevId = orderedTopicIds[idx - 1];
      return data.completedTopics.includes(prevId) || Boolean(data.topicStates[prevId]?.completedAt);
    },
    [data.completedTopics, data.topicStates, orderedTopicIds]
  );

  // Returns the ISO timestamp the learner last touched this topic
  const getTopicLastSeenAt = useCallback(
    (topicId: string) => data.topicStates[topicId]?.lastOpenedAt,
    [data.topicStates]
  );

  const getTopicState = useCallback(
    (topicId: string) => ensureTopicState(data.topicStates[topicId]),
    [data.topicStates]
  );

  const getTopicProgress = useCallback(
    (topicId: string) => {
      const topic = topicCatalog[topicId];
      const state = ensureTopicState(data.topicStates[topicId]);

      if (!topic) return state.completedAt ? 100 : 0;
      if (state.completedAt || data.completedTopics.includes(topicId)) return 100;

      const videoProgress = topic.hasVideo ? clamp(state.videoSeconds / MIN_VIDEO_SECONDS, 0, 1) : 1;
      const notesProgress = state.notesOpened ? 1 : 0;
      const studyProgress = clamp(state.studySeconds / MIN_PAGE_SECONDS, 0, 1);

      return Math.round(((videoProgress + notesProgress + studyProgress) / 3) * 100);
    },
    [data.completedTopics, data.topicStates, topicCatalog]
  );

  const totalStudySeconds = useMemo(
    () => getTotalStudySeconds(data.topicStates),
    [data.topicStates]
  );

  const coursesCompleted = useMemo(
    () =>
      modules.filter((module) => {
        const readyTopics = module.topics.filter((topic) => Boolean(topic.cheatSheetHtml));
        return readyTopics.length > 0 && readyTopics.every((topic) => isTopicCompleted(topic.id));
      }).length,
    [isTopicCompleted, modules]
  );

  const moduleProgress = useCallback(
    (moduleId: string) => {
      const courseModule = modules.find((item) => item.id === moduleId);
      const readyTopics = courseModule?.topics.filter((topic) => Boolean(topic.cheatSheetHtml)) || [];
      if (readyTopics.length === 0) return 0;

      const total = readyTopics.reduce((sum, topic) => sum + getTopicProgress(topic.id), 0);
      return Math.round(total / readyTopics.length);
    },
    [getTopicProgress, modules]
  );

  const activeCourses = useMemo(
    () => modules.filter((module) => {
      const progress = moduleProgress(module.id);
      return progress > 0 && progress < 100;
    }).length,
    [moduleProgress, modules]
  );

  const totalXp = useMemo(
    () => Object.values(data.topicStates).reduce((sum, topic) => sum + (topic.xpAwarded || 0), 0),
    [data.topicStates]
  );

  const overallProgress = useMemo(() => {
    const topicIds = Object.keys(topicCatalog);
    if (topicIds.length === 0) return 0;
    const total = topicIds.reduce((sum, topicId) => sum + getTopicProgress(topicId), 0);
    return Math.round(total / topicIds.length);
  }, [getTopicProgress, topicCatalog]);

  const learningStreak = useMemo(() => calcStreak(data.activityDates), [data.activityDates]);

  const continueTopic = useMemo<ContinueTopic | null>(() => {
    const lastTopicId = data.lastActiveTopicId;

    if (lastTopicId && !isTopicCompleted(lastTopicId) && topicCatalog[lastTopicId]) {
      return {
        id: lastTopicId,
        title: topicCatalog[lastTopicId].title,
        moduleTitle: topicCatalog[lastTopicId].moduleTitle,
        progress: getTopicProgress(lastTopicId),
      };
    }

    const startedTopic = Object.entries(data.topicStates)
      .filter(([topicId, state]) => !state.completedAt && topicCatalog[topicId] && (state.studySeconds > 0 || state.notesOpened || state.videoSeconds > 0 || state.startedAt))
      .sort((a, b) => (b[1].lastOpenedAt || "").localeCompare(a[1].lastOpenedAt || ""))[0];

    if (startedTopic) {
      const [topicId] = startedTopic;
      return {
        id: topicId,
        title: topicCatalog[topicId].title,
        moduleTitle: topicCatalog[topicId].moduleTitle,
        progress: getTopicProgress(topicId),
      };
    }

    const firstTopic = courseData[0]?.modules[0]?.topics[0];
    if (!firstTopic) return null;

    const lookup = getTopicById(firstTopic.id);
    return {
      id: firstTopic.id,
      title: firstTopic.title,
      moduleTitle: lookup?.module.title || "",
      progress: getTopicProgress(firstTopic.id),
    };
  }, [data.lastActiveTopicId, data.topicStates, getTopicProgress, isTopicCompleted, topicCatalog]);

  return (
    <ProgressContext.Provider
      value={{
        isTopicStarted,
        isTopicCompleted,
        startTopic,
        completeTopic,
        recordStudyTime,
        recordVideoTime,
        markNotesOpened,
        setLastActiveTopic,
        getTopicState,
        getTopicProgress,
        moduleProgress,
        coursesCompleted,
        learningStreak,
        activeCourses,
        totalXp,
        overallProgress,
        totalStudySeconds,
        continueTopic,
        activityLog: data.activityLog,
        moduleJustCompleted,
        clearModuleCompletion,
        isTopicUnlocked,
        getTopicLastSeenAt,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}
