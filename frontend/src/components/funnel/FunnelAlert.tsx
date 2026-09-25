import exclamationIcon from "@/assets/icons/figma/exclamation-triangle.svg";
import { onEnterOrSpace } from "@/components/ui/clickable";

interface FunnelAlertProps {
  alert: {
    title: string;
    badge: string;
    body: string;
    note: string;
  };
  onOpenOpportunity?: () => void;
}

export default function FunnelAlert({ alert, onOpenOpportunity }: FunnelAlertProps) {
  const selectable = Boolean(onOpenOpportunity);
  return (
    <aside
      className={`funnel-alert${selectable ? " funnel-alert-clickable" : ""}`}
      role={selectable ? "button" : undefined}
      tabIndex={selectable ? 0 : undefined}
      aria-label={selectable ? "Ver la oportunidad de la mayor caída" : undefined}
      onClick={onOpenOpportunity}
      onKeyDown={(event) =>
        onOpenOpportunity && onEnterOrSpace(event, onOpenOpportunity)
      }
    >
      <div className="funnel-alert-head">
        <span className="funnel-alert-icon-box">
          <img className="funnel-alert-icon" src={exclamationIcon} alt="" />
        </span>
        <h2 className="funnel-alert-title">{alert.title}</h2>
        <span className="funnel-alert-badge">{alert.badge}</span>
      </div>
      <div className="funnel-alert-body">
        <p className="funnel-alert-text">{alert.body}</p>
        <p className="funnel-alert-note">{alert.note}</p>
      </div>
    </aside>
  );
}