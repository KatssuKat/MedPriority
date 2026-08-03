import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./resources";

export const supportedLocales = ["es", "en"] as const;
export type Locale = (typeof supportedLocales)[number];

export function normalizeLocale(value: string | undefined): Locale {
  return value?.toLowerCase().startsWith("en") ? "en" : "es";
}

export function createI18n(locale: Locale) {
  const i18n = createInstance();
  void i18n.use(initReactI18next).init({
    resources,
    lng: locale,
    fallbackLng: "es",
    defaultNS: "common",
    interpolation: { escapeValue: false },
    initAsync: false,
  });
  return i18n;
}

export function getDocumentMetadata(locale: Locale) {
  return resources[locale].common.meta;
}
