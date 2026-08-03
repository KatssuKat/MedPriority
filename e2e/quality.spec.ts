import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { initialPatients } from "../src/demo/fixtures";
import { demoPatientStorageKey, serializeDemoData } from "../src/demo/repository";

const locales = {
  es: {
    fullName: "Nombre de ejemplo",
    birthDate: "Fecha de nacimiento",
    phone: "Teléfono",
    reason: "Motivo de visita (corto)",
    symptoms: "Descripción de síntomas",
    symptom: "Fiebre",
    pain: "4 de 10",
    continue: "Continuar",
    complete: "Crear paciente sintético",
    complaint: "Escenario sintético de kiosco",
    open: "Abrir resumen simulado",
    accept: /^Simular aceptar nivel \d+$/,
    confirm: "Confirmar simulación",
    decision: /^Se aceptó el nivel ESI \d+$/,
    completion: "Escenario sintético creado",
    alertTitle: "Escenario simulado de alerta crítica",
  },
  en: {
    fullName: "Sample name",
    birthDate: "Date of birth",
    phone: "Phone",
    reason: "Reason for visit (short)",
    symptoms: "Symptom description",
    symptom: "Fever",
    pain: "4 of 10",
    continue: "Continue",
    complete: "Create synthetic patient",
    complaint: "Kiosk synthetic scenario",
    open: "Open simulated summary",
    accept: /^Simulate accept Level \d+$/,
    confirm: "Confirm simulation",
    decision: /^ESI Level \d+ accepted$/,
    completion: "Synthetic scenario created",
    alertTitle: "Simulated critical-alert scenario",
  },
} as const;

async function gotoHydrated(page: import("@playwright/test").Page, path: string) {
  await page.goto(path);
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
}

async function getHorizontalOverflow(page: import("@playwright/test").Page) {
  return page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
    elements: Array.from(document.body.querySelectorAll<HTMLElement>("*"))
      .filter((element) => {
        const bounds = element.getBoundingClientRect();
        return bounds.left < -1 || bounds.right > window.innerWidth + 1;
      })
      .slice(0, 5)
      .map((element) => ({
        className: element.getAttribute("class") ?? "",
        tag: element.tagName.toLowerCase(),
        text: element.textContent?.trim().slice(0, 80),
      })),
  }));
}

for (const [locale, copy] of Object.entries(locales)) {
  test(`completes the kiosk to triage flow in ${locale}`, async ({ page }) => {
    await page
      .context()
      .addCookies([{ name: "mp_locale", value: locale, url: "http://127.0.0.1:4173" }]);
    await gotoHydrated(page, "/kiosk");

    await page.getByLabel(copy.fullName).fill("Ada Demo");
    await page.getByLabel(copy.birthDate).fill("1980-01-01");
    await page.getByLabel(copy.phone).fill("5550101");
    await page.getByLabel(copy.reason).fill("Sample visit");
    await page.getByRole("button", { name: copy.continue }).click();
    await expect(page.getByLabel(copy.symptoms)).toBeVisible();
    await page.getByLabel(copy.symptoms).fill("Sample symptoms");
    await page.getByRole("button", { name: copy.symptom }).click();
    await page.getByRole("button", { name: copy.continue }).click();
    await page.getByRole("button", { name: copy.pain, exact: true }).click();
    await page.getByRole("button", { name: copy.continue }).click();
    await page.getByRole("button", { name: copy.complete }).click();

    await expect(page.getByText(copy.complaint)).not.toBeVisible();
    await expect(page.getByRole("heading", { name: copy.completion })).toBeVisible();
    const storedData = await page.evaluate(() => JSON.stringify(localStorage));
    for (const privateValue of ["Ada Demo", "5550101", "Sample visit", "Sample symptoms"]) {
      expect(storedData).not.toContain(privateValue);
    }

    await page
      .getByRole("button", { name: locale === "es" ? "Iniciar nueva demo" : "Start new demo" })
      .click();
    await expect(page.getByLabel(copy.fullName)).toHaveValue("");

    await page.goto("/er");
    const row = page.locator("tr", { hasText: copy.complaint });
    await expect(row).toHaveCount(1);
    const patientId = (await row.textContent())?.match(/DEMO-[A-F0-9]{8}/)?.[0];
    expect(patientId).toBeTruthy();
    await row.getByRole("link", { name: copy.open }).click();
    await expect(page).toHaveURL(`/triage/${patientId}`);
    await expect(page.getByRole("heading", { name: "Demo Kiosk Scenario 11" })).toBeVisible();
    await expect(page.getByRole("button", { name: copy.accept })).toHaveAccessibleName(/3$/);
    await expect(page.getByText(copy.alertTitle)).toHaveCount(0);
    await page.getByRole("button", { name: copy.accept }).click();
    await page.getByRole("button", { name: copy.confirm }).click();
    await expect(page.getByText(copy.decision)).toBeVisible();
  });
}

