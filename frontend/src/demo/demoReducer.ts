import type {
  CampaignRecord,
  CampaignStatus,
  DateRange,
  DemoState,
  ExperimentRecord,
  ExperimentStatus,
  OpportunityRecord,
  OpportunityStatus,
  SegmentRecord,
} from "@/demo/demoTypes";
import { createSeedState, DEMO_DATE, DEMO_FULL_DATE } from "@/demo/demoSeed";
import { formatNumber } from "@/demo/demoFormat";

export type DemoAction =
  | { type: "SET_SEARCH"; search: string }
  | { type: "SET_DATE_RANGE"; dateRange: DateRange }
  | { type: "SET_CHANNEL"; channelId: string | "all" }
  | { type: "RESET_DEMO" }
  | { type: "CAMPAIGN_CREATE"; campaign: CampaignRecord }
  | { type: "CAMPAIGN_UPDATE"; campaign: CampaignRecord }
  | { type: "CAMPAIGN_DELETE"; id: string }
  | { type: "CAMPAIGN_SET_STATUS"; id: string; status: CampaignStatus }
  | { type: "SEGMENT_CREATE"; segment: SegmentRecord }
  | { type: "SEGMENT_UPDATE"; segment: SegmentRecord }
  | { type: "SEGMENT_DELETE"; id: string; substituteId?: string }
  | { type: "OPPORTUNITY_CREATE"; opportunity: OpportunityRecord }
  | { type: "OPPORTUNITY_UPDATE"; opportunity: OpportunityRecord }
  | { type: "OPPORTUNITY_DELETE"; id: string }
  | { type: "OPPORTUNITY_SET_STATUS"; id: string; status: OpportunityStatus }
  | { type: "EXPERIMENT_CREATE"; experiment: ExperimentRecord }
  | { type: "EXPERIMENT_UPDATE"; experiment: ExperimentRecord }
  | { type: "EXPERIMENT_DELETE"; id: string }
  | { type: "EXPERIMENT_LAUNCH"; id: string }
  | {
      type: "EXPERIMENT_CLOSE";
      id: string;
      result: "validado" | "noValidado";
      conversionA: number;
      conversionB: number;
      learning: string;
    };

function recordActivity(state: DemoState, message: string): DemoState["activity"] {
  return [
    {
      id: crypto.randomUUID(),
      message,
      timestamp: DEMO_FULL_DATE,
    },
    ...state.activity,
  ].slice(0, 100);
}

