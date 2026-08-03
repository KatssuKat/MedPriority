import { Link, useLocation } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Bell,
  LayoutDashboard,
  Menu,
  Search,
  Stethoscope,
  Tablet,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/i18n/LanguageSelector";
import { DemoNotice } from "./DemoNotice";
import { SimulationDialog } from "./SimulationDialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";

const nav = [
  { to: "/", label: "overview", icon: LayoutDashboard },
  { to: "/kiosk", label: "kiosk", icon: Tablet },
  { to: "/triage", label: "triage", icon: Stethoscope },
  { to: "/er", label: "er", icon: Activity },
  { to: "/admin", label: "admin", icon: BarChart3 },
];

export function AppShell({ children, dense = false }: { children: ReactNode; dense?: boolean }) {
  const loc = useLocation();
  const { t } = useTranslation();
  const [simulation, setSimulation] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [result, setResult] = useState(false);
  return (
    <div id="app-shell" className="min-h-screen flex">
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[60] rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only"
      >
        {t("common:shell.skipToContent")}
      </a>
      <aside
        aria-label={t("common:shell.navigation")}
        className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex"
      >
        <div className="px-6 py-6 flex items-center gap-3 border-b border-sidebar-border">
          <div className="size-9 rounded-xl bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground">
            <Activity className="size-5" aria-hidden="true" />
          </div>
          <div>
            <div className="font-display text-lg font-semibold tracking-tight">MedPriority</div>
            <div className="text-[11px] uppercase tracking-widest text-sidebar-foreground/60">
              {t("common:shell.subtitle")}
            </div>
          </div>
        </div>
        <Navigation pathname={loc.pathname} />
        <div className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/70">
          {t("common:synthetic")}
        </div>
      </aside>
      <main id="main-content" tabIndex={-1} className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex min-h-16 items-center gap-3 border-b border-border bg-surface/60 px-4 backdrop-blur sm:px-6">
          <button
            aria-label={t("common:shell.menu")}
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-ring lg:hidden"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
          <div className="relative hidden min-w-0 max-w-md flex-1 sm:block">
            <Search
              className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              aria-label={t("common:shell.search")}
              disabled
              placeholder={t("common:shell.search")}
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed"
            />
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-priority-medium" aria-hidden="true" />{" "}
              {t("common:shell.hospital")}
            </div>
            <LanguageSelector compact />
            <button
              aria-label={t("common:shell.notifications")}
              className="relative size-11 rounded-lg border border-border bg-surface hover:bg-muted flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring"
              onClick={() => setSimulation(t("common:shell.notifications"))}
            >
              <Bell className="size-4" aria-hidden="true" />
            </button>
            <div className="hidden items-center gap-2 border-l border-border pl-3 sm:flex">
              <div
                aria-hidden="true"
                className="size-9 rounded-full bg-gradient-to-br from-primary to-info text-primary-foreground flex items-center justify-center text-xs font-semibold"
              >
                DM
              </div>
              <div className="text-xs leading-tight">
                <div className="font-medium">{t("common:shell.user")}</div>
                <div className="text-muted-foreground">{t("common:shell.role")}</div>
              </div>
            </div>
          </div>
        </header>
        <DemoNotice />
        {result && (
          <div className="px-6 py-2 text-sm text-success" role="status">
            {t("common:simulation.complete")}
          </div>
        )}
        <div className={dense ? "" : "p-4 sm:p-6"}>{children}</div>
      </main>
      <SimulationDialog
        action={simulation}
        onClose={() => setSimulation(null)}
        onConfirm={() => {
          setSimulation(null);
          setResult(true);
        }}
      />
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent
          side="left"
          closeLabel={t("common:actions.close")}
          className="w-[min(20rem,85vw)] bg-sidebar p-0 text-sidebar-foreground"
        >
          <SheetHeader className="border-b border-sidebar-border px-6 py-6 text-left">
            <SheetTitle className="pr-10 text-sidebar-foreground">
              {t("common:shell.navigation")}
            </SheetTitle>
            <SheetDescription className="text-xs uppercase tracking-widest text-sidebar-foreground/60">
              MedPriority · {t("common:shell.subtitle")}
            </SheetDescription>
          </SheetHeader>
          <Navigation pathname={loc.pathname} onNavigate={() => setMobileNavOpen(false)} />
          <div className="border-t border-sidebar-border p-4 text-xs text-sidebar-foreground/70">
            {t("common:synthetic")}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Navigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const { t } = useTranslation();
  return (
    <nav aria-label={t("common:shell.navigation")} className="flex-1 space-y-1 p-3">
      {nav.map(({ to, label, icon: Icon }) => {
        const active = pathname === to || (to === "/triage" && pathname.startsWith("/triage/"));
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sidebar-ring ${
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            }`}
          >
            <Icon className="size-4" aria-hidden="true" />
            {t(`common:nav.${label}`)}
            {active && <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary" />}
          </Link>
        );
      })}
    </nav>
  );
}
