import cursorPrimary from "@/assets/icons/figma/cursor-primary.svg";
import personUpPrimary from "@/assets/icons/figma/person-up-primary.svg";
import creditCardPrimary from "@/assets/icons/figma/credit-card-primary.svg";
import graphUpArrowPrimary from "@/assets/icons/figma/graph-up-arrow-primary.svg";
import type {
  CampaignRecord,
  ChannelRecord,
  DemoState,
  ExperimentRecord,
  OpportunityRecord,
  SegmentRecord,
} from "@/demo/demoTypes";
import { FUNNEL_LAYOUT, FUNNEL_RATES } from "@/demo/demoSeed";
import { SCALE_BY_RANGE } from "@/demo/demoScenarios";
import { formatNumber, formatPercent } from "@/demo/demoFormat";

interface FunnelNumbers {
  visits: number;
  registrations: number;
  activados: number;
  clientes: number;
  retenidos: number;
}

function isDefaultScenario(state: DemoState): boolean {
  return (
    state.filters.dateRange === "last30" && state.filters.channelId === "all"
  );
}

function scaleChannel(
  channel: ChannelRecord,
  state: DemoState,
): ChannelRecord {
  const scale = SCALE_BY_RANGE[state.filters.dateRange];
  return {
    ...channel,
    visits: Math.round(channel.visits * scale),
    registrations: Math.round(channel.registrations * scale),
  };
}

function visibleChannels(state: DemoState): ChannelRecord[] {
  const channels = state.channels
    .filter(
      (channel) =>
        state.filters.channelId === "all" ||
        channel.id === state.filters.channelId,
    )
    .map((channel) => scaleChannel(channel, state));
  return channels;
}

function funnelFrom(visits: number, registrations: number): FunnelNumbers {
  const activados = Math.round(registrations * FUNNEL_RATES.activation);
  const clientes = Math.round(activados * FUNNEL_RATES.purchase);
  const retenidos = Math.round(clientes * FUNNEL_RATES.retention);
  return { visits, registrations, activados, clientes, retenidos };
}

function sumChannelVisits(channels: ChannelRecord[]): number {
  return channels.reduce((total, channel) => total + channel.visits, 0);
}

function sumChannelRegistrations(channels: ChannelRecord[]): number {
  return channels.reduce((total, channel) => total + channel.registrations, 0);
}

function proportionalWidth(
  value: number,
  maxValue: number,
  seedWidth: number,
  maxSeedWidth: number,
  preserveSeed: boolean,
): number {
  if (preserveSeed) {
    return seedWidth;
  }
  if (maxValue <= 0) {
    return 0;
  }
  return Math.round(maxSeedWidth * (value / maxValue));
}

function matchesSearch(
  value: string,
  search: string,
): boolean {
  const query = search.trim().toLowerCase();
  if (!query) {
    return true;
  }
  return value.toLowerCase().includes(query);
}

/* ------------------------------- Dashboard ------------------------------ */

export interface DashboardMetrics {
  visits: number;
  registrations: number;
  activados: number;
  clientes: number;
  retenidos: number;
  registrationRate: number;
  retentionRate: number;
  funnel: FunnelNumbers;
}

export function selectDashboardMetrics(state: DemoState): DashboardMetrics {
  const channels = visibleChannels(state);
  const visits = sumChannelVisits(channels);
  const registrations = sumChannelRegistrations(channels);
  const funnel = funnelFrom(visits, registrations);
  return {
    visits,
    registrations,
    activados: funnel.activados,
    clientes: funnel.clientes,
    retenidos: funnel.retenidos,
    registrationRate: registrations / visits,
    retentionRate: funnel.retenidos / funnel.clientes,
    funnel,
  };
}

export function selectDashboardKpis(state: DemoState) {
  const metrics = selectDashboardMetrics(state);
  return [
    {
      label: "VISITAS",
      value: formatNumber(metrics.visits),
      delta: "+12,4 % vs. período anterior",
      deltaDirection: "up" as const,
      iconSrc: cursorPrimary,
    },
    {
      label: "TASA DE REGISTRO",
      value: formatPercent(metrics.registrationRate),
      delta: "+0,9 pts vs. período anterior",
      deltaDirection: "up" as const,
      iconSrc: personUpPrimary,
    },
    {
      label: "CLIENTES NUEVOS",
      value: formatNumber(metrics.clientes),
      delta: "+8,1 % vs. período anterior",
      deltaDirection: "up" as const,
      iconSrc: creditCardPrimary,
    },
    {
      label: "RETENCIÓN 90 DÍAS",
      value: formatPercent(metrics.retentionRate),
      delta: "-2,3 pts vs. período anterior",
      deltaDirection: "down" as const,
      iconSrc: graphUpArrowPrimary,
    },
  ];
}

