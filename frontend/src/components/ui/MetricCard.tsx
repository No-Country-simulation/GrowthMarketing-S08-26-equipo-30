import arrowUpIcon from "@/assets/icons/figma/arrow-up-right-primary.svg";
import arrowDownIcon from "@/assets/icons/figma/arrow-down-right-error.svg";
import { onEnterOrSpace } from "@/components/ui/clickable";

export interface MetricCardData {
  label: string;
  value: string;
  delta: string;
  deltaDirection: "up" | "down";
  iconSrc: string;
}

interface MetricCardProps {
  data: MetricCardData;
  onClick?: () => void;
  ariaLabel?: string;
}

export default function MetricCard({ data, onClick, ariaLabel }: MetricCardProps) {
  const isUp = data.deltaDirection === "up";
  const isClickable = Boolean(onClick);
  const className = isClickable ? "metric-card metric-card-clickable" : "metric-card";
  return (
    <article
      className={className}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick) {
          onEnterOrSpace(event, onClick);
        }
      }}
    >
      <div className="metric-label-row">
        <img className="metric-icon" src={data.iconSrc} alt="" />
        <span className="metric-label">{data.label}</span>
      </div>
      <span className="metric-value">{data.value}</span>
      <div className={`metric-delta metric-delta-${data.deltaDirection}`}>
        <img className="metric-arrow" src={isUp ? arrowUpIcon : arrowDownIcon} alt="" />
        <span className="metric-delta-text">{data.delta}</span>
      </div>
    </article>
  );
}