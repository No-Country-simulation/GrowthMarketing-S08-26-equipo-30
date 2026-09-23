import { Fragment } from "react";
import type {
  CanalesData,
  ChannelData,
  ChannelQuality,
} from "@/features/channels/canalesData";

interface ChannelComparisonTableProps {
  section: CanalesData["comparisonSection"];
  channels: ChannelData[];
}

const QUALITY_LABEL: Record<ChannelQuality, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export default function ChannelComparisonTable({
  section,
  channels,
}: ChannelComparisonTableProps) {
  return (
    <section className="mc-table-card">
      <div className="mc-table-header">
        <h2 className="mc-table-title">{section.title}</h2>
        <span className="mc-table-subtitle">{section.subtitle}</span>
      </div>
      <div className="mc-table">
        {section.columns.map((column) => (
          <span key={column} className="mc-th">
            {column}
          </span>
        ))}
        {channels.map((channel) => (
          <Fragment key={channel.name}>
            <span className="mc-td mc-td-name">{channel.name}</span>
            <span className="mc-td">{channel.visits}</span>
            <span className="mc-td">{channel.registrations}</span>
            <span className="mc-td">{channel.conversion}</span>
            <span className="mc-td">{channel.retention90d}</span>
            <span className={`mc-quality mc-quality-${channel.quality}`}>
              {QUALITY_LABEL[channel.quality]}
            </span>
          </Fragment>
        ))}
      </div>
      <div className="mc-total">
        <span className="mc-total-cell mc-total-label">{section.total.label}</span>
        <span className="mc-total-cell">{section.total.visits}</span>
        <span className="mc-total-cell">{section.total.registrations}</span>
        <span className="mc-total-cell">{section.total.conversion}</span>
        <span className="mc-total-cell">{section.total.retention90d}</span>
      </div>
    </section>
  );
}