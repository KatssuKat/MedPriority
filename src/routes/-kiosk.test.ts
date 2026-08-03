import { describe, expect, it } from "vitest";
import { kioskSchema } from "@/components/Kiosk";

const validKioskForm = {
  fullName: "Sample Person",
  birthDate: "1980-01-01",
  phone: "5550101",
  reason: "Sample visit",
  symptomDescription: "Sample symptoms",
  symptoms: ["fever"],
  pain: 4,
};

describe("kiosk validation", () => {
  it("accepts a complete form including pain level zero", () => {
    expect(kioskSchema.safeParse(validKioskForm).success).toBe(true);
    expect(kioskSchema.safeParse({ ...validKioskForm, pain: 0 }).success).toBe(true);
  });

  it("rejects future dates, short identity fields, and invalid pain levels", () => {
    expect(kioskSchema.safeParse({ ...validKioskForm, birthDate: "2999-01-01" }).success).toBe(
      false,
    );
    expect(kioskSchema.safeParse({ ...validKioskForm, fullName: "A" }).success).toBe(false);
    expect(kioskSchema.safeParse({ ...validKioskForm, pain: 11 }).success).toBe(false);
  });
});
