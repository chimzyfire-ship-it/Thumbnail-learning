"use client";

import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Bell, ArrowLeft, Home, BookOpen, Library, Users, Menu } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { FocusProvider } from "@/lib/focus-context";
import FloatingFocusBubble from "@/components/layout/FloatingFocusBubble";

function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  const tabs = [
    { label: "Home", href: "/dashboard", icon: Home },
    { label: "Courses", href: "/courses", icon: BookOpen },
    { label: "Study", href: "/study-space", icon: Library },
    { label: "Community", href: "/community", icon: Users },
  ];

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] left-3 right-3 z-40 mx-auto max-w-md md:hidden rounded-[1.35rem] border border-[#c9a84c]/18 bg-[#0b111f]/90 p-1.5 shadow-[0_18px_55px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
      <nav className="grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const isActive = pathname?.startsWith(tab.href) || (pathname === "/dashboard" && tab.href === "/dashboard");
          const Icon = tab.icon;
          return (
            <button
              key={tab.label}
              onClick={() => router.push(tab.href)}
              aria-current={isActive ? "page" : undefined}
              className={`phone-tap relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 transition-all duration-300 ${
                isActive
                  ? "bg-[#c9a84c]/14 text-[#c9a84c] shadow-[inset_0_0_0_1px_rgba(201,168,76,0.14)]"
                  : "text-[#8a91a4] hover:bg-white/5 hover:text-white"
              }`}
            >
              {isActive && <span className="absolute top-1 h-1 w-5 rounded-full bg-[#c9a84c]" />}
              <Icon className="mt-1 h-5 w-5" />
              <span className="max-w-full truncate text-[10px] font-semibold tracking-wide">{tab.label}</span>
            </button>
          );
        })}
        <button
          onClick={toggleSidebar}
          className="phone-tap flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[#8a91a4] transition-all duration-300 hover:bg-white/5 hover:text-white"
        >
          <Menu className="mt-1 h-5 w-5" />
          <span className="max-w-full truncate text-[10px] font-semibold tracking-wide">More</span>
        </button>
      </nav>
    </div>
  );
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { avatar, name } = useApp();
  const init = name ? name.charAt(0).toUpperCase() : "U";

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        // If logged in but hasn't onboarded, redirect to the wizard
        if (!localStorage.getItem("aethel_has_onboarded")) {
          router.push("/onboarding");
        }
      }
    });
  }, [router]);

  return (
    <FocusProvider>
      <div 
        className="aethel-app-shell relative min-h-screen w-full overflow-hidden bg-[#070b14]"
        style={{
          backgroundImage: "url('/aethel-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark elegant overlay - matching the 40% opacity of the login screen for beautiful visibility */}
        <div className="absolute inset-0 bg-[#070b14]/40 pointer-events-none z-0" />

        <div className="relative z-10 flex min-h-screen w-full">
          <SidebarProvider>
            <AppSidebar />
            <main className="relative flex min-h-screen min-w-0 flex-1 flex-col overflow-hidden bg-transparent">
              
              {/* Top Navbar Area (Right Side) */}
              <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-[#1f2b3e]/45 bg-[#0b111f]/72 px-3 backdrop-blur-xl sm:h-16 sm:px-6 md:bg-[#0d1424]/40">
                <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
                  <SidebarTrigger className="phone-tap md:hidden" />
                  <button
                    onClick={() => router.back()}
                    className="phone-tap flex items-center gap-1.5 rounded-xl px-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Back</span>
                  </button>
                </div>

                <Link href="/dashboard" className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 md:hidden">
                  <img
                    src="/aethel-logo.png"
                    alt="Aethel Solutions"
                    className="h-8 w-8 object-contain drop-shadow-[0_4px_14px_rgba(201,168,76,0.24)]"
                  />
                  <div className="leading-none">
                    <p className="text-sm font-black tracking-[0.16em] text-[#c9a84c]">Aethel</p>
                    <p className="mt-0.5 text-[7px] font-bold uppercase tracking-[0.36em] text-[#c9a84c]/70">Solutions</p>
                  </div>
                </Link>
                
                <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
                  <button className="phone-tap relative rounded-xl p-2 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground" aria-label="Notifications are coming soon" title="Notifications are coming soon">
                    <Bell className="h-5 w-5" />
                  </button>
                  <div className="flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[#c9a84c]/20 bg-secondary shadow-[0_0_18px_rgba(201,168,76,0.06)] sm:h-9 sm:w-9">
                    {avatar ? (
                      <img src={avatar} alt={name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-sm font-medium">{init}</span>
                    )}
                  </div>
                </div>
              </header>

              <div className="safe-bottom-space flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 sm:px-4 sm:py-6 md:p-8 md:pb-8">{children}</div>
              <FloatingFocusBubble />
              <MobileBottomNav />
            </main>
          </SidebarProvider>
        </div>
      </div>
    </FocusProvider>
  );
}
