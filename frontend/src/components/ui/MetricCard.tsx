import arrowUpIcon from "@/assets/icons/figma/arrow-up-right-primary.svg";
import arrowDownIcon from "@/assets/icons/figma/arrow-down-right-error.svg";
import type { MetricCardData } from "@/features/dashboard/resumenData";

interface MetricCardProps {
  data: MetricCardData;
}

export default function MetricCard({ data }: MetricCardProps) {
  const isUp = data.deltaDirection === "up";
  return (
    <article className="metric-card">
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