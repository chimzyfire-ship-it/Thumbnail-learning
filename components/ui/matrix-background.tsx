"use client";

/**
 * Ultra-lightweight Matrix Background — pure CSS, zero canvas, zero JS animation loops.
 * Uses a single pseudo-element grid pattern with a CSS animation for a subtle effect.
 */
export function MatrixBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ opacity: 0.12 }}
    >
      {/* Static grid pattern using CSS gradient — no JS, no canvas, no requestAnimationFrame */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 200, 255, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 200, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      {/* A few static "glow dots" for visual interest — no animation */}
      <div className="absolute top-[20%] left-[15%] w-1 h-1 rounded-full bg-cyan-400 opacity-60" />
      <div className="absolute top-[45%] left-[70%] w-1 h-1 rounded-full bg-cyan-400 opacity-40" />
      <div className="absolute top-[70%] left-[35%] w-1 h-1 rounded-full bg-cyan-400 opacity-50" />
      <div className="absolute top-[30%] left-[85%] w-1 h-1 rounded-full bg-teal-400 opacity-30" />
      <div className="absolute top-[80%] left-[55%] w-1 h-1 rounded-full bg-teal-400 opacity-40" />
    </div>
  );
}
