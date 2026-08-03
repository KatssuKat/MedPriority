import { describe, expect, it } from "vitest";
import { formatDate, formatMinutes, formatNumber, formatPercent, formatTime } from "./format";

describe("localized formatters", () => {
  it("uses explicit Spanish and English number formats", () => {
    expect(formatNumber(1234.5, "es")).toBe("1234,5");
    expect(formatNumber(1234.5, "en")).toBe("1,234.5");
    expect(formatPercent(0.125, "es")).toBe("12,5 %");
    expect(formatPercent(0.125, "en")).toBe("12.5%");
  });

  it("formats durations and dates with the selected locale", () => {
    expect(formatMinutes(12, "es")).toContain("12");
    expect(formatMinutes(12, "en")).toContain("12");
    expect(formatDate("2026-08-01T12:00:00.000Z", "es")).not.toBe(
      formatDate("2026-08-01T12:00:00.000Z", "en"),
    );
    expect(formatTime("2026-08-01T12:00:00.000Z", "es")).toBeTruthy();
  });
});
