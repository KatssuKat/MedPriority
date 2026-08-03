import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Clock,
  Download,
  FileBarChart,
  type LucideIcon,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/AppShell";
import { SimulationDialog } from "@/components/SimulationDialog";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

const flowData = [
  38, 42, 51, 60, 72, 83, 91, 88, 76, 68, 59, 64, 71, 80, 74, 62, 55, 48, 42, 36, 33, 30, 28, 31,
];
const waitData = [
  12, 14, 16, 18, 22, 28, 31, 27, 22, 19, 17, 18, 20, 24, 21, 18, 16, 15, 14, 12, 11, 10, 11, 13,
];

function Admin() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState("day");
  const [periodChanged, setPeriodChanged] = useState(false);
  const [simulation, setSimulation] = useState<string | null>(null);
  const [result, setResult] = useState(false);
  const levels = [1, 2, 3, 4, 5] as const;
  const reports = ["weekly", "accuracy", "flow", "critical"];
  const zones = [
    ["resuscitation", 95, "bg-priority-critical"],
    ["trauma", 82, "bg-priority-high"],
    ["acute", 71, "bg-priority-medium"],
    ["pediatrics", 48, "bg-priority-low"],
    ["observation", 36, "bg-priority-minor"],
  ] as const;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{t("admin:title")}</h1>
            <p className="text-sm text-muted-foreground">{t("admin:subtitle")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="period">
              {t("admin:period")}
            </label>
            <select
              id="period"
              value={period}
              onChange={(event) => {
                setPeriod(event.target.value);
                setPeriodChanged(true);
              }}
              className="h-11 rounded-lg border border-border bg-surface px-3 text-sm"
            >
              <option value="day">{t("admin:periods.day")}</option>
              <option value="week">{t("admin:periods.week")}</option>
              <option value="month">{t("admin:periods.month")}</option>
              <option value="ytd">{t("admin:periods.ytd")}</option>
            </select>
            <button
              onClick={() => setSimulation(t("admin:schedule"))}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm"
            >
              <FileBarChart className="size-4" aria-hidden="true" />
              {t("admin:schedule")}
            </button>
            <button
              onClick={() => setSimulation(t("admin:export"))}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              <Download className="size-4" aria-hidden="true" />
              {t("admin:export")}
            </button>
          </div>
        </div>
        {periodChanged && (
          <p className="text-sm text-muted-foreground" role="status">
            {t("admin:periodSelected", { period: t(`admin:periods.${period}`) })}
          </p>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BigKpi
            icon={Users}
            label={t("admin:kpis.attended")}
            value="1,284"
            delta="+12.4%"
            positive
          />
          <BigKpi
            icon={Clock}
            label={t("admin:kpis.wait")}
            value="18.2 min"
            delta="-3.1 min"
            positive
          />
          <BigKpi icon={Activity} label={t("admin:kpis.saturation")} value="78%" delta="+6%" />
          <BigKpi icon={AlertTriangle} label={t("admin:kpis.critical")} value="42" delta="+3" />
        </div>
        <div className="grid grid-cols-12 gap-6">
          <section className="col-span-12 rounded-2xl border border-border bg-surface p-6 lg:col-span-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold">{t("admin:flow")}</h2>
                <p className="text-xs text-muted-foreground">{t("admin:flowDescription")}</p>
              </div>
              <div className="flex gap-4 text-xs">
                <Legend color="bg-primary" label={t("admin:arrivals")} />
                <Legend color="bg-priority-high" label={t("admin:averageWait")} />
              </div>
            </div>
            <DualChart bars={flowData} line={waitData} description={t("admin:flow")} />
          </section>
          <section className="col-span-12 rounded-2xl border border-border bg-surface p-6 lg:col-span-4">
            <h2 className="font-semibold">{t("admin:acuity")}</h2>
            <p className="text-xs text-muted-foreground">{t("admin:byEsi")}</p>
            <Donut label={t("admin:total")} />
            <ul className="mt-4 space-y-2 text-sm">
              {levels.map((level) => (
                <li key={level} className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-primary" aria-hidden="true" />
                  <span className="flex-1">
                    L{level} {t(`common:esi.${level}`)}
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {[4, 16, 38, 28, 14][level - 1]}%
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <section className="col-span-12 rounded-2xl border border-border bg-surface p-6 lg:col-span-7">
            <h2 className="font-semibold">{t("admin:saturation")}</h2>
            <p className="text-xs text-muted-foreground">{t("admin:byZone")}</p>
            <div className="mt-5 space-y-4">
              {zones.map(([zone, value, color]) => (
                <div key={zone}>
                  <div className="flex justify-between text-sm">
                    <span>{t(`common:zones.${zone}`)}</span>
                    <span className="font-mono text-muted-foreground">{value}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      role="progressbar"
                      aria-label={t("admin:zoneSaturation", {
                        zone: t(`common:zones.${zone}`),
                      })}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={value}
                      className={`h-full border-r border-foreground/40 ${color}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="col-span-12 rounded-2xl border border-border bg-surface p-6 lg:col-span-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{t("admin:reports")}</h2>
              <button
                onClick={() => setSimulation(t("admin:viewAll"))}
                className="text-xs text-primary"
              >
                {t("admin:viewAll")}
              </button>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {reports.map((report) => (
                <li key={report} className="flex items-center gap-3 py-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                    <FileBarChart className="size-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {t(`admin:reportNames.${report}`)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("common:synthetic")} · PDF
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setSimulation(
                        t("admin:downloadReport", { report: t(`admin:reportNames.${report}`) }),
                      )
                    }
                    aria-label={t("admin:downloadReport", {
                      report: t(`admin:reportNames.${report}`),
                    })}
                    className="flex size-11 items-center justify-center rounded-lg border border-border bg-surface"
                  >
                    <Download className="size-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
        {result && (
          <p role="status" className="text-sm text-success">
            {t("common:simulation.complete")}
          </p>
        )}
      </div>
      <SimulationDialog
        action={simulation}
        onClose={() => setSimulation(null)}
        onConfirm={() => {
          setSimulation(null);
          setResult(true);
        }}
      />
    </AppShell>
  );
}

function BigKpi({
  icon: Icon,
  label,
  value,
  delta,
  positive = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <Icon className="size-4 text-primary" aria-hidden="true" />
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
      <div
        className={`mt-1 flex items-center gap-1 text-xs ${positive ? "text-success" : "text-destructive"}`}
      >
        {positive ? (
          <TrendingUp className="size-3" aria-hidden="true" />
        ) : (
          <TrendingDown className="size-3" aria-hidden="true" />
        )}
        {delta} {t("admin:versus")}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{t("common:synthetic")}</div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`size-2.5 rounded-sm ${color}`} aria-hidden="true" />
      {label}
    </div>
  );
}

function DualChart({
  bars,
  line,
  description,
}: {
  bars: number[];
  line: number[];
  description: string;
}) {
  const { t } = useTranslation();
  const w = 720,
    h = 220,
    pad = 24,
    maxB = Math.max(...bars),
    maxL = Math.max(...line);
  const width = (w - pad * 2) / bars.length - 4;
  const points = line
    .map(
      (value, index) =>
        `${pad + index * ((w - pad * 2) / (line.length - 1))},${h - pad - (value / maxL) * (h - pad * 2)}`,
    )
    .join(" ");
  return (
    <figure>
      <figcaption className="sr-only">{description}</figcaption>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-56 w-full" aria-hidden="true">
        {bars.map((value, index) => {
          const height = (value / maxB) * (h - pad * 2);
          return (
            <rect
              key={index}
              x={pad + index * ((w - pad * 2) / bars.length)}
              y={h - pad - height}
              width={width}
              height={height}
              rx={2}
              className="fill-primary/70"
            />
          );
        })}
        <polyline points={points} fill="none" className="stroke-foreground" strokeWidth={2.5} />
      </svg>
      <div className="sr-only">
        <table>
          <caption>{t("admin:chartTable")}</caption>
          <thead>
            <tr>
              <th scope="col">{t("admin:hour")}</th>
              <th scope="col">{t("admin:arrivals")}</th>
              <th scope="col">{t("admin:averageWait")}</th>
            </tr>
          </thead>
          <tbody>
            {bars.map((value, index) => (
              <tr key={`${index}-${value}`}>
                <th scope="row">{`${String(index).padStart(2, "0")}:00`}</th>
                <td>{value}</td>
                <td>{line[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

function Donut({ label }: { label: string }) {
  return (
    <div className="relative mt-4 flex justify-center">
      <svg viewBox="0 0 160 160" className="size-44 -rotate-90" aria-hidden="true">
        <circle cx="80" cy="80" r="60" stroke="var(--muted)" strokeWidth="20" fill="none" />
        <circle
          cx="80"
          cy="80"
          r="60"
          stroke="var(--primary)"
          strokeWidth="20"
          fill="none"
          strokeDasharray="226 377"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold">1,284</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
