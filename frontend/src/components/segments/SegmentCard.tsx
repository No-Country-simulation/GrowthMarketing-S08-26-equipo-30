import type { SegmentCardItem } from "@/features/segments/segmentosData";

interface SegmentCardProps {
  data: SegmentCardItem;
}

export default function SegmentCard({ data }: SegmentCardProps) {
  const className = data.wide
    ? "segment-card segment-card-wide"
    : "segment-card";
  return (
    <article className={className}>
      <div className="segment-card-head">
        <span className="segment-card-order">{data.order}</span>
        <span className="segment-card-name">{data.name}</span>
        <span className={`segment-card-badge segment-card-badge-${data.intentTone}`}>
          {data.intent}
        </span>
      </div>
      <p className="segment-card-desc">{data.description}</p>
      <div className="segment-card-bars">
        <div className="segment-card-bar">
          <div className="segment-card-bar-top">
            <span className="segment-card-bar-label">% de la base</span>
            <span className="segment-card-bar-value">{data.basePercent}</span>
          </div>
          <div className="segment-card-bar-track">
            <span
              className="segment-card-bar-fill"
              style={{
                width: `${data.baseBarWidth}px`,
                background: data.color,
              }}
            />
          </div>
        </div>
        <div className="segment-card-bar">
          <div className="segment-card-bar-top">
            <span className="segment-card-bar-label">Tasa de conversión</span>
            <span className="segment-card-bar-value">
              {data.conversionRate}
            </span>
          </div>
          <div className="segment-card-bar-track">
            <span
              className="segment-card-bar-fill"
              style={{
                width: `${data.conversionBarWidth}px`,
                background: data.color,
              }}
            />
          </div>
        </div>
      </div>
      <footer className="segment-card-footer">{data.footer}</footer>
    </article>
  );
}