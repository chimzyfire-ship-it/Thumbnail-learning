"use client";

import { courseData } from "@/lib/course-data";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ChevronRight, Lock, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/lib/progress-context";

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function CoursesPage() {
  const tier1 = courseData[0]; // Currently we only have Tier 1
  const { isTopicStarted, isTopicCompleted, getTopicProgress, isTopicUnlocked, getTopicLastSeenAt } = useProgress();

  return (
    <div className="flex flex-col gap-8 sm:gap-10 max-w-6xl mx-auto w-full p-0 sm:p-2 pb-20">
      
      {/* Tier Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/20 to-background rounded-2xl p-4 sm:p-5 border border-primary/20 relative overflow-hidden max-w-xl">
        <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none">
          <img src="/icon-brain.png" alt="" className="w-32 h-32 opacity-20" />
        </div>
        
        <div className="relative z-10 flex flex-col gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Active Tier
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
            {tier1.title}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <strong className="text-[#c9a84c] font-semibold">Focus:</strong> {tier1.focus}
          </p>
        </div>
      </div>

      {/* Modules & Topics */}
      <div className="space-y-16">
        {tier1.modules.map((module) => (
          <section key={module.id} className="scroll-mt-20">
            <div className="flex items-center gap-3 sm:gap-4 mb-8 border-b border-border/50 pb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center">
                <span className="text-xl font-bold text-primary">{module.title.split(":")[0].replace("Module ", "")}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{module.title.split(": ")[1]}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {module.topics.map((topic) => {
                const started = isTopicStarted(topic.id);
                const completed = isTopicCompleted(topic.id);
                const isStarted = started && !completed;
                const progressValue = getTopicProgress(topic.id);
                const unlocked = isTopicUnlocked(topic.id);
                const lastSeenAt = getTopicLastSeenAt(topic.id);
                const ready = Boolean(topic.cheatSheetHtml);
                const canOpen = unlocked && ready;
                
                if (!canOpen) {
                  return (
                    <div className="flex flex-col gap-3 h-full group" key={topic.id}>
                      {/* Card Content (Muted & Grayscale to prevent bleed/clashing) */}
                      <Card
                        className="bg-secondary/15 border-border/30 flex-1 flex flex-col overflow-hidden opacity-40 grayscale transition-all duration-300 pointer-events-none select-none"
                      >
                        {/* Cover Photo */}
                        <div className="h-40 bg-gradient-to-br from-secondary/50 to-background/50 w-full border-b border-border/30 relative overflow-hidden flex items-center justify-center">
                          {topic.coverImage ? (
                            <img src={topic.coverImage} alt={topic.title} className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                            <span className="text-4xl font-black text-muted-foreground/10">{topic.number}</span>
                          )}
                        </div>
                        
                        <CardContent className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/50 mb-2 block">
                              Topic {topic.number}
                            </span>
                            <h3 className="text-lg font-bold text-white/70 mb-2 leading-tight">
                              {topic.title}
                            </h3>
                            <p className="text-sm text-muted-foreground/50 line-clamp-3">
                              {topic.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Obvious Lock/Status Bubble Positioned Under the Card */}
                      {ready ? (
                        <div className="bg-[#1f1a10] border border-[#c9a84c]/20 text-[#c9a84c] text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-center shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                          <Lock className="w-3.5 h-3.5 text-[#c9a84c] flex-shrink-0 animate-pulse" />
                          <span>Complete the previous topic to unlock</span>
                        </div>
                      ) : (
                        <div className="bg-[#10141d] border border-[#1f2b3e]/60 text-muted-foreground/80 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-center shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                          <Lock className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
                          <span>Coming Soon</span>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Card
                    key={topic.id}
                    className="group bg-secondary/30 border-border/50 transition-all duration-300 flex flex-col overflow-hidden h-full relative hover:bg-secondary/60 hover:border-primary/50 cursor-default"
                  >
                    {/* Cover Photo */}
                    <div className="h-40 bg-gradient-to-br from-secondary to-background w-full border-b border-border/50 relative overflow-hidden flex items-center justify-center">
                       {topic.coverImage ? (
                         <img src={topic.coverImage} alt={topic.title} className="absolute inset-0 w-full h-full object-cover" />
                       ) : (
                         <span className="text-4xl font-black text-muted-foreground/20">{topic.number}</span>
                       )}
                       <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/20 transition-colors" />
                       {/* Last-seen badge */}
                       {lastSeenAt && (
                         <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-[10px] text-white/80 font-semibold px-2 py-1 rounded-full border border-white/10">
                           <Clock className="w-2.5 h-2.5 text-[#c9a84c]" />
                           {relativeTime(lastSeenAt)}
                         </div>
                       )}
                    </div>
                    
                    <CardContent className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2 block">
                          Topic {topic.number}
                        </span>
                        {completed && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-[#c9a84c] transition-colors">
                        {topic.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-6 line-clamp-3 flex-1">
                        {topic.description}
                      </p>
                      
                      <div className="space-y-4 mt-auto">
                        {ready && (started || completed) ? (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-muted-foreground">Status</span>
                               <span className={completed ? "text-green-500" : "text-[#c9a84c]"}>
                                {completed ? "Completed" : `${progressValue}%`}
                              </span>
                            </div>
                            <Progress value={progressValue} className={`h-1.5 ${completed ? '[&>div]:bg-green-500' : '[&>div]:bg-[#c9a84c]'}`} />
                          </div>
                        ) : (
                          <div className="h-1.5" /> // Spacer
                        )}
                        
                        <Link href={`/learn/${topic.id}`} passHref legacyBehavior>
                          <Button 
                            variant={completed ? "outline" : isStarted ? "default" : "secondary"}
                            className={`w-full justify-between group-hover:shadow-lg transition-all ${isStarted ? 'bg-[#c9a84c] hover:bg-[#d4b95e] text-[#0a0e1a] font-semibold' : ''}`}
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
