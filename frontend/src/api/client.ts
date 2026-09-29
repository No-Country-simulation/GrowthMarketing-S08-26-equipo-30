export type ApiStatus = "idle" | "checking" | "connected" | "unavailable";

export interface HealthResponse { status: "ok"; checkedAt: string }
export interface ApiChannel { id: number; name: string }
export interface ApiCampaign {
  id: string; name: string; objective: string; budget: number; startDate: string; endDate: string;
  status: "ACTIVA" | "PAUSADA" | "FINALIZADA"; archivedAt?: string | null; channels: ApiChannel[];
  visits: number; registrations: number; customers: number; retained: number;
}
export interface ApiVariant { code: "A" | "B"; description: string; visits?: number; registrations?: number; activations?: number; conversions?: number; clicks?: number; spend?: number; measuredAt?: string }
export interface ApiExperiment {
  id: string; campaignId: string; campaignName: string; status: "BORRADOR" | "ACTIVO" | "TERMINADO" | "CANCELADO";
  viewStatus: "PLANIFICADO" | "EN_CURSO" | "VALIDADO" | "NO_VALIDADO"; name: string; hypothesis: string;
  targetMetric: string; resultType?: string; startedAt?: string; endedAt?: string; winnerCode?: string; conclusion?: string;
  variants: ApiVariant[]; runs?: unknown[];
}
export interface ApiFunnelStage {
  stage: string; label: string; position: number; users: number; advanceRate: number | null;
  channelSegments: { channelId: number; channelName: string; users: number; percentage: number }[];
}
export interface ApiFunnel { stages: ApiFunnelStage[]; bottleneckStage?: string; biggestDrop?: number }

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export function hasApiBaseUrl(): boolean { return API_BASE_URL.length > 0 }

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!hasApiBaseUrl()) throw new Error("VITE_API_BASE_URL no esta configurado");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { Accept: "application/json", "Content-Type": "application/json", ...init.headers },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `API error ${response.status}`);
  }
  return response.json() as Promise<T>;
}

function qs(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => { if (value !== undefined) query.set(key, String(value)); });
  const value = query.toString();
  return value ? `?${value}` : "";
}

export async function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  return request<HealthResponse>("/api/health", { signal });
}

export const api = {
  channels: () => request<ApiChannel[]>("/api/channels"),
  campaigns: (params: { from?: string; to?: string; channelId?: string | number }) =>
    request<ApiCampaign[]>(`/api/campaigns${qs({ from: params.from, to: params.to, channelId: params.channelId === "all" ? undefined : params.channelId })}`),
  createCampaign: (body: unknown) => request<ApiCampaign>("/api/campaigns", { method: "POST", body: JSON.stringify(body) }),
  updateCampaign: (id: string, body: unknown) => request<ApiCampaign>(`/api/campaigns/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  setCampaignStatus: (id: string, status: string) => request<ApiCampaign>(`/api/campaigns/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  archiveCampaign: (id: string) => request<ApiCampaign>(`/api/campaigns/${id}`, { method: "DELETE" }),
  experiments: () => request<ApiExperiment[]>("/api/experiments"),
  createExperiment: (body: unknown) => request<ApiExperiment>("/api/experiments", { method: "POST", body: JSON.stringify(body) }),
  updateExperiment: (id: string, body: unknown) => request<ApiExperiment>(`/api/experiments/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  startExperiment: (id: string) => request<ApiExperiment>(`/api/experiments/${id}/start`, { method: "POST" }),
  cancelExperiment: (id: string) => request<ApiExperiment>(`/api/experiments/${id}/cancel`, { method: "POST" }),
  closeExperiment: (id: string, body: unknown) => request<ApiExperiment>(`/api/experiments/${id}/close`, { method: "POST", body: JSON.stringify(body) }),
  funnel: (params: { from?: string; to?: string; channelId?: string | number }) =>
    request<ApiFunnel>(`/api/analytics/funnel${qs({ from: params.from, to: params.to, channelId: params.channelId === "all" ? undefined : params.channelId })}`),
};
