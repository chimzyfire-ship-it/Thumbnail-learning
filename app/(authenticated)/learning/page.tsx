"use client";

import { courseData } from "@/lib/course-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  Flame,
  BookMarked,
  ChevronRight,
  Trophy,
  Target,
  Zap,
  Calendar,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/lib/progress-context";

export default function LearningPage() {
  const tier1 = courseData[0];
  const { isTopicStarted, isTopicCompleted, learningStreak, overallProgress, moduleProgress } = useProgress();

  // Calculate live stats
  const allTopics = tier1.modules.flatMap(m => m.topics);
  const completedTopics = allTopics.filter(t => isTopicCompleted(t.id));
  const inProgressTopics = allTopics.filter(t => isTopicStarted(t.id) && !isTopicCompleted(t.id));
  const remainingTopics = allTopics.length - completedTopics.length - inProgressTopics.length;

  // Since we don't have a backend activity log yet, we show an empty array
  // We can scale this in Phase 2 with actual database query logs
  const activityLog: any[] = [];
  const savedResources: any[] = [];

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full p-2 pb-20">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Learning</h1>
        <p className="text-muted-foreground">Track your progress, review your activity, and manage your learning journey.</p>
      </div>

      {/* Learning Path Overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" /> Learning Path
        </h2>

        <div className="bg-gradient-to-r from-primary/10 via-secondary/30 to-background rounded-2xl p-6 border border-primary/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-primary mb-1">Current Tier</p>
              <h3 className="text-2xl font-bold text-white mb-2">{tier1.title}</h3>
              <p className="text-sm text-muted-foreground">{tier1.focus}</p>
            </div>
            <div className="flex flex-col items-center gap-2 min-w-[180px]">
              <div className="text-4xl font-black text-primary">{overallProgress}%</div>
              <Progress value={overallProgress} className="h-3 w-full [&>div]:bg-cyan-400" />
              <p className="text-xs text-muted-foreground">Overall Tier Progress</p>
            </div>
          </div>
        </div>

        {/* Module Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tier1.modules.map((mod) => {
            const modProg = moduleProgress(mod.id);
            const completed = mod.topics.filter(t => isTopicCompleted(t.id)).length;
            return (
              <Card key={mod.id} className="bg-secondary/30 border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-primary">
                    {mod.title.split(":")[0]}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{mod.title.split(": ")[1]}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="text-muted-foreground">{completed}/{mod.topics.length} topics</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Activity Log */}
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Activity Log
          </h2>

          <Card className="bg-secondary/20 border-border/50 overflow-hidden min-h-[250px] flex items-center justify-center">
            {activityLog.length > 0 ? (
              <CardContent className="p-0 w-full">
                <div className="divide-y divide-border/50">
                  {activityLog.map((entry) => { 
                    const IconComp = entry.icon;
                    return (
                      <div key={entry.id} className="flex items-start gap-4 p-4 hover:bg-secondary/30 transition-colors">
                        <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
                          <IconComp className={`w-4 h-4 ${entry.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white">
                            <span className="font-semibold">{entry.action}</span>
                            {" "}
                            <span className="text-cyan-400 font-medium">{entry.topic}</span>
                          </p>
                          {entry.module && (
                            <p className="text-xs text-muted-foreground mt-0.5">{entry.module}</p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {entry.time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            ) : (
              <div className="text-center p-8">
                 <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                 <p className="text-muted-foreground text-sm">Your learning activity will appear here once you start taking courses.</p>
              </div>
            )}
          </Card>
        </section>

        {/* Saved/Bookmarked Resources */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-primary" /> Saved
          </h2>

          {savedResources.length > 0 ? (
            <div className="space-y-3">
              {savedResources.map((res) => (
                <Card key={res.id} className="bg-secondary/30 border-border/50 hover:border-primary/30 transition-colors">
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
             <Card className="bg-secondary/20 border-border/50 transition-colors">
                <CardContent className="p-8 text-center">
                  <BookMarked className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">You haven't bookmarked any tools or sheets yet.</p>
                </CardContent>
              </Card>
          )}

          {/* Quick Stats */}
          <Card className="bg-secondary/20 border-border/50 mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> Quick Stats
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
                <span className="font-bold text-orange-400 flex items-center gap-1"><Flame className="w-3 h-3" /> {learningStreak} Days</span>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
