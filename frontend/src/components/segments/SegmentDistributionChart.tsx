import type { SegmentView } from "@/demo/demoSelectors";
import { onEnterOrSpace } from "@/components/ui/clickable";

interface SegmentDistributionChartProps {
  distribution: {
    title: string;
    subtitle: string;
    insight: string;
  };
  items: SegmentView["items"];
  onSelect?: (id: string) => void;
}

export default function SegmentDistributionChart({
  distribution,
  items,
  onSelect,
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
        {items.map((item) => {
          const selectable = Boolean(onSelect);
          return (
            <div
              key={item.id}
              className={`segment-distribution-row${
                selectable ? " segment-distribution-row-clickable" : ""
              }`}
              role={selectable ? "button" : undefined}
              tabIndex={selectable ? 0 : undefined}
              aria-label={
                selectable ? `Ver campañas del segmento ${item.name}` : undefined
              }
              onClick={() => onSelect?.(item.id)}
              onKeyDown={(event) =>
                onSelect && onEnterOrSpace(event, () => onSelect(item.id))
              }
            >
              <div className="segment-distribution-head">
                <span className="segment-distribution-name">{item.name}</span>
                <div className="segment-distribution-right">
                  <span className="segment-distribution-percent">
                    {item.basePercent}
                  </span>
                  <span className="segment-distribution-users">
                    {item.usersText}
                  </span>
                </div>
              </div>
              <div className="segment-distribution-track">
                <span
                  className="segment-distribution-fill"
                  style={{ width: `${item.baseBarWidth}px`, background: item.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <footer className="segments-distribution-insight">
        {distribution.insight}
      </footer>
    </section>
  );
}