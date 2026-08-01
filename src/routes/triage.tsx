import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Brain,
  ChevronRight,
  Droplet,
  FileText,
  Heart,
  type LucideIcon,
  Pencil,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Wind,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/triage")({
  component: Triage,
  head: () => ({ meta: [{ title: "Clinical Triage · MedPriority" }] }),
});

function Triage() {
  return (
    <AppShell>
      <div className="grid grid-cols-12 gap-6">
        {/* Patient header */}
        <section className="col-span-12 rounded-2xl border border-border bg-surface p-6 flex items-center gap-6">
          <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-info text-primary-foreground flex items-center justify-center text-xl font-semibold">
            MG
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">Maria González</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                MRN 00482-119
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                F · 58 yrs
              </span>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Arrived 14:22 · Walk-in · Bay W-3 · Allergies:{" "}
              <span className="text-foreground font-medium">Penicillin</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-10 px-4 rounded-lg border border-border bg-surface text-sm flex items-center gap-2">
              <FileText className="size-4" /> History
            </button>
            <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="size-4" /> Validate priority
            </button>
          </div>
        </section>

        {/* Vitals */}
        <section className="col-span-12 lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Vital signs</h2>
              <span className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-success pulse-dot" /> Live · 14:38:02
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Vital icon={Heart} label="Heart rate" value="118" unit="bpm" tone="high" trend="↑" />
              <Vital
                icon={Activity}
                label="Blood pressure"
                value="156/98"
                unit="mmHg"
                tone="high"
              />
              <Vital icon={Wind} label="Respiratory" value="24" unit="rpm" tone="medium" />
              <Vital icon={Droplet} label="SpO₂" value="93" unit="%" tone="medium" />
              <Vital icon={Thermometer} label="Temp" value="37.2" unit="°C" tone="low" />
              <Vital icon={Brain} label="GCS" value="15" unit="/15" tone="low" />
            </div>
            <div className="mt-5 rounded-xl bg-muted/40 border border-border p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Cardiac rhythm · Lead II
              </div>
              <svg viewBox="0 0 600 80" className="w-full h-16">
                <path
                  className="ecg-line"
                  d="M0 40 L60 40 L72 40 L78 20 L84 60 L90 10 L96 70 L102 40 L160 40 L172 40 L178 28 L184 52 L190 40 L260 40 L272 40 L278 20 L284 60 L290 10 L296 70 L302 40 L360 40 L372 40 L378 28 L384 52 L390 40 L460 40 L472 40 L478 20 L484 60 L490 10 L496 70 L502 40 L600 40"
                />
              </svg>
            </div>
          </div>

          {/* AI suggestion */}
          <div className="rounded-2xl border border-priority-high/40 bg-gradient-to-br from-priority-high/10 via-surface to-surface p-6">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-xl bg-priority-high/15 text-priority-high flex items-center justify-center">
                <Sparkles className="size-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <span>AI Triage Recommendation</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface border border-border">
                    Confidence 94%
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-3">
                  <div className="text-3xl font-semibold">ESI Level 2</div>
                  <span className="text-sm font-medium text-priority-high">High priority</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                  Suspected acute coronary syndrome based on chest pain radiating to left arm,
                  tachycardia (HR 118), borderline SpO₂ (93%), and reported dyspnea. Recommend
                  immediate ECG, troponin, and physician evaluation within 10 minutes.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "Chest pain · radiating",
                    "HR > 110",
                    "SpO₂ < 94%",
                    "Age > 50",
                    "Hypertension hx",
                  ].map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-full bg-surface border border-border text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2">
              <button className="h-10 px-4 rounded-lg bg-priority-high text-white text-sm font-medium flex items-center gap-2">
                <ShieldCheck className="size-4" /> Accept Level 2
              </button>
              <button className="h-10 px-4 rounded-lg border border-border bg-surface text-sm flex items-center gap-2">
                <Pencil className="size-4" /> Override
              </button>
              <button className="h-10 px-4 rounded-lg border border-border bg-surface text-sm">
                View clinical reasoning
              </button>
            </div>
          </div>
        </section>

        {/* Side column */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-5">
            <div className="flex items-center gap-2 text-destructive font-semibold">
              <AlertTriangle className="size-5" /> Critical alert
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Vitals trend matches early-warning protocol. Notify on-call cardiology and prepare
              resuscitation Bay R-1.
            </p>
            <button className="mt-3 h-10 w-full rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold">
              Trigger Code Blue
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="font-semibold">Patient summary</h3>
            <dl className="mt-3 text-sm divide-y divide-border">
              {[
                ["Chief complaint", "Chest pain, dyspnea"],
                ["Onset", "~3 hours"],
                ["Pain", "8 / 10"],
                ["Allergies", "Penicillin"],
                ["Medications", "Lisinopril 10mg"],
                ["Last meal", "08:30"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Recent visits</h3>
              <button className="text-xs text-primary">Open chart</button>
            </div>
            <ul className="mt-3 space-y-3">
              {[
                ["Mar 12, 2025", "Hypertension follow-up", "Discharged"],
                ["Nov 04, 2024", "Migraine, ED visit", "Discharged"],
                ["Aug 21, 2024", "Annual physical", "Routine"],
              ].map(([d, t, s]) => (
                <li key={d} className="flex items-center gap-3 text-sm">
                  <div className="size-9 rounded-lg bg-muted flex items-center justify-center">
                    <FileText className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{t}</div>
                    <div className="text-xs text-muted-foreground">
                      {d} · {s}
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Vital({
  icon: Icon,
  label,
  value,
  unit,
  tone,
  trend,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  unit: string;
  tone: "low" | "medium" | "high";
  trend?: string;
}) {
  const toneClass =
    tone === "high"
      ? "text-priority-high border-priority-high/40 bg-priority-high/10"
      : tone === "medium"
        ? "text-priority-medium border-priority-medium/40 bg-priority-medium/10"
        : "text-success border-success/30 bg-success/10";
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Icon className="size-4" /> {label}
        </div>
        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${toneClass}`}>
          {tone.toUpperCase()}
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-2xl font-semibold">{value}</div>
        <div className="text-xs text-muted-foreground">{unit}</div>
        {trend && <div className="ml-auto text-priority-high text-sm">{trend}</div>}
      </div>
    </div>
  );
}
