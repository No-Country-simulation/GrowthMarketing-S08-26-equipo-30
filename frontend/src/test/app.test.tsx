import { describe, it, expect, afterEach } from "vitest";
import { screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderApp } from "@/test/renderApp";
import { STORAGE_KEY } from "@/demo/demoStorage";

afterEach(() => {
  window.localStorage.clear();
});

const PAGE_TITLES: Record<string, string> = {
  "/": "Resumen de crecimiento",
  "/funnel": "Funnel de conversión",
  "/canales": "Canales de adquisición",
  "/segmentos": "Segmentos por intención",
  "/campanas": "Campañas activas",
  "/oportunidades": "Oportunidades detectadas",
  "/experimentos": "Experimentos",
};

describe("Navegación", () => {
  it("renderiza cada ruta y soporta recargas", async () => {
    for (const [path, title] of Object.entries(PAGE_TITLES)) {
      const { unmount } = renderApp(path);
      expect(await screen.findByRole("heading", { name: title })).toBeInTheDocument();
      unmount();
    }
  });

  it("una ruta inexistente redirige a /", async () => {
    renderApp("/no-existe");
    expect(
      await screen.findByRole("heading", { name: "Resumen de crecimiento" }),
    ).toBeInTheDocument();
  });

  it("funciona atrás y adelante", async () => {
    const user = userEvent.setup();
    const { router } = renderApp("/");
    await user.click(screen.getByRole("link", { name: "Funnel" }));
    expect(
      await screen.findByRole("heading", { name: "Funnel de conversión" }),
    ).toBeInTheDocument();

    router.navigate(-1);
    expect(
      await screen.findByRole("heading", { name: "Resumen de crecimiento" }),
    ).toBeInTheDocument();

    router.navigate(1);
    expect(
      await screen.findByRole("heading", { name: "Funnel de conversión" }),
    ).toBeInTheDocument();
  });

  it("el sidebar refleja la ruta activa", async () => {
    const user = userEvent.setup();
    renderApp("/funnel");
    const funnelLink = screen.getByRole("link", { name: "Funnel" });
    expect(funnelLink.className).toContain("nav-item-active");
    await user.click(screen.getByRole("link", { name: "Canales" }));
    await waitFor(() => {
      expect(funnelLink.className).not.toContain("nav-item-active");
      expect(screen.getByRole("link", { name: "Canales" }).className).toContain(
        "nav-item-active",
      );
    });
  });
});

