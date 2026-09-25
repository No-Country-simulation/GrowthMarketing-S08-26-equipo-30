import { describe, it, expect } from "vitest";
import { createSeedState } from "@/demo/demoSeed";
import {
  selectCampaigns,
  selectChannels,
  selectChannelQuality,
  selectDashboardKpis,
  selectDashboardMetrics,
  selectExperiments,
  selectFunnel,
  selectGlobalSearchResults,
  selectOpportunities,
  selectSegments,
} from "@/demo/demoSelectors";
import { SCALE_BY_RANGE } from "@/demo/demoScenarios";

function stateWith(dateRange: "last7" | "last30" | "last90", channelId = "all") {
  const state = createSeedState();
  state.filters.dateRange = dateRange;
  state.filters.channelId = channelId;
  return state;
}

describe("selectDashboardMetrics", () => {
  it("reproduce los números exactos de Figma en last30 + all", () => {
    const metrics = selectDashboardMetrics(createSeedState());
    expect(metrics.visits).toBe(184320);
    expect(metrics.registrations).toBe(12534);
    expect(metrics.activados).toBe(7148);
    expect(metrics.clientes).toBe(1842);
    expect(metrics.retenidos).toBe(759);
  });

  it("formatea los KPIs como en el diseño", () => {
    const kpis = selectDashboardKpis(createSeedState());
    expect(kpis[0].value).toBe("184.320");
    expect(kpis[1].value).toBe("6,8 %");
    expect(kpis[2].value).toBe("1.842");
    expect(kpis[3].value).toBe("41,2 %");
  });

  it.each([
    ["last7", SCALE_BY_RANGE.last7],
    ["last30", SCALE_BY_RANGE.last30],
    ["last90", SCALE_BY_RANGE.last90],
  ] as const)("%s escala el volumen base por %s", (range, scale) => {
    const state = stateWith(range);
    const metrics = selectDashboardMetrics(state);
    const expectedVisits = state.channels.reduce(
      (sum, channel) => sum + Math.round(channel.visits * scale),
      0,
    );
    const expectedRegistrations = state.channels.reduce(
      (sum, channel) => sum + Math.round(channel.registrations * scale),
      0,
    );
    expect(metrics.visits).toBe(expectedVisits);
    expect(metrics.registrations).toBe(expectedRegistrations);
  });

  it("mantiene retenidos <= clientes <= activados <= registros <= visitas en todos los escenarios", () => {
    for (const range of ["last7", "last30", "last90"] as const) {
      const state = stateWith(range);
      for (const channel of state.channels) {
        state.filters.channelId = channel.id;
        const metrics = selectDashboardMetrics(state);
        expect(
          metrics.retenidos <= metrics.clientes &&
            metrics.clientes <= metrics.activados &&
            metrics.activados <= metrics.registrations &&
            metrics.registrations <= metrics.visits,
        ).toBe(true);
      }
    }
  });

  it("al filtrar por canal usa solo los datos de ese canal", () => {
    const state = stateWith("last30", "ch-meta");
    const metrics = selectDashboardMetrics(state);
    expect(metrics.visits).toBe(44250);
    expect(metrics.registrations).toBe(1770);
  });
});

describe("selectFunnel", () => {
  it("reproduce las etapas y caídas del diseño", () => {
    const funnel = selectFunnel(createSeedState());
    expect(funnel.stages.map((stage) => stage.value)).toEqual([
      "184.320",
      "12.534",
      "7.148",
      "1.842",
      "759",
    ]);
    expect(funnel.stages[0].dropText).toContain("171.786");
    expect(funnel.alert.badge).toBe("-74,2 %");
    expect(funnel.metrics[0].value).toBe("1,00 %");
  });
});

describe("selectChannels", () => {
  it("listas 8 canales con totales del diseño", () => {
    const view = selectChannels(createSeedState());
    expect(view.channels).toHaveLength(8);
    expect(view.channels[0].name).toBe("Referidos partner");
    expect(view.channels[0].conversion).toBe("13,0 %");
    expect(view.total.visits).toBe("184.320");
    expect(view.total.registrations).toBe("12.534");
  });

  it("muestra solo el canal seleccionado", () => {
    const view = selectChannels(stateWith("last30", "ch-seo"));
    expect(view.channels).toHaveLength(1);
    expect(view.channels[0].name).toBe("Búsqueda orgánica");
  });
});

describe("selectChannelQuality", () => {
  it("agrupa registros por calidad", () => {
    const quality = selectChannelQuality(createSeedState());
    expect(quality[0].value).toBe("5.602");
    expect(quality[0].percentage).toBe("44,7 %");
    expect(quality[1].value).toBe("3.543");
    expect(quality[2].value).toBe("3.389");
  });
});

describe("selectSegments", () => {
  it("calcula distribución sobre los usuarios registrados", () => {
    const view = selectSegments(createSeedState());
    expect(view.totalUsers).toBe(12534);
    expect(view.items).toHaveLength(5);
    expect(view.items[0].name).toBe("Explorador");
    expect(view.items[0].basePercent).toBe("34,2 %");
    expect(view.items[0].footer).toBe("4.287 usuarios · 77 clientes");
  });
});

describe("selectCampaigns", () => {
  it("calcula conversiones y retención de las campañas", () => {
    const campaigns = selectCampaigns(createSeedState());
    expect(campaigns).toHaveLength(3);
    expect(campaigns[0].summary.registrationConversion).toBe("4,2 %");
    expect(campaigns[0].summary.retentionTone).toBe("error");
    expect(campaigns[1].summary.retentionTone).toBe("success");
  });

  it("filtra por canal", () => {
    const campaigns = selectCampaigns(createSeedState(), { channel: "ch-meta" });
    expect(campaigns.map((campaign) => campaign.id)).toEqual(["camp-01"]);
  });
});

describe("selectOpportunities", () => {
  it("filtra por etapa", () => {
    const opportunities = selectOpportunities(createSeedState(), {
      stage: "clientes",
    });
    expect(opportunities.map((item) => item.record.id).sort()).toEqual([
      "op-01",
      "op-04",
    ]);
  });
});

describe("selectExperiments", () => {
  it("computa el resultado desde conversiones numéricas", () => {
    const experiments = selectExperiments(createSeedState());
    const closed = experiments.find((item) => item.status === "validado");
    expect(closed?.result).toBe("A 54,1 % · B 61,8 %");
  });
});

describe("selectGlobalSearchResults", () => {
  it("busca en todas las entidades", () => {
    const results = selectGlobalSearchResults(createSeedState(), "meta");
    expect(results.campaigns.length).toBeGreaterThan(0);
    expect(results.experiments.length).toBeGreaterThan(0);
  });

  it("no devuelve nada con búsqueda vacía", () => {
    const results = selectGlobalSearchResults(createSeedState(), "");
    expect(results.campaigns).toHaveLength(0);
    expect(results.experiments).toHaveLength(0);
  });
});