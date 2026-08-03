import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  HeartPulse,
  ShieldAlert,
  Stethoscope,
  Tablet,
  Timer,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/AppShell";
import { useDemoData } from "@/demo/DemoDataProvider";
import { getErMetrics } from "@/demo/selectors";
import type { Locale } from "@/i18n/config";
import { formatMinutes } from "@/i18n/format";

export const Route = createFileRoute("/")({
  component: Overview,
});

const screens = [
  { to: "/kiosk", key: "kiosk", icon: Tablet, tone: "from-info/20 to-primary/10" },
  { to: "/triage", key: "triage", icon: Stethoscope, tone: "from-accent to-primary/10" },
  { to: "/er", key: "er", icon: Activity, tone: "from-priority-high/15 to-priority-critical/10" },
  { to: "/admin", key: "admin", icon: BarChart3, tone: "from-success/15 to-info/10" },
] as const;

function Overview() {
  const { t, i18n } = useTranslation();
  const { patients } = useDemoData();
  const metrics = getErMetrics(patients);
  const locale = (i18n.resolvedLanguage === "en" ? "en" : "es") as Locale;
  const stats = [
    { key: "patients", value: String(metrics.patientCount), icon: HeartPulse },
    { key: "wait", value: formatMinutes(Math.round(metrics.averageWait), locale), icon: Timer },
    { key: "critical", value: String(metrics.criticalCount), icon: ShieldAlert, danger: true },
    { key: "sample", value: "100%", icon: Activity },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-surface to-accent p-8">
          <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-priority-medium" aria-hidden="true" />
              {t("overview:badge")}
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">{t("overview:title")}</h1>
            <p className="mt-3 max-w-xl text-muted-foreground">{t("overview:description")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/triage"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-95"
              >
                {t("overview:openTriage")} <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                to="/er"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium hover:bg-muted"
              >
                {t("overview:viewEr")}
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ key, value, icon: Icon, danger }) => (
            <div key={key} className="glass rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {t(`overview:stats.${key}`)}
                </div>
                <Icon
                  className={`size-4 ${danger ? "text-destructive" : "text-primary"}`}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{t("common:synthetic")}</div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {screens.map(({ to, key, icon: Icon, tone }) => (
            <Link
              key={to}
              to={to}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${tone} p-6 hover:border-primary/40`}
            >
              <div className="flex items-start justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-surface">
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                </div>
                <ArrowUpRight
                  className="size-5 text-muted-foreground group-hover:text-foreground"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-6">
                <div className="text-lg font-semibold">{t(`overview:screens.${key}.0`)}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {t(`overview:screens.${key}.1`)}
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
