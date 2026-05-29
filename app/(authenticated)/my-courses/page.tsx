"use client";

import { courseData } from "@/lib/course-data";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronRight, CheckCircle2, BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/lib/progress-context";

export default function MyCoursesPage() {
  const { isTopicStarted, isTopicCompleted, getTopicProgress, totalStudySeconds } = useProgress();

  const allTopics = courseData[0].modules.flatMap(m =>
    m.topics
      .filter((topic) => Boolean(topic.cheatSheetHtml))
      .map(t => ({
        ...t,
        moduleName: m.title,
      }))
  );

  const enrolled = allTopics.filter(t => isTopicStarted(t.id));
  const completed = enrolled.filter(t => isTopicCompleted(t.id));
  const inProgress = enrolled.filter(t => !isTopicCompleted(t.id));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-7 pb-8 sm:gap-8 sm:p-2">
      <div>
        <h1 className="mb-2 text-[2rem] font-bold leading-tight tracking-tight sm:text-3xl">My Courses</h1>
        <p className="text-sm leading-6 text-muted-foreground sm:text-base">All the topics you have started or completed.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
        <Card className="phone-card border-border/50 bg-secondary/30">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{enrolled.length}</p>
              <p className="text-xs text-muted-foreground">Enrolled Topics</p>
            </div>
          </CardContent>
        </Card>
        <Card className="phone-card border-border/50 bg-secondary/30">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{Math.floor(totalStudySeconds / 60)}m</p>
              <p className="text-xs text-muted-foreground">Study Time Saved</p>
            </div>
          </CardContent>
        </Card>
        <Card className="phone-card border-border/50 bg-secondary/30">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{completed.length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* In Progress */}
      {inProgress.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" /> In Progress
          </h2>
          <div className="space-y-3">
            {inProgress.map(t => (
              <Card key={t.id} className="phone-card border-border/50 bg-secondary/20 transition-colors hover:border-primary/30">
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5">
                  <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{t.number}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white">{t.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.moduleName}</p>
                    <div className="flex items-center gap-3 mt-2 max-w-xs">
                      <Progress value={getTopicProgress(t.id)} className="h-1.5 flex-1 [&>div]:bg-cyan-400" />
                      <span className="text-xs font-bold text-cyan-400">{getTopicProgress(t.id)}%</span>
                    </div>
                  </div>
                  <Link href={`/learn/${t.id}`} passHref legacyBehavior>
                    <Button className="phone-tap w-full gap-2 bg-cyan-500 font-semibold text-black hover:bg-cyan-400 sm:w-auto">
                      Resume <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" /> Completed
          </h2>
          <div className="space-y-3">
            {completed.map(t => (
              <Card key={t.id} className="phone-card border-border/50 bg-secondary/20 transition-colors hover:border-green-500/20">
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white">{t.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.moduleName}</p>
                  </div>
                  <Link href={`/learn/${t.id}`} passHref legacyBehavior>
                    <Button variant="outline" className="phone-tap w-full gap-2 sm:w-auto">
                      Review <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {enrolled.length === 0 && (
        <div className="py-16 text-center sm:py-20">
          <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No courses yet</h3>
          <p className="text-muted-foreground mb-6">Start your learning journey by exploring our courses.</p>
          <Link href="/courses" passHref legacyBehavior>
            <Button className="phone-tap bg-primary font-bold text-primary-foreground hover:bg-primary/80">
              Browse Courses
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
