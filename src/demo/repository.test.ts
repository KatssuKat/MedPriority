import { describe, expect, it } from "vitest";
import { initialPatients } from "./fixtures";
import {
  createKioskScenarioPatient,
  demoPatientStorageDurationMs,
  getActiveAlerts,
  getPatientById,
  parseStoredDemoData,
  serializeDemoData,
} from "./repository";
import { filterAndSortPatients, getErMetrics } from "./selectors";

const now = Date.parse("2026-08-01T15:00:00.000Z");

describe("demo repository", () => {
  it("restores a current, versioned synthetic dataset", () => {
    const stored = serializeDemoData({ patients: initialPatients, decisions: [] }, now - 1);

    expect(parseStoredDemoData(stored, now)).toEqual({ patients: initialPatients, decisions: [] });
  });

  it("rejects expired, future, malformed, and non-synthetic stored data", () => {
    expect(
      parseStoredDemoData(
        serializeDemoData(
          { patients: initialPatients, decisions: [] },
          now - demoPatientStorageDurationMs,
        ),
        now,
      ),
    ).toBeNull();
    expect(
      parseStoredDemoData(
        serializeDemoData({ patients: initialPatients, decisions: [] }, now + 1),
        now,
      ),
    ).toBeNull();
    expect(parseStoredDemoData("not json", now)).toBeNull();
    expect(
      parseStoredDemoData(
        JSON.stringify({ version: 3, savedAt: now - 1, patients: initialPatients, decisions: [] }),
        now,
      ),
    ).toBeNull();

    const withPersonalName = initialPatients.map((patient, index) =>
      index === 0 ? { ...patient, name: "Ana García" } : patient,
    );
    expect(
      parseStoredDemoData(
        serializeDemoData({ patients: withPersonalName, decisions: [] }, now - 1),
        now,
      ),
    ).toBeNull();
  });

  it("creates a kiosk scenario without retaining identity fields", () => {
    const patient = createKioskScenarioPatient(
      { symptoms: ["fever"], pain: 4 },
      10,
      "DEMO-ABC12345",
      "2026-08-01T15:00:00.000Z",
    );

    expect(patient).toMatchObject({
      id: "DEMO-ABC12345",
      name: "Demo Kiosk Scenario 11",
      age: null,
      sex: null,
      symptoms: ["fever"],
      pain: 4,
      isSynthetic: true,
    });
  });

  it("preserves valid triage data and rejects invalid clinical codes", () => {
    const stored = serializeDemoData({ patients: initialPatients, decisions: [] }, now - 1);
    expect(parseStoredDemoData(stored, now)?.patients[0]?.triage.vitals).toHaveLength(6);

    const invalid = JSON.parse(stored) as {
      patients: { triage?: { vitals: { unit: string }[] } }[];
    };
    const firstPatient = invalid.patients[0];
    const firstVital = firstPatient?.triage?.vitals[0];
    if (firstVital) firstVital.unit = "unknown";

    expect(parseStoredDemoData(JSON.stringify(invalid), now)).toBeNull();
  });

  it("retrieves the triage fixture by its stable identifier", () => {
    expect(getPatientById(initialPatients, "DEMO-0001")?.triage?.allergyCodes).toEqual([
      "penicillin",
    ]);
    expect(getPatientById(initialPatients, "DEMO-UNKNOWN")).toBeUndefined();
  });

  it("provides a triage scenario for every initial patient", () => {
    expect(initialPatients.every((patient) => patient.triage.vitals.length > 0)).toBe(true);
  });

  it("hides critical alerts after their episode is acknowledged", () => {
    const criticalPatient = initialPatients[0];
    if (!criticalPatient) throw new Error("Missing critical fixture");
    const decision = {
      id: "DEC-ABC12345",
      patientId: criticalPatient.id,
      episodeId: criticalPatient.episode.id,
      occurredAt: "2026-08-01T15:00:00.000Z",
      type: "acknowledgeAlert" as const,
      alertCode: "critical" as const,
    };

    expect(getActiveAlerts(initialPatients, [decision]).map((patient) => patient.id)).not.toContain(
      criticalPatient.id,
    );
  });

  it("persists decisions only when they match the synthetic schema", () => {
    const patient = initialPatients[0];
    if (!patient) throw new Error("Missing fixture");
    const decision = {
      id: "DEC-ABC12345",
      patientId: patient.id,
      episodeId: patient.episode.id,
      occurredAt: "2026-08-01T15:00:00.000Z",
      type: "overrideEsi" as const,
      level: 1 as const,
      reason: "Synthetic reassessment",
    };
    const stored = serializeDemoData({ patients: initialPatients, decisions: [decision] }, now - 1);

    expect(parseStoredDemoData(stored, now)?.decisions).toEqual([decision]);
    expect(
      parseStoredDemoData(
        JSON.stringify({ ...JSON.parse(stored), decisions: [{ ...decision, reason: "" }] }),
        now,
      ),
    ).toBeNull();
  });

  it("derives ER metrics from the shared synthetic patients", () => {
    expect(getErMetrics(initialPatients)).toMatchObject({
      patientCount: 10,
      criticalCount: 2,
      availableCapacity: 22,
      totalCapacity: 32,
      saturation: 0.3125,
    });
    expect(getErMetrics(initialPatients).averageWait).toBeCloseTo(17.78, 2);
  });

  it("filters by patient fields and orders by ESI, deterioration, and wait", () => {
    expect(
      filterAndSortPatients(initialPatients)
        .slice(0, 3)
        .map((patient) => patient.id),
    ).toEqual(["DEMO-0002", "DEMO-0001", "DEMO-0003"]);
    expect(
      filterAndSortPatients(initialPatients, { query: "r-2" }).map((patient) => patient.id),
    ).toEqual(["DEMO-0002"]);
    expect(filterAndSortPatients(initialPatients, { zone: "pediatrics" })).toHaveLength(2);
    expect(
      getErMetrics(filterAndSortPatients(initialPatients, { zone: "pediatrics" }), "pediatrics"),
    ).toMatchObject({ patientCount: 2, availableCapacity: 6, totalCapacity: 8 });
  });
});
