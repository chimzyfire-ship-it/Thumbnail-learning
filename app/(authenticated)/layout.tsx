"use client";

import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Bell, ArrowLeft, Home, BookOpen, Library, Users, Menu } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { useRouter, usePathname } from "next/navigation";
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
    <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden bg-[#0d1424]/85 backdrop-blur-xl border border-[#1f2b3e]/60 rounded-2xl p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <nav className="flex items-center justify-around px-1">
        {tabs.map((tab) => {
          const isActive = pathname?.startsWith(tab.href) || (pathname === "/dashboard" && tab.href === "/dashboard");
          const Icon = tab.icon;
          return (
            <button
              key={tab.label}
              onClick={() => router.push(tab.href)}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-[#c9a84c] bg-[#c9a84c]/10 scale-105"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
            </button>
          );
        })}
        <button
          onClick={toggleSidebar}
          className="flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl text-muted-foreground hover:text-white transition-all duration-200"
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px] font-medium tracking-wide">More</span>
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
        className="min-h-screen relative w-full overflow-hidden bg-[#070b14]"
        style={{
          backgroundImage: "url('/aethel-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Dark elegant overlay - matching the 40% opacity of the login screen for beautiful visibility */}
        <div className="absolute inset-0 bg-[#070b14]/40 pointer-events-none z-0" />

        <div className="relative z-10 flex min-h-screen w-full">
          <SidebarProvider>
            <AppSidebar />
            <main className="flex flex-1 flex-col min-h-screen relative overflow-hidden bg-transparent">
              
              {/* Top Navbar Area (Right Side) */}
              <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-[#1f2b3e]/40 bg-[#0d1424]/40 backdrop-blur-md px-4 sm:px-6">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="md:hidden" />
                  <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-secondary/50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Back</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-4">
                  <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Notifications are coming soon" title="Notifications are coming soon">
                    <Bell className="h-5 w-5" />
                  </button>
                  <div className="h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center cursor-pointer overflow-hidden">
                    {avatar ? (
                      <img src={avatar} alt={name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-sm font-medium">{init}</span>
                    )}
                  </div>
                </div>
              </header>

              <div className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">{children}</div>
              <FloatingFocusBubble />
              <MobileBottomNav />
            </main>
          </SidebarProvider>
        </div>
      </div>
    </FocusProvider>
  );
}