export function demoReducer(
  state: DemoState,
  action: DemoAction,
): DemoState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, filters: { ...state.filters, search: action.search } };
    case "SET_DATE_RANGE":
      return {
        ...state,
        filters: { ...state.filters, dateRange: action.dateRange },
      };
    case "SET_CHANNEL":
      return {
        ...state,
        filters: { ...state.filters, channelId: action.channelId },
      };
    case "RESET_DEMO":
      return createSeedState();
    case "CAMPAIGN_CREATE":
      return {
        ...state,
        campaigns: [...state.campaigns, action.campaign],
        activity: recordActivity(
          state,
          `Campaña creada: ${action.campaign.title}`,
        ),
      };
    case "CAMPAIGN_UPDATE":
      return {
        ...state,
        campaigns: state.campaigns.map((campaign) =>
          campaign.id === action.campaign.id ? action.campaign : campaign,
        ),
        activity: recordActivity(
          state,
          `Campaña actualizada: ${action.campaign.title}`,
        ),
      };
    case "CAMPAIGN_DELETE":
      return {
        ...state,
        campaigns: state.campaigns.filter(
          (campaign) => campaign.id !== action.id,
        ),
        activity: recordActivity(state, "Campaña eliminada"),
      };
    case "CAMPAIGN_SET_STATUS":
      return {
        ...state,
        campaigns: state.campaigns.map((campaign) =>
          campaign.id === action.id
            ? { ...campaign, status: action.status }
            : campaign,
        ),
        activity: recordActivity(
          state,
          `Campaña ${action.status === "pausado" ? "pausada" : action.status === "activo" ? "reactivada" : "finalizada"}`,
        ),
      };
    case "SEGMENT_CREATE":
      return {
        ...state,
        segments: [...state.segments, action.segment],
        activity: recordActivity(state, `Segmento creado: ${action.segment.name}`),
      };
    case "SEGMENT_UPDATE":
      return {
        ...state,
        segments: state.segments.map((segment) =>
          segment.id === action.segment.id ? action.segment : segment,
        ),
        activity: recordActivity(
          state,
          `Segmento actualizado: ${action.segment.name}`,
        ),
      };
    case "SEGMENT_DELETE": {
      if (state.segments.length <= 1) {
        return state;
      }
      const campaigns = action.substituteId
        ? state.campaigns.map((campaign) =>
            campaign.segmentId === action.id
              ? { ...campaign, segmentId: action.substituteId! }
              : campaign,
          )
        : state.campaigns;
      return {
        ...state,
        campaigns,
        segments: state.segments.filter((segment) => segment.id !== action.id),
        activity: recordActivity(state, "Segmento eliminado"),
      };
    }
    case "OPPORTUNITY_CREATE":
      return {
        ...state,
        opportunities: [...state.opportunities, action.opportunity],
        activity: recordActivity(
          state,
          `Oportunidad creada: ${action.opportunity.title}`,
        ),
      };
    case "OPPORTUNITY_UPDATE":
      return {
        ...state,
        opportunities: state.opportunities.map((opportunity) =>
          opportunity.id === action.opportunity.id
            ? action.opportunity
            : opportunity,
        ),
        activity: recordActivity(
          state,
          `Oportunidad actualizada: ${action.opportunity.title}`,
        ),
      };
    case "OPPORTUNITY_DELETE":
      return {
        ...state,
        opportunities: state.opportunities.filter(
          (opportunity) => opportunity.id !== action.id,
        ),
        activity: recordActivity(state, "Oportunidad eliminada"),
      };
    case "OPPORTUNITY_SET_STATUS":
      return {
        ...state,
        opportunities: state.opportunities.map((opportunity) =>
          opportunity.id === action.id
            ? { ...opportunity, status: action.status }
            : opportunity,
        ),
        activity: recordActivity(
          state,
          `Oportunidad ${action.status === "descartada" ? "descartada" : action.status === "enExperimento" ? "vinculada a experimento" : "reabierta"}`,
        ),
      };
    case "EXPERIMENT_CREATE":
      return {
        ...state,
        experiments: [action.experiment, ...state.experiments],
        activity: recordActivity(
          state,
          `Experimento planificado: ${action.experiment.campaign}`,
        ),
      };
    case "EXPERIMENT_UPDATE":
      return {
        ...state,
        experiments: state.experiments.map((experiment) =>
          experiment.id === action.experiment.id
            ? action.experiment
            : experiment,
        ),
        activity: recordActivity(
          state,
          `Experimento actualizado: ${action.experiment.campaign}`,
        ),
      };
    case "EXPERIMENT_DELETE": {
      const experiment = state.experiments.find((item) => item.id === action.id);
      if (!experiment) {
        return state;
      }
      const opportunities = experiment.opportunityId
        ? state.opportunities.map((opportunity) =>
            opportunity.id === experiment.opportunityId
              ? {
                  ...opportunity,
                  status: "abierta" as const,
                  experimentId: undefined,
                }
              : opportunity,
          )
        : state.opportunities;
      return {
        ...state,
        opportunities,
        experiments: state.experiments.filter((item) => item.id !== action.id),
        activity: recordActivity(state, "Experimento eliminado"),
      };
    }
    case "EXPERIMENT_LAUNCH": {
      const experiment = state.experiments.find((item) => item.id === action.id);
      if (!experiment || experiment.status !== "planificado") {
        return state;
      }
      const opportunity = experiment.opportunityId
        ? state.opportunities.find((item) => item.id === experiment.opportunityId)
        : undefined;
      const campaign = state.campaigns.find(
        (item) => item.title === experiment.campaign,
      );
      const trafficTotal =
        campaign?.visits ?? opportunity?.usersAtStake ?? 20000;
      const exposed = Math.round(trafficTotal / 2);
      const detail = {
        objectiveMetric: experiment.objectiveMetric,
        activatedAt: "6 sep, 2026",
        traffic: `${formatNumber(trafficTotal)} visitas`,
        origin: opportunity
          ? `Oportunidad ${opportunity.id.replace("op-", "")}`
          : "—",
        variantA: {
          label: "Versión A - actual",
          description: experiment.variantA,
          exposed,
          conversion: 0,
        },
        variantB: {
          label: "Versión B - propuesta",
          description: experiment.variantB,
          exposed,
          conversion: 0,
        },
        measurementNotes: "Medido sobre las visitas del período en curso.",
        comments: [] as [string, string, string][],
        tags: [] as string[],
      };
      return {
        ...state,
        experiments: state.experiments.map((item) =>
          item.id === action.id
            ? {
                ...item,
                status: "enCurso" as const,
                dateLabel: "Activado el 6 sep 2026",
                detail,
              }
            : item,
        ),
        activity: recordActivity(state, "Experimento lanzado"),
      };
    }
    case "EXPERIMENT_CLOSE": {
      const experiment = state.experiments.find((item) => item.id === action.id);
      if (!experiment || experiment.status !== "enCurso") {
        return state;
      }
      return {
        ...state,
        experiments: state.experiments.map((item) =>
          item.id === action.id
            ? {
                ...item,
                status: action.result,
                dateLabel: "Cerrado el 6 sep 2026",
                conversionA: action.conversionA,
                conversionB: action.conversionB,
                learning: action.learning,
                detail: item.detail
                  ? {
                      ...item.detail,
                      variantA: {
                        ...item.detail.variantA,
                        conversion: action.conversionA,
                      },
                      variantB: {
                        ...item.detail.variantB,
                        conversion: action.conversionB,
                      },
                    }
                  : item.detail,
              }
            : item,
        ),
        activity: recordActivity(
          state,
          `Experimento ${action.result === "validado" ? "validado" : "no validado"}`,
        ),
      };
    }
    default:
      return state;
  }
}

