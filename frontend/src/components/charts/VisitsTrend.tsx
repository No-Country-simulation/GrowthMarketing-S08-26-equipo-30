import { useState } from "react";
import arrowTagIcon from "@/assets/icons/figma/arrow-up-right-tag.svg";
import type { TrendPoint } from "@/demo/demoScenarios";
import { formatPercent } from "@/demo/demoFormat";

interface VisitsTrendProps {
  data: {
    title: string;
    subtitle: string;
    labels: [string, string, string];
    delta: string;
    caption: string;
  };
  series: TrendPoint[];
}

const PLOT_WIDTH = 508.1;
const PLOT_HEIGHT = 122;

export default function VisitsTrend({ data, series }: VisitsTrendProps) {
  const [active, setActive] = useState<number | null>(null);
  const step = PLOT_WIDTH / (series.length - 1);
  const points = series.map((point, index) => ({
    x: index * step,
    y: point.y,
    point,
  }));
  const line = points
    .map(({ x, y }, index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y}`)
    .join(" ");
  const area = `${line} L${PLOT_WIDTH} ${PLOT_HEIGHT} L0 ${PLOT_HEIGHT} Z`;
  const last = points[points.length - 1];
  const tooltip = active !== null ? points[active] : null;

  return (
    <section className="trend-card">
      <div className="card-heading">
        <h2 className="card-title">{data.title}</h2>
        <span className="card-subtitle">{data.subtitle}</span>
      </div>
      <div className="trend-chart">
        <div className="trend-svg-wrap">
          <svg
            className="trend-svg"
            viewBox={`0 0 ${PLOT_WIDTH} ${PLOT_HEIGHT}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="visits-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#FFB412" stopOpacity="1" />
                <stop offset="1" stopColor="#FFB412" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <line x1="0" y1="4" x2={PLOT_WIDTH} y2="4" stroke="#B8BCC2" strokeWidth="0.5" />
            <line x1="0" y1="63" x2={PLOT_WIDTH} y2="63" stroke="#B8BCC2" strokeWidth="0.5" />
            <line x1="0" y1="122" x2={PLOT_WIDTH} y2="122" stroke="#B8BCC2" strokeWidth="0.5" />
            <path d={area} fill="url(#visits-area)" />
            <path
              d={line}
              fill="none"
              stroke="#FFB412"
              strokeWidth="1.82772"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <circle cx={last.x} cy={last.y} r="3.655" fill="rgba(255, 185, 33, 0.1)" />
            <circle cx={last.x} cy={last.y} r="2.74" fill="#FFB412" />
            {points.map(({ x, y, point }, index) => (
              <circle
                key={index}
                className="trend-hit"
                cx={x}
                cy={y}
                r="8"
                fill="transparent"
                tabIndex={0}
                role="button"
                aria-label={`${point.date}: ${point.visitsText} visitas`}
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
              />
            ))}
          </svg>
          {tooltip ? (
            <div
              className="trend-tooltip"
              style={{
                left: Math.min(tooltip.x, PLOT_WIDTH - 130),
                top: Math.max(tooltip.y - 74, 0),
              }}
            >
              <span className="trend-tooltip-date">{tooltip.point.date}</span>
              <span className="trend-tooltip-value">
                {tooltip.point.visitsText} visitas
              </span>
              <span className="trend-tooltip-delta">
                {tooltip.point.delta >= 0 ? "+" : ""}
                {formatPercent(tooltip.point.delta)} vs. día anterior
              </span>
            </div>
          ) : null}
        </div>
        <div className="trend-labels">
          {data.labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
      <div className="trend-footer">
        <span className="trend-tag">
          <img className="trend-tag-icon" src={arrowTagIcon} alt="" />
          <span className="trend-tag-text">{data.delta}</span>
        </span>
        <span className="trend-caption">{data.caption}</span>
      </div>
    </section>
  );
}