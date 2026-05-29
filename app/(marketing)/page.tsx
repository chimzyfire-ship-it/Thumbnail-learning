import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, BookOpen, PlayCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { MatrixBackground } from "@/components/ui/matrix-background";

export default function MarketingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative mx-auto flex max-w-[100vw] flex-col items-center justify-center overflow-hidden px-4 pb-20 pt-24 text-center sm:px-6 md:py-40">
        <div className="absolute inset-0 z-0 opacity-60 mix-blend-screen pointer-events-none" style={{ maskImage: "linear-gradient(to bottom, black 20%, transparent 95%)", WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent 95%)" }}>
          <MatrixBackground />
        </div>

        <div className="relative z-10 mb-8 flex flex-col items-center justify-center w-full">
          <div className="group relative flex w-full max-w-3xl items-center justify-center rounded-3xl p-2 transition-all duration-1000 md:p-10">
            <img 
              src="/aethel-logo.png" 
              alt="Aethel Solutions" 
              className="h-36 w-auto object-contain drop-shadow-[0_0_35px_rgba(201,168,76,0.28)] sm:h-56"
            />
          </div>
        </div>
        <h1 className="relative z-10 max-w-4xl text-[2.35rem] font-black leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl">
          Learn AI for everyday work, study, and clearer thinking.
        </h1>
        <p className="relative z-10 mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-xl">
          Aethel Solutions gives learners clear lessons, course videos, lab notes, private study materials, progress tracking, and a protected AI helper.
        </p>
        <div className="mt-10 flex w-full max-w-sm flex-col justify-center gap-4 sm:max-w-none sm:flex-row">
          <Link href="/login" passHref legacyBehavior>
            <Button size="lg" className="phone-tap h-12 w-full px-8 text-base glow-cyan sm:w-auto">
              Start Learning Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features" passHref legacyBehavior>
            <Button size="lg" variant="outline" className="phone-tap h-12 w-full px-8 text-base sm:w-auto">
              Explore Features
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-5 sm:gap-8 md:grid-cols-3">
          <Card className="phone-card glass flex flex-col items-start p-6 transition-transform hover:-translate-y-1 sm:p-8">
            <div className="rounded-lg bg-primary/10 p-3 mb-6 glow-cyan">
              <PlayCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Course player</h3>
            <p className="text-muted-foreground">
              Watch each assigned lesson video inside the platform and read the matching lab notes in one place.
            </p>
          </Card>

          <Card className="phone-card glass flex flex-col items-start p-6 transition-transform hover:-translate-y-1 sm:p-8">
            <div className="rounded-lg bg-blue-accent/10 p-3 mb-6">
              <BookOpen className="h-6 w-6 text-blue-accent" />
            </div>
            <h3 className="text-xl font-bold mb-3">Progress and XP</h3>
            <p className="text-muted-foreground">
              Resume where you stopped, build a streak, and earn XP only from real lesson activity.
            </p>
          </Card>

          <Card className="phone-card glass flex flex-col items-start p-6 transition-transform hover:-translate-y-1 sm:p-8">
            <div className="rounded-lg bg-cyan-500/10 p-3 mb-6">
              <Brain className="h-6 w-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Study space</h3>
            <p className="text-muted-foreground">
              Save private materials, take notes, use a focus timer, and ask the AI helper when you need support.
            </p>
          </Card>
        </div>
      </section>

      <section id="courses" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28">
        <Card className="phone-card glass overflow-hidden p-5 sm:p-8 md:p-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/20 bg-[#c9a84c]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#c9a84c]">
                <ShieldCheck className="h-4 w-4" /> MVP ready shape
              </div>
              <h2 className="text-2xl font-black leading-tight text-white sm:text-3xl md:text-4xl">Only ready lessons are shown to learners.</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
                The platform does not need to pretend every lesson is finished. Learners see the completed course content first, and unfinished lessons stay hidden until they are ready.
              </p>
            </div>
            <div className="rounded-2xl border border-[#c9a84c]/20 bg-black/30 p-5 sm:p-6">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#c9a84c]/80">Included now</p>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                <li>The Power of Screenshots</li>
                <li>Asking the Right Questions</li>
                <li>Chatting, Not Searching</li>
                <li>More lessons appear only when fully prepared</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
