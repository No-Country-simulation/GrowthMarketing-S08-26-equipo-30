import type {
  ExperimentCardData,
  ExperimentStatus,
} from "@/features/experiments/experimentsData";

interface ExperimentCardProps {
  data: ExperimentCardData;
  onOpenDetail?: (id: string) => void;
}

const STATUS_LABEL: Record<ExperimentStatus, string> = {
  planificado: "Planificado",
  enCurso: "En curso",
  validado: "Finalizado · Validado",
  noValidado: "Finalizado · No validado",
};

export default function ExperimentCard({ data, onOpenDetail }: ExperimentCardProps) {
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
      <div className="experiment-meta">
        <span className="experiment-date">
          {data.dateLabel} · {data.owner}
        </span>
        {data.status === "enCurso" ? (
          <button
            type="button"
            className="experiment-detail-btn"
            onClick={() => onOpenDetail?.(data.id)}
          >
            Ver detalle
          </button>
        ) : null}
      </div>
    </article>
  );
}