import grid01Body from "@/assets/icons/figma/grid-01-body.svg";
import funnelBody from "@/assets/icons/figma/funnel-body.svg";
import broadcastAccent from "@/assets/icons/figma/broadcast-accent.svg";
import peopleBody from "@/assets/icons/figma/people-body.svg";
import graphUpArrowBody from "@/assets/icons/figma/graph-up-arrow-body.svg";
import lightbulbBody from "@/assets/icons/figma/lightbulb-body.svg";
import type { NavItem } from "@/components/layout/layoutTypes";

export type ChannelQuality = "alta" | "media" | "baja";

export interface ChannelData {
  name: string;
  visits: string;
  registrations: string;
  conversion: string;
  retention90d: string;
  quality: ChannelQuality;
  barWidthPx: number;
}

export interface CanalesData {
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
  conversionSection: {
    title: string;
    legend: { high: string; medium: string; low: string };
    subtitle: string;
    columns: { conversion: string; visits: string; retention: string };
    footer: string;
  };
  comparisonSection: {
    title: string;
    subtitle: string;
    columns: string[];
    total: {
      label: string;
      visits: string;
      registrations: string;
      conversion: string;
      retention90d: string;
    };
  };
  channels: ChannelData[];
}

const nav: NavItem[] = [
  { id: "resumen", label: "Resumen", iconSrc: grid01Body, active: false, targetView: "resumen" },
  { id: "funnel", label: "Funnel", iconSrc: funnelBody, active: false, targetView: "funnel" },
  { id: "canales", label: "Canales", iconSrc: broadcastAccent, active: true, targetView: "canales" },
  { id: "segmentos", label: "Segmentos", iconSrc: peopleBody, active: false },
  { id: "campanas", label: "Campañas", iconSrc: peopleBody, active: false },
  { id: "experimentos", label: "Experimentos", iconSrc: graphUpArrowBody, active: false, targetView: "experimentos" },
  { id: "oportunidades", label: "Oportunidades", iconSrc: lightbulbBody, active: false, targetView: "oportunidades" },
];

export const canalesData: CanalesData = {
  breadcrumb: "GrowthHub / Canales",
  title: "Canales de adquisición",
  subtitle:
    "Ocho canales activos en los últimos 30 días, ordenados por conversión a registro. El color de cada barra indica la calidad del canal, medida por su retención a 90 días.",
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
  conversionSection: {
    title: "Conversión a registro por canal",
    legend: {
      high: "Alta",
      medium: "Media",
      low: "Baja",
    },
    subtitle:
      "Ordenado de mayor a menor conversión · el color indica la calidad del canal",
    columns: {
      conversion: "Conversión a registro",
      visits: "Visitas",
      retention: "Ret. 90 d",
    },
    footer:
      "La línea violeta marca el objetivo del 7 % de conversión. Meta prospecting y LinkedIn Ads quedan por debajo aportando el mayor volumen de visitas; referidos y newsletter convierten el doble y retienen el triple con una fracción del tráfico.",
  },
  comparisonSection: {
    title: "Comparativa de canales",
    subtitle: "Ordenado por retención a 90 días",
    columns: ["canal", "Visitas", "Registros", "Conversión", "Ret. 90 d", "calidad"],
    total: {
      label: "Total / media",
      visits: "184.320",
      registrations: "12.534",
      conversion: "6,8 %",
      retention90d: "41,2 %",
    },
  },
  channels: [
    {
      name: "Referidos partner",
      visits: "8.420",
      registrations: "1.094",
      conversion: "13,0 %",
      retention90d: "62,4 %",
      quality: "alta",
      barWidthPx: 755,
    },
    {
      name: "Newsletter propia",
      visits: "12.180",
      registrations: "1.340",
      conversion: "11,0 %",
      retention90d: "57,8 %",
      quality: "alta",
      barWidthPx: 664,
    },
    {
      name: "Comunidad / Slack",
      visits: "5.260",
      registrations: "468",
      conversion: "8,9 %",
      retention90d: "43,2 %",
      quality: "media",
      barWidthPx: 498,
    },
    {
      name: "Búsqueda orgánica",
      visits: "38.640",
      registrations: "3.168",
      conversion: "8,2 %",
      retention90d: "48,1 %",
      quality: "alta",
      barWidthPx: 436,
    },
    {
      name: "Google Ads · marca",
      visits: "21.480",
      registrations: "1.568",
      conversion: "7,3 %",
      retention90d: "38,9 %",
      quality: "media",
      barWidthPx: 376,
    },
    {
      name: "Display / retargeting",
      visits: "26.180",
      registrations: "1.619",
      conversion: "6,2 %",
      retention90d: "12,4 %",
      quality: "baja",
      barWidthPx: 335,
    },
    {
      name: "LinkedIn Ads",
      visits: "27.910",
      registrations: "1.507",
      conversion: "5,4 %",
      retention90d: "31,5 %",
      quality: "media",
      barWidthPx: 283,
    },
    {
      name: "Meta Ads · prospecting",
      visits: "44.250",
      registrations: "1.770",
      conversion: "4,0 %",
      retention90d: "18,6 %",
      quality: "baja",
      barWidthPx: 237,
    },
  ],
};