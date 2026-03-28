"use client";

import { courseData } from "@/lib/course-data";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ChevronRight, Brain } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/lib/progress-context";

export default function CoursesPage() {
  const tier1 = courseData[0]; // Currently we only have Tier 1
  const { isTopicStarted, isTopicCompleted } = useProgress();

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto w-full p-2 pb-20">
      
      {/* Tier Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/30 to-background rounded-3xl p-8 border border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
          <Brain className="w-64 h-64 text-primary" />
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Active Tier
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            {tier1.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            <strong className="text-cyan-400">Focus:</strong> {tier1.focus}
          </p>
        </div>
      </div>

      {/* Modules & Topics */}
      <div className="space-y-16">
        {tier1.modules.map((module) => (
          <section key={module.id} className="scroll-mt-20">
            <div className="flex items-center gap-4 mb-8 border-b border-border/50 pb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center">
                <span className="text-xl font-bold text-primary">{module.title.split(":")[0].replace("Module ", "")}</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white">{module.title.split(": ")[1]}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {module.topics.map((topic) => {
                const started = isTopicStarted(topic.id);
                const completed = isTopicCompleted(topic.id);
                const isStarted = started && !completed;
                const progressValue = completed ? 100 : (started ? 15 : 0); // show 15% just for visual feedback of "in progress"
                
                return (
                  <Card key={topic.id} className="group bg-secondary/30 border-border/50 hover:bg-secondary/60 hover:border-primary/50 transition-all duration-300 flex flex-col overflow-hidden h-full cursor-default">
                    {/* Cover Photo Placeholder */}
                    <div className="h-40 bg-gradient-to-br from-secondary to-background w-full border-b border-border/50 relative overflow-hidden flex items-center justify-center">
                       <span className="text-4xl font-black text-muted-foreground/20">{topic.number}</span>
                       <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/20 transition-colors" />
                    </div>
                    
                    <CardContent className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">
                          Topic {topic.number}
                        </span>
                        {completed && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-cyan-400 transition-colors">
                        {topic.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-6 line-clamp-3 flex-1">
                        {topic.description}
                      </p>
                      
                      <div className="space-y-4 mt-auto">
                        {(started || completed) ? (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-muted-foreground">Status</span>
                              <span className={completed ? "text-green-500" : "text-cyan-400"}>
                                {completed ? "Completed" : "In Progress"}
                              </span>
                            </div>
                            <Progress value={progressValue} className={`h-1.5 ${completed ? '[&>div]:bg-green-500' : '[&>div]:bg-cyan-400'}`} />
                          </div>
                        ) : (
                          <div className="h-1.5" /> // Spacer
                        )}
                        
                        <Link href={`/learn/${topic.id}`} passHref legacyBehavior>
                          <Button 
                            variant={completed ? "outline" : isStarted ? "default" : "secondary"}
                            className={`w-full justify-between group-hover:shadow-lg transition-all ${isStarted ? 'bg-cyan-500 hover:bg-cyan-400 text-black font-semibold' : ''}`}
                          >
                            <span>{completed ? "Review Topic" : isStarted ? "Resume Learning" : "Start Topic"}</span>
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
