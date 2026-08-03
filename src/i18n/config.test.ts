import { describe, expect, it } from "vitest";
import { createI18n, getDocumentMetadata, normalizeLocale } from "./config";

describe("i18n configuration", () => {
  it("creates isolated instances for concurrent locales", () => {
    const spanish = createI18n("es");
    const english = createI18n("en");

    expect(spanish.t("common:nav.overview")).toBe("Resumen");
    expect(english.t("common:nav.overview")).toBe("Overview");
    expect(spanish.language).toBe("es");
    expect(english.language).toBe("en");
  });

  it("normalizes locales and document metadata", () => {
    expect(normalizeLocale("en-GB")).toBe("en");
    expect(normalizeLocale("fr-FR")).toBe("es");
    expect(getDocumentMetadata("es").title).toBe("MedPriority · Demostración");
    expect(getDocumentMetadata("en").description).toContain("synthetic");
  });
});
