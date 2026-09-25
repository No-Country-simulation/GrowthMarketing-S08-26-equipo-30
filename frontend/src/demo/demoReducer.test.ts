import { describe, it, expect } from "vitest";
import { createSeedState } from "@/demo/demoSeed";
import { demoReducer } from "@/demo/demoReducer";
import type { CampaignRecord, SegmentRecord } from "@/demo/demoTypes";

describe("demoReducer", () => {
  it("SET_SEARCH / SET_DATE_RANGE / SET_CHANNEL actualizan filtros", () => {
    let state = createSeedState();
    state = demoReducer(state, { type: "SET_SEARCH", search: "meta" });
    state = demoReducer(state, { type: "SET_DATE_RANGE", dateRange: "last7" });
    state = demoReducer(state, { type: "SET_CHANNEL", channelId: "ch-meta" });
    expect(state.filters).toEqual({
      search: "meta",
      dateRange: "last7",
      channelId: "ch-meta",
    });
  });

  it("CRUD de campañas", () => {
    let state = createSeedState();
    const campaign: CampaignRecord = {
      id: "camp-nuevo",
      title: "Campaña de prueba",
      status: "activo",
      dateRange: "1 sep – 6 sep 2026",
      channels: ["ch-meta"],
      visits: 1000,
      registrations: 100,
      customers: 20,
      retained: 10,
      segmentId: "seg-exp",
      metricsBarWidths: [212, 21, 4, 2],
    };
    state = demoReducer(state, { type: "CAMPAIGN_CREATE", campaign });
    expect(state.campaigns).toHaveLength(4);

    state = demoReducer(state, {
      type: "CAMPAIGN_SET_STATUS",
      id: "camp-nuevo",
      status: "pausado",
    });
    expect(state.campaigns.find((item) => item.id === "camp-nuevo")?.status).toBe(
      "pausado",
    );

    state = demoReducer(state, {
      type: "CAMPAIGN_UPDATE",
      campaign: { ...campaign, title: "Campaña editada" },
    });
    expect(state.campaigns.find((item) => item.id === "camp-nuevo")?.title).toBe(
      "Campaña editada",
    );

    state = demoReducer(state, { type: "CAMPAIGN_DELETE", id: "camp-nuevo" });
    expect(state.campaigns).toHaveLength(3);
  });

  it("no permite eliminar el último segmento", () => {
    let state = createSeedState();
    state = demoReducer(state, {
      type: "SEGMENT_DELETE",
      id: "seg-rec",
    });
    state = demoReducer(state, {
      type: "SEGMENT_DELETE",
      id: "seg-list",
    });
    state = demoReducer(state, {
      type: "SEGMENT_DELETE",
      id: "seg-comp",
    });
    state = demoReducer(state, {
      type: "SEGMENT_DELETE",
      id: "seg-inv",
    });
    const remaining = state.segments;
    expect(remaining).toHaveLength(1);
    const before = state;
    state = demoReducer(state, {
      type: "SEGMENT_DELETE",
      id: remaining[0].id,
    });
    expect(state).toBe(before);
  });

  it("al eliminar un segmento usado por campañas lo reasigna", () => {
    let state = createSeedState();
    state = demoReducer(state, {
      type: "SEGMENT_DELETE",
      id: "seg-exp",
      substituteId: "seg-inv",
    });
    const camp01 = state.campaigns.find((item) => item.id === "camp-01");
    expect(camp01?.segmentId).toBe("seg-inv");
  });

  it("crear un experimento planificado y lanzarlo", () => {
    let state = createSeedState();
    state = demoReducer(state, {
      type: "EXPERIMENT_CREATE",
      experiment: {
        id: "exp-nuevo",
        status: "planificado",
        type: "Landing",
        campaign: "Reducir la caída post-activación",
        owner: "Marina Costa",
        dateLabel: "Creado el 6 sep 2026",
        hypothesis: "Si mejoramos el onboarding, sube la activación.",
        variantA: "A actual",
        variantB: "B propuesta",
        objectiveMetric: "Tasa de activación",
        opportunityId: "op-01",
      },
    });
    expect(state.experiments[0].status).toBe("planificado");

    state = demoReducer(state, { type: "EXPERIMENT_LAUNCH", id: "exp-nuevo" });
    const launched = state.experiments.find((item) => item.id === "exp-nuevo");
    expect(launched?.status).toBe("enCurso");
    expect(launched?.dateLabel).toBe("Activado el 6 sep 2026");
    expect(launched?.detail).toBeDefined();
  });

  it("cerrar un experimento guarda resultado, conversiones y aprendizaje", () => {
    let state = createSeedState();
    state = demoReducer(state, {
      type: "EXPERIMENT_CREATE",
      experiment: {
        id: "exp-nuevo",
        status: "planificado",
        type: "Landing",
        campaign: "Nuevo",
        owner: "Marina Costa",
        dateLabel: "Creado el 6 sep 2026",
        hypothesis: "Hipótesis",
        variantA: "A",
        variantB: "B",
        objectiveMetric: "Conversión",
      },
    });
    state = demoReducer(state, { type: "EXPERIMENT_LAUNCH", id: "exp-nuevo" });
    state = demoReducer(state, {
      type: "EXPERIMENT_CLOSE",
      id: "exp-nuevo",
      result: "validado",
      conversionA: 4.5,
      conversionB: 5.6,
      learning: "B rinde mejor",
    });
    const closed = state.experiments.find((item) => item.id === "exp-nuevo");
    expect(closed?.status).toBe("validado");
    expect(closed?.conversionA).toBe(4.5);
    expect(closed?.learning).toBe("B rinde mejor");
    expect(closed?.detail?.variantB.conversion).toBe(5.6);
  });

  it("eliminar un experimento planificado reabre su oportunidad", () => {
    let state = createSeedState();
    state = demoReducer(state, {
      type: "OPPORTUNITY_SET_STATUS",
      id: "op-01",
      status: "enExperimento",
    });
    state = demoReducer(state, {
      type: "EXPERIMENT_CREATE",
      experiment: {
        id: "exp-nuevo",
        status: "planificado",
        type: "Landing",
        campaign: "Reducir la caída post-activación",
        owner: "Marina Costa",
        dateLabel: "Creado el 6 sep 2026",
        hypothesis: "Hipótesis",
        variantA: "A",
        variantB: "B",
        objectiveMetric: "Conversión",
        opportunityId: "op-01",
      },
    });
    state = demoReducer(state, { type: "EXPERIMENT_DELETE", id: "exp-nuevo" });
    const opportunity = state.opportunities.find((item) => item.id === "op-01");
    expect(opportunity?.status).toBe("abierta");
    expect(opportunity?.experimentId).toBeUndefined();
  });

  it("RESET_DEMO restaura el seed", () => {
    let state = createSeedState();
    state = demoReducer(state, {
      type: "CAMPAIGN_CREATE",
      campaign: {
        id: "camp-x",
        title: "X",
        status: "activo",
        dateRange: "",
        channels: [],
        visits: 1,
        registrations: 1,
        customers: 1,
        retained: 1,
        segmentId: "seg-exp",
        metricsBarWidths: [212, 0, 0, 0],
      },
    });
    state = demoReducer(state, { type: "SET_SEARCH", search: "algo" });
    state = demoReducer(state, { type: "RESET_DEMO" });
    expect(state.campaigns).toHaveLength(3);
    expect(state.filters.search).toBe("");
  });

  it("registra actividad en las operaciones", () => {
    let state = createSeedState();
    state = demoReducer(state, {
      type: "SEGMENT_CREATE",
      segment: {
        id: "seg-x",
        order: "06",
        name: "Nuevo",
        intent: "Intención baja",
        intentTone: "low",
        description: "",
        users: 10,
        converted: 1,
        color: "#1751C8",
        wide: false,
        baseBarWidth: 194,
        conversionBarWidth: 20,
      } as SegmentRecord,
    });
    expect(state.activity.length).toBeGreaterThan(0);
  });
});