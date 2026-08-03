import type { Locale } from "./config";

const languageTag: Record<Locale, string> = { es: "es-ES", en: "en-US" };

export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(languageTag[locale]).format(value);
}

export function formatPercent(value: number, locale: Locale) {
  return new Intl.NumberFormat(languageTag[locale], {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatMinutes(value: number, locale: Locale) {
  return new Intl.NumberFormat(languageTag[locale], {
    style: "unit",
    unit: "minute",
    unitDisplay: "short",
  }).format(value);
}

export function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(languageTag[locale], { dateStyle: "medium" }).format(
    new Date(value),
  );
}

export function formatTime(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(languageTag[locale], { timeStyle: "short" }).format(
    new Date(value),
  );
}
