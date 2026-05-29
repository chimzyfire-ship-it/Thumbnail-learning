"use client";

import { courseData } from "@/lib/course-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ChevronRight,
  Calendar,
  PlayCircle,
  BookMarked,
} from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/lib/progress-context";

function formatWhen(iso: string) {
  const time = new Date(iso);
  const diffMs = Date.now() - time.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return time.toLocaleDateString();
}

export default function LearningPage() {
  const tier1 = courseData[0];
  const { isTopicStarted, isTopicCompleted, learningStreak, overallProgress, moduleProgress, activityLog, totalStudySeconds, continueTopic } = useProgress();

  // Calculate live stats
  const allTopics = tier1.modules.flatMap(m => m.topics.filter((topic) => Boolean(topic.cheatSheetHtml)));
  const completedTopics = allTopics.filter(t => isTopicCompleted(t.id));
  const inProgressTopics = allTopics.filter(t => isTopicStarted(t.id) && !isTopicCompleted(t.id));
  const remainingTopics = allTopics.length - completedTopics.length - inProgressTopics.length;
  const savedResources: { id: string; title: string; module: string; topicId: string }[] = [];
  const studyHours = Math.floor(totalStudySeconds / 3600);
  const studyMinutes = Math.floor((totalStudySeconds % 3600) / 60);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-7 pb-8 sm:gap-8 sm:p-2">

      {/* Page Header */}
      <div>
        <h1 className="mb-2 text-[2rem] font-bold leading-tight tracking-tight sm:text-3xl">My Learning</h1>
        <p className="text-sm leading-6 text-muted-foreground sm:text-base">Track your progress, review your activity, and manage your learning journey.</p>
      </div>

      {/* Learning Path Overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <img src="/icon-completed.png" alt="" className="w-6 h-6 object-contain" /> Learning Path
        </h2>

        <div className="phone-card rounded-[1.35rem] border border-primary/20 bg-gradient-to-r from-primary/10 via-secondary/30 to-background p-5 sm:rounded-2xl sm:p-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-primary mb-1">Current Tier</p>
              <h3 className="mb-2 text-[1.55rem] font-bold leading-tight text-white sm:text-2xl">{tier1.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{tier1.focus}</p>
            </div>
            <div className="flex flex-col items-center gap-2 min-w-[180px]">
              <div className="text-4xl font-black text-primary">{overallProgress}%</div>
              <Progress value={overallProgress} className="h-3 w-full [&>div]:bg-cyan-400" />
              <p className="text-xs text-muted-foreground">Overall Tier Progress</p>
              <p className="text-xs text-cyan-300">{studyHours > 0 ? `${studyHours}h ` : ""}{studyMinutes}m studied so far</p>
            </div>
          </div>
        </div>

        {/* Module Progress Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {tier1.modules.map((mod) => {
            const readyTopics = mod.topics.filter((topic) => Boolean(topic.cheatSheetHtml));
            const modProg = moduleProgress(mod.id);
            const completed = readyTopics.filter(t => isTopicCompleted(t.id)).length;
            return (
              <Card key={mod.id} className="phone-card border-border/50 bg-secondary/30 transition-colors hover:border-primary/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-primary">
                    {mod.title.split(":")[0]}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{mod.title.split(": ")[1]}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="text-muted-foreground">{completed}/{readyTopics.length} topics</span>
                    <span className="font-bold text-white">{modProg}%</span>
                  </div>
                  <Progress value={modProg} className="h-1.5 [&>div]:bg-cyan-400" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Two Column Layout: Activity + Saved */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
        
        {/* Activity Log */}
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <img src="/icon-streak.png" alt="" className="w-6 h-6 object-contain" /> Activity Log
          </h2>

          <Card className="phone-card flex min-h-[250px] items-center justify-center overflow-hidden border-border/50 bg-secondary/20">
            {activityLog.length > 0 ? (
              <CardContent className="p-0 w-full">
                <div className="divide-y divide-border/50">
                  {activityLog.map((entry) => { 
                    const topic = allTopics.find((item) => item.id === entry.topicId);
                    const action = entry.type === "completed" ? "Completed" : entry.type === "resumed" ? "Returned to" : "Started";
                    return (
                      <div key={entry.id} className="flex flex-col gap-3 p-4 transition-colors hover:bg-secondary/30 sm:flex-row sm:items-start sm:gap-4">
                        <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
                          {entry.type === "completed" ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : entry.type === "resumed" ? (
                            <PlayCircle className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <BookMarked className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white">
                            <span className="font-semibold">{action}</span>
                            {" "}
                            <span className="text-cyan-400 font-medium">{topic?.title || "a lesson"}</span>
                          </p>
                          {topic && (
                            <p className="text-xs text-muted-foreground mt-0.5">{tier1.modules.find((module) => module.topics.some((item) => item.id === topic.id))?.title}</p>
                          )}
                        </div>
                        <span className="flex items-center gap-1 whitespace-nowrap text-xs text-muted-foreground sm:ml-auto">
                          <Calendar className="w-3 h-3" /> {formatWhen(entry.at)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            ) : (
              <div className="text-center p-8">
                 <img src="/icon-streak.png" alt="" className="w-12 h-12 mx-auto mb-3 opacity-30" />
                 <p className="text-muted-foreground text-sm">Your learning activity will appear here once you start taking courses.</p>
              </div>
            )}
          </Card>
        </section>

        {/* Saved/Bookmarked Resources */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <img src="/icon-bookmark.png" alt="" className="w-6 h-6 object-contain" /> Saved
          </h2>

          {savedResources.length > 0 ? (
            <div className="space-y-3">
              {savedResources.map((res) => (
                <Card key={res.id} className="phone-card border-border/50 bg-secondary/30 transition-colors hover:border-primary/30">
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{res.title}</p>
                      <p className="text-xs text-muted-foreground">{res.module}</p>
                    </div>
                    <Link href={`/learn/${res.topicId}`} passHref legacyBehavior>
                      <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
             <Card className="phone-card border-border/50 bg-secondary/20 transition-colors">
                <CardContent className="p-8 text-center">
                  <img src="/icon-bookmark.png" alt="" className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs text-muted-foreground">You haven&apos;t bookmarked any tools or sheets yet.</p>
                </CardContent>
              </Card>
          )}

          {/* Quick Stats */}
          <Card className="phone-card mt-6 border-border/50 bg-secondary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <img src="/icon-star.png" alt="" className="w-5 h-5 object-contain" /> Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Topics Completed</span>
                <span className="font-bold text-green-500">{completedTopics.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">In Progress</span>
                <span className="font-bold text-cyan-400">{inProgressTopics.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-bold text-white">{remainingTopics}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Learning Streak</span>
                <span className="font-bold text-orange-400 flex items-center gap-1"><img src="/icon-streak.png" alt="" className="w-4 h-4 object-contain" /> {learningStreak} Days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next Up</span>
                <span className="font-bold text-cyan-300">{continueTopic?.title || "Start Topic 1"}</span>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
