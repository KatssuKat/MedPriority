export const symptomCodes = [
  "chestPain",
  "dyspnea",
  "fever",
  "headache",
  "dizziness",
  "abdominalPain",
  "bleeding",
  "vomiting",
] as const;

export const syntheticComplaintCodes = [
  "added",
  "critical",
  "discharge",
  "imaging",
  "kiosk",
  "pediatric",
  "treatment",
  "waiting",
] as const;

export const allergyCodes = ["penicillin"] as const;
export const medicationCodes = ["lisinopril"] as const;
export const vitalCodes = [
  "heartRate",
  "bloodPressure",
  "respiratory",
  "oxygen",
  "temperature",
  "gcs",
] as const;
export const vitalUnitCodes = [
  "bpm",
  "mmHg",
  "breathsPerMinute",
  "percent",
  "celsius",
  "gcs",
] as const;
export const triageFactorCodes = [
  "radiatingChestPain",
  "heartRateAbove110",
  "oxygenBelow94",
  "ageAbove50",
  "hypertension",
] as const;

export type SymptomCode = (typeof symptomCodes)[number];
export type SyntheticComplaintCode = (typeof syntheticComplaintCodes)[number];
export type AllergyCode = (typeof allergyCodes)[number];
export type MedicationCode = (typeof medicationCodes)[number];
export type VitalCode = (typeof vitalCodes)[number];
export type VitalUnitCode = (typeof vitalUnitCodes)[number];
export type TriageFactorCode = (typeof triageFactorCodes)[number];
export type EsiLevel = 1 | 2 | 3 | 4 | 5;
export type PatientStatus = "waiting" | "treatment" | "critical" | "imaging" | "discharging";
export type ZoneCode = "resuscitation" | "trauma" | "pediatrics";
export type SexCode = "F" | "M";
export type SeverityCode = "low" | "medium" | "high";
export type DeteriorationCode = "none" | "watch" | "active";
export type AlertCode = "critical";

export type DemoEpisode = {
  id: string;
  startedAt: string;
  alertCode: AlertCode | null;
};

export type DemoDecision =
  | {
      id: string;
      patientId: string;
      episodeId: string;
      occurredAt: string;
      type: "acceptEsi";
      level: EsiLevel;
    }
  | {
      id: string;
      patientId: string;
      episodeId: string;
      occurredAt: string;
      type: "overrideEsi";
      level: EsiLevel;
      reason: string;
    }
  | {
      id: string;
      patientId: string;
      episodeId: string;
      occurredAt: string;
      type: "acknowledgeAlert";
      alertCode: AlertCode;
    };

export type DemoVital = {
  code: VitalCode;
  value: string;
  unit: VitalUnitCode;
  severity: SeverityCode;
};

export type DemoTriage = {
  allergyCodes: AllergyCode[];
  medications: { code: MedicationCode; dose: string }[];
  onsetMinutes: number;
  lastMeal: string;
  vitals: DemoVital[];
  vitalsObservedAt: string;
  visitDates: string[];
  factorCodes: TriageFactorCode[];
  narrativeCode: "cardiorespiratory" | "general";
};

export type DemoPatient = {
  id: string;
  name: string;
  age: number | null;
  sex: SexCode | null;
  level: EsiLevel;
  deterioration: DeteriorationCode;
  status: PatientStatus;
  waitMinutes: number | null;
  bay: string | null;
  arrivedAt: string;
  zone: ZoneCode;
  symptoms: SymptomCode[];
  pain?: number;
  complaint: SyntheticComplaintCode;
  triage: DemoTriage;
  episode: DemoEpisode;
  isSynthetic: true;
};

export type KioskScenario = {
  symptoms: SymptomCode[];
  pain: number;
};
