import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { DemoDecision, DemoPatient, EsiLevel, KioskScenario } from "./domain";
import { initialPatients } from "./fixtures";
import {
  createEpisode,
  createGenericTriage,
  createKioskScenarioPatient,
  demoPatientStorageKey,
  getActiveAlerts,
  getPatientById,
  parseStoredDemoData,
  serializeDemoData,
} from "./repository";

type DemoData = {
  patients: DemoPatient[];
  decisions: DemoDecision[];
  activeAlerts: DemoPatient[];
  hydrated: boolean;
  dataStatus: "ready" | "restored" | "unavailable";
  addKioskScenario: (scenario: KioskScenario) => void;
  addSamplePatient: () => void;
  acceptEsi: (patientId: string) => void;
  overrideEsi: (patientId: string, level: EsiLevel, reason: string) => void;
  acknowledgeAlerts: () => void;
  resetPatients: () => void;
};

const DemoDataContext = createContext<DemoData | null>(null);

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState(initialPatients);
  const [decisions, setDecisions] = useState<DemoDecision[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [dataStatus, setDataStatus] = useState<DemoData["dataStatus"]>("ready");
  const persistRequested = useRef(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(demoPatientStorageKey);
      if (saved !== null) {
        const data = parseStoredDemoData(saved, Date.now());
        if (data) {
          setPatients(data.patients);
          setDecisions(data.decisions);
        } else {
          try {
            window.localStorage.removeItem(demoPatientStorageKey);
            setDataStatus("restored");
          } catch {
            setDataStatus("unavailable");
          }
        }
      }
    } catch {
      setDataStatus("unavailable");
      try {
        window.localStorage.removeItem(demoPatientStorageKey);
      } catch {
        // Invalid data can be ignored when the browser blocks storage.
      }
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated || !persistRequested.current) return;
    persistRequested.current = false;
    try {
      window.localStorage.setItem(
        demoPatientStorageKey,
        serializeDemoData({ patients, decisions }, Date.now()),
      );
      setDataStatus("ready");
    } catch {
      setDataStatus("unavailable");
    }
  }, [decisions, hydrated, patients]);

  function addKioskScenario(scenario: KioskScenario) {
    persistRequested.current = true;
    setPatients((current) => [
      createKioskScenarioPatient(
        scenario,
        current.length,
        `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        new Date().toISOString(),
      ),
      ...current,
    ]);
  }

  function addSamplePatient() {
    const number = patients.length + 1;
    const id = `DEMO-ADDED-${number}`;
    persistRequested.current = true;
    setPatients((current) => [
      {
        id,
        name: `Demo Patient ${String(number).padStart(2, "0")}`,
        age: 40,
        sex: "F",
        level: 3,
        deterioration: "none",
        status: "waiting",
        waitMinutes: 0,
        bay: null,
        arrivedAt: new Date().toISOString(),
        zone: "trauma",
        symptoms: [],
        complaint: "added",
        triage: createGenericTriage(),
        episode: createEpisode(id, new Date().toISOString(), null),
        isSynthetic: true,
      },
      ...current,
    ]);
  }

  function acceptEsi(patientId: string) {
    const patient = getPatientById(patients, patientId);
    if (!patient) return;
    persistRequested.current = true;
    setDecisions((current) => [
      ...current,
      {
        id: `DEC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        patientId,
        episodeId: patient.episode.id,
        occurredAt: new Date().toISOString(),
        type: "acceptEsi",
        level: patient.level,
      },
    ]);
  }

  function overrideEsi(patientId: string, level: EsiLevel, reason: string) {
    const patient = getPatientById(patients, patientId);
    if (!patient || reason.trim().length < 3) return;
    const occurredAt = new Date().toISOString();
    persistRequested.current = true;
    setPatients((current) =>
      current.map((entry) => (entry.id === patientId ? { ...entry, level } : entry)),
    );
    setDecisions((current) => [
      ...current,
      {
        id: `DEC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        patientId,
        episodeId: patient.episode.id,
        occurredAt,
        type: "overrideEsi",
        level,
        reason: reason.trim(),
      },
    ]);
  }

  function acknowledgeAlerts() {
    const alerts = getActiveAlerts(patients, decisions);
    if (alerts.length === 0) return;
    persistRequested.current = true;
    setDecisions((current) => [
      ...current,
      ...alerts.map((patient) => ({
        id: `DEC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        patientId: patient.id,
        episodeId: patient.episode.id,
        occurredAt: new Date().toISOString(),
        type: "acknowledgeAlert" as const,
        alertCode: "critical" as const,
      })),
    ]);
  }

  function resetPatients() {
    persistRequested.current = false;
    setPatients(initialPatients);
    setDecisions([]);
    try {
      window.localStorage.removeItem(demoPatientStorageKey);
      setDataStatus("ready");
    } catch {
      setDataStatus("unavailable");
    }
  }

  const activeAlerts = getActiveAlerts(patients, decisions);

  return (
    <DemoDataContext.Provider
      value={{
        patients,
        decisions,
        activeAlerts,
        hydrated,
        dataStatus,
        addKioskScenario,
        addSamplePatient,
        acceptEsi,
        overrideEsi,
        acknowledgeAlerts,
        resetPatients,
      }}
    >
      {children}
    </DemoDataContext.Provider>
  );
}

export function useDemoData() {
  const context = useContext(DemoDataContext);
  if (!context) throw new Error("useDemoData must be used inside DemoDataProvider");
  return context;
}
