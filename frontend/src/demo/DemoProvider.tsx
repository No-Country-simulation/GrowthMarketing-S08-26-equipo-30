import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type { DemoState } from "@/demo/demoTypes";
import { demoReducer, type DemoAction } from "@/demo/demoReducer";
import { loadState, resetStoredDemo, saveState } from "@/demo/demoStorage";

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
}

const DemoContext = createContext<DemoContextValue | null>(null);

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

  useEffect(() => {
    saveState(state);
  }, [state]);

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