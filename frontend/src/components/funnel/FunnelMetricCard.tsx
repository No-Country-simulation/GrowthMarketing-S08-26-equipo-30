interface FunnelMetricCardProps {
  data: {
    label: string;
    value: string;
    caption: string;
  };
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