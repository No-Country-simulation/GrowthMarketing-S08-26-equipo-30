import arrowTagIcon from "@/assets/icons/figma/arrow-up-right-tag.svg";
import type { VisitTrendData } from "@/features/dashboard/resumenData";

interface VisitsTrendProps {
  data: VisitTrendData;
}

const PLOT_WIDTH = 508.1;
const PLOT_HEIGHT = 122;
const VALUES = [96, 92, 99, 88, 90, 82, 78, 84, 72, 66, 58, 48, 30, 8, 4];

function buildPoints(): { line: string; area: string; last: [number, number] } {
  const step = PLOT_WIDTH / (VALUES.length - 1);
  const line = VALUES.map(
    (y, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(2)} ${y}`,
  ).join(" ");
  const area = `${line} L${PLOT_WIDTH} ${PLOT_HEIGHT} L0 ${PLOT_HEIGHT} Z`;
  const last: [number, number] = [(VALUES.length - 1) * step, VALUES[VALUES.length - 1]];
  return { line, area, last };
}

export default function VisitsTrend({ data }: VisitsTrendProps) {
  const { line, area, last } = buildPoints();
  return (
    <section className="trend-card">
      <div className="card-heading">
        <h2 className="card-title">{data.title}</h2>
        <span className="card-subtitle">{data.subtitle}</span>
      </div>
      <div className="trend-chart">
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
          <circle cx={last[0]} cy={last[1]} r="3.655" fill="rgba(255, 185, 33, 0.1)" />
          <circle cx={last[0]} cy={last[1]} r="2.74" fill="#FFB412" />
        </svg>
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