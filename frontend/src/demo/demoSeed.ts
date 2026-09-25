import type {
  CampaignRecord,
  ChannelRecord,
  DemoState,
  ExperimentRecord,
  OpportunityRecord,
  SegmentRecord,
} from "@/demo/demoTypes";

export const DEMO_DATE = "6 sep 2026";
export const DEMO_FULL_DATE = "2026-09-06";

export const FUNNEL_RATES = {
  activation: 7148 / 12534,
  purchase: 1842 / 7148,
  retention: 759 / 1842,
};

export const FUNNEL_LAYOUT = {
  summaryWidths: [826, 352, 300, 180, 86],
  detailWidths: [875, 208, 146, 72, 41],
};

export const seedChannels: ChannelRecord[] = [
  {
    id: "ch-ref",
    name: "Referidos partner",
    visits: 8420,
    registrations: 1094,
    retention90d: 62.4,
    quality: "alta",
    barWidth: 755,
  },
  {
    id: "ch-news",
    name: "Newsletter propia",
    visits: 12180,
    registrations: 1340,
    retention90d: 57.8,
    quality: "alta",
    barWidth: 664,
  },
  {
    id: "ch-comm",
    name: "Comunidad / Slack",
    visits: 5260,
    registrations: 468,
    retention90d: 43.2,
    quality: "media",
    barWidth: 498,
  },
  {
    id: "ch-seo",
    name: "Búsqueda orgánica",
    visits: 38640,
    registrations: 3168,
    retention90d: 48.1,
    quality: "alta",
    barWidth: 436,
  },
  {
    id: "ch-google",
    name: "Google Ads · marca",
    visits: 21480,
    registrations: 1568,
    retention90d: 38.9,
    quality: "media",
    barWidth: 376,
  },
  {
    id: "ch-display",
    name: "Display / retargeting",
    visits: 26180,
    registrations: 1619,
    retention90d: 12.4,
    quality: "baja",
    barWidth: 335,
  },
  {
    id: "ch-linkedin",
    name: "LinkedIn Ads",
    visits: 27910,
    registrations: 1507,
    retention90d: 31.5,
    quality: "media",
    barWidth: 283,
  },
  {
    id: "ch-meta",
    name: "Meta Ads · prospecting",
    visits: 44250,
    registrations: 1770,
    retention90d: 18.6,
    quality: "baja",
    barWidth: 237,
  },
];

export const seedSegments: SegmentRecord[] = [
  {
    id: "seg-exp",
    order: "01",
    name: "Explorador",
    intent: "Intención baja",
    intentTone: "low",
    description:
      "Primer contacto, sin intención definida: entró, creó la cuenta y no volvió a abrir el producto.",
    users: 4287,
    converted: 77,
    color: "#C24A3A",
    wide: false,
    baseBarWidth: 272,
    conversionBarWidth: 21,
  },
  {
    id: "seg-inv",
    order: "02",
    name: "Investigador",
    intent: "Intención baja",
    intentTone: "low",
    description:
      "Explora el producto por su cuenta: abrió el editor de informes varias veces, todavía sin crear el primero.",
    users: 3083,
    converted: 197,
    color: "#1751C8",
    wide: false,
    baseBarWidth: 194,
    conversionBarWidth: 52,
  },
  {
    id: "seg-comp",
    order: "03",
    name: "Comparador",
    intent: "Intención media",
    intentTone: "medium",
    description:
      "Ya activado y evaluando alternativas: creó informes, visitó la página de precios más de una vez.",
    users: 2144,
    converted: 315,
    color: "#276A60",
    wide: false,
    baseBarWidth: 155,
    conversionBarWidth: 97,
  },
  {
    id: "seg-list",
    order: "04",
    name: "Listo para comprar",
    intent: "Intención alta",
    intentTone: "high",
    description:
      "Señales claras de compra: informes compartidos con su equipo, consulta al área comercial o prueba del plan de pago.",
    users: 1140,
    converted: 436,
    color: "#FFB412",
    wide: true,
    baseBarWidth: 194,
    conversionBarWidth: 295,
  },
  {
    id: "seg-rec",
    order: "05",
    name: "Cliente recurrente",
    intent: "Cliente",
    intentTone: "customer",
    description:
      "Ya paga y sigue usando el producto: informes recurrentes cada semana y más de un usuario por cuenta.",
    users: 1880,
    converted: 1737,
    color: "#CE8BFF",
    wide: true,
    baseBarWidth: 194,
    conversionBarWidth: 396,
  },
];