/* -------------------------------- Funnel -------------------------------- */

export interface FunnelView {
  funnel: FunnelNumbers;
  summarySteps: {
    label: string;
    value: string;
    percentage: string;
    dropLabel?: string;
    barWidthPx: number;
  }[];
  stages: {
    label: string;
    description: string;
    value: string;
    percentage: string;
    dropText?: string;
    barWidthPx: number;
    highlight?: boolean;
  }[];
  alert: {
    title: string;
    badge: string;
    body: string;
    note: string;
  };
  metrics: {
    label: string;
    value: string;
    caption: string;
  }[];
}

const STAGE_DEFINITIONS = [
  { label: "Visitas", description: "Sesiones únicas" },
  { label: "Registros", description: "Cuenta creada" },
  { label: "Activados", description: "Primer informe creado" },
  { label: "Clientes", description: "Plan de pago activo" },
  { label: "Retenidos", description: "Activos a 90 días" },
];

export function selectFunnel(state: DemoState): FunnelView {
  const { funnel } = selectDashboardMetrics(state);
  const { visits, registrations, activados, clientes, retenidos } = funnel;
  const values = [visits, registrations, activados, clientes, retenidos];
  const maxValue = Math.max(...values);
  const preserveSeed = isDefaultScenario(state);
  const [visitasWidth, registrosWidth, activadosWidth, clientesWidth, retenidosWidth] =
    FUNNEL_LAYOUT.detailWidths;

  const stages = STAGE_DEFINITIONS.map((stage, index) => {
    const value = values[index];
    const percentage = formatPercent(value / visits);
    const next = values[index + 1];
    const dropText =
      next !== undefined
        ? `-${formatPercentDeltaAbs(1 - next / value)} ${formatNumber(value - next)} personas no avanzan`
        : undefined;
    const width = proportionalWidth(
      value,
      maxValue,
      [visitasWidth, registrosWidth, activadosWidth, clientesWidth, retenidosWidth][index],
      visitasWidth,
      preserveSeed,
    );
    return {
      label: stage.label,
      description: stage.description,
      value: formatNumber(value),
      percentage,
      dropText,
      barWidthPx: width,
      highlight: stage.label === "Activados",
    };
  });

  const [summaryVisitas, summaryRegistros, summaryActivados, summaryClientes, summaryRetenidos] =
    FUNNEL_LAYOUT.summaryWidths;
  const summarySteps = STAGE_DEFINITIONS.map((stage, index) => {
    const value = values[index];
    const next = values[index + 1];
    const dropLabel =
      next !== undefined
        ? `caída-${formatPercentDeltaAbs(1 - next / value)}`
        : undefined;
    return {
      label: stage.label,
      value: formatNumber(value),
      percentage: formatPercent(value / visits),
      dropLabel,
      barWidthPx: proportionalWidth(
        value,
        maxValue,
        [summaryVisitas, summaryRegistros, summaryActivados, summaryClientes, summaryRetenidos][index],
        summaryVisitas,
        preserveSeed,
      ),
    };
  });

  const registrosDrop = 1 - registrations / visits;
  const clientesDrop = 1 - clientes / activados;
  const retenidosDrop = 1 - retenidos / clientes;

  const alert = {
    title: "Mayor caída detectada: Activados → Clientes",
    badge: `-${formatPercentDeltaAbs(clientesDrop)}`,
    body: `De los ${formatNumber(activados)} usuarios que activaron el producto, sólo ${formatNumber(clientes)} llegaron a ser clientes: se pierden ${formatNumber(activados - clientes)} usuarios ya activados en el paso a pago. Es la caída más grande del recorrido interno y, por el valor de esos usuarios, la principal oportunidad de mejora del trimestre.`,
    note: `La caída Visitas → Registros (-${formatPercentDeltaAbs(registrosDrop)}) es mayor en términos absolutos, pero está dentro del rango esperable para tráfico frío.`,
  };

  const metrics = [
    {
      label: "Conversión total",
      value: formatPercent(clientes / visits, 2),
      caption: "De visita a cliente pagador",
    },
    {
      label: "Tiempo medio al pago",
      value: "11,4 días",
      caption: "Desde el registro, mediana 8 días",
    },
    {
      label: "Clientes perdidos a 90 d",
      value: formatNumber(clientes - retenidos),
      caption: `${formatPercentDeltaAbs(retenidosDrop)} de los clientes nuevos`,
    },
  ];

  return {
    funnel,
    summarySteps,
    stages,
    alert,
    metrics,
  };
}

