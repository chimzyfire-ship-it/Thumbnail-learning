"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock3 } from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/lib/progress-context";
import { useApp } from "@/lib/app-context";
import { createClient } from "@/lib/supabase/client";
import { getTopicById } from "@/lib/course-data";
import { useEffect, useState } from "react";

interface LeaderEntry { id: string; first_name: string | null; last_name: string | null; total_xp: number; }

export default function DashboardPage() {
  const { coursesCompleted, learningStreak, activeCourses, totalXp, overallProgress, continueTopic, totalStudySeconds, activityLog } = useProgress();
  const { name } = useApp();
  const studyHours = Math.floor(totalStudySeconds / 3600);
  const studyMinutes = Math.floor((totalStudySeconds % 3600) / 60);
  const hasStarted = totalStudySeconds > 0 || overallProgress > 0;
  const activeCourse = continueTopic;

  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);
  const [leaderLoading, setLeaderLoading] = useState(true);
  const [leaderError, setLeaderError] = useState(false);
  const [myRank, setMyRank] = useState<number>(0);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from("leaderboard")
          .select("id, first_name, last_name, total_xp")
          .limit(5);

        if (!error && data) {
          setLeaderboard(data as LeaderEntry[]);
          if (user) {
            const rank = data.findIndex((e: LeaderEntry) => e.id === user.id);
            setMyRank(rank >= 0 ? rank + 1 : data.length + 1);
          }
        } else {
          setLeaderError(true);
        }
      } catch {
        setLeaderError(true);
      } finally {
        setLeaderLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const statCards = [
    { label: "Completed", value: coursesCompleted, sub: "courses finished", icon: "/icon-completed.png" },
    { label: "Streak", value: `${learningStreak} ${learningStreak === 1 ? "Day" : "Days"}`, sub: "keep it going!", icon: "/icon-streak.png" },
    { label: "In Progress", value: activeCourses, sub: "courses started", icon: "/icon-bookmark.png" },
    { label: "Total XP", value: totalXp.toLocaleString(), sub: "experience points", icon: "/icon-star.png" },
  ];

  const activityLabels = {
    started: "Started",
    resumed: "Returned to",
    completed: "Completed",
  };

  const recentActivity = activityLog.slice(0, 4).map((item) => {
    const lesson = getTopicById(item.topicId);
    return {
      id: item.id,
      label: activityLabels[item.type],
      title: lesson?.topic.title || "A lesson",
      moduleTitle: lesson?.module.title || "Course activity",
      at: new Date(item.at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    };
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-8 sm:gap-8 sm:p-2">
      <div>
        <h1 className="mb-2 text-[2rem] font-bold leading-tight tracking-tight md:text-4xl">Hey {name}</h1>
        <p className="text-base leading-7 text-muted-foreground sm:text-lg">Here&apos;s what&apos;s happening with your learning.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label} className="phone-card border-[#c9a84c]/20 bg-[#111827]/60 transition-colors hover:border-[#c9a84c]/40">
            <CardHeader className="flex flex-row items-center justify-between gap-2 p-3.5 pb-2 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">{s.label}</CardTitle>
              <img src={s.icon} alt={s.label} className="h-6 w-6 object-contain sm:h-7 sm:w-7" />
            </CardHeader>
            <CardContent className="p-3.5 pt-0 sm:p-6 sm:pt-0">
              <div className="text-[1.55rem] font-bold leading-tight sm:text-4xl">{s.value}</div>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Learning */}
      <div className="space-y-4 mt-2">
        <h2 className="text-2xl font-bold tracking-tight">Continue Learning</h2>
        <div className="phone-card relative overflow-hidden rounded-[1.35rem] border border-[#c9a84c]/25 bg-gradient-to-r from-[#0a0e1a] via-[#0e1525] to-[#111827] p-5 shadow-2xl sm:rounded-2xl sm:p-8 md:p-10">
          <div className="absolute top-0 right-0 bottom-0 w-1/2 overflow-hidden pointer-events-none opacity-60">
            <div className="absolute right-[-10%] top-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_rgba(201,168,76,0.12),_transparent_60%)]" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-20">
              <img src="/icon-brain.png" alt="" className="w-96 h-96 object-contain opacity-40" />
            </div>
          </div>
          <div className="relative z-10 flex min-h-[160px] max-w-lg flex-col justify-center gap-5 sm:gap-6">
            <div>
              <h3 className="mb-2 text-[1.65rem] font-bold leading-tight text-white md:text-3xl">{activeCourse?.title || "Start your first lesson"}</h3>
              <p className="text-sm leading-6 text-white/70 sm:text-base md:text-lg">{activeCourse?.moduleTitle || "Your next lesson will appear here as soon as you begin."}</p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 max-w-sm">
              <Progress value={overallProgress} className="h-3 flex-1 bg-black/40 [&>div]:bg-[#c9a84c]" />
              <span className="text-base font-semibold text-[#d4b95e]">{overallProgress}%</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Clock3 className="w-4 h-4 text-[#c9a84c]" />
              <span>{studyHours > 0 ? `${studyHours}h ` : ""}{studyMinutes}m of study saved</span>
            </div>
            <div className="mt-2">
              <Link href={`/learn/${activeCourse?.id || "topic-1"}`} passHref legacyBehavior>
                <Button className="w-full sm:w-auto bg-[#c9a84c] hover:bg-[#d4b95e] text-[#0a0e1a] font-bold text-base px-10 py-6 rounded-xl hover:scale-105 transition-transform shadow-lg">
                  {hasStarted ? "Resume Learning →" : "Start Course →"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="mt-4 grid grid-cols-1 gap-6 pb-4 sm:mt-6 sm:gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
              <h2 className="flex items-center justify-between text-lg font-bold tracking-tight text-white sm:text-xl">
              Your Study Space <Link href="/study-space" className="text-[#c9a84c] text-sm font-semibold hover:underline">Open All →</Link>
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {[
                { href: "/study-space", label: "My Jotter", desc: "Write fast notes.", icon: "/icon-book.png", from: "from-[#1a1530]" },
                { href: "/study-space", label: "Materials", desc: "Saved PDFs & Links.", icon: "/icon-bookmark.png", from: "from-[#151a30]" },
                { href: "/study-space", label: "AI Helper", desc: "Ask simple questions.", icon: "/icon-brain.png", from: "from-[#101a25]" },
              ].map((item) => (
                <Link key={item.label} href={item.href} className={`phone-card group rounded-2xl border border-[#c9a84c]/20 bg-gradient-to-br ${item.from} to-black/40 p-5 shadow-[0_5px_15px_rgba(201,168,76,0.05)] transition-all hover:scale-[1.02] hover:border-[#c9a84c]/50`}>
                  <div className="w-12 h-12 rounded-xl overflow-hidden mb-4">
                    <img src={item.icon} alt={item.label} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-lg text-white mb-1">{item.label}</h3>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="phone-card relative overflow-hidden rounded-2xl border border-[#c9a84c]/15 bg-black/60 p-5 shadow-2xl sm:p-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a84c]/10 blur-[50px] rounded-full pointer-events-none" />
            <div className="relative">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Recent Learning Activity</h3>
                <p className="text-sm text-muted-foreground">This only shows real actions from your account.</p>
              </div>

              <div className="mt-5 space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((item) => (
                    <div key={item.id} className="flex flex-col gap-1 rounded-xl border border-[#c9a84c]/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">{item.label} {item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.moduleTitle}</p>
                      </div>
                      <span className="text-xs font-semibold text-[#c9a84c]">{item.at}</span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-[#c9a84c]/20 bg-[#c9a84c]/5 p-5 text-sm text-muted-foreground">
                    Your first lesson action will appear here after you start learning.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Leaderboard */}
        <div className="space-y-8">
          <section className="phone-card flex h-full flex-col overflow-hidden rounded-2xl border border-[#c9a84c]/15 bg-[#111827]/60 shadow-lg">
            <div className="p-5 border-b border-[#1f2b3e] bg-black/20 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <img src="/icon-star.png" alt="Leaderboard" className="w-6 h-6 object-contain" /> Top Learners
              </h2>
              <span className="text-xs font-semibold text-[#c9a84c] bg-[#c9a84c]/10 px-2 py-1 rounded">ALL TIME</span>
            </div>
            <div className="flex-1 p-2 space-y-1">
              {leaderLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="h-4 w-6 bg-secondary/50 rounded animate-pulse" />
                      <div className="w-10 h-10 rounded-full bg-secondary/50 animate-pulse" />
                      <div className="h-4 w-20 bg-secondary/50 rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-16 bg-secondary/30 rounded animate-pulse" />
                  </div>
                ))
              ) : leaderError ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  <img src="/icon-star.png" alt="" className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  Leaderboard is being prepared. It will show real learner progress once setup is complete.
                </div>
              ) : leaderboard.length > 0 ? (
                leaderboard.map((entry, i) => {
                  const rankColors = ["text-[#d4b95e]", "text-slate-300", "text-[#a8893a]"];
                  const isMe = myRank === i + 1;
                  return (
                    <div key={entry.id} className={`flex items-center justify-between gap-3 rounded-xl p-4 ${isMe ? "bg-[#c9a84c]/10 border border-[#c9a84c]/30" : ""}`}>
                      <div className="flex items-center gap-4">
                        <div className={`font-bold w-6 text-center ${rankColors[i] || "text-gray-400"}`}>#{i + 1}</div>
                        <div className="w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center font-bold text-[13px]">
                          {(entry.first_name || "?").charAt(0)}
                        </div>
                        <span className="font-semibold text-sm">{isMe ? "You" : `${entry.first_name || ""} ${(entry.last_name || "").charAt(0)}.`}</span>
                      </div>
                      <span className="text-sm font-bold text-[#c9a84c]">{(entry.total_xp || 0).toLocaleString()} XP</span>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  <img src="/icon-star.png" alt="" className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  Complete your first lesson to appear on the leaderboard!
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
