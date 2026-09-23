import type { FunnelMetricData } from "@/features/funnel/funnelData";

interface FunnelMetricCardProps {
  data: FunnelMetricData;
}

export default function FunnelMetricCard({ data }: FunnelMetricCardProps) {
  return (
    <article className="funnel-metric-card">
      <span className="funnel-metric-label">{data.label}</span>
      <span className="funnel-metric-value">{data.value}</span>
      <span className="funnel-metric-caption">{data.caption}</span>
    </article>
  );
}