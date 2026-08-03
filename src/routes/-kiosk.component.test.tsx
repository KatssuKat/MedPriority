import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Kiosk } from "@/components/Kiosk";
import { DemoDataProvider } from "@/demo/DemoDataProvider";
import { LocaleProvider } from "@/i18n/LocaleProvider";

vi.mock("@/i18n/LanguageSelector", () => ({ LanguageSelector: () => null }));

function renderKiosk() {
  return render(
    <LocaleProvider locale="es">
      <DemoDataProvider>
        <Kiosk />
      </DemoDataProvider>
    </LocaleProvider>,
  );
}

async function completeIdentity(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Nombre de ejemplo"), "Persona ficticia");
  await user.type(screen.getByLabelText("Fecha de nacimiento"), "1980-01-01");
  await user.type(screen.getByLabelText("Teléfono"), "5550101");
  await user.type(screen.getByLabelText("Motivo de visita (corto)"), "Visita ficticia");
  await user.click(screen.getByRole("button", { name: "Continuar" }));
}

describe("Kiosk", () => {
  it("focuses validation errors and announces each new step", async () => {
    const user = userEvent.setup();
    renderKiosk();
    const name = screen.getByLabelText("Nombre de ejemplo");

    await user.click(screen.getByRole("button", { name: "Continuar" }));
    expect(name).toHaveFocus();
    expect(name).toHaveAttribute("aria-invalid", "true");

    await completeIdentity(user);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Describa el escenario de ejemplo." }),
      ).toHaveFocus(),
    );
    expect(screen.getByRole("status")).toHaveTextContent("Paso 2 de 4: Síntomas");

    await user.click(screen.getByRole("button", { name: "Continuar" }));
    expect(screen.getByLabelText("Descripción de síntomas")).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Fiebre" }));
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    await waitFor(() => expect(screen.getByRole("heading", { name: /dolor/ })).toHaveFocus());

    await user.click(screen.getByRole("button", { name: "Continuar" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "0 de 10" })).toHaveFocus());
    expect(screen.getByRole("alert")).toHaveTextContent("Este campo es obligatorio.");
  });

  it("clears an in-progress kiosk session with observable feedback", async () => {
    const user = userEvent.setup();
    renderKiosk();
    const name = screen.getByLabelText("Nombre de ejemplo");
    await user.type(name, "Persona temporal");

    await user.click(screen.getByRole("button", { name: "Cancelar y borrar sesión" }));

    expect(name).toHaveValue("");
    expect(
      screen.getByText("Sesión del kiosco borrada. No se guardó información."),
    ).toHaveAttribute("role", "status");
  });
});
