import arrowCircleIcon from "@/assets/icons/figma/arrow-up-right-circle-fill.svg";
import type {
  OpportunityCardData,
  OpportunityImpact,
} from "@/features/opportunities/oportunidadesData";

interface OpportunityCardProps {
  data: OpportunityCardData;
  onCreateHypothesis?: (opportunity: OpportunityCardData) => void;
}

const IMPACT_LABEL: Record<OpportunityImpact, string> = {
  alto: "Impacto alto",
  medio: "Impacto medio",
};

export default function OpportunityCard({
  data,
  onCreateHypothesis,
}: OpportunityCardProps) {
  const isHigh = data.impact === "alto";
  return (
    <article className="opportunity-card">
      <div className="opportunity-content">
        <span
          className={`opportunity-index ${
            isHigh ? "opportunity-index-high" : "opportunity-index-medium"
          }`}
        >
          {data.index}
        </span>
        <div className="opportunity-body">
          <div className="opportunity-title-row">
            <h3 className="opportunity-title">{data.title}</h3>
            <div className="opportunity-tags">
              <span className="opportunity-source-pill">
                <img className="opportunity-source-icon" src={data.source.iconSrc} alt="" />
                {data.source.label}
              </span>
              <span
                className={`opportunity-impact-pill ${
                  isHigh ? "opportunity-impact-high" : "opportunity-impact-medium"
                }`}
              >
                {IMPACT_LABEL[data.impact]}
              </span>
            </div>
          </div>
          <p className="opportunity-description">{data.description}</p>
          <div className="opportunity-metrics">
            {data.metrics.map((metric) => (
              <div key={metric.label} className="opportunity-metric">
                <span className="opportunity-metric-label">{metric.label}</span>
                <span className="opportunity-metric-value">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        type="button"
        className="opportunity-cta"
        onClick={() => onCreateHypothesis?.(data)}
      >
        <span className="opportunity-cta-text">{data.ctaLabel}</span>
        <img className="opportunity-cta-icon" src={arrowCircleIcon} alt="" />
      </button>
    </article>
  );
}