import cursorPrimary from "@/assets/icons/figma/cursor-primary.svg";
import personUpPrimary from "@/assets/icons/figma/person-up-primary.svg";
import creditCardPrimary from "@/assets/icons/figma/credit-card-primary.svg";
import graphUpArrowPrimary from "@/assets/icons/figma/graph-up-arrow-primary.svg";
import type {
  CampaignMetric,
  CampaignTrackingData,
} from "@/features/campaigns/campanasData";

interface CampaignTrackingCardProps {
  data: CampaignTrackingData;
}

const METRIC_ICON: Record<CampaignMetric["label"], string> = {
  VISITAS: cursorPrimary,
  Registros: personUpPrimary,
  Clientes: creditCardPrimary,
  Retenidos: graphUpArrowPrimary,
};

const SUMMARY_ITEMS: {
  key: "registrationConversion" | "visitToCustomer" | "retention90d" | "dominantSegment";
  label: string;
}[] = [
  { key: "registrationConversion", label: "Conversión a registro" },
  { key: "visitToCustomer", label: "Visita a cliente" },
  { key: "retention90d", label: "Retención a 90 d" },
  { key: "dominantSegment", label: "Segmento dominante" },
];

export default function CampaignTrackingCard({
  data,
}: CampaignTrackingCardProps) {
  return (
    <article className="campaign-card">
      <header className="campaign-card-head">
        <div className="campaign-title-group">
          <h2 className="campaign-title">{data.title}</h2>
          <span className="campaign-date">{data.dateRange}</span>
        </div>
        <div className="campaign-head-right">
          <span className="campaign-status campaign-status-activo">
            {data.status}
          </span>
          <div className="campaign-channels">
            {data.channels.map((channel) => (
              <span key={channel} className="campaign-channel">
                {channel}
              </span>
            ))}
          </div>
        </div>
      </header>
      <div className="campaign-metrics">
        {data.metrics.map((metric) => (
          <div key={metric.label} className="campaign-metric-card">
            <div className="campaign-metric-label-row">
              <img
                className="campaign-metric-icon"
                src={METRIC_ICON[metric.label]}
                alt=""
              />
              <span className="campaign-metric-label">{metric.label}</span>
            </div>
            <span className="campaign-metric-value">{metric.value}</span>
            <span className="campaign-metric-caption">{metric.caption}</span>
            <div className="campaign-bar">
              <span
                className={`campaign-bar-fill campaign-bar-fill-${metric.tone}`}
                style={{ width: `${metric.barWidthPx}px` }}
              />
            </div>
          </div>
        ))}
      </div>
      <footer className="campaign-summary">
        {SUMMARY_ITEMS.map((item) => {
          const value = data.summary[item.key];
          const isRetention = item.key === "retention90d";
          const valueClass = isRetention
            ? `campaign-summary-value campaign-summary-value-${data.summary.retentionTone}`
            : "campaign-summary-value";
          return (
            <div key={item.key} className="campaign-summary-item">
              <span className="campaign-summary-label">{item.label}</span>
              <span className={valueClass}>{value}</span>
            </div>
          );
        })}
      </footer>
    </article>
  );
}