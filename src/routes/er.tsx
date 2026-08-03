import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  BedDouble,
  Clock,
  Filter,
  type LucideIcon,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/AppShell";
import { SimulationDialog } from "@/components/SimulationDialog";
import { useDemoData } from "@/demo/DemoDataProvider";
import type { DemoPatient, PatientStatus, ZoneCode } from "@/demo/domain";
import { filterAndSortPatients, getErMetrics } from "@/demo/selectors";
import type { Locale } from "@/i18n/config";
import { formatMinutes, formatPercent, formatTime } from "@/i18n/format";

export const Route = createFileRoute("/er")({
  component: ER,
});

const levelStyles: Record<DemoPatient["level"], { color: string; bg: string }> = {
  1: { color: "text-white", bg: "bg-priority-critical" },
  2: { color: "text-foreground", bg: "bg-priority-high" },
  3: { color: "text-foreground", bg: "bg-priority-medium" },
  4: { color: "text-foreground", bg: "bg-priority-low" },
  5: { color: "text-foreground", bg: "bg-priority-minor" },
};

function ER() {
  const { t, i18n } = useTranslation();
  const {
    patients,
    activeAlerts,
    addSamplePatient,
    acknowledgeAlerts,
    dataStatus,
    hydrated,
    resetPatients,
  } = useDemoData();
  const [zone, setZone] = useState<"all" | ZoneCode>("all");
  const [query, setQuery] = useState("");
  const [simulation, setSimulation] = useState<string | null>(null);
  const [addingPatient, setAddingPatient] = useState(false);
  const [resettingPatients, setResettingPatients] = useState(false);
  const [acknowledgingAlerts, setAcknowledgingAlerts] = useState(false);
  const [result, setResult] = useState(false);
  const locale = (i18n.resolvedLanguage === "en" ? "en" : "es") as Locale;
  const visiblePatients = filterAndSortPatients(patients, { query, zone });
  const metrics = getErMetrics(visiblePatients, zone);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{t("er:title")}</h1>
            <p className="text-sm text-muted-foreground">{t("er:subtitle")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex h-11 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm">
              <Filter className="size-4 text-muted-foreground" aria-hidden="true" />
              <span className="sr-only">{t("er:filter")}</span>
              <select
                value={zone}
                onChange={(event) => setZone(event.target.value as "all" | ZoneCode)}
                className="bg-transparent focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">{t("common:zones.all")}</option>
                <option value="resuscitation">{t("common:zones.resuscitation")}</option>
                <option value="trauma">{t("common:zones.trauma")}</option>
                <option value="pediatrics">{t("common:zones.pediatrics")}</option>
              </select>
            </label>
            <label className="flex h-11 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm focus-within:ring-2 focus-within:ring-ring">
              <Search className="size-4 text-muted-foreground" aria-hidden="true" />
              <span className="sr-only">{t("er:search")}</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("er:search")}
                className="w-36 bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:w-48"
              />
            </label>
            <button
              onClick={() => {
                setAddingPatient(true);
                setSimulation(t("er:add"));
              }}
              className="h-11 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              {t("er:add")}
            </button>
            <button
              onClick={() => {
                setResettingPatients(true);
                setSimulation(t("er:reset"));
              }}
              className="h-11 rounded-lg border border-border bg-surface px-4 text-sm font-medium"
            >
              {t("er:reset")}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <Kpi icon={Users} label={t("er:kpis.inEd")} value={String(metrics.patientCount)} />
          <Kpi
            icon={AlertTriangle}
            label={t("er:kpis.critical")}
            value={String(metrics.criticalCount)}
            tone="critical"
          />
          <Kpi
            icon={Clock}
            label={t("er:kpis.wait")}
            value={formatMinutes(Math.round(metrics.averageWait), locale)}
          />
          <Kpi
            icon={BedDouble}
            label={t("er:kpis.beds")}
            value={`${metrics.availableCapacity} / ${metrics.totalCapacity}`}
          />
          <Kpi
            icon={Activity}
            label={t("er:kpis.saturation")}
            value={formatPercent(metrics.saturation, locale)}
            tone={metrics.saturation >= 0.75 ? "high" : undefined}
          />
        </div>

        {!hydrated && (
          <p className="text-sm text-destructive" role="alert">
            {t("er:dataLoading")}
          </p>
        )}
        {dataStatus === "restored" && (
          <p className="text-sm text-muted-foreground" role="status">
            {t("er:dataRestored")}
          </p>
        )}
        {dataStatus === "unavailable" && (
          <p className="text-sm text-muted-foreground" role="status">
            {t("er:dataUnavailable")}
          </p>
        )}

        {activeAlerts.length > 0 && (
          <div
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-destructive/40 bg-destructive/5 p-4"
            role="region"
            aria-labelledby="er-alert-title"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/15 text-destructive">
              <AlertTriangle className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div id="er-alert-title" className="font-semibold text-destructive">
                {t("er:alerts", { count: activeAlerts.length })}
              </div>
              <div className="text-sm text-muted-foreground">{t("er:alertDescription")}</div>
            </div>
            <button
              onClick={() => {
                setAcknowledgingAlerts(true);
                setSimulation(t("er:acknowledge"));
              }}
              className="h-11 rounded-lg bg-destructive px-4 text-sm font-semibold text-destructive-foreground"
            >
              {t("er:acknowledge")}
            </button>
          </div>
        )}

        <p className="text-xs text-muted-foreground">{t("er:sort")}</p>
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full min-w-[760px] text-sm">
            <caption className="sr-only">{t("er:table.caption")}</caption>
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                {[
                  "priority",
                  "patient",
                  "complaint",
                  "status",
                  "wait",
                  "bay",
                  "arrived",
                  "actions",
                ].map((column) => (
                  <th key={column} scope="col" className="px-4 py-3 text-left">
                    {t(`er:table.${column}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visiblePatients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                    {t("er:empty")}
                  </td>
                </tr>
              ) : (
                visiblePatients.map((patient) => (
                  <PatientRow key={patient.id} patient={patient} locale={locale} />
                ))
              )}
            </tbody>
          </table>
        </div>
        {result && (
          <p role="status" className="text-sm text-success">
            {t("common:simulation.complete")}
          </p>
        )}
      </div>
      <SimulationDialog
        action={simulation}
        onClose={() => {
          setSimulation(null);
          setAddingPatient(false);
          setResettingPatients(false);
          setAcknowledgingAlerts(false);
        }}
        onConfirm={() => {
          if (addingPatient) addSamplePatient();
          if (resettingPatients) resetPatients();
          if (acknowledgingAlerts) acknowledgeAlerts();
          setAddingPatient(false);
          setResettingPatients(false);
          setAcknowledgingAlerts(false);
          setSimulation(null);
          setResult(true);
        }}
      />
    </AppShell>
  );
}

function PatientRow({ patient, locale }: { patient: DemoPatient; locale: Locale }) {
  const { t } = useTranslation();
  const meta = levelStyles[patient.level];
  return (
    <tr
      className={`border-t border-border hover:bg-muted/30 ${patient.status === "critical" ? "bg-destructive/[0.04]" : ""}`}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className={`flex size-9 items-center justify-center rounded-lg font-bold ${meta.bg} ${meta.color}`}
          >
            {patient.level}
          </div>
          <div className="text-xs">
            <div className="font-medium">L{patient.level}</div>
            <div className="text-muted-foreground">{t(`common:esi.${patient.level}`)}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="font-medium">{patient.name}</div>
        <div className="text-xs text-muted-foreground">
          {patient.id}
          {patient.age !== null && patient.sex !== null && ` · ${patient.age}${patient.sex}`}
        </div>
      </td>
      <td className="px-4 py-3">{t(`er:complaints.${patient.complaint}`)}</td>
      <td className="px-4 py-3">
        <StatusPill status={patient.status} />
      </td>
      <td
        className={`px-4 py-3 font-mono ${patient.waitMinutes !== null && patient.waitMinutes > 30 ? "font-semibold text-foreground underline decoration-priority-high decoration-2 underline-offset-4" : ""}`}
      >
        {patient.waitMinutes === null ? "—" : formatMinutes(patient.waitMinutes, locale)}
      </td>
      <td className="px-4 py-3 font-mono text-muted-foreground">{patient.bay ?? "—"}</td>
      <td className="px-4 py-3 text-muted-foreground">{formatTime(patient.arrivedAt, locale)}</td>
      <td className="px-4 py-3 text-right">
        <Link
          to="/triage/$patientId"
          params={{ patientId: patient.id }}
          aria-label={t("er:table.openPatient", { patient: patient.name, id: patient.id })}
          className="inline-flex min-h-11 items-center text-xs font-medium text-primary"
        >
          {t("er:table.open")}
        </Link>
      </td>
    </tr>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "critical" | "high";
}) {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {label}
        <Icon
          className={`size-4 ${tone === "critical" ? "text-destructive" : tone === "high" ? "text-priority-high" : "text-primary"}`}
          aria-hidden="true"
        />
      </div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{t("common:synthetic")}</div>
    </div>
  );
}

function StatusPill({ status }: { status: PatientStatus }) {
  const { t } = useTranslation();
  const styles: Record<PatientStatus, string> = {
    waiting: "bg-muted text-foreground",
    treatment: "border border-info/30 bg-info/15 text-foreground",
    critical: "border border-destructive/30 bg-destructive/15 text-foreground",
    imaging: "bg-accent text-foreground",
    discharging: "border border-success/30 bg-success/15 text-foreground",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {t(`common:status.${status}`)}
    </span>
  );
}
