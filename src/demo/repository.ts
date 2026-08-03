import { z } from "zod";
import {
  type AlertCode,
  allergyCodes,
  type DemoDecision,
  type DemoPatient,
  type KioskScenario,
  medicationCodes,
  symptomCodes,
  syntheticComplaintCodes,
  triageFactorCodes,
  vitalCodes,
  vitalUnitCodes,
} from "./domain";

export const demoPatientStorageKey = "medpriority-demo-patients-v1";
export const demoPatientStorageDurationMs = 24 * 60 * 60 * 1000;
const demoPatientStorageVersion = 5;

export type DemoDataState = {
  patients: DemoPatient[];
  decisions: DemoDecision[];
};

const patientSchema = z.object({
  id: z.string().regex(/^DEMO-(?:\d{4}|ADDED-\d+|[A-F0-9]{8})$/),
  name: z.string().regex(/^Demo (?:Patient|Kiosk Scenario) \d+$/),
  age: z.number().int().nonnegative().nullable(),
  sex: z.enum(["F", "M"]).nullable(),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  deterioration: z.enum(["none", "watch", "active"]),
  status: z.enum(["waiting", "treatment", "critical", "imaging", "discharging"]),
  waitMinutes: z.number().int().nonnegative().nullable(),
  bay: z
    .string()
    .regex(/^[RTP]-\d+$/)
    .nullable(),
  arrivedAt: z.string().refine((value) => !Number.isNaN(Date.parse(value))),
  zone: z.enum(["resuscitation", "trauma", "pediatrics"]),
  symptoms: z.array(z.enum(symptomCodes)),
  pain: z.number().int().min(0).max(10).optional(),
  complaint: z.enum(syntheticComplaintCodes),
  triage: z.object({
    allergyCodes: z.array(z.enum(allergyCodes)),
    medications: z.array(z.object({ code: z.enum(medicationCodes), dose: z.string() })),
    onsetMinutes: z.number().int().nonnegative(),
    lastMeal: z.string().regex(/^\d{2}:\d{2}$/),
    vitals: z.array(
      z.object({
        code: z.enum(vitalCodes),
        value: z.string(),
        unit: z.enum(vitalUnitCodes),
        severity: z.enum(["low", "medium", "high"]),
      }),
    ),
    vitalsObservedAt: z.string().refine((value) => !Number.isNaN(Date.parse(value))),
    visitDates: z.array(z.string().date()),
    factorCodes: z.array(z.enum(triageFactorCodes)),
    narrativeCode: z.enum(["cardiorespiratory", "general"]),
  }),
  episode: z.object({
    id: z.string().regex(/^EP-DEMO-(?:\d{4}|ADDED-\d+|[A-F0-9]{8})$/),
    startedAt: z.string().refine((value) => !Number.isNaN(Date.parse(value))),
    alertCode: z.literal("critical").nullable(),
  }),
  isSynthetic: z.literal(true),
});

const decisionSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string().regex(/^DEC-[A-F0-9]{8}$/),
    patientId: z.string().regex(/^DEMO-(?:\d{4}|ADDED-\d+|[A-F0-9]{8})$/),
    episodeId: z.string().regex(/^EP-DEMO-(?:\d{4}|ADDED-\d+|[A-F0-9]{8})$/),
    occurredAt: z.string().refine((value) => !Number.isNaN(Date.parse(value))),
    type: z.literal("acceptEsi"),
    level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  }),
  z.object({
    id: z.string().regex(/^DEC-[A-F0-9]{8}$/),
    patientId: z.string().regex(/^DEMO-(?:\d{4}|ADDED-\d+|[A-F0-9]{8})$/),
    episodeId: z.string().regex(/^EP-DEMO-(?:\d{4}|ADDED-\d+|[A-F0-9]{8})$/),
    occurredAt: z.string().refine((value) => !Number.isNaN(Date.parse(value))),
    type: z.literal("overrideEsi"),
    level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
    reason: z.string().trim().min(3).max(280),
  }),
  z.object({
    id: z.string().regex(/^DEC-[A-F0-9]{8}$/),
    patientId: z.string().regex(/^DEMO-(?:\d{4}|ADDED-\d+|[A-F0-9]{8})$/),
    episodeId: z.string().regex(/^EP-DEMO-(?:\d{4}|ADDED-\d+|[A-F0-9]{8})$/),
    occurredAt: z.string().refine((value) => !Number.isNaN(Date.parse(value))),
    type: z.literal("acknowledgeAlert"),
    alertCode: z.literal("critical"),
  }),
]);

const storedPatientsSchema = z.object({
  version: z.literal(demoPatientStorageVersion),
  savedAt: z.number().int().nonnegative(),
  patients: z.array(patientSchema),
  decisions: z.array(decisionSchema),
});

export function parseStoredDemoData(value: string, now: number): DemoDataState | null {
  try {
    const stored = storedPatientsSchema.parse(JSON.parse(value));
    if (stored.savedAt > now || now - stored.savedAt >= demoPatientStorageDurationMs) return null;
    return { patients: stored.patients, decisions: stored.decisions };
  } catch {
    return null;
  }
}

export function serializeDemoData(data: DemoDataState, savedAt: number) {
  return JSON.stringify({ version: demoPatientStorageVersion, savedAt, ...data });
}

export function getPatientById(patients: DemoPatient[], id: string) {
  return patients.find((patient) => patient.id === id);
}

export function createEpisode(patientId: string, startedAt: string, alertCode: AlertCode | null) {
  return { id: `EP-${patientId}`, startedAt, alertCode };
}

export function getActiveAlerts(patients: DemoPatient[], decisions: DemoDecision[]) {
  return patients.filter(
    (patient) =>
      patient.episode.alertCode &&
      !decisions.some(
        (decision) =>
          decision.type === "acknowledgeAlert" && decision.episodeId === patient.episode.id,
      ),
  );
}

export function createGenericTriage(): DemoPatient["triage"] {
  return {
    allergyCodes: [],
    medications: [],
    onsetMinutes: 30,
    lastMeal: "12:00",
    vitals: [
      { code: "heartRate", value: "82", unit: "bpm", severity: "low" },
      { code: "bloodPressure", value: "122/78", unit: "mmHg", severity: "low" },
      { code: "respiratory", value: "16", unit: "breathsPerMinute", severity: "low" },
      { code: "oxygen", value: "98", unit: "percent", severity: "low" },
      { code: "temperature", value: "36.8", unit: "celsius", severity: "low" },
      { code: "gcs", value: "15", unit: "gcs", severity: "low" },
    ],
    vitalsObservedAt: "2026-08-01T14:30:00-07:00",
    visitDates: [],
    factorCodes: [],
    narrativeCode: "general",
  };
}

export function createKioskScenarioPatient(
  scenario: KioskScenario,
  patientCount: number,
  id: string,
  arrivedAt: string,
): DemoPatient {
  return {
    id,
    name: `Demo Kiosk Scenario ${String(patientCount + 1).padStart(2, "0")}`,
    age: null,
    sex: null,
    level: 3,
    deterioration: "none",
    status: "waiting",
    waitMinutes: 22,
    bay: null,
    arrivedAt,
    zone: "trauma",
    symptoms: scenario.symptoms,
    pain: scenario.pain,
    complaint: "kiosk",
    triage: createGenericTriage(),
    episode: createEpisode(id, arrivedAt, null),
    isSynthetic: true,
  };
}
