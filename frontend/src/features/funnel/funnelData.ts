import grid01Body from "@/assets/icons/figma/grid-01-body.svg";
import funnelAccent from "@/assets/icons/figma/funnel-accent.svg";
import broadcastBody from "@/assets/icons/figma/broadcast-body.svg";
import peopleBody from "@/assets/icons/figma/people-body.svg";
import graphUpArrowBody from "@/assets/icons/figma/graph-up-arrow-body.svg";
import lightbulbBody from "@/assets/icons/figma/lightbulb-body.svg";
import type { NavItem } from "@/components/layout/layoutTypes";

export interface FunnelStageData {
  label: string;
  description: string;
  value: string;
  percentage: string;
  dropText?: string;
  barWidthPx: number;
  highlight?: boolean;
}

export interface FunnelMetricData {
  label: string;
  value: string;
  caption: string;
}

export interface FunnelData {
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
  alert: {
    title: string;
    badge: string;
    body: string;
    note: string;
  };
  detail: {
    title: string;
    legend: {
      etapa: string;
      drop: string;
    };
  };
  stages: FunnelStageData[];
  metrics: FunnelMetricData[];
}

const nav: NavItem[] = [
  { id: "resumen", label: "Resumen", iconSrc: grid01Body, active: false, targetView: "resumen" },
  { id: "funnel", label: "Funnel", iconSrc: funnelAccent, active: true, targetView: "funnel" },
  { id: "canales", label: "Canales", iconSrc: broadcastBody, active: false, targetView: "canales" },
  { id: "segmentos", label: "Segmentos", iconSrc: peopleBody, active: false },
  { id: "campanas", label: "Campañas", iconSrc: peopleBody, active: false },
  { id: "experimentos", label: "Experimentos", iconSrc: graphUpArrowBody, active: false, targetView: "experimentos" },
  { id: "oportunidades", label: "Oportunidades", iconSrc: lightbulbBody, active: false, targetView: "oportunidades" },
];

export const funnelData: FunnelData = {
  breadcrumb: "GrowthHub / Funnel",
  title: "Funnel de conversión",
  subtitle:
    "Las cinco etapas del recorrido, últimos 30 días. Cada barra es el porcentaje sobre las visitas iniciales; entre etapas se muestra la caída y las personas perdidas.",
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
  alert: {
    title: "Mayor caída detectada: Activados → Clientes",
    badge: "-74,2 %",
    body:
      "De los 7.148 usuarios que activaron el producto, sólo 1.842 llegaron a ser clientes: se pierden 5.306 usuarios ya activados en el paso a pago. Es la caída más grande del recorrido interno y, por el valor de esos usuarios, la principal oportunidad de mejora del trimestre.",
    note:
      "La caída Visitas → Registros (-93,2 %) es mayor en términos absolutos, pero está dentro del rango esperable para tráfico frío.",
  },
  detail: {
    title: "Etapas del recorrido",
    legend: {
      etapa: "Etapa",
      drop: "Caída al siguiente paso",
    },
  },
  stages: [
    {
      label: "Visitas",
      description: "Sesiones únicas",
      value: "184.320",
      percentage: "100 %",
      dropText: "-93,2 % 171.786 personas no avanzan",
      barWidthPx: 875,
    },
    {
      label: "Registros",
      description: "Cuenta creada",
      value: "12.534",
      percentage: "6,8 %",
      dropText: "-43,0 % 5.386 personas no avanzan",
      barWidthPx: 208,
    },
    {
      label: "Activados",
      description: "Primer informe creado",
      value: "7.148",
      percentage: "3,9 %",
      dropText: "-74,2 % 5.306 personas no avanzan",
      barWidthPx: 146,
      highlight: true,
    },
    {
      label: "Clientes",
      description: "Plan de pago activo",
      value: "1.842",
      percentage: "1,0 %",
      dropText: "-58,8 % 1.083 personas no avanzan",
      barWidthPx: 72,
    },
    {
      label: "Retenidos",
      description: "Activos a 90 días",
      value: "759",
      percentage: "0,4 %",
      barWidthPx: 41,
    },
  ],
  metrics: [
    { label: "Conversión total", value: "1,00 %", caption: "De visita a cliente pagador" },
    { label: "Tiempo medio al pago", value: "11,4 días", caption: "Desde el registro, mediana 8 días" },
    { label: "Clientes perdidos a 90 d", value: "1.083", caption: "58,8 % de los clientes nuevos" },
  ],
};