import grid01Body from "@/assets/icons/figma/grid-01-body.svg";
import funnelBody from "@/assets/icons/figma/funnel-body.svg";
import broadcastBody from "@/assets/icons/figma/broadcast-body.svg";
import peopleAccent from "@/assets/icons/figma/people-accent.svg";
import peopleBody from "@/assets/icons/figma/people-body.svg";
import graphUpArrowBody from "@/assets/icons/figma/graph-up-arrow-body.svg";
import lightbulbBody from "@/assets/icons/figma/lightbulb-body.svg";
import type { NavItem } from "@/components/layout/layoutTypes";

export type SegmentDistributionItem = {
  name: string;
  percent: string;
  users: string;
  color: string;
  barWidth: number;
};

export type IntentTone = "low" | "medium" | "high" | "customer";

export type SegmentCardItem = {
  order: string;
  name: string;
  intent: string;
  intentTone: IntentTone;
  description: string;
  basePercent: string;
  conversionRate: string;
  footer: string;
  color: string;
  baseBarWidth: number;
  conversionBarWidth: number;
  wide?: boolean;
};

export interface SegmentosData {
  breadcrumb: string;
  title: string;
  subtitle: string;
  sectionTitle: string;
  sectionSubtitle: string;
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
  distribution: {
    title: string;
    subtitle: string;
    insight: string;
    items: SegmentDistributionItem[];
  };
  cards: SegmentCardItem[];
}

const nav: NavItem[] = [
  { id: "resumen", label: "Resumen", iconSrc: grid01Body, active: false, targetView: "resumen" },
  { id: "funnel", label: "Funnel", iconSrc: funnelBody, active: false, targetView: "funnel" },
  { id: "canales", label: "Canales", iconSrc: broadcastBody, active: false, targetView: "canales" },
  { id: "segmentos", label: "Segmentos", iconSrc: peopleAccent, active: true, targetView: "segmentos" },
  { id: "campanas", label: "Campañas", iconSrc: peopleBody, active: false, targetView: "campanas" },
  { id: "experimentos", label: "Experimentos", iconSrc: graphUpArrowBody, active: false, targetView: "experimentos" },
  { id: "oportunidades", label: "Oportunidades", iconSrc: lightbulbBody, active: false, targetView: "oportunidades" },
];

export const segmentosData: SegmentosData = {
  breadcrumb: "GrowthHub / Segmentos",
  title: "Segmentos por intención",
  subtitle:
    "Clasifica a los 12.534 usuarios registrados de los últimos 30 días según su cercanía a la compra, leyendo señales de uso dentro del producto: informes creados, usuarios invitados, visitas a la página de precios y consultas al equipo comercial.",
  sectionTitle: "Los 5 segmentos, de menor a mayor intención",
  sectionSubtitle:
    "La tasa de conversión es propia de cada segmento: usuarios que pasaron a un plan de pago.",
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
  distribution: {
    title: "Distribución de la base",
    subtitle: "12.534 usuarios · un solo segmento por usuario, recalculado cada noche",
    insight:
      "Casi 6 de cada 10 registrados siguen en intención baja (Explorador o Investigador): el volumen está lejos de la compra, y sólo el 9,1 % llega a intención alta.",
    items: [
      { name: "Explorador", percent: "34,2 %", users: "4.287", color: "#C24A3A", barWidth: 831 },
      { name: "Investigador", percent: "26,6 %", users: "3.083", color: "#1751C8", barWidth: 696 },
      { name: "Comparador", percent: "17,1 %", users: "2.144", color: "#276A60", barWidth: 528 },
      { name: "Listo para comprar", percent: "9,1 %", users: "1.140", color: "#FFB412", barWidth: 300 },
      { name: "Cliente recurrente", percent: "15,5 %", users: "1.880", color: "#CE8BFF", barWidth: 432 },
    ],
  },
  cards: [
    {
      order: "01",
      name: "Explorador",
      intent: "Intención baja",
      intentTone: "low",
      description:
        "Primer contacto, sin intención definida: entró, creó la cuenta y no volvió a abrir el producto.",
      basePercent: "34,2 %",
      conversionRate: "1,8 %",
      footer: "4.287 usuarios · 77 clientes",
      color: "#C24A3A",
      baseBarWidth: 272,
      conversionBarWidth: 21,
    },
    {
      order: "02",
      name: "Investigador",
      intent: "Intención baja",
      intentTone: "low",
      description:
        "Explora el producto por su cuenta: abrió el editor de informes varias veces, todavía sin crear el primero.",
      basePercent: "24,6 %",
      conversionRate: "6,4 %",
      footer: "3.083 usuarios · 197 clientes",
      color: "#1751C8",
      baseBarWidth: 194,
      conversionBarWidth: 52,
    },
    {
      order: "03",
      name: "Comparador",
      intent: "Intención media",
      intentTone: "medium",
      description:
        "Ya activado y evaluando alternativas: creó informes, visitó la página de precios más de una vez.",
      basePercent: "17,1 %",
      conversionRate: "14,7 %",
      footer: "2.144 usuarios · 315 clientes",
      color: "#276A60",
      baseBarWidth: 155,
      conversionBarWidth: 97,
    },
    {
      order: "04",
      name: "Listo para comprar",
      intent: "Intención alta",
      intentTone: "high",
      description:
        "Señales claras de compra: informes compartidos con su equipo, consulta al área comercial o prueba del plan de pago.",
      basePercent: "9,1 %",
      conversionRate: "38,2 %",
      footer: "1.140 usuarios · 436 clientes",
      color: "#FFB412",
      baseBarWidth: 194,
      conversionBarWidth: 295,
      wide: true,
    },
    {
      order: "05",
      name: "Cliente recurrente",
      intent: "Cliente",
      intentTone: "customer",
      description:
        "Ya paga y sigue usando el producto: informes recurrentes cada semana y más de un usuario por cuenta.",
      basePercent: "15,0 %",
      conversionRate: "92,4 %",
      footer: "1.880 usuarios · 1.737 renuevan",
      color: "#CE8BFF",
      baseBarWidth: 194,
      conversionBarWidth: 396,
      wide: true,
    },
  ],
};