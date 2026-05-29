"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  GraduationCap,
  Users,
  Settings,
  Library,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  LifeBuoy,
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
  useSidebar,
} from "@/components/ui/sidebar";
import { useApp } from "@/lib/app-context";
import { t } from "@/lib/i18n";
import { useProgress } from "@/lib/progress-context";

const navItems = [
  { titleKey: "nav.home",      href: "/dashboard", icon: Home },
  { titleKey: "nav.courses",   href: "/courses",   icon: BookOpen },
  { titleKey: "nav.learning",  href: "/learning",  icon: GraduationCap },
  { titleKey: "nav.studySpace", href: "/study-space", icon: Library },
  { titleKey: "nav.community", href: "/community",  icon: Users },
  { titleKey: "nav.myCourses", href: "/my-courses", icon: BookOpen },
  { titleKey: "nav.support",  href: "/support",   icon: LifeBuoy },
  { titleKey: "nav.settings",  href: "/settings",  icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { lang } = useApp();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { continueTopic } = useProgress();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-[linear-gradient(180deg,rgba(8,12,22,0.98)_0%,rgba(10,14,26,0.96)_100%)] shadow-[0_0_40px_rgba(0,0,0,0.22)]"
    >
      <SidebarHeader className="relative flex h-20 items-center justify-center border-b border-border px-4 py-3 sm:px-5 md:h-16 md:py-2 group-data-[collapsible=icon]:px-0">
        <Link
          href="/"
          className="group/logo flex w-full items-center gap-3 overflow-hidden px-1 transition-all duration-300 ease-out group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <img
            src="/aethel-logo.png"
            alt="Aethel Solutions"
            className="h-14 w-14 shrink-0 object-contain transition-all duration-300 ease-out group-hover/logo:scale-[1.03] md:h-11 md:w-11 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9"
            style={{ filter: "drop-shadow(0 4px 10px rgba(201,168,76,0.3))" }}
          />
          <div className="flex min-w-0 flex-col justify-center overflow-hidden leading-none transition-all duration-300 ease-out group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:translate-x-2 group-data-[collapsible=icon]:opacity-0">
            <span className="whitespace-nowrap text-xl font-extrabold tracking-[0.1em] text-[#c9a84c] md:text-lg">Aethel</span>
            <span className="mt-1 whitespace-nowrap text-[10px] uppercase tracking-[0.4em] text-[#c9a84c]/72 md:mt-0.5">Solutions</span>
          </div>
        </Link>

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand menu" : "Collapse menu"}
          title={isCollapsed ? "Expand menu" : "Collapse menu"}
          className="absolute -right-3 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#c9a84c]/25 bg-[#101727] text-[#c9a84c] shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out hover:scale-105 hover:border-[#c9a84c]/50 hover:bg-[#151d31] md:flex"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 transition-transform duration-300 ease-out" />
          ) : (
            <ChevronLeft className="h-4 w-4 transition-transform duration-300 ease-out" />
          )}
        </button>
      </SidebarHeader>

      <SidebarContent className="px-1 md:px-0">
        {/* ─── Continue Learning Quick-Access ─── */}
        {continueTopic && (
          <div className="px-3 pb-2 pt-4 group-data-[collapsible=icon]:px-1">
            <Link
              href={`/learn/${continueTopic.id}`}
              title={`Continue: ${continueTopic.title}`}
              className="phone-tap flex w-full items-center gap-3 rounded-2xl border border-[#c9a84c]/30 bg-gradient-to-r from-[#c9a84c]/20 to-[#c9a84c]/5 px-3 py-3 text-[#c9a84c] transition-all duration-200 hover:border-[#c9a84c]/50 hover:from-[#c9a84c]/30 md:rounded-xl md:py-2.5 group/continue"
            >
              <PlayCircle className="h-5 w-5 shrink-0 animate-pulse md:h-4 md:w-4" />
              <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#c9a84c]/70 leading-none mb-0.5">Continue</span>
                <span className="text-xs font-semibold text-[#c9a84c] truncate leading-tight">{continueTopic.title}</span>
              </div>
            </Link>
          </div>
        )}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground/60">
            {t("nav.navigation", lang)}
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-3 md:mt-4">
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
                        className={`phone-tap relative overflow-hidden rounded-2xl px-3.5 py-3.5 transition-all duration-300 md:rounded-xl md:px-3 md:py-3 ${
                          isActive 
                            ? "bg-[linear-gradient(135deg,rgba(201,168,76,0.16)_0%,rgba(201,168,76,0.06)_100%)] text-primary font-medium shadow-[inset_0_0_0_1px_rgba(201,168,76,0.16)] group-data-[collapsible=icon]:shadow-[inset_0_0_0_1px_rgba(201,168,76,0.22)]" 
                            : "text-muted-foreground hover:bg-white/4 hover:text-foreground"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary group-data-[collapsible=icon]:hidden" />
                        )}
                        <item.icon className={`h-5 w-5 shrink-0 transition-transform duration-300 md:h-4 md:w-4 ${isActive ? "text-primary" : ""}`} />
                        <span className="text-[15px] transition-all duration-300 md:text-sm group-data-[collapsible=icon]:hidden">{title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-4 transition-all duration-300 group-data-[collapsible=icon]:hidden">
        <Link href="/support" className="glass block rounded-lg p-3 transition-colors hover:border-[#c9a84c]/30">
          <p className="text-xs font-medium text-primary">Need help?</p>
          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
            Contact Aethel support for account, lesson, or upload issues.
          </p>
        </Link>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
