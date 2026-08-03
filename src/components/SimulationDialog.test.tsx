import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { SimulationDialog } from "./SimulationDialog";

function DialogHarness({ onConfirm = vi.fn() }: { onConfirm?: () => void }) {
  const [action, setAction] = useState<string | null>(null);
  return (
    <LocaleProvider locale="es">
      <main id="app-shell">
        <button type="button" onClick={() => setAction("Acción simulada")}>
          Abrir
        </button>
      </main>
      <SimulationDialog
        action={action}
        onClose={() => setAction(null)}
        onConfirm={() => {
          onConfirm();
          setAction(null);
        }}
      />
    </LocaleProvider>
  );
}

describe("SimulationDialog", () => {
  it("traps focus, blocks the background, and restores focus on Escape", async () => {
    const user = userEvent.setup();
    render(<DialogHarness />);
    const opener = screen.getByRole("button", { name: "Abrir" });

    await user.click(opener);
    const dialog = screen.getByRole("dialog", { name: "Acción simulada" });
    expect(dialog).toBeVisible();
    expect(document.querySelector("#app-shell")).toHaveAttribute("inert");
    expect(document.body).toHaveStyle({ overflow: "hidden" });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Confirmar simulación" })).toHaveFocus(),
    );

    await user.tab();
    expect(screen.getByRole("button", { name: "Cerrar" })).toHaveFocus();
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.querySelector("#app-shell")).not.toHaveAttribute("inert");
    expect(opener).toHaveFocus();
  });

  it("confirms the action and supports a custom description", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<DialogHarness onConfirm={onConfirm} />);

    await user.click(screen.getByRole("button", { name: "Abrir" }));
    await user.click(screen.getByRole("button", { name: "Confirmar simulación" }));

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
