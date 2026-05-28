"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { title: "Features", href: "/#features" },
  { title: "Courses", href: "/#courses" },
  { title: "Support", href: "/support" },
  { title: "Terms", href: "/terms" },
  { title: "Privacy", href: "/privacy" },
];

export function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="group flex h-16 w-48 shrink-0 items-center justify-start gap-3">
            <img src="/aethel-logo.png" alt="Aethel Solutions" className="h-12 w-12 object-contain transition-all duration-500 group-hover:brightness-125" />
            <div className="leading-none">
              <p className="text-lg font-black tracking-[0.14em] text-[#c9a84c]">Aethel</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.32em] text-[#c9a84c]/70">Solutions</p>
            </div>
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
          <Link href="/login" passHref legacyBehavior>
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/login" passHref legacyBehavior>
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
              <Link href="/login" passHref legacyBehavior>
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/login" passHref legacyBehavior>
                <Button size="sm" className="glow-cyan">Get Started Free</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
