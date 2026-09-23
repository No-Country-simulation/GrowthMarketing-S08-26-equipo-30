import grid01Body from "@/assets/icons/figma/grid-01-body.svg";
import funnelBody from "@/assets/icons/figma/funnel-body.svg";
import broadcastBody from "@/assets/icons/figma/broadcast-body.svg";
import peopleBody from "@/assets/icons/figma/people-body.svg";
import graphUpArrowBody from "@/assets/icons/figma/graph-up-arrow-body.svg";
import lightbulbAccent from "@/assets/icons/figma/lightbulb-accent.svg";
import type { NavItem } from "@/components/layout/layoutTypes";

export type OpportunityImpact = "alto" | "medio";
export type OpportunitySource = "funnel" | "canales";

export interface OpportunityMetric {
  label: string;
  value: string;
}

export interface OpportunityCardData {
  id: string;
  index: string;
  title: string;
  source: {
    type: OpportunitySource;
    label: string;
    iconSrc: string;
  };
  impact: OpportunityImpact;
  description: string;
  metrics: [OpportunityMetric, OpportunityMetric, OpportunityMetric];
  ctaLabel: string;
}

export interface OportunidadesData {
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
  opportunities: OpportunityCardData[];
}

const nav: NavItem[] = [
  { id: "resumen", label: "Resumen", iconSrc: grid01Body, active: false, targetView: "resumen" },
  { id: "funnel", label: "Funnel", iconSrc: funnelBody, active: false, targetView: "funnel" },
  { id: "canales", label: "Canales", iconSrc: broadcastBody, active: false, targetView: "canales" },
  { id: "segmentos", label: "Segmentos", iconSrc: peopleBody, active: false },
  { id: "campanas", label: "Campañas", iconSrc: peopleBody, active: false, targetView: "campanas" },
  { id: "experimentos", label: "Experimentos", iconSrc: graphUpArrowBody, active: false, targetView: "experimentos" },
  { id: "oportunidades", label: "Oportunidades", iconSrc: lightbulbAccent, active: true, targetView: "oportunidades" },
];

export const oportunidadesData: OportunidadesData = {
  breadcrumb: "GrowthHub / Oportunidades",
  title: "Oportunidades detectadas",
  subtitle:
    "Generadas automáticamente a partir de las caídas del funnel y del rendimiento de los canales de los últimos 30 días (184.320 visitas). Ordenadas por impacto estimado: primero la mayor pérdida de usuarios.",
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
  opportunities: [
    {
      id: "op-01",
      index: "01",
      title: "Reducir la caída post-activación",
      source: { type: "funnel", label: "Resumen", iconSrc: funnelBody },
      impact: "alto",
      description:
        "El 74,2 % de los usuarios activados no llega a ser cliente: 5.306 usuarios perdidos en el paso a pago, la mayor caída del recorrido interno.",
      metrics: [
        { label: "Usuarios en juego", value: "5.306" },
        { label: "etapa", value: "Activados → Clientes" },
        { label: "Métrica objetivo", value: "Conversión a pago" },
      ],
      ctaLabel: "Crear hipótesis",
    },
    {
      id: "op-02",
      index: "02",
      title: "Simplificar el onboarding",
      source: {
        type: "funnel",
        label: "Funnel · Registros → Activados",
        iconSrc: funnelBody,
      },
      impact: "alto",
      description:
        "5.386 usuarios se registran pero nunca crean su primer informe (-43,0 %). El abandono se concentra en el paso 3 de 5 del onboarding.",
      metrics: [
        { label: "Usuarios en juego", value: "5.386" },
        { label: "etapa", value: "Registros → Activados" },
        { label: "Métrica objetivo", value: "Tasa de activación" },
      ],
      ctaLabel: "Crear hipótesis",
    },
    {
      id: "op-03",
      index: "03",
      title: "Reasignar presupuesto de Meta prospecting",
      source: {
        type: "canales",
        label: "Canales · Meta Ads",
        iconSrc: broadcastBody,
      },
      impact: "medio",
      description:
        "Meta prospecting es el canal de mayor volumen (44.250 visitas) pero convierte al 4,0 % y retiene sólo el 18,6 % a 90 días, muy por debajo del objetivo del 7 %.",
      metrics: [
        { label: "Usuarios en juego", value: "44.250" },
        { label: "etapa", value: "Adquisición" },
        { label: "Métrica objetivo", value: "Conversión por canal" },
      ],
      ctaLabel: "Crear hipótesis",
    },
    {
      id: "op-04",
      index: "04",
      title: "Frenar la fuga de clientes nuevos",
      source: {
        type: "funnel",
        label: "Funnel · Clientes → Retenidos",
        iconSrc: funnelBody,
      },
      impact: "medio",
      description:
        "1.083 de los 1.842 clientes nuevos no siguen activos a los 90 días (-58,8 %), con la retención global cayendo 2,3 puntos vs. el período anterior.",
      metrics: [
        { label: "Usuarios en juego", value: "1.083" },
        { label: "etapa", value: "Clientes → Retenidos" },
        { label: "Métrica objetivo", value: "Retención 90 d" },
      ],
      ctaLabel: "Crear hipótesis",
    },
  ],
};