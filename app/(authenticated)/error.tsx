"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AuthenticatedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Aethel Error]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 gap-6">
      <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <AlertTriangle className="w-10 h-10 text-red-400" />
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          An unexpected error occurred. Your progress is saved. Try refreshing the page — if it keeps happening, contact support.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/50 font-mono mt-2">Error ID: {error.digest}</p>
        )}
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#d4b95e] text-[#0a0e1a] font-bold px-8 py-3 rounded-xl transition-all hover:scale-[1.02]"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}
