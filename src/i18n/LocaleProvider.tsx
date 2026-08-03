import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { createI18n, type Locale } from "./config";

export function LocaleProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const [i18n] = useState(() => createI18n(locale));

  useEffect(() => {
    if (i18n.language !== locale) void i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
    document.documentElement.dataset.hydrated = "true";
  }, [i18n, locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