function formatPercentDeltaAbs(value: number): string {
  const formatted = (value * 100).toFixed(1).replace(".", ",");
  return `${formatted} %`;
}

/* -------------------------------- Canales ------------------------------- */

export interface ChannelView {
  channels: {
    id: string;
    name: string;
    visits: string;
    registrations: string;
    conversion: string;
    retention90d: string;
    quality: ChannelRecord["quality"];
    barWidthPx: number;
  }[];
  total: {
    visits: string;
    registrations: string;
    conversion: string;
    retention90d: string;
  };
}

export function selectChannels(state: DemoState): ChannelView {
  const query = state.filters.search;
  const channels = visibleChannels(state).filter((channel) =>
    matchesSearch(channel.name, query),
  );
  const maxConversion = Math.max(
    ...channels.map((channel) => channel.registrations / channel.visits),
    0,
  );
  const maxSeedWidth = Math.max(
    ...state.channels.map((channel) => channel.barWidth),
  );
  const preserveSeed = isDefaultScenario(state);
  const viewChannels = channels
    .slice()
    .sort(
      (a, b) =>
        b.registrations / b.visits - a.registrations / a.visits,
    )
    .map((channel) => {
      const conversion = channel.registrations / channel.visits;
      return {
        id: channel.id,
        name: channel.name,
        visits: formatNumber(channel.visits),
        registrations: formatNumber(channel.registrations),
        conversion: formatPercent(conversion),
        retention90d: formatPercent(channel.retention90d / 100),
        quality: channel.quality,
        barWidthPx: proportionalWidth(
          conversion,
          maxConversion,
          channel.barWidth,
          maxSeedWidth,
          preserveSeed,
        ),
      };
    });

  const visits = sumChannelVisits(channels);
  const registrations = sumChannelRegistrations(channels);
  const { clientes, retenidos } = funnelFrom(visits, registrations);
  return {
    channels: viewChannels,
    total: {
      visits: formatNumber(visits),
      registrations: formatNumber(registrations),
      conversion: formatPercent(registrations / visits),
      retention90d: formatPercent(retenidos / clientes),
    },
  };
}

export interface ChannelQualityItem {
  label: string;
  value: string;
  percentage: string;
  color: "secondary" | "accent" | "error";
  quality: ChannelRecord["quality"];
}

export function selectChannelQuality(state: DemoState): ChannelQualityItem[] {
  const channels = visibleChannels(state);
  const grouped = { alta: 0, media: 0, baja: 0 };
  channels.forEach((channel) => {
    grouped[channel.quality] += channel.registrations;
  });
  const total = grouped.alta + grouped.media + grouped.baja;
  const items: ChannelQualityItem[] = [
    {
      label: "Alta calidad",
      value: formatNumber(grouped.alta),
      percentage: formatPercent(grouped.alta / total),
      color: "secondary",
      quality: "alta",
    },
    {
      label: "Media calidad",
      value: formatNumber(grouped.media),
      percentage: formatPercent(grouped.media / total),
      color: "accent",
      quality: "media",
    },
    {
      label: "Baja calidad",
      value: formatNumber(grouped.baja),
      percentage: formatPercent(grouped.baja / total),
      color: "error",
      quality: "baja",
    },
  ];
  return items;
}

/* ------------------------------- Segmentos ------------------------------ */

export interface SegmentView {
  totalUsers: number;
  items: {
    id: string;
    order: string;
    name: string;
    intent: string;
    intentTone: SegmentRecord["intentTone"];
    description: string;
    users: number;
    usersText: string;
    converted: number;
    convertedText: string;
    basePercent: string;
    conversionRate: string;
    footer: string;
    color: string;
    baseBarWidth: number;
    conversionBarWidth: number;
    wide: boolean;
  }[];
}

