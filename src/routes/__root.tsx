import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { DemoDataProvider } from "@/demo/DemoDataProvider";
import { getDocumentMetadata } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { getPreferredLocale } from "@/i18n/locale.server";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          {t("common:errors.notFound")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("common:errors.notFoundDescription")}
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("common:errors.home")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  loader: () => getPreferredLocale(),
  head: ({ loaderData }) => {
    const metadata = getDocumentMetadata(loaderData?.locale === "en" ? "en" : "es");
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: metadata.title },
        { name: "description", content: metadata.description },
        { name: "author", content: "MedPriority" },
        { property: "og:title", content: metadata.title },
        { property: "og:description", content: metadata.description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  const locale = useRouterState({
    select: (state) => {
      const loaderData = state.matches.find((match) => match.routeId === "__root__")?.loaderData as
        | { locale?: "es" | "en" }
        | undefined;
      return loaderData?.locale ?? "es";
    },
  });
  return (
    <html lang={locale}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { locale } = Route.useLoaderData();
  return (
    <LocaleProvider locale={locale}>
      <DemoDataProvider>
        <Outlet />
      </DemoDataProvider>
    </LocaleProvider>
  );
}