test("renders independent SSR locales and hydrates without locale warnings", async ({
  page,
  request,
}) => {
  const [spanish, english] = await Promise.all([
    request.get("/", { headers: { "accept-language": "es-MX,es;q=0.9" } }),
    request.get("/", { headers: { "accept-language": "en-GB,en;q=0.9" } }),
  ]);
  const [spanishHtml, englishHtml] = await Promise.all([spanish.text(), english.text()]);

  expect(spanishHtml).toContain('<html lang="es"');
  expect(spanishHtml).toContain("Explore un flujo de triaje simulado.");
  expect(englishHtml).toContain('<html lang="en"');
  expect(englishHtml).toContain("Explore a simulated triage workflow.");

  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && /hydration|hydrated/i.test(message.text())) {
      hydrationErrors.push(message.text());
    }
  });
  await page
    .context()
    .addCookies([{ name: "mp_locale", value: "en", url: "http://127.0.0.1:4173" }]);
  await gotoHydrated(page, "/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(hydrationErrors).toEqual([]);
});

test("preserves kiosk state when changing language and persists the language on reload", async ({
  page,
}) => {
  await page
    .context()
    .addCookies([{ name: "mp_locale", value: "es", url: "http://127.0.0.1:4173" }]);
  await gotoHydrated(page, "/kiosk");

  await page.getByLabel("Nombre de ejemplo").fill("Temporary sample");
  await page.getByLabel("Idioma").selectOption("en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByLabel("Sample name")).toHaveValue("Temporary sample");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByLabel("Sample name")).toHaveValue("");
});

test("does not renew stored data on read and reports failed writes", async ({ page }) => {
  const savedAt = Date.now() - 60_000;
  const stored = serializeDemoData({ patients: initialPatients, decisions: [] }, savedAt);
  await page
    .context()
    .addCookies([{ name: "mp_locale", value: "es", url: "http://127.0.0.1:4173" }]);
  await page.addInitScript(({ key, value }) => window.localStorage.setItem(key, value), {
    key: demoPatientStorageKey,
    value: stored,
  });
  await gotoHydrated(page, "/er");
  expect(
    await page.evaluate(
      (key) => JSON.parse(window.localStorage.getItem(key) ?? "{}").savedAt,
      demoPatientStorageKey,
    ),
  ).toBe(savedAt);

  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage blocked", "QuotaExceededError");
    };
  });
  await page.getByRole("button", { name: "Simular alta de paciente" }).click();
  await page.getByRole("button", { name: "Confirmar simulación" }).click();
  await expect(
    page.getByText(
      "El almacenamiento local no está disponible; los cambios durarán solo esta sesión.",
    ),
  ).toBeVisible();
});

test("restores the initial dataset when local storage contains an empty corrupt value", async ({
  page,
}) => {
  await page
    .context()
    .addCookies([{ name: "mp_locale", value: "es", url: "http://127.0.0.1:4173" }]);
  await page.addInitScript((key) => {
    if (window.sessionStorage.getItem("corrupt-seeded")) return;
    window.localStorage.setItem(key, "");
    window.sessionStorage.setItem("corrupt-seeded", "true");
  }, demoPatientStorageKey);

  await gotoHydrated(page, "/er");
  await expect(
    page.getByText(
      "Los datos locales eran incompatibles o expiraron; se restauró el escenario inicial.",
    ),
  ).toBeVisible();
  expect(
    await page.evaluate((key) => window.localStorage.getItem(key), demoPatientStorageKey),
  ).toBe(null);
  await expect(page.locator("tbody tr")).toHaveCount(initialPatients.length);
});