export function selectSegments(state: DemoState): SegmentView {
  const query = state.filters.search;
  const filtered = state.segments.filter((segment) =>
    matchesSearch(segment.name, query),
  );
  const totalUsers = filtered.reduce((total, segment) => total + segment.users, 0);
  const maxUsers = Math.max(...filtered.map((segment) => segment.users), 0);
  const maxConverted = Math.max(...filtered.map((segment) => segment.converted), 0);
  const maxBaseWidth = Math.max(
    ...state.segments.map((segment) => segment.baseBarWidth),
  );
  const maxConversionWidth = Math.max(
    ...state.segments.map((segment) => segment.conversionBarWidth),
  );
  const preserveSeed = isDefaultScenario(state);

  const items = filtered.map((segment) => {
    const basePercent = segment.users / totalUsers;
    const conversionRate = segment.converted / segment.users;
    const isCustomer = segment.intentTone === "customer";
    return {
      id: segment.id,
      order: segment.order,
      name: segment.name,
      intent: segment.intent,
      intentTone: segment.intentTone,
      description: segment.description,
      users: segment.users,
      usersText: formatNumber(segment.users),
      converted: segment.converted,
      convertedText: formatNumber(segment.converted),
      basePercent: formatPercent(basePercent),
      conversionRate: formatPercent(conversionRate),
      footer: `${formatNumber(segment.users)} usuarios · ${formatNumber(
        segment.converted,
      )} ${isCustomer ? "renuevan" : "clientes"}`,
      color: segment.color,
      baseBarWidth: proportionalWidth(
        segment.users,
        maxUsers,
        segment.baseBarWidth,
        maxBaseWidth,
        preserveSeed,
      ),
      conversionBarWidth: proportionalWidth(
        segment.converted,
        maxConverted,
        segment.conversionBarWidth,
        maxConversionWidth,
        preserveSeed,
      ),
      wide: segment.wide,
    };
  });

  return { totalUsers, items };
}

/* -------------------------------- Campañas ------------------------------ */

export interface CampaignView {
  id: string;
  title: string;
  status: CampaignRecord["status"];
  statusLabel: string;
  dateRange: string;
  channels: string[];
  metrics: {
    label: "VISITAS" | "Registros" | "Clientes" | "Retenidos";
    value: string;
    caption: string;
    barWidthPx: number;
    tone: "primary" | "secondary" | "accent" | "success";
  }[];
  summary: {
    registrationConversion: string;
    visitToCustomer: string;
    retention90d: string;
    retentionTone: "success" | "error";
    dominantSegment: string;
  };
}

const CAMPAIGN_STATUS_LABEL: Record<CampaignRecord["status"], string> = {
  activo: "Activo",
  pausado: "Pausado",
  finalizado: "Finalizado",
};

export function selectCampaigns(
  state: DemoState,
  options?: { channel?: string | null; segment?: string | null },
): CampaignView[] {
  const query = state.filters.search;
  const channelFilter = state.filters.channelId;
  const campaigns = state.campaigns
    .filter((campaign) => matchesSearch(campaign.title, query))
    .filter(
      (campaign) =>
        channelFilter === "all" || campaign.channels.includes(channelFilter),
    )
    .filter(
      (campaign) =>
        !options?.channel || campaign.channels.includes(options.channel),
    )
    .filter(
      (campaign) =>
        !options?.segment || campaign.segmentId === options.segment,
    );

  const maxSeedWidth = Math.max(
    ...state.campaigns.flatMap((campaign) => campaign.metricsBarWidths),
  );
  const preserveSeed = isDefaultScenario(state);

  return campaigns.map((campaign) => {
    const registrationConversion = campaign.registrations / campaign.visits;
    const visitToCustomer = campaign.customers / campaign.visits;
    const retention90d = campaign.retained / campaign.customers;
    const maxValue = Math.max(
      campaign.visits,
      campaign.registrations,
      campaign.customers,
      campaign.retained,
    );
    const widths = campaign.metricsBarWidths.map((seedWidth, index) => {
      const value = [campaign.visits, campaign.registrations, campaign.customers, campaign.retained][index];
      return proportionalWidth(value, maxValue, seedWidth, maxSeedWidth, preserveSeed);
    });
    const segment = state.segments.find(
      (item) => item.id === campaign.segmentId,
    );
    const metricValues = [campaign.visits, campaign.registrations, campaign.customers, campaign.retained];
    const metricLabels = ["VISITAS", "Registros", "Clientes", "Retenidos"] as const;
    const metricTones = ["primary", "secondary", "accent", "success"] as const;
    return {
      id: campaign.id,
      title: campaign.title,
      status: campaign.status,
      statusLabel: CAMPAIGN_STATUS_LABEL[campaign.status],
      dateRange: campaign.dateRange,
      channels: campaign.channels
        .map((id) => state.channels.find((channel) => channel.id === id)?.name)
        .filter((name): name is string => Boolean(name)),
      metrics: metricLabels.map((label, index) => ({
        label,
        value: formatNumber(metricValues[index]),
        caption:
          index === 0
            ? "100 % de la campaña"
            : index === 1
              ? `${formatPercent(metricValues[index] / metricValues[0])} de las visitas`
              : index === 2
                ? `${formatPercent(metricValues[index] / metricValues[1])} de los registros`
                : `${formatPercent(metricValues[index] / metricValues[2])} de los clientes a 90 d`,
        barWidthPx: widths[index],
        tone: metricTones[index],
      })),
      summary: {
        registrationConversion: formatPercent(registrationConversion),
        visitToCustomer: formatPercent(visitToCustomer),
        retention90d: formatPercent(retention90d),
        retentionTone: retention90d >= 0.4 ? "success" : "error",
        dominantSegment: segment?.name ?? "—",
      },
    };
  });
}

