import grid01Body from "@/assets/icons/figma/grid-01-body.svg";
import funnelBody from "@/assets/icons/figma/funnel-body.svg";
import broadcastBody from "@/assets/icons/figma/broadcast-body.svg";
import peopleBody from "@/assets/icons/figma/people-body.svg";
import graphUpArrowBody from "@/assets/icons/figma/graph-up-arrow-body.svg";
import lightbulbBody from "@/assets/icons/figma/lightbulb-body.svg";
import type { NavItem } from "@/components/layout/layoutTypes";

export type CampaignQuality = "alta" | "media" | "baja";

export interface CampaignMetric {
  label: "VISITAS" | "Registros" | "Clientes" | "Retenidos";
  value: string;
  caption: string;
  barWidthPx: number;
  tone: "primary" | "secondary" | "accent" | "success";
}

export interface CampaignTrackingData {
  id: string;
  title: string;
  status: "Activo";
  dateRange: string;
  channels: string[];
  metrics: CampaignMetric[];
  summary: {
    registrationConversion: string;
    visitToCustomer: string;
    retention90d: string;
    retentionTone: "success" | "error";
    dominantSegment: string;
  };
}

export interface CampanasData {
  breadcrumb: string;
  title: string;
  subtitle: string;
  notice: string;
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
  campaigns: CampaignTrackingData[];
}

const nav: NavItem[] = [
  { id: "resumen", label: "Resumen", iconSrc: grid01Body, active: false, targetView: "resumen" },
  { id: "funnel", label: "Funnel", iconSrc: funnelBody, active: false, targetView: "funnel" },
  { id: "canales", label: "Canales", iconSrc: broadcastBody, active: false, targetView: "canales" },
  { id: "segmentos", label: "Segmentos", iconSrc: peopleBody, active: false },
  { id: "campanas", label: "Campañas", iconSrc: peopleBody, active: true, targetView: "campanas" },
  { id: "experimentos", label: "Experimentos", iconSrc: graphUpArrowBody, active: false, targetView: "experimentos" },
  { id: "oportunidades", label: "Oportunidades", iconSrc: lightbulbBody, active: false, targetView: "oportunidades" },
];

export const campanasData: CampanasData = {
  breadcrumb: "GrowthHub / Campañas",
  title: "Campañas activas",
  subtitle:
    "Seguimiento de punta a punta: cada campaña se sigue desde la visita hasta la retención — campaña → usuario → interacción → conversión a plan de pago → activo a 90 días — con el mismo criterio que el funnel general.",
  notice:
    "Vista de sólo lectura: las campañas se gestionan desde este panel a nivel de seguimiento, sin acciones de creación en esta primera versión.",
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
  campaigns: [
    {
      id: "camp-01",
      title: "Q3 · Meta prospecting ES",
      status: "Activo",
      dateRange: "18 ago – 6 sep 2026",
      channels: ["Meta Ads · prospecting", "Display / retargeting"],
      metrics: [
        {
          label: "VISITAS",
          value: "21.140",
          caption: "100 % de la campaña",
          barWidthPx: 212,
          tone: "primary",
        },
        {
          label: "Registros",
          value: "892",
          caption: "4,2 % de las visitas",
          barWidthPx: 32,
          tone: "secondary",
        },
        {
          label: "Clientes",
          value: "61",
          caption: "6,8 % de los registros",
          barWidthPx: 14,
          tone: "accent",
        },
        {
          label: "Retenidos",
          value: "19",
          caption: "31,1 % de los clientes a 90 d",
          barWidthPx: 15,
          tone: "success",
        },
      ],
      summary: {
        registrationConversion: "4,2 %",
        visitToCustomer: "0,3 %",
        retention90d: "31,1 %",
        retentionTone: "error",
        dominantSegment: "Explorador",
      },
    },
    {
      id: "camp-02",
      title: "Q3 · Referidos partner",
      status: "Activo",
      dateRange: "1 ago – 6 sep 2026",
      channels: ["Referidos partner", "Comunidad / Slack"],
      metrics: [
        {
          label: "VISITAS",
          value: "9.310",
          caption: "100 % de la campaña",
          barWidthPx: 212,
          tone: "primary",
        },
        {
          label: "Registros",
          value: "1.186",
          caption: "12,7 % de las visitas",
          barWidthPx: 32,
          tone: "secondary",
        },
        {
          label: "Clientes",
          value: "268",
          caption: "22,6 % de los registros",
          barWidthPx: 20,
          tone: "accent",
        },
        {
          label: "Retenidos",
          value: "167",
          caption: "62,3 % de los clientes a 90 d",
          barWidthPx: 15,
          tone: "success",
        },
      ],
      summary: {
        registrationConversion: "12,7 %",
        visitToCustomer: "2,9 %",
        retention90d: "62,3 %",
        retentionTone: "success",
        dominantSegment: "Listo para comprar",
      },
    },
    {
      id: "camp-03",
      title: "Siempre activa · Búsqueda de marca",
      status: "Activo",
      dateRange: "Sin fecha de fin",
      channels: ["Google Ads · marca", "Búsqueda orgánica"],
      metrics: [
        {
          label: "VISITAS",
          value: "34.820",
          caption: "100 % de la campaña",
          barWidthPx: 212,
          tone: "primary",
        },
        {
          label: "Registros",
          value: "2.744",
          caption: "7,9 % de las visitas",
          barWidthPx: 24,
          tone: "secondary",
        },
        {
          label: "Clientes",
          value: "471",
          caption: "17,2 % de los registros",
          barWidthPx: 13,
          tone: "accent",
        },
        {
          label: "Retenidos",
          value: "236",
          caption: "50,1 % de los clientes a 90 d",
          barWidthPx: 13,
          tone: "success",
        },
      ],
      summary: {
        registrationConversion: "7,9 %",
        visitToCustomer: "1,4 %",
        retention90d: "50,1 %",
        retentionTone: "success",
        dominantSegment: "Comparador",
      },
    },
  ],
};