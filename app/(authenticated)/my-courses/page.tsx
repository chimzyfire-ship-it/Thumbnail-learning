"use client";

import { courseData } from "@/lib/course-data";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronRight, CheckCircle2, BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/lib/progress-context";

export default function MyCoursesPage() {
  const { isTopicStarted, isTopicCompleted } = useProgress();

  const allTopics = courseData[0].modules.flatMap(m =>
    m.topics.map(t => ({
      ...t,
      moduleName: m.title,
    }))
  );

  const enrolled = allTopics.filter(t => isTopicStarted(t.id));
  const completed = enrolled.filter(t => isTopicCompleted(t.id));
  const inProgress = enrolled.filter(t => !isTopicCompleted(t.id));

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full p-2 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Courses</h1>
        <p className="text-muted-foreground">All the topics you have started or completed.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-secondary/30 border-border/50">
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
        <Card className="bg-secondary/30 border-border/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{inProgress.length}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/30 border-border/50">
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
              <Card key={t.id} className="bg-secondary/20 border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-5 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{t.number}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white">{t.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.moduleName}</p>
                    <div className="flex items-center gap-3 mt-2 max-w-xs">
                      <Progress value={15} className="h-1.5 flex-1 [&>div]:bg-cyan-400" /> {/* Visual 15% marker point for in progress */}
                      <span className="text-xs font-bold text-cyan-400">In Progress</span>
                    </div>
                  </div>
                  <Link href={`/learn/${t.id}`} passHref legacyBehavior>
                    <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold gap-2">
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
              <Card key={t.id} className="bg-secondary/20 border-border/50 hover:border-green-500/20 transition-colors">
                <CardContent className="p-5 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white">{t.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.moduleName}</p>
                  </div>
                  <Link href={`/learn/${t.id}`} passHref legacyBehavior>
                    <Button variant="outline" className="gap-2">
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
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No courses yet</h3>
          <p className="text-muted-foreground mb-6">Start your learning journey by exploring our courses.</p>
          <Link href="/courses" passHref legacyBehavior>
            <Button className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold">
              Browse Courses
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
