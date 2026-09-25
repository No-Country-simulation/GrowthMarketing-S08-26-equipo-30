import type { ExperimentStatus } from "@/demo/demoTypes";
import type { ExperimentView } from "@/demo/demoSelectors";
import EntityActions from "@/components/ui/EntityActions";

interface ExperimentCardProps {
  data: ExperimentView;
  onOpenDetail?: (id: string) => void;
  onEdit?: (id: string) => void;
  onLaunch?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const STATUS_LABEL: Record<ExperimentStatus, string> = {
  planificado: "Planificado",
  enCurso: "En curso",
  validado: "Finalizado · Validado",
  noValidado: "Finalizado · No validado",
};

export default function ExperimentCard({
  data,
  onOpenDetail,
  onEdit,
  onLaunch,
  onDelete,
}: ExperimentCardProps) {
  return (
    <article className="experiment-card">
      <div className="experiment-card-tags">
        <span className={`experiment-status experiment-status-${data.status}`}>
          {STATUS_LABEL[data.status]}
        </span>
        <span className="experiment-type">{data.type}</span>
      </div>
      <h3 className="experiment-campaign">{data.campaign}</h3>
      <p className="experiment-hypothesis">{data.hypothesis}</p>
      {data.result ? (
        <div className="experiment-result">
          <span className="experiment-result-label">Resultado</span>
          <span className="experiment-result-value">{data.result}</span>
        </div>
      ) : null}
      {data.status !== "enCurso" && data.learning ? (
        <div className="experiment-result">
          <span className="experiment-result-label">Aprendizaje</span>
          <span className="experiment-result-value">{data.learning}</span>
        </div>
      ) : null}
      <div className="experiment-meta">
        <span className="experiment-date">
          {data.dateLabel} · {data.owner}
        </span>
        <div className="experiment-meta-actions">
          {onOpenDetail ? (
            <button
              type="button"
              className="experiment-detail-btn"
              onClick={() => onOpenDetail(data.id)}
            >
              Ver detalle
            </button>
          ) : null}
          {data.canEdit && onEdit ? (
            <EntityActions
              compact
              actions={[
                { label: "Editar", onClick: () => onEdit(data.id) },
                ...(onLaunch
                  ? [{ label: "Lanzar", onClick: () => onLaunch(data.id) }]
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
        </div>
      </div>
    </article>
  );
}