export function newCampaignRecord(
  overrides: Partial<CampaignRecord> = {},
): CampaignRecord {
  return {
    id: crypto.randomUUID(),
    title: "",
    status: "activo",
    dateRange: "",
    channels: [],
    visits: 0,
    registrations: 0,
    customers: 0,
    retained: 0,
    segmentId: "",
    metricsBarWidths: [212, 0, 0, 0],
    ...overrides,
  };
}

export function newSegmentRecord(
  overrides: Partial<SegmentRecord> = {},
): SegmentRecord {
  return {
    id: crypto.randomUUID(),
    order: "06",
    name: "",
    intent: "Intención baja",
    intentTone: "low",
    description: "",
    users: 0,
    converted: 0,
    color: "#1751C8",
    wide: false,
    baseBarWidth: 194,
    conversionBarWidth: 0,
    ...overrides,
  };
}

export function newOpportunityRecord(
  overrides: Partial<OpportunityRecord> = {},
): OpportunityRecord {
  return {
    id: crypto.randomUUID(),
    title: "",
    impact: "medio",
    source: "funnel",
    sourceLabel: "Funnel",
    stage: "",
    stageKey: "",
    description: "",
    usersAtStake: 0,
    objectiveMetric: "",
    status: "abierta",
    ...overrides,
  };
}

export function newExperimentRecord(
  overrides: Partial<ExperimentRecord> = {},
): ExperimentRecord {
  return {
    id: crypto.randomUUID(),
    status: "planificado",
    type: "Landing",
    campaign: "",
    owner: "Marina Costa",
    dateLabel: `Creado el ${DEMO_DATE}`,
    hypothesis: "",
    variantA: "",
    variantB: "",
    objectiveMetric: "",
    ...overrides,
  };
}

export type { ExperimentStatus };