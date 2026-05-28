import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Activity, Tablet, Stethoscope, BarChart3, ArrowUpRight, HeartPulse, ShieldAlert, Timer } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Overview,
  head: () => ({
    meta: [
      { title: "MedPriority — Intelligent Hospital Triage" },
      { name: "description", content: "AI-assisted triage, ER monitoring and analytics for modern hospitals." },
    ],
  }),
});

const screens = [
  { to: "/kiosk", title: "Patient Kiosk", desc: "Self check-in, voice symptoms, accessible flow.", icon: Tablet, tone: "from-info/20 to-primary/10" },
  { to: "/triage", title: "Clinical Triage", desc: "AI-suggested ESI level with vitals & history.", icon: Stethoscope, tone: "from-accent to-primary/10" },
  { to: "/er", title: "ER Dashboard", desc: "Live patient board, severity sorting, alerts.", icon: Activity, tone: "from-priority-high/15 to-priority-critical/10" },
  { to: "/admin", title: "Analytics", desc: "Saturation, KPIs, downloadable reports.", icon: BarChart3, tone: "from-success/15 to-info/10" },
];

const stats = [
  { label: "Patients in ER", value: "47", delta: "+6", icon: HeartPulse },
  { label: "Avg. wait", value: "18m", delta: "-3m", icon: Timer },
  { label: "Critical", value: "3", delta: "live", icon: ShieldAlert, danger: true },
  { label: "AI accuracy (24h)", value: "96.4%", delta: "+0.8", icon: Activity },
];

function Overview() {
  return (
    <AppShell>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-surface to-accent p-8">
          <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(circle_at_30%_20%,black,transparent_70%)]" />
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-surface border border-border text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success" /> Live · Emergency Department
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">Triage decisions, accelerated by clinical AI.</h1>
            <p className="mt-3 text-muted-foreground max-w-xl">
              MedPriority unifies patient intake, ESI classification, and ER orchestration into one calm, defensible workflow — so the right patient is always seen first.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/triage" className="inline-flex items-center gap-2 px-4 h-11 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-95">
                Open clinical triage <ArrowUpRight className="size-4" />
              </Link>
              <Link to="/er" className="inline-flex items-center gap-2 px-4 h-11 rounded-lg border border-border bg-surface text-sm font-medium hover:bg-muted">
                View ER board
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
                <s.icon className={`size-4 ${s.danger ? "text-destructive" : "text-primary"}`} />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <div className="text-3xl font-semibold tracking-tight">{s.value}</div>
                <div className={`text-xs ${s.danger ? "text-destructive" : "text-success"}`}>{s.delta}</div>
              </div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {screens.map((s) => (
            <Link key={s.to} to={s.to} className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${s.tone} p-6 hover:border-primary/40 transition-colors`}>
              <div className="flex items-start justify-between">
                <div className="size-11 rounded-xl bg-surface flex items-center justify-center border border-border">
                  <s.icon className="size-5 text-primary" />
                </div>
                <ArrowUpRight className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <div className="mt-6">
                <div className="text-lg font-semibold">{s.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.desc}</div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
