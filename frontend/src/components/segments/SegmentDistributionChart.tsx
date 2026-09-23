import type { SegmentosData } from "@/features/segments/segmentosData";

interface SegmentDistributionChartProps {
  distribution: SegmentosData["distribution"];
}

export default function SegmentDistributionChart({
  distribution,
}: SegmentDistributionChartProps) {
  return (
    <section className="segments-distribution-card">
      <div className="segments-distribution-head">
        <h2 className="segments-distribution-title">{distribution.title}</h2>
        <span className="segments-distribution-subtitle">
          {distribution.subtitle}
        </span>
      </div>
      <div className="segments-distribution-list">
        {distribution.items.map((item) => (
          <div key={item.name} className="segment-distribution-row">
            <div className="segment-distribution-head">
              <span className="segment-distribution-name">{item.name}</span>
              <div className="segment-distribution-right">
                <span className="segment-distribution-percent">
                  {item.percent}
                </span>
                <span className="segment-distribution-users">{item.users}</span>
              </div>
            </div>
            <div className="segment-distribution-track">
              <span
                className="segment-distribution-fill"
                style={{ width: `${item.barWidth}px`, background: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <footer className="segments-distribution-insight">
        {distribution.insight}
      </footer>
    </section>
  );
}