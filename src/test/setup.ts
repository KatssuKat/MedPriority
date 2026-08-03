import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.body.style.removeProperty("overflow");
  document.documentElement.removeAttribute("data-hydrated");
  document.documentElement.removeAttribute("lang");
  document.querySelectorAll("#app-shell, #kiosk-shell").forEach((element) => {
    element.removeAttribute("inert");
  });
});
