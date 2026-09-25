import type { ChannelQualityItem } from "@/demo/demoSelectors";
import { onEnterOrSpace } from "@/components/ui/clickable";

interface ChannelQualityDonutProps {
  data: ChannelQualityItem[];
  section: {
    title: string;
    subtitle: string;
    footer: string;
  };
  onSelectQuality?: (quality: string) => void;
}

const COLOR_MAP: Record<ChannelQualityItem["color"], string> = {
  secondary: "#CE8BFF",
  accent: "#FFB412",
  error: "#C24A3A",
};

const DONUT_RADIUS = 79;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;
const CX = 95.5;
const CY = 95.35;

interface DonutSegment {
  color: string;
  dashLength: number;
  dashOffset: number;
  onClick: () => void;
}

function buildSegments(
  data: ChannelQualityItem[],
  onSelectQuality?: (quality: string) => void,
): DonutSegment[] {
  let offset = 0;
  return data.map((item) => {
    const fraction =
      parseFloat(item.percentage.replace("%", "").replace(",", ".").trim()) / 100;
    const dashLength = fraction * DONUT_CIRCUMFERENCE;
    const segment: DonutSegment = {
      color: COLOR_MAP[item.color],
      dashLength,
      dashOffset: offset,
      onClick: () => onSelectQuality?.(item.quality),
    };
    offset -= dashLength;
    return segment;
  });
}

export default function ChannelQualityDonut({
  data,
  section,
  onSelectQuality,
}: ChannelQualityDonutProps) {
  const segments = buildSegments(data, onSelectQuality);
  const center = data[0];
  return (
    <section className="quality-card">
      <div className="quality-heading">
        <h2 className="card-title">{section.title}</h2>
        <span className="card-subtitle">{section.subtitle}</span>
      </div>
      <div className="quality-body">
        <div className="donut-wrap">
          <svg
            className="donut-svg"
            viewBox={`0 0 191 190.71`}
            aria-hidden="true"
          >
            {segments.map((segment) => (
              <circle
                key={segment.color}
                cx={CX}
                cy={CY}
                r={DONUT_RADIUS}
                fill="none"
                stroke={segment.color}
                strokeWidth="30"
                strokeDasharray={`${segment.dashLength} ${DONUT_CIRCUMFERENCE - segment.dashLength}`}
                strokeDashoffset={segment.dashOffset}
                transform={`rotate(-90 ${CX} ${CY})`}
              />
            ))}
          </svg>
          <button
            type="button"
            className="donut-center"
            onClick={() => onSelectQuality?.(center.quality)}
            aria-label={`Ver canales de ${center.label.toLowerCase()}`}
          >
            <span className="donut-center-value">{center.percentage}</span>
            <span className="donut-center-label">{center.label}</span>
          </button>
        </div>
        <div className="quality-legend">
          {data.map((item) => (
            <button
              key={item.label}
              type="button"
              className="legend-row legend-row-button"
              onClick={() => onSelectQuality?.(item.quality)}
              onKeyDown={(event) =>
                onSelectQuality && onEnterOrSpace(event, () => onSelectQuality(item.quality))
              }
            >
              <div className="legend-left">
                <span
                  className="legend-dot"
                  style={{ background: COLOR_MAP[item.color] }}
                />
                <span className="legend-label">{item.label}</span>
              </div>
              <div className="legend-right">
                <span className="legend-value">{item.value}</span>
                <span className="legend-percent">{item.percentage}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <p className="quality-footer">{section.footer}</p>
    </section>
  );
}