export const seedCampaigns: CampaignRecord[] = [
  {
    id: "camp-01",
    title: "Q3 · Meta prospecting ES",
    status: "activo",
    dateRange: "18 ago – 6 sep 2026",
    channels: ["ch-meta", "ch-display"],
    visits: 21140,
    registrations: 892,
    customers: 61,
    retained: 19,
    segmentId: "seg-exp",
    metricsBarWidths: [212, 32, 14, 15],
  },
  {
    id: "camp-02",
    title: "Q3 · Referidos partner",
    status: "activo",
    dateRange: "1 ago – 6 sep 2026",
    channels: ["ch-ref", "ch-comm"],
    visits: 9310,
    registrations: 1186,
    customers: 268,
    retained: 167,
    segmentId: "seg-list",
    metricsBarWidths: [212, 32, 20, 15],
  },
  {
    id: "camp-03",
    title: "Siempre activa · Búsqueda de marca",
    status: "activo",
    dateRange: "Sin fecha de fin",
    channels: ["ch-google", "ch-seo"],
    visits: 34820,
    registrations: 2744,
    customers: 471,
    retained: 236,
    segmentId: "seg-comp",
    metricsBarWidths: [212, 24, 13, 13],
  },
];

export const seedOpportunities: OpportunityRecord[] = [
  {
    id: "op-01",
    title: "Reducir la caída post-activación",
    impact: "alto",
    source: "funnel",
    sourceLabel: "Resumen",
    stage: "Activados → Clientes",
    stageKey: "activados|clientes",
    description:
      "El 74,2 % de los usuarios activados no llega a ser cliente: 5.306 usuarios perdidos en el paso a pago, la mayor caída del recorrido interno.",
    usersAtStake: 5306,
    objectiveMetric: "Conversión a pago",
    status: "abierta",
  },
  {
    id: "op-02",
    title: "Simplificar el onboarding",
    impact: "alto",
    source: "funnel",
    sourceLabel: "Funnel · Registros → Activados",
    stage: "Registros → Activados",
    stageKey: "registros|activados",
    description:
      "5.386 usuarios se registran pero nunca crean su primer informe (-43,0 %). El abandono se concentra en el paso 3 de 5 del onboarding.",
    usersAtStake: 5386,
    objectiveMetric: "Tasa de activación",
    status: "abierta",
  },
  {
    id: "op-03",
    title: "Reasignar presupuesto de Meta prospecting",
    impact: "medio",
    source: "canales",
    sourceLabel: "Canales · Meta Ads",
    stage: "Adquisición",
    stageKey: "adquisicion",
    channelId: "ch-meta",
    description:
      "Meta prospecting es el canal de mayor volumen (44.250 visitas) pero convierte al 4,0 % y retiene sólo el 18,6 % a 90 días, muy por debajo del objetivo del 7 %.",
    usersAtStake: 44250,
    objectiveMetric: "Conversión por canal",
    status: "abierta",
  },
  {
    id: "op-04",
    title: "Frenar la fuga de clientes nuevos",
    impact: "medio",
    source: "funnel",
    sourceLabel: "Funnel · Clientes → Retenidos",
    stage: "Clientes → Retenidos",
    stageKey: "clientes|retenidos",
    description:
      "1.083 de los 1.842 clientes nuevos no siguen activos a los 90 días (-58,8 %), con la retención global cayendo 2,3 puntos vs. el período anterior.",
    usersAtStake: 1083,
    objectiveMetric: "Retención 90 d",
    status: "abierta",
  },
];

