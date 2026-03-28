"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BrainCircuit,
  Home,
  BookOpen,
  GraduationCap,
  Users,
  Settings,
  Library,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useApp } from "@/lib/app-context";
import { t } from "@/lib/i18n";

const navItems = [
  { titleKey: "nav.home",      href: "/dashboard", icon: Home },
  { titleKey: "nav.courses",   href: "/courses",   icon: BookOpen },
  { titleKey: "nav.learning",  href: "/learning",  icon: GraduationCap },
  { titleKey: "nav.studySpace", href: "/study-space", icon: Library },
  { titleKey: "nav.community", href: "/community",  icon: Users },
  { titleKey: "nav.myCourses", href: "/my-courses", icon: BookOpen },
  { titleKey: "nav.settings",  href: "/settings",  icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { lang } = useApp();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-4 py-4 border-b border-border h-16 flex items-center justify-center group-data-[collapsible=icon]:p-0">
        <Link href="/" className="flex items-center justify-center gap-2 group/logo w-full px-2 group-data-[collapsible=icon]:p-0">
          <span className="font-extrabold text-xs md:text-sm tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 group-hover/logo:from-teal-300 group-hover/logo:to-cyan-300 transition-all group-data-[collapsible=icon]:hidden drop-shadow-sm">
            THUMBNAIL
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/60 px-4">
            {t("nav.navigation", lang)}
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu className="gap-2">
              {navItems.map((item) => {
                const isActive = pathname?.startsWith(item.href) || (pathname === '/dashboard' && item.titleKey === 'nav.home');
                const title = t(item.titleKey, lang);
                return (
                  <SidebarMenuItem key={item.titleKey}>
                    <Link href={item.href} passHref legacyBehavior>
                      <SidebarMenuButton
                        tooltip={title}
                        isActive={isActive}
                        className={`transition-all duration-200 py-3 ${
                          isActive 
                            ? "bg-primary/10 text-primary font-medium border-l-2 border-primary group-data-[collapsible=icon]:border-l-0" 
                            : "text-muted-foreground hover:bg-secondary/50"
                        }`}
                      >
                        <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
                        <span className="text-sm group-data-[collapsible=icon]:hidden">{title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-4 group-data-[collapsible=icon]:hidden">
        <div className="glass rounded-lg p-3">
          <p className="text-xs font-medium text-primary">Pro Upgrade</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Unlock AI-powered feedback and advanced analytics.
          </p>
          <div className="mt-2.5 h-1.5 w-full rounded-full bg-muted">
            <div className="h-1.5 w-3/5 rounded-full bg-gradient-to-r from-primary to-blue-accent" />
          </div>
          <p className="mt-1.5 text-[10px] text-muted-foreground">
            3 of 5 free {t("billing.used", lang)}
          </p>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
