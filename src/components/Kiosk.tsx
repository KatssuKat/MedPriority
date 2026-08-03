import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, AlertTriangle, ChevronLeft, ChevronRight, User, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { DemoNotice } from "@/components/DemoNotice";
import { SimulationDialog } from "@/components/SimulationDialog";
import { useDemoData } from "@/demo/DemoDataProvider";
import { symptomCodes } from "@/demo/domain";
import { LanguageSelector } from "@/i18n/LanguageSelector";

export const kioskSchema = z.object({
  fullName: z.string().trim().min(2),
  birthDate: z
    .string()
    .min(1)
    .refine((value) => value <= new Date().toISOString().slice(0, 10)),
  phone: z.string().trim().min(7),
  reason: z.string().trim().min(3),
  symptomDescription: z.string().trim(),
  symptoms: z.array(z.enum(symptomCodes)),
  pain: z.number().int().min(0).max(10).nullable(),
});

type KioskForm = z.infer<typeof kioskSchema>;
const defaults: KioskForm = {
  fullName: "",
  birthDate: "",
  phone: "",
  reason: "",
  symptomDescription: "",
  symptoms: [],
  pain: null,
};
export function Kiosk() {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [simulation, setSimulation] = useState<string | null>(null);
  const [simulated, setSimulated] = useState(false);
  const [reading, setReading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sessionCleared, setSessionCleared] = useState(false);
  const [speechStatus, setSpeechStatus] = useState<"unavailable" | "error" | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const painFirstRef = useRef<HTMLButtonElement>(null);
  const focusHeadingAfterRender = useRef(false);
  const { addKioskScenario } = useDemoData();
  const {
    register,
    watch,
    getValues,
    setValue,
    setError,
    clearErrors,
    trigger,
    reset,
    formState: { errors },
  } = useForm<KioskForm>({ resolver: zodResolver(kioskSchema), defaultValues: defaults });
  const values = watch();

  useEffect(() => {
    if (!focusHeadingAfterRender.current) return;
    focusHeadingAfterRender.current = false;
    headingRef.current?.focus();
  }, [step, submitted]);

  function errorFor(name: keyof KioskForm) {
    if (!errors[name]) return undefined;
    const value = getValues(name);
    return typeof value === "string" && value.trim()
      ? t("validation:invalid")
      : t("validation:required");
  }

  async function next() {
    if (step === 1) {
      if (!(await trigger(["fullName", "birthDate", "phone", "reason"], { shouldFocus: true })))
        return;
    }
    if (step === 2) {
      if (!getValues("symptomDescription") && getValues("symptoms").length === 0) {
        setError("symptomDescription", { type: "manual" }, { shouldFocus: true });
        return;
      }
      clearErrors("symptomDescription");
    }
    if (step === 3 && getValues("pain") === null) {
      setError("pain", { type: "manual" });
      requestAnimationFrame(() => painFirstRef.current?.focus());
      return;
    }
    focusHeadingAfterRender.current = true;
    setSessionCleared(false);
    setStep((current) => Math.min(4, current + 1));
  }

  function resetDemo(announce = false) {
    window.speechSynthesis?.cancel();
    reset(defaults);
    focusHeadingAfterRender.current = true;
    setStep(1);
    setSimulated(false);
    setReading(false);
    setSubmitted(false);
    setSpeechStatus(null);
    setSessionCleared(announce);
  }

  function completeDemo() {
    if (values.pain === null) return;
    addKioskScenario({
      symptoms: values.symptoms,
      pain: values.pain,
    });
    reset(defaults);
    focusHeadingAfterRender.current = true;
    setSubmitted(true);
    setSessionCleared(false);
  }

  function toggleSymptom(code: (typeof symptomCodes)[number]) {
    const symptoms = getValues("symptoms");
    setValue(
      "symptoms",
      symptoms.includes(code) ? symptoms.filter((item) => item !== code) : [...symptoms, code],
      { shouldDirty: true },
    );
    clearErrors("symptomDescription");
  }

  function toggleReadAloud() {
    if (reading) {
      window.speechSynthesis?.cancel();
      setReading(false);
      setSpeechStatus(null);
      return;
    }
    if (!("speechSynthesis" in window)) {
      setSpeechStatus("unavailable");
      return;
    }
    try {
      const copy = [
        t("common:demo.kioskTitle"),
        t("common:demo.kioskDescription"),
        t(`kiosk:steps.${step - 1}`),
      ].join(". ");
      const utterance = new SpeechSynthesisUtterance(copy);
      utterance.lang = i18n.resolvedLanguage === "en" ? "en-US" : "es-ES";
      utterance.onend = () => setReading(false);
      utterance.onerror = () => {
        setReading(false);
        setSpeechStatus("error");
      };
      setSpeechStatus(null);
      setReading(true);
      window.speechSynthesis.speak(utterance);
    } catch {
      setReading(false);
      setSpeechStatus("error");
    }
  }

  const pain = values.pain;
  const painLabel =
    pain === 0
      ? t("kiosk:painBand.0")
      : pain !== null && pain <= 3
        ? t("kiosk:painBand.mild")
        : pain !== null && pain <= 6
          ? t("kiosk:painBand.moderate")
          : pain !== null && pain <= 8
            ? t("kiosk:painBand.severe")
            : t("kiosk:painBand.worst");

  return (
    <div
      id="kiosk-shell"
      className="flex min-h-screen flex-col bg-gradient-to-br from-primary/10 via-background to-accent"
    >
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface/90 px-4 py-4 backdrop-blur sm:px-8 sm:py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Activity className="size-5" aria-hidden="true" />
          </div>
          <div>
            <div className="font-display text-xl font-semibold">MedPriority</div>
            <div className="text-xs text-muted-foreground">{t("kiosk:department")}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LanguageSelector compact />
          <button
            type="button"
            onClick={toggleReadAloud}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-surface px-3 text-sm"
          >
            <Volume2 className="size-4" aria-hidden="true" />
            {reading ? t("kiosk:stopReading") : t("kiosk:readAloud")}
          </button>
          <button
            type="button"
            onClick={() => setSimulation(t("kiosk:emergencyTitle"))}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-destructive px-4 text-sm font-semibold text-destructive-foreground"
          >
            <AlertTriangle className="size-4" aria-hidden="true" />
            {t("kiosk:emergency")}
          </button>
        </div>
        {speechStatus && (
          <p className="w-full text-right text-sm text-destructive" role="alert">
            {t(`kiosk:speech.${speechStatus}`)}
          </p>
        )}
      </header>
      <DemoNotice kiosk />

      <nav aria-label={t(`kiosk:steps.${step - 1}`)} className="px-4 pt-5 sm:px-8 sm:pt-6">
        <ol className="mx-auto flex max-w-5xl items-center gap-2">
          {[0, 1, 2, 3].map((index) => {
            const current = index + 1 === step;
            const done = index + 1 < step;
            return (
              <li
                key={index}
                className="flex flex-1 items-center gap-2"
                aria-current={current ? "step" : undefined}
              >
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${done ? "bg-success text-primary-foreground" : current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {index + 1}
                </span>
                <span
                  className={`sr-only text-sm sm:not-sr-only ${current ? "font-medium text-foreground" : "text-muted-foreground"}`}
                >
                  {t(`kiosk:steps.${index}`)}
                </span>
                {index < 3 && (
                  <span
                    className={`h-1 flex-1 rounded-full ${done ? "bg-success" : "bg-muted"}`}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
        <p className="sr-only" role="status" aria-atomic="true">
          {t("kiosk:stepAnnouncement", {
            current: step,
            total: 4,
            name: t(`kiosk:steps.${step - 1}`),
          })}
        </p>
      </nav>

      <main className="flex flex-1 items-start justify-center px-4 py-8 sm:px-8 sm:py-10">
        <form
          className="w-full max-w-3xl"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            if (step === 4) {
              if (submitted) resetDemo();
              else completeDemo();
            } else {
              void next();
            }
          }}
        >
          {step === 1 && (
            <section className="rounded-3xl border border-border bg-surface p-6 shadow-xl shadow-primary/5 sm:p-10">
              <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <User className="size-7" aria-hidden="true" />
              </div>
              <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-semibold tracking-tight">
                {t("kiosk:identifyTitle")}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">{t("kiosk:identifyDescription")}</p>
              <div className="mt-8 grid grid-cols-1 gap-4">
                <TextField
                  label={t("kiosk:fullName")}
                  error={errorFor("fullName")}
                  registration={register("fullName")}
                  autoComplete="name"
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextField
                    label={t("kiosk:birthDate")}
                    error={errorFor("birthDate")}
                    registration={register("birthDate")}
                    type="date"
                    autoComplete="bday"
                  />
                  <TextField
                    label={t("kiosk:phone")}
                    error={errorFor("phone")}
                    registration={register("phone")}
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </div>
                <TextField
                  label={t("kiosk:reason")}
                  error={errorFor("reason")}
                  registration={register("reason")}
                />
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="rounded-3xl border border-border bg-surface p-6 shadow-xl shadow-primary/5 sm:p-10">
              <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-semibold tracking-tight">
                {t("kiosk:symptomsTitle")}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">{t("kiosk:symptomsDescription")}</p>
              <label className="mt-8 block" htmlFor="symptom-description">
                <span className="text-sm font-medium text-muted-foreground">
                  {t("kiosk:symptomLabel")}
                </span>
                <textarea
                  {...register("symptomDescription")}
                  id="symptom-description"
                  aria-describedby={errors.symptomDescription ? "symptoms-error" : undefined}
                  aria-invalid={Boolean(errors.symptomDescription)}
                  className="mt-2 h-36 w-full rounded-2xl border border-border bg-muted/40 p-4 text-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              {errorFor("symptomDescription") && (
                <p id="symptoms-error" className="mt-2 text-sm text-destructive" role="alert">
                  {errorFor("symptomDescription")}
                </p>
              )}
              <fieldset className="mt-6">
                <legend className="mb-3 text-sm text-muted-foreground">
                  {t("kiosk:commonSymptoms")}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {symptomCodes.map((code) => {
                    const selected = values.symptoms.includes(code);
                    return (
                      <button
                        key={code}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleSymptom(code)}
                        className={`h-11 rounded-full border px-4 text-sm font-medium ${selected ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface hover:border-primary"}`}
                      >
                        {t(`kiosk:symptoms.${code}`)}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </section>
          )}

          {step === 3 && (
            <section className="rounded-3xl border border-border bg-surface p-6 shadow-xl shadow-primary/5 sm:p-10">
              <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-semibold tracking-tight">
                {t("kiosk:painTitle")}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">{t("kiosk:painDescription")}</p>
              <fieldset
                className="mt-8"
                aria-describedby={errors.pain ? "pain-error" : undefined}
                aria-invalid={Boolean(errors.pain)}
              >
                <legend className="sr-only">{t("kiosk:painTitle")}</legend>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {Array.from({ length: 11 }).map((_, value) => (
                    <button
                      key={value}
                      ref={value === 0 ? painFirstRef : undefined}
                      type="button"
                      aria-label={t("kiosk:painOption", { value })}
                      aria-pressed={pain === value}
                      onClick={() => {
                        setValue("pain", value, { shouldDirty: true });
                        clearErrors("pain");
                      }}
                      className={`h-14 rounded-xl border-2 text-xl font-semibold ${pain === value ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/40 text-muted-foreground"}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </fieldset>
              {errorFor("pain") && (
                <p id="pain-error" className="mt-2 text-sm text-destructive" role="alert">
                  {errorFor("pain")}
                </p>
              )}
              <div className="mt-5 flex justify-between text-sm text-muted-foreground">
                <span>{t("kiosk:noPain")}</span>
                <span>{t("kiosk:mild")}</span>
                <span>{t("kiosk:severe")}</span>
                <span>{t("kiosk:worst")}</span>
              </div>
              <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-5">
                <div className="text-lg font-medium">
                  {pain === null ? t("validation:required") : painLabel}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{t("common:synthetic")}</p>
              </div>
            </section>
          )}

          {step === 4 && !submitted && (
            <section className="rounded-3xl border border-border bg-surface p-6 shadow-xl shadow-primary/5 sm:p-10">
              <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-semibold tracking-tight">
                {t("kiosk:reviewTitle")}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">{t("kiosk:reviewDescription")}</p>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Stat label={t("kiosk:queue")} value="#7" />
                <Stat label={t("kiosk:wait")} value="22 min" />
                <Stat label={t("kiosk:priority")} value={t("triage:level", { level: 3 })} tone />
              </div>
              <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-5">
                <div className="text-sm font-medium">{t("kiosk:summary")}</div>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>{values.reason}</li>
                  <li>
                    {pain}/10 · {painLabel}
                  </li>
                  <li>
                    {values.symptoms.map((code) => t(`kiosk:symptoms.${code}`)).join(", ") ||
                      values.symptomDescription}
                  </li>
                  <li>{t("kiosk:noAllergies")}</li>
                </ul>
              </div>
            </section>
          )}
          {step === 4 && submitted && (
            <section className="rounded-3xl border border-border bg-surface p-6 shadow-xl shadow-primary/5 sm:p-10">
              <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-semibold tracking-tight">
                {t("kiosk:submissionCompleteTitle")}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {t("kiosk:submissionCompleteDescription")}
              </p>
            </section>
          )}

          {(simulated || submitted) && (
            <p className="mt-4 text-sm text-success" role="status">
              {t("common:simulation.complete")}
            </p>
          )}
          {sessionCleared && (
            <p className="mt-4 text-sm text-success" role="status">
              {t("kiosk:sessionCleared")}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  focusHeadingAfterRender.current = true;
                  setSessionCleared(false);
                  setStep((current) => Math.max(1, current - 1));
                }}
                disabled={step === 1 || submitted}
                className="inline-flex h-12 items-center gap-2 rounded-2xl border border-border bg-surface px-5 text-base font-medium disabled:opacity-40"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
                {t("common:actions.back")}
              </button>
              {!submitted && (
                <button
                  type="button"
                  onClick={() => resetDemo(true)}
                  className="inline-flex h-12 items-center rounded-2xl border border-border bg-surface px-5 text-base font-medium"
                >
                  {t("kiosk:cancelSession")}
                </button>
              )}
            </div>
            <button
              type="submit"
              className="inline-flex h-12 items-center gap-2 rounded-2xl bg-primary px-6 text-base font-semibold text-primary-foreground"
            >
              <span>
                {step === 4
                  ? submitted
                    ? t("kiosk:reset")
                    : t("kiosk:complete")
                  : t("common:actions.continue")}
              </span>
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </form>
      </main>
      <SimulationDialog
        action={simulation}
        description={simulation ? t("kiosk:emergencyDescription") : undefined}
        onClose={() => setSimulation(null)}
        onConfirm={() => {
          setSimulation(null);
          setSimulated(true);
        }}
      />
    </div>
  );
}

function TextField({
  label,
  error,
  registration,
  type = "text",
  autoComplete,
  inputMode,
}: {
  label: string;
  error?: string;
  registration: ReturnType<typeof useForm<KioskForm>>["register"] extends (
    name: infer Name,
  ) => infer Result
    ? Result
    : never;
  type?: "text" | "date" | "tel";
  autoComplete?: string;
  inputMode?: "tel";
}) {
  const id = label.replaceAll(" ", "-").toLowerCase();
  return (
    <div>
      <label className="block" htmlFor={id}>
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <input
          {...registration}
          id={id}
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-2 h-12 w-full rounded-2xl border border-border bg-muted/40 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </label>
      {error && (
        <span id={`${id}-error`} className="mt-2 block text-sm text-destructive" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

function Stat({ label, value, tone = false }: { label: string; value: string; tone?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${tone ? "border-priority-medium/40 bg-priority-medium/15" : "border-border bg-muted/40"}`}
    >
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
    </div>
  );
}