export const seedExperiments: ExperimentRecord[] = [
  {
    id: "exp-03",
    status: "enCurso",
    type: "Landing",
    campaign: "Q3 · Meta prospecting ES",
    owner: "Marina Costa",
    dateLabel: "Activado el 18 ago 2026",
    hypothesis:
      "Si la landing de Meta habla de ahorro de tiempo en lugar de precio, subirá la conversión a registro.",
    variantA: "Landing actual con enfoque en precio",
    variantB: "Landing con enfoque en ahorro de tiempo",
    objectiveMetric: "Conversión a registro",
    opportunityId: "op-03",
    detail: {
      objectiveMetric: "Conversión a registro",
      activatedAt: "18 ago, 2026",
      traffic: "21.140 visitas",
      origin: "Oportunidad 03",
      variantA: {
        label: "Versión A - actual",
        description:
          "Landing genérica con foco en precio y plan gratuito. Titular “El plan gratuito más completo del mercado” y tabla de precios sobre el pliegue.",
        exposed: 10612,
        conversion: 4.5,
      },
      variantB: {
        label: "Versión B - propuesta",
        description:
          "Landing con caso de uso y prueba social de equipos de marketing. Titular “Tu informe de growth listo en 10 minutos” y precios debajo del pliegue.",
        exposed: 10528,
        conversion: 5.6,
      },
      measurementNotes:
        "Medido sobre las visitas de Meta prospecting entre el 18 ago y el 6 sep.",
      comments: [
        [
          "MC",
          "Marina Costa 18 ago · 10:24",
          "Arrancamos con reparto 50/50 del tráfico de Meta. La versión B sólo cambia el titular y el orden de los bloques, no el formulario.",
        ],
        [
          "DF",
          "Diego Ferrer 29 ago · 16:02",
          "Ojo que la semana del 24 tuvimos un pico de tráfico de una campaña de retargeting; puede ensuciar un poco los números de A.",
        ],
        [
          "LB",
          "Lucía Bravo 5 sep · 09:41",
          "Cargué la conversión de las dos versiones desde el panel de Meta. B viene consistentemente arriba desde la segunda semana.",
        ],
      ],
      tags: ["meta-ads", "copy-landing", "q3"],
    },
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
    variantA: "Onboarding actual",
    variantB: "Onboarding guiado",
    objectiveMetric: "Tasa de activación",
    conversionA: 54.1,
    conversionB: 61.8,
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
    variantA: "CTA actual",
    variantB: "CTA directo",
    objectiveMetric: "Conversión a pago",
    conversionA: 6.9,
    conversionB: 6.7,
    learning: "Sin diferencia significativa entre versiones.",
  },
];

export const seedActivity: DemoState["activity"] = [];

export function createSeedState(): DemoState {
  return {
    version: 1,
    filters: {
      search: "",
      dateRange: "last30",
      channelId: "all",
    },
    channels: seedChannels.map((channel) => ({ ...channel })),
    segments: seedSegments.map((segment) => ({ ...segment })),
    campaigns: seedCampaigns.map((campaign) => ({
      ...campaign,
      channels: [...campaign.channels],
      metricsBarWidths: [...campaign.metricsBarWidths] as [
        number,
        number,
        number,
        number,
      ],
    })),
    opportunities: seedOpportunities.map((opportunity) => ({ ...opportunity })),
    experiments: seedExperiments.map((experiment) => ({
      ...experiment,
      detail: experiment.detail
        ? {
            ...experiment.detail,
            variantA: { ...experiment.detail.variantA },
            variantB: { ...experiment.detail.variantB },
            comments: experiment.detail.comments.map((comment) => [
              ...comment,
            ]) as [string, string, string][],
            tags: [...experiment.detail.tags],
          }
        : undefined,
    })),
    activity: [],
  };
}