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
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/AppShell";
import { SimulationDialog } from "@/components/SimulationDialog";
import { useDemoData } from "@/demo/DemoDataProvider";
import type { DemoDecision, EsiLevel, VitalCode } from "@/demo/domain";
import { getPatientById } from "@/demo/repository";
import type { Locale } from "@/i18n/config";
import { formatDate, formatMinutes, formatTime } from "@/i18n/format";

export const Route = createFileRoute("/triage")({
  component: DefaultTriage,
});

const vitalIcons: Record<VitalCode, LucideIcon> = {
  heartRate: Heart,
  bloodPressure: Activity,
  respiratory: Wind,
  oxygen: Droplet,
  temperature: Thermometer,
  gcs: Brain,
};

function DefaultTriage() {
  return <Triage patientId="DEMO-0001" />;
}

export function Triage({ patientId }: { patientId: string }) {
  const { t, i18n } = useTranslation();
  const { patients, decisions, acceptEsi, overrideEsi } = useDemoData();
  const [simulation, setSimulation] = useState<string | null>(null);
  const [pendingDecision, setPendingDecision] = useState<"acceptEsi" | null>(null);
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [overrideLevel, setOverrideLevel] = useState<EsiLevel>(3);
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideError, setOverrideError] = useState(false);
  const [result, setResult] = useState(false);
  const locale = (i18n.resolvedLanguage === "en" ? "en" : "es") as Locale;
  const patient = getPatientById(patients, patientId);
  const triage = patient?.triage;

  if (!patient || !triage) {
    return (
      <AppShell>
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h1 className="text-2xl font-semibold">{t("triage:noTriageTitle")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("triage:noTriageDescription")}</p>
        </section>
      </AppShell>
    );
  }

  const allergies = triage.allergyCodes.map((code) => t(`triage:allergies.${code}`)).join(", ");
  const medications = triage.medications
    .map((medication) => `${t(`triage:medications.${medication.code}`)} ${medication.dose}`)
    .join(", ");
  const patientSummary = [
    ["complaint", patient.symptoms.map((code) => t(`kiosk:symptoms.${code}`)).join(", ")],
    ["onset", `~${formatMinutes(triage.onsetMinutes, locale)}`],
    ["pain", patient.pain === undefined ? "—" : `${patient.pain} / 10`],
    ["allergies", allergies || t("triage:noneRecorded")],
    ["medications", medications || t("triage:noneRecorded")],
    ["lastMeal", triage.lastMeal],
  ] as const;
  const patientDecisions = decisions.filter(
    (decision) => decision.episodeId === patient.episode.id,
  );
  const isHighPriority = patient.level <= 2;

  return (
    <AppShell>
      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 flex flex-wrap items-center gap-5 rounded-2xl border border-border bg-surface p-6">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-info text-xl font-semibold text-primary-foreground">
            DP
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold">{patient.name}</h1>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                MRN {patient.id}
              </span>
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
                {patient.sex ?? "—"} · {patient.age ?? "—"}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("triage:patient")} · {patient.bay ?? "—"} · {t("triage:labels.allergies")}:{" "}
              <span className="font-medium text-foreground">
                {allergies || t("triage:noneRecorded")}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Action
              icon={FileText}
              label={t("triage:history")}
              onClick={() => setSimulation(t("triage:history"))}
            />
            <Action
              icon={ShieldCheck}
              primary
              label={t("triage:validate")}
              onClick={() => setSimulation(t("triage:validate"))}
            />
          </div>
        </section>

        <section className="col-span-12 space-y-6 lg:col-span-8">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">{t("triage:vitals")}</h2>
              <span className="text-xs text-muted-foreground">
                {t("triage:vitalTime", { time: formatTime(triage.vitalsObservedAt, locale) })}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {triage.vitals.map((vital) => (
                <Vital
                  key={vital.code}
                  icon={vitalIcons[vital.code]}
                  label={t(`triage:vitalsLabels.${vital.code}`)}
                  value={vital.value}
                  unit={t(`triage:units.${vital.unit}`)}
                  tone={vital.severity}
                />
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-border bg-muted/40 p-4">
              <div
                id="triage-rhythm-title"
                className="mb-2 text-xs uppercase tracking-wider text-muted-foreground"
              >
                {t("triage:rhythm")}
              </div>
              <svg
                viewBox="0 0 600 80"
                className="h-16 w-full"
                aria-labelledby="triage-rhythm-title"
                role="img"
              >
                <desc>{t("triage:rhythmDescription")}</desc>
                <path
                  className="ecg-line"
                  d="M0 40 L60 40 L78 20 L84 60 L90 10 L96 70 L102 40 L160 40 L178 28 L184 52 L190 40 L260 40 L278 20 L284 60 L290 10 L296 70 L302 40 L360 40 L378 28 L384 52 L390 40 L460 40 L478 20 L484 60 L490 10 L496 70 L502 40 L600 40"
                />
              </svg>
            </div>
          </div>

          <div
            className={`rounded-2xl border bg-gradient-to-br via-surface to-surface p-6 ${
              isHighPriority
                ? "border-priority-high/40 from-priority-high/10"
                : "border-primary/30 from-primary/5"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-priority-high/15 text-priority-high">
                <Sparkles className="size-6" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {t("triage:recommendation")}
                </div>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  {t("triage:notAi")}
                </p>
                <div className="mt-2 flex items-baseline gap-3">
                  <div className="text-3xl font-semibold">
                    {t("triage:level", { level: patient.level })}
                  </div>
                  {isHighPriority && (
                    <span className="text-sm font-medium text-foreground">
                      {t("triage:highPriority")}
                    </span>
                  )}
                </div>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  {t(`triage:narratives.${triage.narrativeCode}`)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {triage.factorCodes.map((code) => (
                    <span
                      key={code}
                      className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {t(`triage:factors.${code}`)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Action
                icon={ShieldCheck}
                primary
                label={t("triage:accept", { level: patient.level })}
                onClick={() => {
                  setPendingDecision("acceptEsi");
                  setSimulation(t("triage:accept", { level: patient.level }));
                }}
              />
              <Action
                icon={Pencil}
                label={t("triage:override")}
                onClick={() => {
                  setOverrideLevel(patient.level);
                  setOverrideError(false);
                  setOverrideOpen(true);
                }}
              />
              <Action
                label={t("triage:reasoning")}
                onClick={() => setSimulation(t("triage:reasoning"))}
              />
            </div>
            {overrideOpen && (
              <form
                className="mt-5 grid gap-3 rounded-xl border border-border bg-surface/80 p-4 sm:grid-cols-[auto_1fr_auto]"
                onSubmit={(event) => {
                  event.preventDefault();
                  const reason = overrideReason.trim();
                  if (reason.length < 3) {
                    setOverrideError(true);
                    return;
                  }
                  overrideEsi(patient.id, overrideLevel, reason);
                  setOverrideOpen(false);
                  setOverrideReason("");
                  setOverrideError(false);
                  setResult(true);
                }}
              >
                <label className="text-sm font-medium">
                  <span className="sr-only">{t("triage:overrideLevel")}</span>
                  <select
                    value={overrideLevel}
                    onChange={(event) => setOverrideLevel(Number(event.target.value) as EsiLevel)}
                    className="h-10 rounded-lg border border-border bg-surface px-3"
                  >
                    {[1, 2, 3, 4, 5].map((level) => (
                      <option key={level} value={level}>
                        {t("triage:level", { level })}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="min-w-0 text-sm">
                  <span className="sr-only">{t("triage:overrideReason")}</span>
                  <input
                    required
                    minLength={3}
                    value={overrideReason}
                    onChange={(event) => {
                      setOverrideReason(event.target.value);
                      setOverrideError(false);
                    }}
                    placeholder={t("triage:overrideReason")}
                    aria-invalid={overrideError}
                    aria-describedby={overrideError ? "override-reason-error" : undefined}
                    className="h-10 w-full rounded-lg border border-border bg-surface px-3"
                  />
                  {overrideError && (
                    <span
                      id="override-reason-error"
                      className="mt-1 block text-xs text-destructive"
                      role="alert"
                    >
                      {t("validation:invalid")}
                    </span>
                  )}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOverrideOpen(false);
                      setOverrideReason("");
                      setOverrideError(false);
                    }}
                    className="h-10 rounded-lg border border-border px-3 text-sm font-medium"
                  >
                    {t("common:actions.cancel")}
                  </button>
                  <button className="h-10 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground">
                    {t("triage:saveOverride")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        <aside className="col-span-12 space-y-6 lg:col-span-4">
          {patient.episode.alertCode && (
            <div
              className="rounded-2xl border border-destructive/40 bg-destructive/5 p-5"
              role="region"
              aria-labelledby="triage-alert-title"
            >
              <div
                id="triage-alert-title"
                className="flex items-center gap-2 font-semibold text-destructive"
              >
                <AlertTriangle className="size-5" aria-hidden="true" />
                {t("triage:alertTitle")}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t("triage:alertDescription")}</p>
              <button
                onClick={() => setSimulation(t("triage:escalate"))}
                className="mt-3 h-10 w-full rounded-lg bg-destructive text-sm font-semibold text-destructive-foreground"
              >
                {t("triage:escalate")}
              </button>
            </div>
          )}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="font-semibold">{t("triage:summary")}</h3>
            <dl className="mt-3 divide-y divide-border text-sm">
              {patientSummary.map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 py-2">
                  <dt className="text-muted-foreground">{t(`triage:labels.${key}`)}</dt>
                  <dd className="text-right font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{t("triage:visits")}</h3>
              <button
                onClick={() => setSimulation(t("triage:chart"))}
                className="text-xs text-primary"
              >
                {t("triage:chart")}
              </button>
            </div>
            <ul className="mt-3 space-y-3">
              {triage.visitDates.map((date) => (
                <li key={date} className="flex items-center gap-3 text-sm">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                    <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{t("common:synthetic")}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(date, locale)}</div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h3 className="font-semibold">{t("triage:decisionHistory")}</h3>
            {patientDecisions.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">{t("triage:noDecisions")}</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {patientDecisions.map((decision) => (
                  <li key={decision.id} className="border-l-2 border-primary/30 pl-3 text-sm">
                    <div className="font-medium">{decisionDescription(decision, t)}</div>
                    {decision.type === "overrideEsi" && (
                      <p className="mt-1 text-muted-foreground">{decision.reason}</p>
                    )}
                    <div className="mt-1 text-xs text-muted-foreground">
                      {formatTime(decision.occurredAt, locale)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
      {result && (
        <p className="mt-4 text-sm text-success" role="status">
          {t("common:simulation.complete")}
        </p>
      )}
      <SimulationDialog
        action={simulation}
        onClose={() => {
          setSimulation(null);
          setPendingDecision(null);
        }}
        onConfirm={() => {
          if (pendingDecision === "acceptEsi") acceptEsi(patient.id);
          setSimulation(null);
          setPendingDecision(null);
          setResult(true);
        }}
      />
    </AppShell>
  );
}

function decisionDescription(
  decision: DemoDecision,
  t: (key: string, options?: Record<string, unknown>) => string,
) {
  if (decision.type === "acceptEsi") {
    return t("triage:decisionTypes.acceptEsi", { level: decision.level });
  }
  if (decision.type === "overrideEsi") {
    return t("triage:decisionTypes.overrideEsi", { level: decision.level });
  }
  return t("triage:decisionTypes.acknowledgeAlert");
}

function Action({
  icon: Icon,
  label,
  onClick,
  primary = false,
}: {
  icon?: LucideIcon;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-medium ${primary ? "bg-primary text-primary-foreground" : "border border-border bg-surface"}`}
    >
      {Icon && <Icon className="size-4" aria-hidden="true" />}
      {label}
    </button>
  );
}

function Vital({
  icon: Icon,
  label,
  value,
  unit,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  unit: string;
  tone: "low" | "medium" | "high";
}) {
  const toneClass =
    tone === "high"
      ? "text-foreground border-priority-high/40 bg-priority-high/10"
      : tone === "medium"
        ? "text-foreground border-priority-medium/40 bg-priority-medium/10"
        : "text-foreground border-success/30 bg-success/10";
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Icon className="size-4" aria-hidden="true" />
          {label}
        </div>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${toneClass}`}>
          {t(`common:severity.${tone}`)}
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-2xl font-semibold">{value}</div>
        <div className="text-xs text-muted-foreground">{unit}</div>
      </div>
    </div>
  );
}
