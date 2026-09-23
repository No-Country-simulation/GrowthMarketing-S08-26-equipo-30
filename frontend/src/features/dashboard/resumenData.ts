import grid01Accent from "@/assets/icons/figma/grid-01-accent.svg";
import funnelBody from "@/assets/icons/figma/funnel-body.svg";
import broadcastBody from "@/assets/icons/figma/broadcast-body.svg";
import peopleBody from "@/assets/icons/figma/people-body.svg";
import graphUpArrowBody from "@/assets/icons/figma/graph-up-arrow-body.svg";
import lightbulbBody from "@/assets/icons/figma/lightbulb-body.svg";
import cursorPrimary from "@/assets/icons/figma/cursor-primary.svg";
import personUpPrimary from "@/assets/icons/figma/person-up-primary.svg";
import creditCardPrimary from "@/assets/icons/figma/credit-card-primary.svg";
import graphUpArrowPrimary from "@/assets/icons/figma/graph-up-arrow-primary.svg";
import type { NavItem } from "@/components/layout/layoutTypes";

export type TrendDirection = "up" | "down";
export type QualityColor = "secondary" | "accent" | "error";

export interface MetricCardData {
  label: string;
  value: string;
  delta: string;
  deltaDirection: TrendDirection;
  iconSrc: string;
}

export interface FunnelStepData {
  label: string;
  value: string;
  percentage: string;
  dropLabel?: string;
  barWidthPx: number;
}

export interface VisitTrendData {
  title: string;
  subtitle: string;
  labels: [string, string, string];
  delta: string;
  caption: string;
}

export interface ChannelQualityData {
  label: string;
  value: string;
  percentage: string;
  color: QualityColor;
}

export interface ResumenDashboardData {
  breadcrumb: string;
  title: string;
  subtitle: string;
  filters: {
    search: string;
    dateRange: string;
    channel: string;
  };
  nav: NavItem[];
  metrics: MetricCardData[];
  funnel: FunnelStepData[];
  visitTrend: VisitTrendData;
  channelQuality: ChannelQualityData[];
  user: {
    initials: string;
    name: string;
    role: string;
  };
  funnelSection: {
    title: string;
    caption: string;
    buttonLabel: string;
  };
  channelQualitySection: {
    title: string;
    subtitle: string;
    footer: string;
  };
}

export const resumenData: ResumenDashboardData = {
  breadcrumb: "GrowthHub / Resumen",
  title: "Resumen de crecimiento",
  subtitle:
    "Últimos 30 días (8 ago – 6 sep 2026) · adquisición, activación y conversión, comparado con los 30 días anteriores.",
  filters: {
    search: "Buscar...",
    dateRange: "Últimos 30 días",
    channel: "Todos los canales",
  },
  nav: [
    { id: "resumen", label: "Resumen", iconSrc: grid01Accent, active: true, targetView: "resumen" },
    { id: "funnel", label: "Funnel", iconSrc: funnelBody, active: false, targetView: "funnel" },
    { id: "canales", label: "Canales", iconSrc: broadcastBody, active: false, targetView: "canales" },
    { id: "segmentos", label: "Segmentos", iconSrc: peopleBody, active: false },
    { id: "campanas", label: "Campañas", iconSrc: peopleBody, active: false },
    { id: "experimentos", label: "Experimentos", iconSrc: graphUpArrowBody, active: false, targetView: "experimentos" },
    { id: "oportunidades", label: "Oportunidades", iconSrc: lightbulbBody, active: false, targetView: "oportunidades" },
  ],
  metrics: [
    {
      label: "VISITAS",
      value: "184.320",
      delta: "+12,4 % vs. período anterior",
      deltaDirection: "up",
      iconSrc: cursorPrimary,
    },
    {
      label: "TASA DE REGISTRO",
      value: "6,8 %",
      delta: "+0,9 pts vs. período anterior",
      deltaDirection: "up",
      iconSrc: personUpPrimary,
    },
    {
      label: "CLIENTES NUEVOS",
      value: "1.842",
      delta: "+8,1 % vs. período anterior",
      deltaDirection: "up",
      iconSrc: creditCardPrimary,
    },
    {
      label: "RETENCIÓN 90 DÍAS",
      value: "41,2 %",
      delta: "-2,3 pts vs. período anterior",
      deltaDirection: "down",
      iconSrc: graphUpArrowPrimary,
    },
  ],
  funnel: [
    {
      label: "Visitas",
      value: "184.320",
      percentage: "100 %",
      dropLabel: "caída-93,2 %",
      barWidthPx: 826,
    },
    {
      label: "Registros",
      value: "12.534",
      percentage: "6,8 %",
      dropLabel: "caída-43,0 %",
      barWidthPx: 352,
    },
    {
      label: "Activados",
      value: "7.148",
      percentage: "3,9 %",
      dropLabel: "caída-74,2 %",
      barWidthPx: 300,
    },
    {
      label: "Clientes",
      value: "1.842",
      percentage: "1,0 %",
      dropLabel: "caída-58,8 %",
      barWidthPx: 180,
    },
    {
      label: "Retenidos",
      value: "759",
      percentage: "0,4 %",
      barWidthPx: 86,
    },
  ],
  visitTrend: {
    title: "Tendencia de visitas",
    subtitle: "Últimos 14 días · media 12,9 K/día",
    labels: ["24 ago", "31 ago", "6 sep"],
    delta: "+18,4 %",
    caption: "últimos 7 días vs. 7 anteriores",
  },
  channelQuality: [
    { label: "Alta calidad", value: "5.602", percentage: "44,7 %", color: "secondary" },
    { label: "Media calidad", value: "3.543", percentage: "28,3 %", color: "accent" },
    { label: "Baja calidad", value: "3.389", percentage: "27,0 %", color: "error" },
  ],
  user: {
    initials: "MC",
    name: "Marina Costa",
    role: "Growth · Marketing",
  },
  funnelSection: {
    title: "Recorrido del usuario",
    caption: "De la visita a la retención · 5 etapas",
    buttonLabel: "Ver Funnel completo",
  },
  channelQualitySection: {
    title: "Registros por calidad de canal",
    subtitle: "12.534 registros · calidad medida por retención a 90 d",
    footer:
      "Más de la mitad de los registros llega por canales de calidad media o baja: volumen que no se convierte en retención.",
  },
};