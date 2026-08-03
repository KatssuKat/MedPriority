import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequestHeader, setCookie } from "@tanstack/react-start/server";
import { type Locale, normalizeLocale } from "./config";

const COOKIE_NAME = "mp_locale";

export const getPreferredLocale = createServerFn({ method: "GET" }).handler(() => {
  const cookieLocale = getCookie(COOKIE_NAME);
  const browserLocale = getRequestHeader("accept-language")?.split(",")[0];
  return { locale: normalizeLocale(cookieLocale ?? browserLocale) };
});

export const savePreferredLocale = createServerFn({ method: "POST" })
  .validator((value: Locale) => normalizeLocale(value))
  .handler(({ data }) => {
    setCookie(COOKIE_NAME, data, { maxAge: 60 * 60 * 24 * 365, path: "/", sameSite: "lax" });
    return { locale: data };
  });