test("clears an in-progress kiosk session on cancel and route abandonment", async ({ page }) => {
  await page
    .context()
    .addCookies([{ name: "mp_locale", value: "es", url: "http://127.0.0.1:4173" }]);
  await gotoHydrated(page, "/kiosk");
  const name = page.getByLabel("Nombre de ejemplo");
  await name.fill("Temporal Cancelled");
  await page.getByRole("button", { name: "Cancelar y borrar sesión" }).click();
  await expect(name).toHaveValue("");
  await expect(
    page.getByText("Sesión del kiosco borrada. No se guardó información."),
  ).toBeVisible();

  await name.fill("Temporal Abandoned");
  await page.goto("/er");
  await page.goto("/kiosk");
  await expect(page.getByLabel("Nombre de ejemplo")).toHaveValue("");
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain(
    "Temporal Abandoned",
  );
});

test("rejects a whitespace-only ESI override without reporting success", async ({ page }) => {
  await page
    .context()
    .addCookies([{ name: "mp_locale", value: "es", url: "http://127.0.0.1:4173" }]);
  await gotoHydrated(page, "/triage/DEMO-0006");
  await page.getByRole("button", { name: "Simular override" }).click();
  await page.getByLabel("Motivo del override").fill("   ");
  await page.getByRole("button", { name: "Guardar override simulado" }).click();

  await expect(page.getByRole("alert")).toHaveText("Revise este valor e inténtelo de nuevo.");
  await expect(
    page.getByText("Simulación completada localmente. No se notificó a nadie."),
  ).toHaveCount(0);
});

test("keeps mobile navigation, dialogs, and layouts keyboard-safe", async ({ page }) => {
  await page
    .context()
    .addCookies([{ name: "mp_locale", value: "es", url: "http://127.0.0.1:4173" }]);
  for (const path of ["/", "/kiosk", "/er", "/triage/DEMO-0001", "/admin"]) {
    for (const width of [320, 375, 768, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      await gotoHydrated(page, path);
      const overflow = await getHorizontalOverflow(page);
      expect(
        overflow.documentWidth,
        `${path} overflows at ${width}px: ${JSON.stringify(overflow.elements)}`,
      ).toBeLessThanOrEqual(overflow.viewportWidth);
    }
  }

  await page.setViewportSize({ width: 375, height: 900 });
  await gotoHydrated(page, "/er");
  await page.getByRole("button", { name: "Abrir menú de navegación" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("link", { name: "Tablero ER" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();

  await gotoHydrated(page, "/kiosk");
  const emergency = page.getByRole("button", { name: "¿Necesita ayuda urgente?" });
  await emergency.focus();
  await emergency.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(emergency).toBeFocused();
});

test("has no automated axe violations on principal routes", async ({ page }) => {
  test.setTimeout(60_000);
  await page
    .context()
    .addCookies([{ name: "mp_locale", value: "es", url: "http://127.0.0.1:4173" }]);
  for (const path of ["/", "/kiosk", "/er", "/triage/DEMO-0001", "/admin"]) {
    await gotoHydrated(page, path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, `${path}: ${JSON.stringify(results.violations, null, 2)}`).toEqual(
      [],
    );
  }

  await gotoHydrated(page, "/kiosk");
  await page.getByRole("button", { name: "Continuar" }).click();
  let results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations,
    `kiosk errors: ${JSON.stringify(results.violations, null, 2)}`,
  ).toEqual([]);
  await page.getByRole("button", { name: "¿Necesita ayuda urgente?" }).click();
  results = await new AxeBuilder({ page }).analyze();
  expect(results.violations, `open dialog: ${JSON.stringify(results.violations, null, 2)}`).toEqual(
    [],
  );
});
