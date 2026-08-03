import type { DemoPatient, ZoneCode } from "./domain";

export const zoneCapacities: Record<ZoneCode, number> = {
  resuscitation: 4,
  trauma: 20,
  pediatrics: 8,
};

const deteriorationRank = { none: 0, watch: 1, active: 2 } as const;

export function filterAndSortPatients(
  patients: DemoPatient[],
  { query = "", zone = "all" }: { query?: string; zone?: "all" | ZoneCode } = {},
) {
  const normalizedQuery = query.trim().toLowerCase();
  return patients
    .filter((patient) => zone === "all" || patient.zone === zone)
    .filter((patient) => {
      if (!normalizedQuery) return true;
      return [patient.name, patient.id, patient.bay ?? ""].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      );
    })
    .sort(
      (first, second) =>
        first.level - second.level ||
        deteriorationRank[second.deterioration] - deteriorationRank[first.deterioration] ||
        (second.waitMinutes ?? -1) - (first.waitMinutes ?? -1),
    );
}

export function getErMetrics(patients: DemoPatient[], zone: "all" | ZoneCode = "all") {
  const totalCapacity =
    zone === "all"
      ? Object.values(zoneCapacities).reduce((total, capacity) => total + capacity, 0)
      : zoneCapacities[zone];
  const waits = patients.flatMap((patient) =>
    patient.waitMinutes === null ? [] : patient.waitMinutes,
  );
  const averageWait =
    waits.length === 0 ? 0 : waits.reduce((total, wait) => total + wait, 0) / waits.length;
  const occupied = Math.min(patients.length, totalCapacity);

  return {
    patientCount: patients.length,
    criticalCount: patients.filter((patient) => patient.status === "critical").length,
    averageWait,
    availableCapacity: totalCapacity - occupied,
    totalCapacity,
    saturation: totalCapacity === 0 ? 0 : occupied / totalCapacity,
    zoneOccupancy: (Object.keys(zoneCapacities) as ZoneCode[]).map((zone) => {
      const capacity = zoneCapacities[zone];
      const count = patients.filter((patient) => patient.zone === zone).length;
      return { zone, capacity, count, saturation: count / capacity };
    }),
  };
}
