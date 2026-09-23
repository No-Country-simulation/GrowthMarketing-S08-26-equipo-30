import arrowDropIcon from "@/assets/icons/figma/arrow-90deg-down-error.svg";
import type { FunnelStageData } from "@/features/funnel/funnelData";

interface FunnelDetailChartProps {
  title: string;
  legend: {
    etapa: string;
    drop: string;
  };
  stages: FunnelStageData[];
}

export default function FunnelDetailChart({
  title,
  legend,
  stages,
}: FunnelDetailChartProps) {
  return (
    <section className="funnel-detail-card">
      <div className="funnel-detail-header">
        <h2 className="funnel-detail-title">{title}</h2>
        <div className="funnel-detail-legend">
          <span className="funnel-detail-pill funnel-detail-pill-stage">
            <span className="funnel-detail-dot" />
            <span className="funnel-detail-pill-text">{legend.etapa}</span>
          </span>
          <span className="funnel-detail-pill funnel-detail-pill-drop">
            <span className="funnel-detail-dot" />
            <span className="funnel-detail-pill-text">{legend.drop}</span>
          </span>
        </div>
      </div>
      <div className="funnel-detail-list">
        {stages.map((stage) => (
          <div key={stage.label} className="funnel-detail-row">
            <div className="funnel-detail-stage">
              <span className="funnel-detail-stage-label">{stage.label}</span>
              <span className="funnel-detail-stage-desc">{stage.description}</span>
            </div>
            <div className="funnel-detail-chart">
              <div className="funnel-detail-bar">
                <div className="funnel-detail-bar-track">
                  <span
                    className={`funnel-detail-bar-fill${
                      stage.highlight ? " funnel-detail-bar-fill-accent" : ""
                    }`}
                    style={{ width: `${stage.barWidthPx}px` }}
                  />
                </div>
              </div>
              <span className="funnel-detail-value">{stage.value}</span>
              {stage.dropText ? (
                <div className="funnel-detail-drop">
                  <img className="funnel-detail-drop-icon" src={arrowDropIcon} alt="" />
                  <span className="funnel-detail-drop-text">{stage.dropText}</span>
                </div>
              ) : null}
            </div>
            <span className="funnel-detail-pct">{stage.percentage}</span>
          </div>
        ))}
      </div>
    </section>
  );
}