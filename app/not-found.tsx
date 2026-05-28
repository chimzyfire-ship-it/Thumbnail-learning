import Link from "next/link";
import { BookOpen, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 gap-8 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg,#06080f 0%,#0a0e1a 100%)" }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#c9a84c]/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-md">
        <div className="text-[120px] font-black text-[#c9a84c]/20 leading-none select-none">404</div>
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Page not found</h1>
          <p className="text-muted-foreground leading-relaxed">
            This page doesn&apos;t exist or may have moved. Head back to the dashboard or browse your courses.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#d4b95e] text-[#0a0e1a] font-bold px-6 py-3 rounded-xl transition-all hover:scale-[1.02] flex-1"
          >
            <Home className="w-4 h-4" /> Dashboard
          </Link>
          <Link
            href="/courses"
            className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground font-semibold px-6 py-3 rounded-xl transition-all border border-border flex-1"
          >
            <BookOpen className="w-4 h-4" /> Browse Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
