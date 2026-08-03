import { FlaskConical } from "lucide-react";
import { useTranslation } from "react-i18next";

export function DemoNotice({ kiosk = false }: { kiosk?: boolean }) {
  const { t } = useTranslation();
  const title = kiosk ? "common:demo.kioskTitle" : "common:demo.title";
  const description = kiosk ? "common:demo.kioskDescription" : "common:demo.description";

  return (
    <aside
      aria-labelledby="demo-notice-title"
      className={`${kiosk ? "" : "sticky top-16 z-10"} border-b border-priority-medium/50 bg-priority-medium/15 px-4 py-3 text-sm text-foreground`}
    >
      <div className="mx-auto flex max-w-7xl items-start gap-3">
        <FlaskConical className="mt-0.5 size-5 shrink-0 text-priority-high" aria-hidden="true" />
        <div>
          <div id="demo-notice-title" className="font-semibold">
            {t(title)}
          </div>
          <p className="mt-0.5 text-muted-foreground">{t(description)}</p>
        </div>
      </div>
    </aside>
  );
}
