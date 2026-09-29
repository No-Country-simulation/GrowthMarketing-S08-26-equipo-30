import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type { CampaignRecord, ChannelRecord, DemoState, ExperimentRecord } from "@/demo/demoTypes";
import { demoReducer, type DemoAction } from "@/demo/demoReducer";
import { loadState, resetStoredDemo, saveState } from "@/demo/demoStorage";
import { createSeedState } from "@/demo/demoSeed";
import { api, getHealth, hasApiBaseUrl, type ApiCampaign, type ApiExperiment, type ApiStatus } from "@/api/client";

export interface Toast {
  id: string;
  message: string;
  tone: "success" | "error";
}

interface DemoContextValue {
  state: DemoState;
  dispatch: (action: DemoAction) => void;
  toasts: Toast[];
  dismissToast: (id: string) => void;
  notify: (message: string, tone?: Toast["tone"]) => void;
  resetDemo: () => void;
  apiStatus: ApiStatus;
}


const DemoContext = createContext<DemoContextValue | null>(null);

function mapCampaign(campaign: ApiCampaign): CampaignRecord {
  const max = Math.max(campaign.visits, 1);
  return {
    id: campaign.id,
    title: campaign.name,
    objective: campaign.objective,
    budget: Number(campaign.budget),
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    status: campaign.status === "PAUSADA" ? "pausado" : campaign.status === "FINALIZADA" ? "finalizado" : "activo",
    dateRange: `${campaign.startDate} - ${campaign.endDate}`,
    channels: campaign.channels.map((channel) => String(channel.id)),
    visits: campaign.visits,
    registrations: campaign.registrations,
    customers: campaign.customers,
    retained: campaign.retained,
    segmentId: "server",
    metricsBarWidths: [212, Math.round((campaign.registrations / max) * 212), Math.round((campaign.customers / max) * 212), Math.round((campaign.retained / max) * 212)],
  };
}

function mapExperiment(experiment: ApiExperiment): ExperimentRecord {
  const variantA = experiment.variants.find((variant) => variant.code === "A");
  const variantB = experiment.variants.find((variant) => variant.code === "B");
  return {
    id: experiment.id,
    status: experiment.viewStatus === "EN_CURSO" ? "enCurso" : experiment.viewStatus === "VALIDADO" ? "validado" : experiment.viewStatus === "NO_VALIDADO" ? "noValidado" : "planificado",
    type: "Landing",
    campaign: experiment.campaignName,
    owner: "Growth · Marketing",
    dateLabel: experiment.startedAt ? `Activado ${experiment.startedAt.slice(0, 10)}` : "Borrador",
    hypothesis: experiment.hypothesis,
    variantA: variantA?.description ?? "Versión A",
    variantB: variantB?.description ?? "Versión B",
    objectiveMetric: experiment.targetMetric,
    conversionA: variantA?.conversions,
    conversionB: variantB?.conversions,
    learning: experiment.conclusion,
  };
}

function mapChannel(id: number, name: string): ChannelRecord {
  return { id: String(id), name, visits: 0, registrations: 0, retention90d: 0, quality: "media", barWidth: 50 };
}


