"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { title: "Features", href: "#features" },
  { title: "Courses", href: "#courses" },
  { title: "Pricing", href: "#pricing" },
];

export function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="flex h-16 w-64 shrink-0 items-center justify-start group">
            <img src="/logo.png" alt="Thumbnail Learning" className="h-full w-full object-contain object-left invert hue-rotate-180 mix-blend-screen filter group-hover:brightness-125 transition-all duration-500" />
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.title}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/dashboard" passHref legacyBehavior>
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/dashboard" passHref legacyBehavior>
            <Button size="sm" className="glow-cyan">Get Started Free</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="glass border-t border-border p-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.title}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Link href="/dashboard" passHref legacyBehavior>
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/dashboard" passHref legacyBehavior>
                <Button size="sm" className="glow-cyan">Get Started Free</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
