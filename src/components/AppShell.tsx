import { Link, useLocation } from "@tanstack/react-router";
import { Activity, LayoutDashboard, Stethoscope, Tablet, BarChart3, Bell, Search } from "lucide-react";
import { ReactNode } from "react";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/kiosk", label: "Patient Kiosk", icon: Tablet },
  { to: "/triage", label: "Triage", icon: Stethoscope },
  { to: "/er", label: "ER Dashboard", icon: Activity },
  { to: "/admin", label: "Analytics", icon: BarChart3 },
];

export function AppShell({ children, dense = false }: { children: ReactNode; dense?: boolean }) {
  const loc = useLocation();
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
        <div className="px-6 py-6 flex items-center gap-3 border-b border-sidebar-border">
          <div className="size-9 rounded-xl bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground">
            <Activity className="size-5" />
          </div>
          <div>
            <div className="font-display text-lg font-semibold tracking-tight">MedPriority</div>
            <div className="text-[11px] uppercase tracking-widest text-sidebar-foreground/60">Triage AI</div>
          </div>
        </div>
        <nav className="p-3 flex-1 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = loc.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="size-4" />
                {label}
                {active && <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="rounded-xl bg-sidebar-accent/40 p-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="size-2 rounded-full bg-success pulse-dot" />
              System operational
            </div>
            <div className="mt-1 text-[11px] text-sidebar-foreground/60">All AI models nominal · v4.2.1</div>
          </div>
        </div>
      </aside>
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-border bg-surface/60 backdrop-blur sticky top-0 z-20 flex items-center px-6 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search patients, MRN, beds…"
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-muted/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-success" /> St. Vincent's General · Bay Area
            </div>
            <button className="relative size-10 rounded-lg border border-border bg-surface hover:bg-muted flex items-center justify-center">
              <Bell className="size-4" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-destructive" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-border">
              <div className="size-9 rounded-full bg-gradient-to-br from-primary to-info text-primary-foreground flex items-center justify-center text-xs font-semibold">DR</div>
              <div className="text-xs leading-tight">
                <div className="font-medium">Dr. Reyes</div>
                <div className="text-muted-foreground">Charge Nurse</div>
              </div>
            </div>
          </div>
        </header>
        <div className={dense ? "" : "p-6"}>{children}</div>
      </main>
    </div>
  );
}