describe("Filtros de período y canal", () => {
  it("cambiar el período recalcula las métricas", async () => {
    const user = userEvent.setup();
    renderApp("/");
    expect(screen.getAllByText("184.320").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Últimos 30 días" }));
    await user.click(screen.getByText("Últimos 7 días"));

    expect(screen.getAllByText("44.236").length).toBeGreaterThan(0);
    expect(screen.queryByText("184.320")).not.toBeInTheDocument();
  });

  it("cambiar el canal filtra funnel y resumen", async () => {
    const user = userEvent.setup();
    renderApp("/");
    await user.click(screen.getByRole("button", { name: "Todos los canales" }));
    await user.click(screen.getByText("Meta Ads · prospecting"));

    expect(screen.getAllByText("44.250").length).toBeGreaterThan(0);
    expect(screen.getAllByText("4,0 %").length).toBeGreaterThan(0);
  });

  it("la selección de período se conserva al cambiar de flujo", async () => {
    const user = userEvent.setup();
    renderApp("/");
    await user.click(screen.getByRole("button", { name: "Últimos 30 días" }));
    await user.click(screen.getByText("Últimos 90 días"));
    await user.click(screen.getByRole("link", { name: "Funnel" }));
    expect(
      await screen.findByRole("button", { name: "Últimos 90 días" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("525.313").length).toBeGreaterThan(0);
  });
});

describe("Navegación contextual", () => {
  it("un KPI del resumen lleva a la etapa del funnel", async () => {
    const user = userEvent.setup();
    renderApp("/");
    await user.click(screen.getByRole("button", { name: /Ver etapa clientes en el funnel/ }));
    expect(
      await screen.findByRole("heading", { name: "Funnel de conversión" }),
    ).toBeInTheDocument();
  });

  it("una etapa del funnel abre oportunidades relacionadas", async () => {
    const user = userEvent.setup();
    renderApp("/funnel");
    await user.click(
      screen.getByRole("button", { name: /etapa activados/i }),
    );
    expect(
      await screen.findByRole("heading", { name: "Oportunidades detectadas" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Reducir la caída post-activación")).toBeInTheDocument();
  });

  it("la alerta del funnel abre la oportunidad relacionada", async () => {
    const user = userEvent.setup();
    renderApp("/funnel");
    await user.click(
      screen.getByRole("button", { name: "Ver la oportunidad de la mayor caída" }),
    );
    expect(
      await screen.findByRole("heading", { name: "Oportunidades detectadas" }),
    ).toBeInTheDocument();
  });

  it("un canal lleva a sus campañas", async () => {
    const user = userEvent.setup();
    renderApp("/canales");
    const channelRows = screen.getAllByRole("button", {
      name: "Ver campañas del canal Meta Ads · prospecting",
    });
    await user.click(channelRows[0]);
    expect(
      await screen.findByRole("heading", { name: "Campañas activas" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Q3 · Meta prospecting ES")).toBeInTheDocument();
  });
});

describe("Búsqueda global", () => {
  it("busca una entidad y navega a su flujo", async () => {
    const user = userEvent.setup();
    renderApp("/");
    await user.type(screen.getByRole("textbox", { name: "Buscar" }), "Comparador");

    const segmentOption = await screen.findByRole("option", {
      name: "Comparador",
    });
    await user.click(segmentOption);

    expect(
      await screen.findByRole("heading", { name: "Segmentos por intención" }),
    ).toBeInTheDocument();
  });

  it("muestra estado vacío cuando no hay resultados", async () => {
    const user = userEvent.setup();
    renderApp("/");
    await user.type(screen.getByRole("textbox", { name: "Buscar" }), "zzz-no-existe");
    expect(
      await screen.findByText(/No hay resultados para/),
    ).toBeInTheDocument();
  });
});

describe("CRUD de campañas", () => {
  it("crea, edita, pausa y elimina una campaña", async () => {
    const user = userEvent.setup();
    renderApp("/campanas");

    await user.click(screen.getByRole("button", { name: "Nueva campaña" }));
    await user.type(screen.getByLabelText("Nombre"), "Campaña de prueba");
    await user.type(screen.getByLabelText("Rango de fechas"), "1 sep – 6 sep 2026");
    await user.click(screen.getByRole("checkbox", { name: "Meta Ads · prospecting" }));
    const visits = screen.getByLabelText("Visitas");
    await user.clear(visits);
    await user.type(visits, "1000");
    const registrations = screen.getByLabelText("Registros");
    await user.clear(registrations);
    await user.type(registrations, "100");
    const customers = screen.getByLabelText("Clientes");
    await user.clear(customers);
    await user.type(customers, "20");
    const retained = screen.getByLabelText("Retenidos");
    await user.clear(retained);
    await user.type(retained, "10");
    await user.click(screen.getByRole("button", { name: "Crear campaña" }));

    const created = await screen.findByText("Campaña de prueba");
    expect(created).toBeInTheDocument();
    expect(
      within(created.closest(".campaign-card") as HTMLElement).getByText("Activo"),
    ).toBeInTheDocument();

    // Expandir y pausar (la tarjeta queda expandida tras la acción)
    const createdCard = created.closest(".campaign-card") as HTMLElement;
    await user.click(screen.getByRole("button", { name: /Acciones de Campaña de prueba/ }));
    await user.click(within(createdCard).getByRole("button", { name: "Pausar" }));
    expect(await within(createdCard).findByText("Pausado")).toBeInTheDocument();

    // Editar (sigue expandida)
    await user.click(within(createdCard).getByRole("button", { name: "Editar" }));
    const nombre = screen.getByLabelText("Nombre");
    await user.clear(nombre);
    await user.type(nombre, "Campaña editada");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));
    const edited = await screen.findByText("Campaña editada");
    const editedCard = edited.closest(".campaign-card") as HTMLElement;
    expect(editedCard).toBeInTheDocument();

    // Eliminar
    await user.click(within(editedCard).getByRole("button", { name: "Eliminar" }));
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "Eliminar" }),
    );
    await waitFor(() => {
      expect(screen.queryByText("Campaña editada")).not.toBeInTheDocument();
    });
  });
});

describe("CRUD de segmentos", () => {
  it("crea, edita y elimina un segmento", async () => {
    const user = userEvent.setup();
    renderApp("/segmentos");

    await user.click(screen.getByRole("button", { name: "Nuevo segmento" }));
    await user.type(screen.getByLabelText("Nombre"), "Segmento de prueba");
    const usuarios = screen.getByLabelText("Usuarios");
    await user.clear(usuarios);
    await user.type(usuarios, "500");
    const convertidos = screen.getByLabelText("Convertidos");
    await user.clear(convertidos);
    await user.type(convertidos, "100");
    await user.click(screen.getByRole("button", { name: "Crear segmento" }));

    const findSegmentCard = (name: string) =>
      screen
        .getAllByRole("button", { name: `Ver campañas del segmento ${name}` })
        .find((element) => element.closest(".segment-card"));
    expect(findSegmentCard("Segmento de prueba")).toBeDefined();

    // Editar
    await user.click(
      within(findSegmentCard("Segmento de prueba")!).getByRole("button", { name: "Editar" }),
    );
    const nombre = screen.getByLabelText("Nombre");
    await user.clear(nombre);
    await user.type(nombre, "Segmento editado");
    await user.click(screen.getByRole("button", { name: "Guardar cambios" }));
    await waitFor(() => {
      expect(findSegmentCard("Segmento editado")).toBeDefined();
    });

    // Eliminar
    await user.click(
      within(findSegmentCard("Segmento editado")!).getByRole("button", { name: "Eliminar" }),
    );
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "Eliminar" }),
    );
    await waitFor(() => {
      expect(screen.queryByText("Segmento editado")).not.toBeInTheDocument();
    });
  });

  it("valida convertidos <= usuarios", async () => {
    const user = userEvent.setup();
    renderApp("/segmentos");
    await user.click(screen.getByRole("button", { name: "Nuevo segmento" }));
    await user.type(screen.getByLabelText("Nombre"), "Segmento inválido");
    const usuarios = screen.getByLabelText("Usuarios");
    await user.clear(usuarios);
    await user.type(usuarios, "10");
    const convertidos = screen.getByLabelText("Convertidos");
    await user.clear(convertidos);
    await user.type(convertidos, "50");
    expect(
      await screen.findByText("Los convertidos no pueden superar a los usuarios."),
    ).toBeInTheDocument();
    const submit = screen.getByRole("button", { name: "Crear segmento" });
    expect(submit).toBeDisabled();
  });
});

describe("Oportunidades", () => {
  it("crea una oportunidad y la descarta / reabre", async () => {
    const user = userEvent.setup();
    renderApp("/oportunidades");

    await user.click(screen.getByRole("button", { name: "Nueva oportunidad" }));
    await user.type(screen.getByLabelText("Título"), "Oportunidad de prueba");
    const usuarios = screen.getByLabelText("Usuarios en juego");
    await user.clear(usuarios);
    await user.type(usuarios, "500");
    await user.type(screen.getByLabelText("Métrica objetivo"), "Conversión a pago");
    await user.click(screen.getByRole("button", { name: "Crear oportunidad" }));

    expect(await screen.findByText("Oportunidad de prueba")).toBeInTheDocument();

    const card = screen.getByText("Oportunidad de prueba").closest(".opportunity-card") as HTMLElement;
    await user.click(
      within(card).getByRole("button", { name: /Acciones de la oportunidad Oportunidad de prueba/ }),
    );
    await user.click(within(card).getByRole("menuitem", { name: "Descartar" }));
    expect(await within(card).findByText("Descartada")).toBeInTheDocument();

    await user.click(within(card).getByRole("button", { name: "Reabrir" }));
    expect(
      await within(card).findByRole("button", { name: /Crear hipótesis/ }),
    ).toBeInTheDocument();
  });

  it("filtra oportunidades por etapa del funnel", async () => {
    renderApp("/oportunidades?stage=clientes");
    expect(await screen.findByText("Reducir la caída post-activación")).toBeInTheDocument();
    expect(screen.getByText("Frenar la fuga de clientes nuevos")).toBeInTheDocument();
    expect(screen.queryByText("Simplificar el onboarding")).not.toBeInTheDocument();
  });
});

describe("Ciclo completo de experimento", () => {
  it("oportunidad → hipótesis → lanzamiento → detalle → cierre", async () => {
    const user = userEvent.setup();
    renderApp("/oportunidades");

    const firstCard = screen.getByText("Reducir la caída post-activación").closest(
      ".opportunity-card",
    ) as HTMLElement;
    await user.click(within(firstCard).getByRole("button", { name: "Crear hipótesis" }));

    await user.type(screen.getByLabelText("Versión A"), "Onboarding actual");
    await user.type(screen.getByLabelText("Versión B"), "Onboarding guiado");
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "Crear hipótesis" }),
    );

    // Navega a experimentos, el nuevo experimento queda planificado
    expect(
      await screen.findByRole("heading", { name: "Experimentos" }),
    ).toBeInTheDocument();
    const newCard = screen.getByText("Reducir la caída post-activación").closest(
      ".experiment-card",
    ) as HTMLElement;
    expect(within(newCard).getByText("Planificado")).toBeInTheDocument();

    // La oportunidad queda en experimento
    await user.click(screen.getByRole("link", { name: "Oportunidades" }));
    const updatedCard = screen.getByText("Reducir la caída post-activación").closest(
      ".opportunity-card",
    ) as HTMLElement;
    expect(within(updatedCard).getByText("En experimento")).toBeInTheDocument();

    // Lanzar
    await user.click(screen.getByRole("link", { name: "Experimentos" }));
    const plannedCard = screen.getByText("Reducir la caída post-activación").closest(
      ".experiment-card",
    ) as HTMLElement;
    await user.click(within(plannedCard).getByRole("button", { name: "Lanzar" }));
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "Lanzar" }),
    );

    // Detalle en curso
    expect(
      await screen.findByRole("heading", { name: "Reducir la caída post-activación" }),
    ).toBeInTheDocument();
    expect(screen.getByText("En curso")).toBeInTheDocument();

    // Cerrar
    await user.click(screen.getByRole("button", { name: "Cerrar experimento" }));
    await user.click(screen.getByRole("button", { name: /Validado/ }));
    const convA = screen.getByLabelText("Conversión A (%)");
    await user.type(convA, "4,5");
    await user.type(screen.getByLabelText("Conversión B (%)"), "5,6");
    await user.type(screen.getByLabelText("Aprendizaje"), "B rinde mejor");
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "Cerrar experimento" }),
    );

    expect(await screen.findByText("A 4,5 % · B 5,6 %")).toBeInTheDocument();
    expect(screen.getByText("B rinde mejor")).toBeInTheDocument();
    expect(screen.getByText("Validado")).toBeInTheDocument();
  });

  it("un experimento inexistente redirige a la lista", async () => {
    renderApp("/experimentos/exp-no-existe");
    expect(
      await screen.findByRole("heading", { name: "Experimentos" }),
    ).toBeInTheDocument();
  });
});