function toastMessageFor(action: DemoAction): string | null {
  switch (action.type) {
    case "CAMPAIGN_CREATE":
      return `Campaña “${action.campaign.title || "sin nombre"}” creada`;
    case "CAMPAIGN_UPDATE":
      return `Campaña “${action.campaign.title}” actualizada`;
    case "CAMPAIGN_DELETE":
      return "Campaña eliminada";
    case "CAMPAIGN_SET_STATUS":
      return action.status === "pausado"
        ? "Campaña pausada"
        : action.status === "activo"
          ? "Campaña reactivada"
          : "Campaña finalizada";
    case "SEGMENT_CREATE":
      return `Segmento “${action.segment.name}” creado`;
    case "SEGMENT_UPDATE":
      return `Segmento “${action.segment.name}” actualizado`;
    case "SEGMENT_DELETE":
      return "Segmento eliminado";
    case "OPPORTUNITY_CREATE":
      return `Oportunidad “${action.opportunity.title}” creada`;
    case "OPPORTUNITY_UPDATE":
      return `Oportunidad “${action.opportunity.title}” actualizada`;
    case "OPPORTUNITY_DELETE":
      return "Oportunidad eliminada";
    case "OPPORTUNITY_SET_STATUS":
      return action.status === "descartada"
        ? "Oportunidad descartada"
        : action.status === "enExperimento"
          ? "Oportunidad vinculada al experimento"
          : "Oportunidad reabierta";
    case "EXPERIMENT_CREATE":
      return "Hipótesis creada · experimento planificado";
    case "EXPERIMENT_UPDATE":
      return "Experimento actualizado";
    case "EXPERIMENT_DELETE":
      return "Experimento eliminado · oportunidad reabierta";
    case "EXPERIMENT_LAUNCH":
      return "Experimento lanzado";
    case "EXPERIMENT_CLOSE":
      return action.result === "validado"
        ? "Experimento cerrado · validado"
        : "Experimento cerrado · no validado";
    default:
      return null;
  }
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, undefined, loadState);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [apiStatus, setApiStatus] = useState<ApiStatus>("idle");

  useEffect(() => {
    if (!hasApiBaseUrl()) {
      saveState(state);
    }
  }, [state]);

  useEffect(() => {
    if (!hasApiBaseUrl()) {
      return;
    }

    const controller = new AbortController();
    setApiStatus("checking");
    getHealth(controller.signal)
      .then(async () => {
        setApiStatus("connected");
        const [channels, campaigns, experiments] = await Promise.all([
          api.channels(),
          api.campaigns({}),
          api.experiments(),
        ]);
        const seed = createSeedState();
        dispatch({
          type: "SERVER_LOAD",
          state: {
            ...seed,
            channels: channels.map((channel) => mapChannel(channel.id, channel.name)),
            campaigns: campaigns.map(mapCampaign),
            experiments: experiments.map(mapExperiment),
          },
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setApiStatus("unavailable");
        showToast(error instanceof Error ? error.message : "No se pudo conectar con la API", "error");
      });

    return () => controller.abort();
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, tone: Toast["tone"] = "success") => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { id, message, tone }]);
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, 4000);
    },
    [],
  );

  const dispatchAction = useCallback(
    (action: DemoAction) => {
      dispatch(action);
      const message = toastMessageFor(action);
      if (message) {
        showToast(message);
      }
      if (!hasApiBaseUrl()) {
        return;
      }
      const reload = async () => {
        const [channels, campaigns, experiments] = await Promise.all([api.channels(), api.campaigns({}), api.experiments()]);
        const seed = createSeedState();
        dispatch({
          type: "SERVER_LOAD",
          state: { ...seed, channels: channels.map((channel) => mapChannel(channel.id, channel.name)), campaigns: campaigns.map(mapCampaign), experiments: experiments.map(mapExperiment) },
        });
      };
      const run = async () => {
        if (action.type === "CAMPAIGN_CREATE" || action.type === "CAMPAIGN_UPDATE") {
          const body = {
            name: action.campaign.title,
            objective: action.campaign.objective,
            budget: action.campaign.budget,
            startDate: action.campaign.startDate,
            endDate: action.campaign.endDate,
            channelIds: action.campaign.channels.map(Number),
          };
          if (action.type === "CAMPAIGN_CREATE") await api.createCampaign(body);
          else await api.updateCampaign(action.campaign.id, body);
          await reload();
        }
        if (action.type === "CAMPAIGN_SET_STATUS") {
          await api.setCampaignStatus(action.id, action.status === "pausado" ? "PAUSADA" : action.status === "finalizado" ? "FINALIZADA" : "ACTIVA");
          await reload();
        }
        if (action.type === "CAMPAIGN_DELETE") {
          await api.archiveCampaign(action.id);
          await reload();
        }
      };
      void run().catch((error: unknown) => showToast(error instanceof Error ? error.message : "No se pudo guardar en la API", "error"));
    },
    [showToast],
  );

  const resetDemo = useCallback(() => {
    resetStoredDemo();
    dispatch({ type: "RESET_DEMO" });
    showToast("Demo restaurada");
  }, [showToast]);

  return (
    <DemoContext.Provider
      value={{
        state,
        dispatch: dispatchAction,
        toasts,
        dismissToast,
        notify: showToast,
        resetDemo,
        apiStatus,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo(): DemoContextValue {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemo debe usarse dentro de <DemoProvider>");
  }
  return context;
}