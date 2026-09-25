import { Fragment } from "react";
import type { CanalesPresentationData } from "@/features/channels/canalesData";
import type { ChannelView } from "@/demo/demoSelectors";
import { onEnterOrSpace } from "@/components/ui/clickable";

interface ChannelComparisonTableProps {
  section: CanalesPresentationData["comparisonSection"];
  channels: ChannelView["channels"];
  total: ChannelView["total"];
  onSelectChannel?: (id: string) => void;
}

const QUALITY_LABEL: Record<ChannelView["channels"][number]["quality"], string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export default function ChannelComparisonTable({
  section,
  channels,
  total,
  onSelectChannel,
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
        {channels.map((channel) => {
          const selectable = Boolean(onSelectChannel);
          return (
            <Fragment key={channel.id}>
              <span
                className={`mc-td mc-td-name${selectable ? " mc-td-clickable" : ""}`}
                role={selectable ? "button" : undefined}
                tabIndex={selectable ? 0 : undefined}
                aria-label={
                  selectable ? `Ver campañas del canal ${channel.name}` : undefined
                }
                onClick={() => onSelectChannel?.(channel.id)}
                onKeyDown={(event) =>
                  onSelectChannel &&
                  onEnterOrSpace(event, () => onSelectChannel(channel.id))
                }
              >
                {channel.name}
              </span>
              <span className="mc-td">{channel.visits}</span>
              <span className="mc-td">{channel.registrations}</span>
              <span className="mc-td">{channel.conversion}</span>
              <span className="mc-td">{channel.retention90d}</span>
              <span className={`mc-quality mc-quality-${channel.quality}`}>
                {QUALITY_LABEL[channel.quality]}
              </span>
            </Fragment>
          );
        })}
      </div>
      <div className="mc-total">
        <span className="mc-total-cell mc-total-label">Total / media</span>
        <span className="mc-total-cell">{total.visits}</span>
        <span className="mc-total-cell">{total.registrations}</span>
        <span className="mc-total-cell">{total.conversion}</span>
        <span className="mc-total-cell">{total.retention90d}</span>
      </div>
    </section>
  );
}