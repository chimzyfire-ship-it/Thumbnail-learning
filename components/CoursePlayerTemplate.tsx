"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CheckCircle2, PlayCircle, FileText, Clock, BookOpen, MonitorPlay, Sparkles, List, Trophy, X } from "lucide-react";
import type { Lesson } from "@/lib/db";
import { MIN_PAGE_SECONDS, MIN_VIDEO_SECONDS, useProgress } from "@/lib/progress-context";
import { courseData } from "@/lib/course-data";

interface CoursePlayerTemplateProps {
  activeLesson: Lesson;
  moduleLessons: Lesson[];
  linkPrefix?: "courses" | "learn";
}

const TICK_INTERVAL = 1000;
const SAVE_INTERVAL = 5;

// Resolve a module title from its id for the celebration modal
function getModuleTitle(moduleId: string): string {
  for (const tier of courseData) {
    const mod = tier.modules.find((m) => m.id === moduleId);
    if (mod) return mod.title.split(": ")[1] ?? mod.title;
  }
  return "Module";
}

export function CoursePlayerTemplate({ activeLesson, moduleLessons, linkPrefix = "courses" }: CoursePlayerTemplateProps) {
  const {
    isTopicCompleted,
    completeTopic,
    startTopic,
    recordStudyTime,
    recordVideoTime,
    markNotesOpened,
    setLastActiveTopic,
    getTopicState,
    getTopicProgress,
    moduleJustCompleted,
    clearModuleCompletion,
  } = useProgress();
  const completed = isTopicCompleted(activeLesson.id);
  const savedState = getTopicState(activeLesson.id);

  // ─── Engagement Tracking State ─────────────────────────────
  const [videoSeconds, setVideoSeconds] = useState(savedState.videoSeconds);
  const [pageSeconds, setPageSeconds] = useState(savedState.studySeconds);
  const [notesOpened, setNotesOpened] = useState(savedState.notesOpened);
  const [justCompleted, setJustCompleted] = useState(false);
  
  // ─── Layout State ─────────────────────────────
  const [activeTab, setActiveTab] = useState<"notes" | "lessons">("notes");

  const videoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pageTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const studyBufferRef = useRef(0);
  const videoBufferRef = useRef(0);
  const hasVideo = Boolean(activeLesson.videoUrl);

  // Conditions
  const videoOk = !hasVideo || videoSeconds >= MIN_VIDEO_SECONDS;
  const notesOk = notesOpened;
  const pageOk = pageSeconds >= MIN_PAGE_SECONDS;
  const allConditionsMet = videoOk && notesOk && pageOk;
  const conditionsMet = [videoOk, notesOk, pageOk].filter(Boolean).length;

  useEffect(() => {
    startTopic(activeLesson.id);
    setLastActiveTopic(activeLesson.id);
  }, [activeLesson.id, setLastActiveTopic, startTopic]);

  useEffect(() => {
    setPageSeconds(savedState.studySeconds);
    setVideoSeconds(savedState.videoSeconds);
    setNotesOpened(savedState.notesOpened);
    setJustCompleted(false);
    studyBufferRef.current = 0;
    videoBufferRef.current = 0;
  }, [activeLesson.id, savedState.notesOpened, savedState.studySeconds, savedState.videoSeconds]);

  useEffect(() => {
    if (completed) return;
    pageTimerRef.current = setInterval(() => {
      setPageSeconds((seconds) => {
        const next = seconds + 1;
        studyBufferRef.current += 1;

        if (studyBufferRef.current >= SAVE_INTERVAL) {
          recordStudyTime(activeLesson.id, studyBufferRef.current);
          studyBufferRef.current = 0;
        }

        return next;
      });
    }, TICK_INTERVAL);
    return () => {
      if (pageTimerRef.current) clearInterval(pageTimerRef.current);
      if (studyBufferRef.current > 0) {
        recordStudyTime(activeLesson.id, studyBufferRef.current);
        studyBufferRef.current = 0;
      }
    };
  }, [activeLesson.id, completed, recordStudyTime]);

  useEffect(() => {
    if (completed || !hasVideo) return;
    videoTimerRef.current = setInterval(() => {
      setVideoSeconds((seconds) => {
        const next = seconds + 1;
        videoBufferRef.current += 1;

        if (videoBufferRef.current >= SAVE_INTERVAL) {
          recordVideoTime(activeLesson.id, videoBufferRef.current);
          videoBufferRef.current = 0;
        }

        return next;
      });
    }, TICK_INTERVAL);
    return () => {
      if (videoTimerRef.current) clearInterval(videoTimerRef.current);
      if (videoBufferRef.current > 0) {
        recordVideoTime(activeLesson.id, videoBufferRef.current);
        videoBufferRef.current = 0;
      }
    };
  }, [activeLesson.id, completed, hasVideo, recordVideoTime]);

  // Mark notes opened when the notes tab is actively viewed
  useEffect(() => {
    if (activeTab === "notes" && !notesOpened) {
      setNotesOpened(true);
      markNotesOpened(activeLesson.id);
    }
  }, [activeLesson.id, activeTab, markNotesOpened, notesOpened]);

  useEffect(() => {
    if (!completed && allConditionsMet && !justCompleted) {
      completeTopic(activeLesson.id);
      setJustCompleted(true);
    }
  }, [allConditionsMet, completed, justCompleted, activeLesson.id, completeTopic]);

  const getHref = (lesson: Lesson) => {
    if (linkPrefix === "learn") return `/learn/${lesson.id}`;
    return `/courses/${lesson.moduleId}/${lesson.id}`;
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const lessonProgress = completed ? 100 : getTopicProgress(activeLesson.id);

  // ─── Module Completion Modal ───────────────────────────────
  const completedModuleTitle = moduleJustCompleted ? getModuleTitle(moduleJustCompleted) : null;

  return (
    // Split-Screen Magic: 50% Video+Progress / 50% Notes+Lessons on Desktop (xl)
    <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 w-full">

      {/* ═══ MODULE COMPLETION CELEBRATION ═══ */}
      {moduleJustCompleted && completedModuleTitle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
          <div className="relative mx-3 max-w-md w-full bg-gradient-to-br from-[#0a0e1a] via-[#111827] to-[#0d1420] border border-[#c9a84c]/40 rounded-3xl p-6 text-center shadow-[0_0_80px_rgba(201,168,76,0.25)] animate-in zoom-in-95 duration-500 sm:mx-4 sm:p-10">
            {/* Dismiss button */}
            <button
              onClick={clearModuleCompletion}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>

            {/* Trophy glow */}
            <div className="relative mx-auto mb-6 w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-[#c9a84c]/20 blur-xl" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#c9a84c]/30 to-[#c9a84c]/5 border border-[#c9a84c]/40 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-[#c9a84c]" />
              </div>
            </div>

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#c9a84c]/70 mb-2">Module Complete</p>
            <h2 className="text-2xl font-extrabold text-white mb-3 leading-tight">{completedModuleTitle}</h2>
            <p className="text-base text-white/60 leading-relaxed mb-8">
              You finished every lesson in this module. Your XP has been saved and your streak is still alive. Keep going!
            </p>

            <div className="flex flex-col items-stretch justify-center gap-3 mb-8 sm:flex-row sm:items-center">
              <div className="flex flex-col items-center bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-2xl px-6 py-4">
                <span className="text-3xl font-black text-[#c9a84c]">{moduleLessons.length * 50}</span>
                <span className="text-xs text-white/50 mt-1 font-medium uppercase tracking-wider">XP Earned</span>
              </div>
              <div className="flex flex-col items-center bg-green-500/10 border border-green-500/20 rounded-2xl px-6 py-4">
                <CheckCircle2 className="w-8 h-8 text-green-400 mb-1" />
                <span className="text-xs text-white/50 font-medium uppercase tracking-wider">{moduleLessons.length} Lessons</span>
              </div>
            </div>

            <button
              onClick={clearModuleCompletion}
              className="w-full bg-gradient-to-r from-[#c9a84c] to-[#d4b95e] hover:from-[#d4b95e] hover:to-[#e0c96a] text-[#0a0e1a] font-extrabold text-base py-4 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg"
            >
              Continue Learning →
            </button>
          </div>
        </div>
      )}
      
      {/* ═══ LEFT PANE: Video Container (50%) ═══ */}
      <div className="w-full xl:w-1/2 flex flex-col gap-6 min-w-0">
        
        {/* Title Block */}
        <div className="px-1 pt-2">
          <p className="text-sm font-semibold text-cyan-400/80 uppercase tracking-widest mb-1">{activeLesson.moduleTitle}</p>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{activeLesson.title}</h1>
        </div>

        {/* Video Player */}
        <div className="w-full aspect-video rounded-2xl flex-shrink-0 overflow-hidden bg-black border border-border/50 shadow-2xl relative">
          {hasVideo ? (
            <iframe
              src={activeLesson.videoUrl}
              title={activeLesson.title}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.16),transparent_45%),linear-gradient(180deg,#06080f_0%,#0a0e1a_100%)] px-8 text-center">
              <MonitorPlay className="h-12 w-12 text-primary/80" />
              <h3 className="mt-4 text-xl font-bold text-white">Course video coming soon</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                This lesson is ready for its own course video. Once a YouTube video is assigned to this lesson, learners will watch it right here in this player.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pb-2 border-b border-border/30">
          <div className="text-lg font-bold">Your Progress</div>
          {completed || justCompleted ? (
            <div className="flex items-center gap-2 text-green-400 font-bold bg-green-500/10 px-3 py-1 rounded-full text-sm">
              <CheckCircle2 className="w-4 h-4" /> Lesson Complete
            </div>
          ) : (
            <div className="text-sm font-semibold text-muted-foreground">{lessonProgress}% ready</div>
          )}
        </div>

        {/* ── PROGRESS TRACKER CARD ── */}
        {!completed && !justCompleted && (
          <div className="bg-secondary/10 rounded-2xl border border-border/50 p-6 space-y-5">
            <div className="flex items-center gap-2 text-[15px] font-semibold text-cyan-300">
              <Sparkles className="w-5 h-5" /> Let&apos;s earn those 50 XP!
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className={`flex flex-col gap-2 p-4 rounded-xl border transition-colors ${videoOk ? "bg-green-500/10 border-green-500/30" : "bg-black/30 border-border/40"}`}>
                <div className="flex items-center gap-2">
                  <MonitorPlay className={`w-5 h-5 shrink-0 ${videoOk ? "text-green-400" : "text-muted-foreground"}`} />
                  <p className={`text-sm font-bold ${videoOk ? "text-green-400" : ""}`}>
                    {!hasVideo ? "No Video Yet" : videoOk ? "Watched" : "Watch Video"}
                  </p>
                </div>
                <p className="text-xs font-medium text-muted-foreground">
                  {!hasVideo ? "This lesson can have its own course video." : videoOk ? "Done" : `${fmt(videoSeconds)} / ${fmt(MIN_VIDEO_SECONDS)}`}
                </p>
              </div>

              <div className={`flex flex-col gap-2 p-4 rounded-xl border transition-colors ${notesOk ? "bg-green-500/10 border-green-500/30" : "bg-black/30 border-border/40"}`}>
                <div className="flex items-center gap-2">
                  <BookOpen className={`w-5 h-5 shrink-0 ${notesOk ? "text-green-400" : "text-muted-foreground"}`} />
                  <p className={`text-sm font-bold ${notesOk ? "text-green-400" : ""}`}>{notesOk ? "Notes Read" : "Read Notes"}</p>
                </div>
                <p className="text-xs font-medium text-muted-foreground">{notesOk ? "Done" : "Click 'Lab Notes' Tab"}</p>
              </div>

              <div className={`flex flex-col gap-2 p-4 rounded-xl border transition-colors ${pageOk ? "bg-green-500/10 border-green-500/30" : "bg-black/30 border-border/40"}`}>
                <div className="flex items-center gap-2">
                  <Clock className={`w-5 h-5 shrink-0 ${pageOk ? "text-green-400" : "text-muted-foreground"}`} />
                  <p className={`text-sm font-bold ${pageOk ? "text-green-400" : ""}`}>{pageOk ? "Time Met" : "Study Time"}</p>
                </div>
                <p className="text-xs font-medium text-muted-foreground">{pageOk ? "Done" : `${fmt(pageSeconds)} / ${fmt(MIN_PAGE_SECONDS)}`}</p>
              </div>
            </div>

            <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-border/20">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-300 transition-all duration-700 ease-out"
                style={{ width: `${(conditionsMet / 3) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ═══ RIGHT PANE: Tabbed Area (50%) ═══ */}
      <div className="w-full xl:w-1/2 flex flex-col bg-secondary/5 rounded-2xl border border-border/50 xl:sticky xl:top-6 xl:h-[calc(100vh-8rem)] overflow-hidden shadow-2xl">
        
        {/* Thick, Beautiful Tab Headers */}
        <div className="flex p-1.5 sm:p-2 bg-black/40 border-b border-border/40 shrink-0">
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl font-bold transition-all duration-300 sm:py-4 sm:px-4 ${
              activeTab === "notes"
                ? "bg-gradient-to-br from-cyan-900/60 to-primary/30 text-cyan-300 shadow-lg border border-cyan-500/30 scale-[1.02]"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
            }`}
          >
            <FileText className={`w-5 h-5 ${activeTab === "notes" ? "text-cyan-400" : ""}`} />
            <span className="text-sm sm:text-[15px]">Lab Notes</span>
          </button>
          
          <button
            onClick={() => setActiveTab("lessons")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl font-bold transition-all duration-300 sm:py-4 sm:px-4 ${
              activeTab === "lessons"
                ? "bg-gradient-to-br from-cyan-900/60 to-primary/30 text-cyan-300 shadow-lg border border-cyan-500/30 scale-[1.02]"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
            }`}
          >
            <List className={`w-5 h-5 ${activeTab === "lessons" ? "text-cyan-400" : ""}`} />
            <span className="text-sm sm:text-[15px]">Module Lessons</span>
          </button>
        </div>

        {/* Scrollable Content Engine */}
        <div className="flex-1 overflow-y-auto w-full relative">
          
          {/* LAB NOTES VIEW */}
          {activeTab === "notes" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out p-4 sm:p-6 md:p-10 lg:p-12">
              <div className="prose prose-invert prose-base sm:prose-lg lg:prose-xl xl:prose-2xl max-w-none text-gray-300 prose-teal 
                prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                prose-strong:text-cyan-300 prose-a:text-cyan-400 
                prose-code:text-cyan-300 prose-code:bg-black/60 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg 
                prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 prose-blockquote:pl-6 prose-blockquote:text-gray-400 prose-blockquote:italic
                prose-th:text-primary prose-td:text-gray-300 prose-table:border-collapse prose-th:border prose-th:border-border prose-th:p-4 prose-td:border prose-td:border-border prose-td:p-4 
                prose-p:leading-relaxed prose-li:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: activeLesson.cheatSheetHtml }}
              />
              <div className="h-20 w-full" /> {/* Bottom padding */}
            </div>
          )}

          {/* MODULE LESSONS VIEW */}
          {activeTab === "lessons" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out flex flex-col h-full bg-black/20">
              <div className="p-6 border-b border-border/40 bg-secondary/10 sticky top-0 z-10 backdrop-blur-xl">
                <h3 className="font-extrabold text-xl">Module Curriculum</h3>
                <p className="text-sm text-cyan-400/80 font-medium mt-1">{activeLesson.moduleTitle}</p>
              </div>
              <div className="p-4 space-y-2">
                {moduleLessons.map((lesson) => {
                  const isActive = lesson.id === activeLesson.id;
                  const isDone = isTopicCompleted(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      href={getHref(lesson)}
                      className={`block p-4 md:p-5 rounded-2xl transition-all duration-200 border ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-900/30 to-transparent border-cyan-500/40 shadow-sm outline outline-1 outline-cyan-500/10"
                          : "bg-secondary/5 hover:bg-secondary/30 border-transparent hover:border-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-inner ${
                            isDone
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : isActive
                              ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                              : "bg-black/50 text-muted-foreground border border-border/50"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : isActive ? (
                            <PlayCircle className="w-5 h-5" />
                          ) : (
                            lesson.order
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-base font-bold truncate ${isActive ? "text-cyan-100" : "text-gray-300"}`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center mt-1">
                            {isDone ? (
                              <span className="text-[13px] text-green-400/80 font-semibold tracking-wide uppercase">Completed</span>
                            ) : isActive ? (
                              <span className="text-[13px] text-cyan-400/80 font-semibold tracking-wide uppercase flex items-center gap-1">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                </span>
                                Currently Playing
                              </span>
                            ) : (
                              <span className="text-[13px] text-muted-foreground font-medium">Up next</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
