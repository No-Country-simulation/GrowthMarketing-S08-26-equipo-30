import arrowDropIcon from "@/assets/icons/figma/arrow-90deg-down-error.svg";
import arrowCircleIcon from "@/assets/icons/figma/arrow-up-right-circle-fill.svg";

export interface FunnelStepData {
  label: string;
  value: string;
  percentage: string;
  dropLabel?: string;
  barWidthPx: number;
}

interface FunnelSummaryProps {
  steps: FunnelStepData[];
  section: {
    title: string;
    caption: string;
    buttonLabel: string;
  };
  onNavigate: () => void;
}

export default function FunnelSummary({ steps, section, onNavigate }: FunnelSummaryProps) {
  return (
    <section className="funnel-card">
      <div className="funnel-header">
        <div className="funnel-title-group">
          <h2 className="funnel-title">{section.title}</h2>
          <span className="funnel-caption">{section.caption}</span>
        </div>
        <button type="button" className="funnel-button" onClick={onNavigate}>
          <span className="funnel-button-text">{section.buttonLabel}</span>
          <img className="funnel-button-icon" src={arrowCircleIcon} alt="" />
        </button>
      </div>
      <div className="funnel-list">
        {steps.map((step) => (
          <div key={step.label} className="funnel-row">
            <span className="funnel-step-label">{step.label}</span>
            <div className="funnel-bar">
              <span
                className="funnel-bar-fill"
                style={{ width: `${step.barWidthPx}px` }}
              />
            </div>
            {step.dropLabel ? (
              <div className="funnel-drop">
                <img className="funnel-drop-icon" src={arrowDropIcon} alt="" />
                <span className="funnel-drop-text">{step.dropLabel}</span>
              </div>
            ) : null}
            <div className="funnel-value-group">
              <span className="funnel-value">{step.value}</span>
              <span className="funnel-percentage">{step.percentage}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}