describe("Persistencia y reinicio", () => {
  it("sobrevive a una recarga", async () => {
    const user = userEvent.setup();
    const first = renderApp("/campanas");
    await user.click(screen.getByRole("button", { name: "Nueva campaña" }));
    await user.type(screen.getByLabelText("Nombre"), "Campaña persistente");
    await user.click(screen.getByRole("checkbox", { name: "Búsqueda orgánica" }));
    await user.click(screen.getByRole("button", { name: "Crear campaña" }));
    expect(await screen.findByText("Campaña persistente")).toBeInTheDocument();
    first.unmount();

    const second = renderApp("/campanas", { clearStorage: false });
    expect(await second.findByText("Campaña persistente")).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull();
  });

  it("reinicar la demo restaura el estado inicial", async () => {
    const user = userEvent.setup();
    renderApp("/campanas");
    await user.click(screen.getByRole("button", { name: "Nueva campaña" }));
    await user.type(screen.getByLabelText("Nombre"), "Campaña a borrar");
    await user.click(screen.getByRole("checkbox", { name: "Búsqueda orgánica" }));
    await user.click(screen.getByRole("button", { name: "Crear campaña" }));
    expect(await screen.findByText("Campaña a borrar")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Menú de usuario" }));
    await user.click(screen.getByRole("menuitem", { name: "Reiniciar demo" }));
    await user.click(screen.getByRole("button", { name: "Reiniciar" }));

    expect(
      await screen.findByRole("heading", { name: "Resumen de crecimiento" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Demo restaurada")).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Campañas" }));
    await waitFor(() => {
      expect(screen.queryByText("Campaña a borrar")).not.toBeInTheDocument();
    });
  });
});

describe("Accesibilidad de modales", () => {
  it("Escape cierra el modal y devuelve el foco", async () => {
    const user = userEvent.setup();
    renderApp("/campanas");
    const openButton = screen.getByRole("button", { name: "Nueva campaña" });
    await user.click(openButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(document.activeElement).toBe(openButton);
  });

  it("el clic en el overlay cierra el modal", async () => {
    const user = userEvent.setup();
    renderApp("/segmentos");
    await user.click(screen.getByRole("button", { name: "Nuevo segmento" }));
    const dialog = screen.getByRole("dialog");
    await user.click(dialog.parentElement!);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});