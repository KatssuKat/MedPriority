import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LanguageSelector } from "./LanguageSelector";
import { LocaleProvider } from "./LocaleProvider";

const mocks = vi.hoisted(() => ({
  invalidate: vi.fn(),
  savePreferredLocale: vi.fn(),
}));

vi.mock("./locale.server", () => ({ savePreferredLocale: mocks.savePreferredLocale }));
vi.mock("@tanstack/react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@tanstack/react-router")>()),
  useRouter: () => ({ invalidate: mocks.invalidate }),
}));

describe("LanguageSelector", () => {
  it("persists a language change and updates the document language", async () => {
    mocks.savePreferredLocale.mockResolvedValue({ locale: "en" });
    mocks.invalidate.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="es">
        <LanguageSelector />
      </LocaleProvider>,
    );

    const selector = screen.getByRole("combobox", { name: "Idioma" });
    await user.selectOptions(selector, "en");

    await waitFor(() => expect(selector).toHaveValue("en"));
    expect(mocks.savePreferredLocale).toHaveBeenCalledWith({ data: "en" });
    expect(mocks.invalidate).toHaveBeenCalledOnce();
    expect(document.documentElement).toHaveAttribute("lang", "en");
  });
});
