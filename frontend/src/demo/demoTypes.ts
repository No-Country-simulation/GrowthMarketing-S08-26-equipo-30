export type DateRange = "last7" | "last30" | "last90";

export type CampaignStatus = "activo" | "pausado" | "finalizado";

export type OpportunityStatus = "abierta" | "enExperimento" | "descartada";

export type ExperimentStatus =
  | "planificado"
  | "enCurso"
  | "validado"
  | "noValidado";

export type ChannelQuality = "alta" | "media" | "baja";

export type OpportunityImpact = "alto" | "medio";

export type OpportunitySource = "funnel" | "canales";

export type ExperimentType =
  | "Canal"
  | "Segmentación"
  | "Anuncio"
  | "Landing"
  | "CTA"
  | "Onboarding"
  | "Oferta"
  | "Retención";

export type IntentTone = "low" | "medium" | "high" | "customer";

export interface DemoFilters {
  search: string;
  dateRange: DateRange;
  channelId: string | "all";
}

export interface ChannelRecord {
  id: string;
  name: string;
  visits: number;
  registrations: number;
  retention90d: number;
  quality: ChannelQuality;
  barWidth: number;
}

export interface SegmentRecord {
  id: string;
  order: string;
  name: string;
  intent: string;
  intentTone: IntentTone;
  description: string;
  users: number;
  converted: number;
  color: string;
  wide: boolean;
  baseBarWidth: number;
  conversionBarWidth: number;
}

export interface CampaignRecord {
  id: string;
  title: string;
  status: CampaignStatus;
  dateRange: string;
  channels: string[];
  visits: number;
  registrations: number;
  customers: number;
  retained: number;
  segmentId: string;
  metricsBarWidths: [number, number, number, number];
}

export interface OpportunityRecord {
  id: string;
  title: string;
  impact: OpportunityImpact;
  source: OpportunitySource;
  sourceLabel: string;
  stage: string;
  stageKey: string;
  channelId?: string;
  description: string;
  usersAtStake: number;
  objectiveMetric: string;
  status: OpportunityStatus;
  experimentId?: string;
}

export interface ExperimentVariantRecord {
  label: string;
  description: string;
  exposed: number;
  conversion: number;
}

export interface ExperimentDetailRecord {
  objectiveMetric: string;
  activatedAt: string;
  traffic: string;
  origin: string;
  variantA: ExperimentVariantRecord;
  variantB: ExperimentVariantRecord;
  measurementNotes: string;
  comments: [string, string, string][];
  tags: string[];
}

export interface ExperimentRecord {
  id: string;
  status: ExperimentStatus;
  type: ExperimentType;
  campaign: string;
  owner: string;
  dateLabel: string;
  hypothesis: string;
  variantA: string;
  variantB: string;
  objectiveMetric: string;
  opportunityId?: string;
  conversionA?: number;
  conversionB?: number;
  learning?: string;
  detail?: ExperimentDetailRecord;
}

export interface ActivityRecord {
  id: string;
  message: string;
  timestamp: string;
}

export interface DemoState {
  version: 1;
  filters: DemoFilters;
  channels: ChannelRecord[];
  segments: SegmentRecord[];
  campaigns: CampaignRecord[];
  opportunities: OpportunityRecord[];
  experiments: ExperimentRecord[];
  activity: ActivityRecord[];
}