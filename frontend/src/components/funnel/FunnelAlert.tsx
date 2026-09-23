import exclamationIcon from "@/assets/icons/figma/exclamation-triangle.svg";

interface FunnelAlertProps {
  alert: {
    title: string;
    badge: string;
    body: string;
    note: string;
  };
}

export default function FunnelAlert({ alert }: FunnelAlertProps) {
  return (
    <aside className="funnel-alert">
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