/* ----------------------------- Oportunidades ---------------------------- */

export interface OpportunityView {
  record: OpportunityRecord;
  index: string;
  usersAtStakeText: string;
  experiment?: ExperimentRecord;
}

export function selectOpportunities(
  state: DemoState,
  options?: { stage?: string | null },
): OpportunityView[] {
  const query = state.filters.search;
  const channelFilter = state.filters.channelId;
  const opportunities = state.opportunities
    .filter((opportunity) => matchesSearch(opportunity.title, query))
    .filter((opportunity) => {
      if (
        channelFilter !== "all" &&
        opportunity.source === "canales" &&
        opportunity.channelId !== channelFilter
      ) {
        return false;
      }
      return true;
    })
    .filter((opportunity) => {
      if (!options?.stage) {
        return true;
      }
      const normalized = options.stage.trim().toLowerCase();
      return opportunity.stageKey
        .toLowerCase()
        .split("|")
        .some((key) => key.includes(normalized) || normalized.includes(key));
    });

  return opportunities.map((opportunity) => ({
    record: opportunity,
    index: String(
      state.opportunities.indexOf(opportunity) + 1,
    ).padStart(2, "0"),
    usersAtStakeText: formatNumber(opportunity.usersAtStake),
    experiment: opportunity.experimentId
      ? state.experiments.find(
          (experiment) => experiment.id === opportunity.experimentId,
        )
      : undefined,
  }));
}

/* ------------------------------ Experimentos ---------------------------- */

export interface ExperimentView extends ExperimentRecord {
  result?: string;
  canEdit: boolean;
  canLaunch: boolean;
  canClose: boolean;
}

export function selectExperiments(state: DemoState): ExperimentView[] {
  const query = state.filters.search;
  const experiments = state.experiments.filter((experiment) =>
    matchesSearch(
      `${experiment.campaign} ${experiment.hypothesis}`,
      query,
    ),
  );
  return experiments.map((experiment) => {
    const result =
      experiment.conversionA !== undefined && experiment.conversionB !== undefined
        ? `A ${formatPercent(experiment.conversionA / 100)} · B ${formatPercent(
            experiment.conversionB / 100,
          )}`
        : undefined;
    return {
      ...experiment,
      result,
      canEdit: experiment.status === "planificado",
      canLaunch: experiment.status === "planificado",
      canClose: experiment.status === "enCurso",
    };
  });
}

export function selectExperimentById(
  state: DemoState,
  id: string | undefined,
): ExperimentView | undefined {
  if (!id) {
    return undefined;
  }
  return selectExperiments(state).find((experiment) => experiment.id === id);
}

/* ------------------------- Búsqueda global ------------------------------ */

export interface GlobalSearchResults {
  campaigns: { id: string; title: string; to: string }[];
  segments: { id: string; name: string; to: string }[];
  opportunities: { id: string; title: string; to: string }[];
  experiments: { id: string; title: string; to: string }[];
}

export function selectGlobalSearchResults(
  state: DemoState,
  query: string,
): GlobalSearchResults {
  const trimmed = query.trim().toLowerCase();
  const empty = { campaigns: [], segments: [], opportunities: [], experiments: [] };
  if (!trimmed) {
    return empty;
  }
  const contains = (value: string) => value.toLowerCase().includes(trimmed);
  return {
    campaigns: state.campaigns
      .filter((campaign) => contains(campaign.title))
      .map((campaign) => ({
        id: campaign.id,
        title: campaign.title,
        to: "/campanas",
      })),
    segments: state.segments
      .filter((segment) => contains(segment.name))
      .map((segment) => ({ id: segment.id, name: segment.name, to: "/segmentos" })),
    opportunities: state.opportunities
      .filter((opportunity) => contains(opportunity.title))
      .map((opportunity) => ({
        id: opportunity.id,
        title: opportunity.title,
        to: "/oportunidades",
      })),
    experiments: state.experiments
      .filter((experiment) => contains(experiment.campaign) || contains(experiment.hypothesis))
      .map((experiment) => ({
        id: experiment.id,
        title: experiment.campaign,
        to: `/experimentos/${experiment.id}`,
      })),
  };
}

export type { ChannelRecord };