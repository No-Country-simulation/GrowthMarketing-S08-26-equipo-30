import grid01Body from "@/assets/icons/figma/grid-01-body.svg";
import funnelBody from "@/assets/icons/figma/funnel-body.svg";
import broadcastBody from "@/assets/icons/figma/broadcast-body.svg";
import peopleBody from "@/assets/icons/figma/people-body.svg";
import graphUpArrowAccent from "@/assets/icons/figma/graph-up-arrow-accent.svg";
import lightbulbBody from "@/assets/icons/figma/lightbulb-body.svg";
import type { NavItem } from "@/components/layout/layoutTypes";

export type ExperimentStatus = "planificado" | "enCurso" | "validado" | "noValidado";

export type ExperimentType =
  | "Canal"
  | "Segmentación"
  | "Anuncio"
  | "Landing"
  | "CTA"
  | "Onboarding"
  | "Oferta"
  | "Retención";

export interface ExperimentCardData {
  id: string;
  status: ExperimentStatus;
  type: ExperimentType;
  campaign: string;
  owner: string;
  dateLabel: string;
  hypothesis: string;
  result?: string;
  learning?: string;
}

export interface ExperimentsData {
  breadcrumb: string;
  title: string;
  subtitle: string;
  filters: {
    search: string;
    dateRange: string;
    channel: string;
  };
  nav: NavItem[];
  user: {
    initials: string;
    name: string;
    role: string;
  };
  experiments: ExperimentCardData[];
}

const nav: NavItem[] = [
  { id: "resumen", label: "Resumen", iconSrc: grid01Body, active: false, targetView: "resumen" },
  { id: "funnel", label: "Funnel", iconSrc: funnelBody, active: false, targetView: "funnel" },
  { id: "canales", label: "Canales", iconSrc: broadcastBody, active: false, targetView: "canales" },
  { id: "segmentos", label: "Segmentos", iconSrc: peopleBody, active: false },
  { id: "campanas", label: "Campañas", iconSrc: peopleBody, active: false },
  { id: "experimentos", label: "Experimentos", iconSrc: graphUpArrowAccent, active: true, targetView: "experimentos" },
  { id: "oportunidades", label: "Oportunidades", iconSrc: lightbulbBody, active: false, targetView: "oportunidades" },
];

export const experimentsData: ExperimentsData = {
  breadcrumb: "GrowthHub / Experimentos",
  title: "Experimentos",
  subtitle:
    "Hipótesis en curso y cerradas. Los experimentos finalizados guardan el resultado cargado y el aprendizaje escrito por el equipo.",
  filters: {
    search: "Buscar...",
    dateRange: "Últimos 30 días",
    channel: "Todos los canales",
  },
  nav,
  user: {
    initials: "MC",
    name: "Marina Costa",
    role: "Growth · Marketing",
  },
  experiments: [
    {
      id: "exp-03",
      status: "enCurso",
      type: "Landing",
      campaign: "Q3 · Meta prospecting ES",
      owner: "Marina Costa",
      dateLabel: "Activado el 18 ago 2026",
      hypothesis:
        "Si la landing de Meta habla de ahorro de tiempo en lugar de precio, subirá la conversión a registro.",
    },
    {
      id: "exp-02",
      status: "validado",
      type: "Onboarding",
      campaign: "Q3 · Onboarding guiado",
      owner: "Marina Costa",
      dateLabel: "Cerrado el 3 sep 2026",
      hypothesis:
        "Si el onboarding guía la creación del primer informe antes de explicar el plan, subirá la activación.",
      result: "A 54,1 % · B 61,8 %",
      learning:
        "La versión guiada mejora la activación +7,7 pts sobre el flujo actual.",
    },
    {
      id: "exp-01",
      status: "noValidado",
      type: "CTA",
      campaign: "Q3 · Pricing ES",
      owner: "Marina Costa",
      dateLabel: "Cerrado el 28 ago 2026",
      hypothesis:
        "Si el CTA de la página de precios es más directo, subirá la conversión a pago.",
      result: "A 6,9 % · B 6,7 %",
      learning: "Sin diferencia significativa entre versiones.",
    },
  ],
};