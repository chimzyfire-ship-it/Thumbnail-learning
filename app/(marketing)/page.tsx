import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Code, Zap, Target, ArrowRight } from "lucide-react";
import { MatrixBackground } from "@/components/ui/matrix-background";

export default function MarketingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="mx-auto flex max-w-[100vw] flex-col items-center justify-center px-6 py-32 text-center md:py-48 relative overflow-hidden">
        {/* Cyberpunk Matrix Background */}
        <div className="absolute inset-0 z-0 opacity-60 mix-blend-screen pointer-events-none" style={{ maskImage: "linear-gradient(to bottom, black 20%, transparent 95%)", WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent 95%)" }}>
          <MatrixBackground />
        </div>
        

        
        <div className="relative z-10 mb-8 flex flex-col items-center justify-center w-full">
          <div className="relative flex items-center justify-center w-full max-w-4xl p-4 md:p-12 rounded-3xl group transition-all duration-1000">
            {/* The Magic CSS trick: Invert turns White bg to Black. Hue-rotate 180 turns inverted cyan back to cyan. Mix blend screen drops the black! */}
            <img 
              src="/logo.png" 
              alt="Thumbnail Learning" 
              className="w-full h-auto max-h-[400px] object-contain invert hue-rotate-180 mix-blend-screen filter drop-shadow-[0_0_15px_rgba(0,255,255,0.3)]" 
            />
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Interactive AI-driven courses, real-time code execution, and personalized
          learning paths designed to give you the unfair advantage in tech.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center">
          <Link href="/login" passHref legacyBehavior>
            <Button size="lg" className="h-12 px-8 text-base glow-cyan">
              Start Learning Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features" passHref legacyBehavior>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              Explore Features
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="glass flex flex-col items-start p-8 transition-transform hover:-translate-y-1">
            <div className="rounded-lg bg-primary/10 p-3 mb-6 glow-cyan">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI-Powered Curriculum</h3>
            <p className="text-muted-foreground">
              Dynamic courses that adapt to your skill level and learning speed in real-time.
            </p>
          </Card>

          <Card className="glass flex flex-col items-start p-8 transition-transform hover:-translate-y-1">
            <div className="rounded-lg bg-blue-accent/10 p-3 mb-6">
              <Code className="h-6 w-6 text-blue-accent" />
            </div>
            <h3 className="text-xl font-bold mb-3">Interactive Code Labs</h3>
            <p className="text-muted-foreground">
              Write, execute, and debug code directly in your browser with AI assistance.
            </p>
          </Card>

          <Card className="glass flex flex-col items-start p-8 transition-transform hover:-translate-y-1">
            <div className="rounded-lg bg-cyan-500/10 p-3 mb-6">
              <Target className="h-6 w-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Project-Based Learning</h3>
            <p className="text-muted-foreground">
              Build real-world applications instead of just watching theoretical videos.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
