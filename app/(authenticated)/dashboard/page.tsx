"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckSquare, Flame, Bookmark, Star, BrainCircuit, BookOpen } from "lucide-react";
import Link from "next/link";
import { getActiveCourse } from "@/lib/course-data";
import { useProgress } from "@/lib/progress-context";
import { useApp } from "@/lib/app-context";

export default function DashboardPage() {
  const activeCourse = getActiveCourse();
  const { coursesCompleted, learningStreak, activeCourses, totalXp, overallProgress } = useProgress();
  const { name } = useApp();
  const isStarted = overallProgress > 0;

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full p-2">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Hey {name}! 👋</h1>
        <p className="text-lg text-muted-foreground">Here&apos;s what&apos;s happening with your learning.</p>
      </div>

      <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
        {/* Courses Completed */}
        <Card className="bg-secondary/40 border-border/50 hover:bg-secondary/60 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <CheckSquare className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{coursesCompleted}</div>
            <p className="text-sm text-muted-foreground mt-1">courses finished</p>
          </CardContent>
        </Card>
        
        {/* Learning Streak */}
        <Card className="bg-secondary/40 border-border/50 hover:bg-secondary/60 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Streak</CardTitle>
            <Flame className={`h-5 w-5 ${learningStreak > 0 ? "text-orange-400" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{learningStreak} {learningStreak === 1 ? "Day" : "Days"}</div>
            <p className="text-sm text-muted-foreground mt-1">keep it going!</p>
          </CardContent>
        </Card>
        
        {/* Active Courses */}
        <Card className="bg-secondary/40 border-border/50 hover:bg-secondary/60 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            <Bookmark className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{activeCourses}</div>
            <p className="text-sm text-muted-foreground mt-1">courses started</p>
          </CardContent>
        </Card>
        
        {/* Total XP */}
        <Card className="bg-secondary/40 border-border/50 hover:bg-secondary/60 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total XP</CardTitle>
            <Star className={`h-5 w-5 ${totalXp > 0 ? "text-yellow-400" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalXp.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">experience points</p>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning */}
      <div className="space-y-4 mt-2">
        <h2 className="text-2xl font-bold tracking-tight">Continue Learning</h2>
        
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0a1128] via-[#051e2c] to-[#043343] border border-cyan-900/40 p-8 md:p-10 shadow-2xl">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 bottom-0 w-1/2 overflow-hidden pointer-events-none opacity-80 mix-blend-screen">
             <div className="absolute right-[-10%] top-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />
             <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-30 text-cyan-400">
                <BrainCircuit className="w-96 h-96" strokeWidth={0.5} />
             </div>
          </div>

          <div className="relative z-10 flex flex-col justify-center max-w-lg min-h-[160px] gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{activeCourse.title}</h3>
              <p className="text-base md:text-lg text-cyan-50/80">
                {activeCourse.moduleTitle}
              </p>
            </div>
            
            <div className="flex items-center gap-4 max-w-sm">
              <Progress value={overallProgress} className="h-3 flex-1 bg-black/40 [&>div]:bg-cyan-400" />
              <span className="text-base font-semibold text-cyan-100">{overallProgress}%</span>
            </div>

            <div className="mt-2">
              <Link href={`/learn/${activeCourse.id}`} passHref legacyBehavior>
                <Button className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-base px-10 py-6 rounded-xl hover:scale-105 transition-transform shadow-lg">
                  {isStarted ? "Resume Learning →" : "Start Course →"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN LAYOUT FOR SCROLLING RICH CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6 pb-12">
        
        {/* Left Column (Main App Shortcuts and Recents) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Shortcuts to Study Space */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center justify-between">
              Your Study Space <Link href="/study-space" className="text-cyan-400 text-sm font-semibold hover:underline">Open All →</Link>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/study-space" className="bg-gradient-to-br from-indigo-900/40 to-black/40 border border-indigo-500/30 p-5 rounded-2xl hover:border-indigo-400/60 transition-all hover:scale-[1.02] shadow-[0_5px_15px_rgba(79,70,229,0.1)] group">
                <div className="bg-indigo-500/20 text-indigo-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white mb-1">My Jotter</h3>
                <p className="text-xs text-slate-400">Write fast notes.</p>
              </Link>
              <Link href="/study-space" className="bg-gradient-to-br from-cyan-900/40 to-black/40 border border-cyan-500/30 p-5 rounded-2xl hover:border-cyan-400/60 transition-all hover:scale-[1.02] shadow-[0_5px_15px_rgba(6,182,212,0.1)] group">
                <div className="bg-cyan-500/20 text-cyan-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white mb-1">Materials</h3>
                <p className="text-xs text-slate-400">Saved PDFs & Links.</p>
              </Link>
              <Link href="/study-space" className="bg-gradient-to-br from-teal-900/40 to-black/40 border border-teal-500/30 p-5 rounded-2xl hover:border-teal-400/60 transition-all hover:scale-[1.02] shadow-[0_5px_15px_rgba(20,184,166,0.1)] group">
                <div className="bg-teal-500/20 text-teal-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white mb-1">AI Helper</h3>
                <p className="text-xs text-slate-400">Ask simple questions.</p>
              </Link>
            </div>
          </section>

          {/* Daily Motivation Box */}
          <section className="bg-black/60 border border-border/50 rounded-2xl overflow-hidden shadow-2xl relative p-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] rounded-full pointer-events-none"></div>
            <div className="flex gap-6 items-center">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-secondary/80 flex items-center justify-center text-yellow-400 border border-yellow-500/30">
                <Flame className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 ">Quote of the Day</h3>
                <p className="text-gray-300 italic text-lg line-clamp-2">
                  "No matter how hard it is right now, the only way to fail is if you stop trying. Read one more page today."
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column (Community & Leaderboard) */}
        <div className="space-y-8">
          
          {/* Top Learners Leaderboard */}
          <section className="bg-secondary/20 border border-border/40 rounded-2xl overflow-hidden shadow-lg h-full flex flex-col">
            <div className="p-5 border-b border-border/30 bg-black/20 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" /> Top Learners
              </h2>
              <span className="text-xs font-semibold text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded">THIS WEEK</span>
            </div>
            
            <div className="flex-1 p-2 space-y-1">
              {[
                { name: "Chidi N.", xp: 3200, rank: 1, color: "text-amber-300", bg: "bg-amber-500/10" },
                { name: "Aisha M.", xp: 2850, rank: 2, color: "text-slate-300", bg: "bg-slate-500/10" },
                { name: "Tobi O.", xp: 2100, rank: 3, color: "text-amber-700", bg: "bg-amber-900/20" },
                { name: "You", xp: totalXp, rank: 14, color: "text-cyan-400", bg: "bg-cyan-500/10 border border-cyan-500/30" },
                { name: "Nneka E.", xp: 500, rank: 15, color: "text-gray-400", bg: "bg-transparent" },
              ].map((user, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-xl ${user.bg}`}>
                  <div className="flex items-center gap-4">
                    <div className={`font-bold w-6 text-center ${user.color}`}>#{user.rank}</div>
                    <div className="w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center font-bold text-[13px]">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-sm">{user.name}</span>
                  </div>
                  <span className="text-sm font-bold text-cyan-400">{user.xp.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
