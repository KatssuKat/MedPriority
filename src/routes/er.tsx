import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Filter, AlertTriangle, Clock, BedDouble, Activity, Users } from "lucide-react";

export const Route = createFileRoute("/er")({
  component: ER,
  head: () => ({ meta: [{ title: "ER Dashboard · MedPriority" }] }),
});

type Patient = {
  id: string; name: string; age: number; sex: "M" | "F"; complaint: string;
  level: 1 | 2 | 3 | 4 | 5; status: "Waiting" | "In treatment" | "Critical" | "Imaging" | "Discharging";
  wait: string; bay: string; arrived: string;
};

const patients: Patient[] = [
  { id: "P-1041", name: "Maria González", age: 58, sex: "F", complaint: "Chest pain, dyspnea", level: 2, status: "Critical", wait: "0 min", bay: "R-1", arrived: "14:22" },
  { id: "P-1042", name: "James O'Connor", age: 71, sex: "M", complaint: "Stroke symptoms (FAST+)", level: 1, status: "Critical", wait: "0 min", bay: "R-2", arrived: "14:18" },
  { id: "P-1043", name: "Aiko Tanaka", age: 34, sex: "F", complaint: "Severe abdominal pain", level: 2, status: "In treatment", wait: "8 min", bay: "T-4", arrived: "14:05" },
  { id: "P-1044", name: "Daniel Smith", age: 22, sex: "M", complaint: "Lacerated forearm", level: 3, status: "Imaging", wait: "14 min", bay: "T-7", arrived: "13:58" },
  { id: "P-1045", name: "Fatima Al-Hasan", age: 67, sex: "F", complaint: "Shortness of breath", level: 2, status: "In treatment", wait: "5 min", bay: "T-2", arrived: "13:55" },
  { id: "P-1046", name: "Carlos Mendes", age: 45, sex: "M", complaint: "Fever, chills, cough", level: 4, status: "Waiting", wait: "32 min", bay: "—", arrived: "13:48" },
  { id: "P-1047", name: "Hannah Lee", age: 9, sex: "F", complaint: "Asthma exacerbation", level: 3, status: "In treatment", wait: "2 min", bay: "P-1", arrived: "13:42" },
  { id: "P-1048", name: "Robert Klein", age: 60, sex: "M", complaint: "Knee injury", level: 4, status: "Waiting", wait: "41 min", bay: "—", arrived: "13:30" },
  { id: "P-1049", name: "Sofia Rivera", age: 28, sex: "F", complaint: "Migraine", level: 5, status: "Waiting", wait: "58 min", bay: "—", arrived: "13:18" },
  { id: "P-1050", name: "Ethan Walker", age: 51, sex: "M", complaint: "Post-op check", level: 5, status: "Discharging", wait: "—", bay: "T-9", arrived: "12:55" },
];

const LEVEL_META: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: "Resuscitation", color: "text-white", bg: "bg-priority-critical" },
  2: { label: "Emergent", color: "text-white", bg: "bg-priority-high" },
  3: { label: "Urgent", color: "text-foreground", bg: "bg-priority-medium" },
  4: { label: "Less urgent", color: "text-white", bg: "bg-priority-low" },
  5: { label: "Non-urgent", color: "text-white", bg: "bg-priority-minor" },
};

function ER() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Emergency Department · Live Board</h1>
            <p className="text-sm text-muted-foreground">Sorted by acuity · auto-refresh every 5s</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 h-10 px-3 rounded-lg border border-border bg-surface text-sm">
              <Filter className="size-4 text-muted-foreground" />
              <select className="bg-transparent focus:outline-none text-sm"><option>All zones</option><option>Resus</option><option>Trauma</option><option>Pediatrics</option></select>
            </div>
            <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium">+ Add patient</button>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Kpi icon={Users} label="In ED" value="47" />
          <Kpi icon={AlertTriangle} label="Critical" value="3" tone="critical" />
          <Kpi icon={Clock} label="Avg wait" value="18m" />
          <Kpi icon={BedDouble} label="Beds free" value="6 / 32" />
          <Kpi icon={Activity} label="Saturation" value="78%" tone="high" />
        </div>

        {/* Critical strip */}
        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 flex items-center gap-4">
          <div className="size-10 rounded-xl bg-destructive/15 text-destructive flex items-center justify-center">
            <AlertTriangle className="size-5" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-destructive">2 critical alerts</div>
            <div className="text-sm text-muted-foreground">James O'Connor (FAST+ stroke) · Maria González (suspected ACS) — both require immediate physician attention.</div>
          </div>
          <button className="h-10 px-4 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold">Acknowledge</button>
        </div>

        {/* Patient table */}
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Priority</th>
                <th className="text-left px-4 py-3">Patient</th>
                <th className="text-left px-4 py-3">Chief complaint</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Wait</th>
                <th className="text-left px-4 py-3">Bay</th>
                <th className="text-left px-4 py-3">Arrived</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => {
                const meta = LEVEL_META[p.level];
                const critical = p.status === "Critical";
                return (
                  <tr key={p.id} className={`border-t border-border hover:bg-muted/30 ${critical ? "bg-destructive/[0.04]" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`size-9 rounded-lg ${meta.bg} ${meta.color} flex items-center justify-center font-bold`}>{p.level}</div>
                        <div className="text-xs">
                          <div className="font-medium">L{p.level}</div>
                          <div className="text-muted-foreground">{meta.label}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium flex items-center gap-2">
                        {p.name}
                        {critical && <span className="size-2 rounded-full bg-destructive pulse-dot" />}
                      </div>
                      <div className="text-xs text-muted-foreground">{p.id} · {p.age}{p.sex}</div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">{p.complaint}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={p.status} />
                    </td>
                    <td className={`px-4 py-3 font-mono ${parseInt(p.wait) > 30 ? "text-priority-high font-semibold" : ""}`}>{p.wait}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{p.bay}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.arrived}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-primary text-xs font-medium">Open</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

function Kpi({ icon: Icon, label, value, tone }: { icon: any; label: string; value: string; tone?: "critical" | "high" }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {label}
        <Icon className={`size-4 ${tone === "critical" ? "text-destructive" : tone === "high" ? "text-priority-high" : "text-primary"}`} />
      </div>
      <div className={`mt-2 text-2xl font-semibold ${tone === "critical" ? "text-destructive" : ""}`}>{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Waiting": "bg-muted text-muted-foreground",
    "In treatment": "bg-info/15 text-info border border-info/30",
    "Critical": "bg-destructive/15 text-destructive border border-destructive/30",
    "Imaging": "bg-accent text-accent-foreground",
    "Discharging": "bg-success/15 text-success border border-success/30",
  };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${map[status]}`}>{status}</span>;
}
