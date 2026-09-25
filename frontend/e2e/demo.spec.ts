import { expect, test, type Page } from "@playwright/test";

const FLOWS = [
  { path: "/", title: "Resumen de crecimiento" },
  { path: "/funnel", title: "Funnel de conversión" },
  { path: "/canales", title: "Canales de adquisición" },
  { path: "/segmentos", title: "Segmentos por intención" },
  { path: "/campanas", title: "Campañas activas" },
  { path: "/oportunidades", title: "Oportunidades detectadas" },
  { path: "/experimentos", title: "Experimentos" },
];

async function collectErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("requestfailed", (request) =>
    errors.push(`requestfailed: ${request.url()}`),
  );
  return errors;
}

async function assertNoBrokenImages(page: Page): Promise<void> {
  const broken = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll("img"));
    return images
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.getAttribute("src"));
  });
  expect(broken, `imágenes rotas: ${broken.join(", ")}`).toEqual([]);
}

async function expectNoHorizontalOverflow(
  page: Page,
  maxWidth: number,
): Promise<void> {
  const scrollWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  expect(scrollWidth).toBeLessThanOrEqual(maxWidth);
}

test("navegación por todas las rutas y recarga de cada URL", async ({ page }) => {
  for (const flow of FLOWS) {
    await page.goto(flow.path);
    await expect(page.getByRole("heading", { name: flow.title })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { name: flow.title })).toBeVisible();
    await assertNoBrokenImages(page);
  }
});

test("atrás y adelante del navegador", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Funnel" }).click();
  await expect(page.getByRole("heading", { name: "Funnel de conversión" })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Resumen de crecimiento" })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole("heading", { name: "Funnel de conversión" })).toBeVisible();
});

test("cambio de período y canal recalcula métricas coherentes", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("184.320").first()).toBeVisible();

  await page.getByRole("button", { name: "Últimos 30 días" }).click();
  await page.getByRole("option", { name: /Últimos 7 días/ }).click();
  await expect(page.getByText("44.236").first()).toBeVisible();
  await expect(page.getByText("184.320")).toHaveCount(0);

  await page.getByRole("button", { name: "Últimos 7 días" }).click();
  await page.getByRole("option", { name: /Últimos 30 días/ }).click();
  await page.getByRole("button", { name: "Todos los canales" }).click();
  await page.getByRole("option", { name: "Meta Ads · prospecting" }).click();
  await expect(page.getByText("44.250").first()).toBeVisible();
});

test("búsqueda global abre una entidad", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "Buscar" }).fill("Comparador");
  await page.getByRole("option", { name: "Comparador" }).click();
  await expect(page.getByRole("heading", { name: "Segmentos por intención" })).toBeVisible();
});

