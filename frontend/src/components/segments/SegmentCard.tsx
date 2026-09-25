import type { SegmentView } from "@/demo/demoSelectors";
import EntityActions from "@/components/ui/EntityActions";
import { onEnterOrSpace } from "@/components/ui/clickable";

interface SegmentCardProps {
  data: SegmentView["items"][number];
  onOpen?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function SegmentCard({
  data,
  onOpen,
  onEdit,
  onDelete,
}: SegmentCardProps) {
  const className = data.wide
    ? "segment-card segment-card-wide"
    : "segment-card";
  const selectable = Boolean(onOpen);
  return (
    <article
      className={className}
      role={selectable ? "button" : undefined}
      tabIndex={selectable ? 0 : undefined}
      aria-label={selectable ? `Ver campañas del segmento ${data.name}` : undefined}
      onClick={() => onOpen?.(data.id)}
      onKeyDown={(event) =>
        onOpen && onEnterOrSpace(event, () => onOpen(data.id))
      }
    >
      <div className="segment-card-head">
        <span className="segment-card-order">{data.order}</span>
        <span className="segment-card-name">{data.name}</span>
        <span className={`segment-card-badge segment-card-badge-${data.intentTone}`}>
          {data.intent}
        </span>
      </div>
      <p className="segment-card-desc">{data.description}</p>
      <div className="segment-card-bars">
        <div className="segment-card-bar">
          <div className="segment-card-bar-top">
            <span className="segment-card-bar-label">% de la base</span>
            <span className="segment-card-bar-value">{data.basePercent}</span>
          </div>
          <div className="segment-card-bar-track">
            <span
              className="segment-card-bar-fill"
              style={{
                width: `${data.baseBarWidth}px`,
                background: data.color,
              }}
            />
          </div>
        </div>
        <div className="segment-card-bar">
          <div className="segment-card-bar-top">
            <span className="segment-card-bar-label">Tasa de conversión</span>
            <span className="segment-card-bar-value">
              {data.conversionRate}
            </span>
          </div>
          <div className="segment-card-bar-track">
            <span
              className="segment-card-bar-fill"
              style={{
                width: `${data.conversionBarWidth}px`,
                background: data.color,
              }}
            />
          </div>
        </div>
      </div>
      <footer className="segment-card-footer">{data.footer}</footer>
      {onEdit || onDelete ? (
        <EntityActions
          compact
          actions={[
            ...(onEdit
              ? [
                  {
                    label: "Editar",
                    onClick: () => onEdit(data.id),
                  },
                ]
              : []),
            ...(onDelete
              ? [
                  {
                    label: "Eliminar",
                    tone: "danger" as const,
                    onClick: () => onDelete(data.id),
                  },
                ]
              : []),
          ]}
        />
      ) : null}
    </article>
  );
}