import { CircleCheck, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

export function SimulationDialog({
  action,
  description,
  onClose,
  onConfirm,
}: {
  action: string | null;
  description?: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { t } = useTranslation();
  const confirmRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!action) return;
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const background = document.querySelector<HTMLElement>("#app-shell, #kiosk-shell");
    background?.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => confirmRef.current?.focus());

    return () => {
      background?.removeAttribute("inert");
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    };
  }, [action]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])",
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    if (action) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [action, onClose]);

  if (!action) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4"
      role="presentation"
    >
      <section
        ref={dialogRef}
        aria-describedby={`${titleId}-description`}
        aria-labelledby={titleId}
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              {t("common:simulated")}
            </p>
            <h2 id={titleId} className="mt-1 text-xl font-semibold">
              {action}
            </h2>
          </div>
          <button
            aria-label={t("common:actions.close")}
            className="inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={onClose}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <p id={`${titleId}-description`} className="mt-4 text-sm text-muted-foreground">
          {description ?? t("common:simulation.description")}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="h-11 rounded-lg border border-border px-4 text-sm font-medium"
            onClick={onClose}
          >
            {t("common:actions.cancel")}
          </button>
          <button
            ref={confirmRef}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
            onClick={onConfirm}
          >
            <CircleCheck className="size-4" aria-hidden="true" />
            {t("common:actions.confirm")}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
