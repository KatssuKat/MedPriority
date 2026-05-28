import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Download, TrendingUp, TrendingDown, Users, Clock, Activity, AlertTriangle, FileBarChart } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Analytics · MedPriority" }] }),
});

const flowData = [38, 42, 51, 60, 72, 83, 91, 88, 76, 68, 59, 64, 71, 80, 74, 62, 55, 48, 42, 36, 33, 30, 28, 31];
const waitData = [12, 14, 16, 18, 22, 28, 31, 27, 22, 19, 17, 18, 20, 24, 21, 18, 16, 15, 14, 12, 11, 10, 11, 13];

function Admin() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Operational Analytics</h1>
            <p className="text-sm text-muted-foreground">Last 24 hours · St. Vincent's General · Emergency Department</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="h-10 px-3 rounded-lg border border-border bg-surface text-sm">
              <option>Last 24 hours</option><option>Last 7 days</option><option>Last 30 days</option><option>YTD</option>
            </select>
            <button className="h-10 px-4 rounded-lg border border-border bg-surface text-sm flex items-center gap-2"><FileBarChart className="size-4" /> Schedule report</button>
            <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2"><Download className="size-4" /> Export PDF</button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <BigKpi icon={Users} label="Patients attended" value="1,284" delta="+12.4%" up />
          <BigKpi icon={Clock} label="Avg waiting time" value="18.2m" delta="-3.1m" up />
          <BigKpi icon={Activity} label="ED saturation" value="78%" delta="+6%" tone="warn" />
          <BigKpi icon={AlertTriangle} label="Critical cases" value="42" delta="+3" tone="danger" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold">Patient flow vs. waiting time</h3>
                <p className="text-xs text-muted-foreground">Hourly · last 24h</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <Legend color="bg-primary" label="Arrivals" />
                <Legend color="bg-priority-high" label="Avg wait (min)" />
              </div>
            </div>
            <DualChart bars={flowData} line={waitData} />
          </div>

          <div className="col-span-12 lg:col-span-4 rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-semibold">Acuity distribution</h3>
            <p className="text-xs text-muted-foreground">By ESI level</p>
            <Donut />
            <ul className="mt-4 space-y-2 text-sm">
              {[
                ["L1 Resuscitation", "4%", "bg-priority-critical"],
                ["L2 Emergent", "16%", "bg-priority-high"],
                ["L3 Urgent", "38%", "bg-priority-medium"],
                ["L4 Less urgent", "28%", "bg-priority-low"],
                ["L5 Non-urgent", "14%", "bg-priority-minor"],
              ].map(([l, v, c]) => (
                <li key={l} className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-full ${c}`} />
                  <span className="flex-1">{l}</span>
                  <span className="font-mono text-muted-foreground">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Saturation + reports */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7 rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-semibold">Department saturation</h3>
            <p className="text-xs text-muted-foreground">Capacity utilization by zone</p>
            <div className="mt-5 space-y-4">
              {([
                ["Resuscitation", 95, "bg-priority-critical"],
                ["Trauma", 82, "bg-priority-high"],
                ["Acute care", 71, "bg-priority-medium"],
                ["Pediatrics", 48, "bg-priority-low"],
                ["Observation", 36, "bg-priority-minor"],
              ] as const).map(([n, v, c]) => (
                <div key={n}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{n}</span>
                    <span className="font-mono text-muted-foreground">{v}%</span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full ${c}`} style={{ width: `${v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Reports</h3>
              <button className="text-xs text-primary">View all</button>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {[
                ["Weekly Operations Summary", "Apr 28 — May 4", "PDF · 2.4 MB"],
                ["Triage Accuracy Audit", "Q2 2026", "XLSX · 812 KB"],
                ["Patient Flow Analysis", "Last 30 days", "PDF · 1.8 MB"],
                ["Critical Case Review", "May 2026", "PDF · 950 KB"],
              ].map(([t, d, s]) => (
                <li key={t} className="py-3 flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-muted flex items-center justify-center"><FileBarChart className="size-4 text-muted-foreground" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{t}</div>
                    <div className="text-xs text-muted-foreground">{d} · {s}</div>
                  </div>
                  <button className="size-9 rounded-lg border border-border bg-surface flex items-center justify-center hover:bg-muted">
                    <Download className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function BigKpi({ icon: Icon, label, value, delta, up, tone }: { icon: any; label: string; value: string; delta: string; up?: boolean; tone?: "warn" | "danger" }) {
  const accent = tone === "danger" ? "text-destructive" : tone === "warn" ? "text-priority-high" : "text-primary";
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
        <div className={`size-9 rounded-lg bg-muted/60 flex items-center justify-center ${accent}`}><Icon className="size-4" /></div>
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
      <div className={`mt-1 text-xs flex items-center gap-1 ${up ? "text-success" : "text-destructive"}`}>
        {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
        {delta} vs prev period
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return <div className="flex items-center gap-1.5"><span className={`size-2.5 rounded-sm ${color}`} />{label}</div>;
}

function DualChart({ bars, line }: { bars: number[]; line: number[] }) {
  const w = 720, h = 220, pad = 24;
  const maxB = Math.max(...bars), maxL = Math.max(...line);
  const bw = (w - pad * 2) / bars.length - 4;
  const linePts = line.map((v, i) => {
    const x = pad + i * ((w - pad * 2) / (line.length - 1));
    const y = h - pad - (v / maxL) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56">
      {[0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={pad} x2={w - pad} y1={h - pad - t * (h - pad * 2)} y2={h - pad - t * (h - pad * 2)} stroke="currentColor" className="text-border" strokeWidth={1} />
      ))}
      {bars.map((v, i) => {
        const x = pad + i * ((w - pad * 2) / bars.length);
        const bh = (v / maxB) * (h - pad * 2);
        return <rect key={i} x={x} y={h - pad - bh} width={bw} height={bh} rx={2} className="fill-primary/70" />;
      })}
      <polyline points={linePts} fill="none" className="stroke-priority-high" strokeWidth={2.5} />
      {line.map((v, i) => {
        const x = pad + i * ((w - pad * 2) / (line.length - 1));
        const y = h - pad - (v / maxL) * (h - pad * 2);
        return <circle key={i} cx={x} cy={y} r={2.5} className="fill-priority-high" />;
      })}
    </svg>
  );
}

function Donut() {
  const segs = [
    { v: 4, c: "var(--priority-critical)" },
    { v: 16, c: "var(--priority-high)" },
    { v: 38, c: "var(--priority-medium)" },
    { v: 28, c: "var(--priority-low)" },
    { v: 14, c: "var(--priority-minor)" },
  ];
  const C = 2 * Math.PI * 60;
  let acc = 0;
  return (
    <div className="relative mt-4 flex justify-center">
      <svg viewBox="0 0 160 160" className="size-44 -rotate-90">
        <circle cx="80" cy="80" r="60" stroke="var(--muted)" strokeWidth="20" fill="none" />
        {segs.map((s, i) => {
          const len = (s.v / 100) * C;
          const el = <circle key={i} cx="80" cy="80" r="60" stroke={s.c} strokeWidth="20" fill="none" strokeDasharray={`${len} ${C}`} strokeDashoffset={-acc} />;
          acc += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold">1,284</div>
        <div className="text-xs text-muted-foreground">total</div>
      </div>
    </div>
  );
}