test("CRUD completo de campaña", async ({ page }) => {
  await page.goto("/campanas");
  await page.getByRole("button", { name: "Nueva campaña" }).click();
  await page.getByLabel("Nombre").fill("Campaña E2E");
  await page.getByRole("checkbox", { name: "Meta Ads · prospecting" }).check();
  const visits = page.getByLabel("Visitas");
  await visits.fill("1000");
  await page.getByLabel("Registros").fill("100");
  await page.getByLabel("Clientes").fill("20");
  await page.getByLabel("Retenidos").fill("10");
  await page.getByRole("button", { name: "Crear campaña" }).click();
  const createdCard = page.locator(".campaign-card", { hasText: "Campaña E2E" });
  await expect(createdCard).toBeVisible();

  await createdCard.click();
  await createdCard.getByRole("button", { name: "Pausar" }).click();
  await expect(createdCard.getByText("Pausado")).toBeVisible();

  await createdCard.getByRole("button", { name: "Editar" }).click();
  await page.getByLabel("Nombre").fill("Campaña E2E editada");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  const editedCard = page.locator(".campaign-card", { hasText: "Campaña E2E editada" });
  await expect(editedCard).toBeVisible();

  await editedCard.getByRole("button", { name: "Eliminar" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Eliminar" }).click();
  await expect(editedCard).toHaveCount(0);
});

test("CRUD completo de segmento", async ({ page }) => {
  await page.goto("/segmentos");
  await page.getByRole("button", { name: "Nuevo segmento" }).click();
  await page.getByLabel("Nombre").fill("Segmento E2E");
  await page.getByLabel("Usuarios").fill("500");
  await page.getByLabel("Convertidos").fill("100");
  await page.getByRole("button", { name: "Crear segmento" }).click();
  const segmentCard = page.locator(".segment-card", { hasText: "Segmento E2E" });
  await expect(segmentCard).toBeVisible();

  await segmentCard.getByRole("button", { name: "Editar" }).click();
  await page.getByLabel("Nombre").fill("Segmento E2E editado");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  const editedCard = page.locator(".segment-card", { hasText: "Segmento E2E editado" });
  await expect(editedCard).toBeVisible();

  await editedCard.getByRole("button", { name: "Eliminar" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Eliminar" }).click();
  await expect(editedCard).toHaveCount(0);
});

test("oportunidad: crear, descartar y reabrir", async ({ page }) => {
  await page.goto("/oportunidades");
  await page.getByRole("button", { name: "Nueva oportunidad" }).click();
  await page.getByLabel("Título").fill("Oportunidad E2E");
  await page.getByLabel("Usuarios en juego").fill("500");
  await page.getByRole("button", { name: "Crear oportunidad" }).click();
  const card = page.locator(".opportunity-card", { hasText: "Oportunidad E2E" });
  await expect(card).toBeVisible();
  await card.getByRole("button", { name: /Acciones de la oportunidad/ }).click();
  await card.getByRole("menuitem", { name: "Descartar" }).click();
  await expect(card.getByText("Descartada")).toBeVisible();

  await card.getByRole("button", { name: "Reabrir" }).click();
  await expect(card.getByRole("button", { name: "Crear hipótesis" })).toBeVisible();
});

test("ciclo completo: oportunidad → hipótesis → lanzamiento → detalle → cierre", async ({
  page,
}) => {
  await page.goto("/oportunidades");
  const firstCard = page
    .locator(".opportunity-card", { hasText: "Reducir la caída post-activación" });
  await firstCard.getByRole("button", { name: "Crear hipótesis" }).click();

  await page.getByLabel("Versión A").fill("Onboarding actual");
  await page.getByLabel("Versión B").fill("Onboarding guiado");
  await page.getByRole("dialog").getByRole("button", { name: "Crear hipótesis" }).click();

  await expect(page.getByRole("heading", { name: "Experimentos" })).toBeVisible();
  const expCard = page
    .locator(".experiment-card", { hasText: "Reducir la caída post-activación" });
  await expect(expCard.getByText("Planificado")).toBeVisible();

  await page.getByRole("link", { name: "Oportunidades" }).click();
  await expect(
    page
      .locator(".opportunity-card", { hasText: "Reducir la caída post-activación" })
      .getByText("En experimento"),
  ).toBeVisible();

  await page.getByRole("link", { name: "Experimentos" }).click();
  await expCard.getByRole("button", { name: "Lanzar" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Lanzar" }).click();

  await page.getByRole("button", { name: "Cerrar experimento" }).waitFor();
  await expect(
    page.locator(".experiment-detail-summary").getByText("En curso"),
  ).toBeVisible();

  await page.getByRole("button", { name: "Cerrar experimento" }).click();
  await page.getByRole("button", { name: /Validado/ }).click();
  await page.getByLabel("Conversión A (%)").fill("4,5");
  await page.getByLabel("Conversión B (%)").fill("5,6");
  await page.getByLabel("Aprendizaje").fill("B rinde mejor");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Cerrar experimento" })
    .click();

  await expect(page.getByText("A 4,5 % · B 5,6 %")).toBeVisible();
  await expect(page.getByText("B rinde mejor")).toBeVisible();
});

test("persistencia tras recargar", async ({ page }) => {
  await page.goto("/campanas");
  await page.getByRole("button", { name: "Nueva campaña" }).click();
  await page.getByLabel("Nombre").fill("Campaña persistente");
  await page.getByRole("checkbox", { name: "Búsqueda orgánica" }).check();
  await page.getByRole("button", { name: "Crear campaña" }).click();
  await expect(page.getByRole("heading", { name: "Campaña persistente" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Campaña persistente" })).toBeVisible();
});

test("reinicio completo de la demo", async ({ page }) => {
  await page.goto("/campanas");
  await page.getByRole("button", { name: "Nueva campaña" }).click();
  await page.getByLabel("Nombre").fill("Campaña a borrar");
  await page.getByRole("checkbox", { name: "Búsqueda orgánica" }).check();
  await page.getByRole("button", { name: "Crear campaña" }).click();
  await expect(page.getByRole("heading", { name: "Campaña a borrar" })).toBeVisible();

  await page.getByRole("button", { name: "Menú de usuario" }).click();
  await page.getByRole("menuitem", { name: "Reiniciar demo" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Reiniciar" }).click();

  await expect(page.getByRole("heading", { name: "Resumen de crecimiento" })).toBeVisible();
  await expect(page.getByText("Demo restaurada")).toBeVisible();

  await page.getByRole("link", { name: "Campañas" }).click();
  await expect(page.getByRole("heading", { name: "Campaña a borrar" })).toHaveCount(0);
});

test("modales: Escape cierra y restaura el foco", async ({ page }) => {
  await page.goto("/segmentos");
  const openButton = page.getByRole("button", { name: "Nuevo segmento" });
  await openButton.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(openButton).toBeFocused();
});

test("sin errores de consola ni imágenes rotas en los flujos", async ({ page }) => {
  const errors = await collectErrors(page);
  for (const flow of FLOWS) {
    await page.goto(flow.path);
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: flow.title })).toBeVisible();
    await assertNoBrokenImages(page);
  }
  expect(errors).toEqual([]);
});

test("sin overflow horizontal a 1440 y 1024 px", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1527 });
  for (const flow of FLOWS) {
    await page.goto(flow.path);
    await expectNoHorizontalOverflow(page, 1440);
  }
  await page.setViewportSize({ width: 1024, height: 1527 });
  for (const flow of FLOWS) {
    await page.goto(flow.path);
    await expectNoHorizontalOverflow(page, 1440);
  }
});

test("captura de pantallas por flujo para comparación visual", async ({ page }) => {
  for (const flow of FLOWS) {
    await page.goto(flow.path);
    const name = flow.path === "/" ? "resumen" : flow.path.replace("/", "");
    await page.screenshot({
      path: `e2e/screenshots/${name}.png`,
      fullPage: true,
    });
  }
});