"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Bell, ArrowLeft } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { useRouter } from "next/navigation";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { avatar, name } = useApp();
  const init = name ? name.charAt(0).toUpperCase() : "U";

  useEffect(() => {
    // const supabase = createClient();
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   if (!session) {
    //     router.push("/login");
    //   }
    // });
    // Bypassed for UI preview
  }, [router]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-1 flex-col min-h-screen relative overflow-hidden bg-background">
        
        {/* Top Navbar Area (Right Side) */}
        <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border bg-background px-6">
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
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-primary" />
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

        <div className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
}
