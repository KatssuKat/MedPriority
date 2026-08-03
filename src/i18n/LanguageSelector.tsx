import { useRouter } from "@tanstack/react-router";
import { Languages } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { type Locale, normalizeLocale } from "./config";
import { savePreferredLocale } from "./locale.server";

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function changeLocale(value: string) {
    const locale = normalizeLocale(value) as Locale;
    setUpdating(true);
    try {
      await savePreferredLocale({ data: locale });
      await i18n.changeLanguage(locale);
      document.documentElement.lang = locale;
      await router.invalidate();
    } finally {
      setUpdating(false);
    }
  }

  return (
    <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      <Languages className="size-4" aria-hidden="true" />
      {!compact && <span>{t("common:language")}</span>}
      <select
        aria-label={t("common:language")}
        value={i18n.resolvedLanguage ?? "es"}
        onChange={(event) => void changeLocale(event.target.value)}
        disabled={updating}
        className="h-9 rounded-lg border border-border bg-surface px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
      >
        <option value="es">Español</option>
        <option value="en">English</option>
      </select>
    </label>
  );
}
