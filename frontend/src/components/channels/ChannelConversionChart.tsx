import type { CanalesPresentationData } from "@/features/channels/canalesData";
import type { ChannelView } from "@/demo/demoSelectors";
import { onEnterOrSpace } from "@/components/ui/clickable";

interface ChannelConversionChartProps {
  section: CanalesPresentationData["conversionSection"];
  channels: ChannelView["channels"];
  onSelectChannel?: (id: string) => void;
}

const FILL_CLASS: Record<ChannelView["channels"][number]["quality"], string> = {
  alta: "mc-bar-fill-high",
  media: "mc-bar-fill-medium",
  baja: "mc-bar-fill-low",
};

const PILL_CLASS: Record<ChannelView["channels"][number]["quality"], string> = {
  alta: "mc-pill-high",
  media: "mc-pill-medium",
  baja: "mc-pill-low",
};

const LEGEND_KEYS: [ChannelView["channels"][number]["quality"], keyof CanalesPresentationData["conversionSection"]["legend"]][] = [
  ["alta", "high"],
  ["media", "medium"],
  ["baja", "low"],
];

export default function ChannelConversionChart({
  section,
  channels,
  onSelectChannel,
}: ChannelConversionChartProps) {
  return (
    <section className="mc-card">
      <div className="mc-header">
        <div className="mc-title-group">
          <h2 className="mc-title">{section.title}</h2>
          <span className="mc-subtitle">{section.subtitle}</span>
        </div>
        <div className="mc-legend">
          {LEGEND_KEYS.map(([quality, legendKey]) => (
            <span key={quality} className={`mc-pill ${PILL_CLASS[quality]}`}>
              <span className="mc-pill-dot" />
              <span className="mc-pill-text">{section.legend[legendKey]}</span>
            </span>
          ))}
        </div>
        <div className="mc-columns">
          <span className="mc-column">{section.columns.conversion}</span>
          <span className="mc-column">{section.columns.visits}</span>
          <span className="mc-column">{section.columns.retention}</span>
        </div>
      </div>
      <div className="mc-list">
        {channels.map((channel) => {
          const selectable = Boolean(onSelectChannel);
          return (
            <div
              key={channel.id}
              className={`mc-row${selectable ? " mc-row-clickable" : ""}`}
              role={selectable ? "button" : undefined}
              tabIndex={selectable ? 0 : undefined}
              aria-label={
                selectable ? `Ver campañas del canal ${channel.name}` : undefined
              }
              onClick={() => onSelectChannel?.(channel.id)}
              onKeyDown={(event) =>
                onSelectChannel && onEnterOrSpace(event, () => onSelectChannel(channel.id))
              }
            >
              <span className="mc-row-label">{channel.name}</span>
              <div className="mc-bar">
                <span
                  className={`mc-bar-fill ${FILL_CLASS[channel.quality]}`}
                  style={{ width: `${channel.barWidthPx}px` }}
                />
              </div>
              <div className="mc-right">
                <span className="mc-value">{channel.conversion}</span>
                <span className="mc-value">{channel.visits}</span>
                <span className="mc-value">{channel.retention90d}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mc-footer">{section.footer}</p>
    </section>
  );
}