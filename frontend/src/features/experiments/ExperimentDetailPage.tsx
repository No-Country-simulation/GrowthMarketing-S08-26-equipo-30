import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CloseExperimentModal, {
  type ExperimentCloseResult,
} from "@/components/experiments/CloseExperimentModal";
import ExperimentFormModal from "@/features/experiments/ExperimentFormModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useDemo } from "@/demo/DemoProvider";
import { selectExperimentById } from "@/demo/demoSelectors";
import type { ExperimentDetailRecord, ExperimentStatus } from "@/demo/demoTypes";

const STATUS_LABEL: Record<ExperimentStatus, string> = {
  planificado: "Planificado",
  enCurso: "En curso",
  validado: "Validado",
  noValidado: "No validado",
};

export default function ExperimentDetailPage() {
  const { id } = useParams();
  const { state, dispatch, notify } = useDemo();
  const navigate = useNavigate();
  const experiment = selectExperimentById(state, id);

  const [closeOpen, setCloseOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [launchConfirm, setLaunchConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!experiment && id) {
      notify("El experimento no existe", "error");
      navigate("/experimentos", { replace: true });
    }
  }, [experiment, id, navigate, notify]);

  if (!experiment) {
    return null;
  }

  const detail = experiment.detail;
  const showResults =
    Boolean(detail) &&
    (experiment.status !== "enCurso" ||
      (detail!.variantA.conversion > 0 || detail!.variantB.conversion > 0));

  const handleConfirmClose = (
    result: ExperimentCloseResult,
    conversionA: number,
    conversionB: number,
    learning: string,
  ) => {
    setCloseOpen(false);
    dispatch({
      type: "EXPERIMENT_CLOSE",
      id: experiment.id,
      result,
      conversionA,
      conversionB,
      learning,
    });
  };

  const handleLaunch = () => {
    setLaunchConfirm(false);
    dispatch({ type: "EXPERIMENT_LAUNCH", id: experiment.id });
  };

  const handleDelete = () => {
    setDeleteConfirm(false);
    dispatch({ type: "EXPERIMENT_DELETE", id: experiment.id });
    navigate("/experimentos");
  };

  return (
    <main className="experiment-detail-main">
      <SummarySection experiment={experiment} detail={detail} />
      {experiment.status === "validado" || experiment.status === "noValidado" ? (
        <section className="experiment-detail-outcome">
          {experiment.result ? (
            <div className="experiment-detail-outcome-item">
              <span className="experiment-detail-outcome-label">Resultado</span>
              <span className="experiment-detail-outcome-value">
                {experiment.result}
              </span>
            </div>
          ) : null}
          {experiment.learning ? (
            <div className="experiment-detail-outcome-item">
              <span className="experiment-detail-outcome-label">Aprendizaje</span>
              <span className="experiment-detail-outcome-value">
                {experiment.learning}
              </span>
            </div>
          ) : null}
        </section>
      ) : null}
      {showResults && detail ? <ResultsSection detail={detail} /> : null}
      <div className="experiment-detail-two-col">
        <CommentsPanel detail={detail} />
        <NotesPanel detail={detail} />
      </div>
      <section className="experiment-detail-close-card">
        {experiment.status === "planificado" ? (
          <>
            <div className="experiment-detail-close-info">
              <h2 className="experiment-detail-close-title">
                ¿Qué querés hacer con este experimento?
              </h2>
              <p className="experiment-detail-close-text">
                Todavía no se lanzó. Podés editar la hipótesis, lanzarlo o eliminarlo.
              </p>
            </div>
            <div className="experiment-detail-close-actions">
              <button
                type="button"
                className="experiment-detail-ghost-btn"
                onClick={() => setEditOpen(true)}
              >
                Editar hipótesis
              </button>
              <button
                type="button"
                className="experiment-detail-close-btn"
                onClick={() => setLaunchConfirm(true)}
              >
                Lanzar experimento
              </button>
              <button
                type="button"
                className="experiment-detail-danger-btn"
                onClick={() => setDeleteConfirm(true)}
              >
                Eliminar
              </button>
            </div>
          </>
        ) : experiment.status === "enCurso" ? (
          <>
            <div className="experiment-detail-close-info">
              <h2 className="experiment-detail-close-title">
                ¿Cerrar el experimento?
              </h2>
              <p className="experiment-detail-close-text">
                Se guardará el resultado, las conversiones A/B y el aprendizaje cargado por el equipo.
              </p>
            </div>
            <button
              type="button"
              className="experiment-detail-close-btn"
              onClick={() => setCloseOpen(true)}
            >
              Cerrar experimento
            </button>
          </>
        ) : (
          <>
            <div className="experiment-detail-close-info">
              <h2 className="experiment-detail-close-title">
                Experimento cerrado
              </h2>
              <p className="experiment-detail-close-text">
                El resultado y el aprendizaje quedaron guardados. La edición y el lanzamiento quedaron bloqueados.
              </p>
            </div>
            <button
              type="button"
              className="experiment-detail-ghost-btn"
              onClick={() => navigate("/experimentos")}
            >
              Volver a experimentos
            </button>
          </>
        )}
      </section>

      <CloseExperimentModal
        experiment={experiment}
        open={closeOpen}
        onCancel={() => setCloseOpen(false)}
        onConfirm={handleConfirmClose}
      />

      <ExperimentFormModal
        key={`edit-${experiment.id}`}
        open={editOpen}
        experiment={experiment}
        onClose={() => setEditOpen(false)}
        onSave={(updated) => {
          dispatch({ type: "EXPERIMENT_UPDATE", experiment: updated });
          setEditOpen(false);
        }}
      />

      <ConfirmDialog
        open={launchConfirm}
        title="Lanzar experimento"
        message="Se activará con la fecha fija de la demo (6 sep 2026) y quedará en estado En curso."
        confirmLabel="Lanzar"
        onConfirm={handleLaunch}
        onCancel={() => setLaunchConfirm(false)}
      />

      <ConfirmDialog
        open={deleteConfirm}
        title="Eliminar experimento"
        message="Se eliminará el experimento planificado y su oportunidad de origen volverá a estar abierta."
        confirmLabel="Eliminar"
        tone="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
      />
    </main>
  );
}

function SummarySection({
  experiment,
  detail,
}: {
  experiment: NonNullable<ReturnType<typeof selectExperimentById>>;
  detail?: NonNullable<ReturnType<typeof selectExperimentById>>["detail"];
}) {
  return (
    <section className="experiment-detail-summary">
      <div className="experiment-detail-summary-tags">
        <span className={`experiment-status experiment-status-${experiment.status}`}>
          {STATUS_LABEL[experiment.status]}
        </span>
        <span className="experiment-type">{experiment.type}</span>
      </div>
      <h2 className="experiment-detail-summary-title">{experiment.campaign}</h2>
      <p className="experiment-detail-summary-hypothesis">
        {experiment.hypothesis}
      </p>
      {detail ? (
        <div className="experiment-detail-metrics">
          <Metric label="Métrica objetivo" value={detail.objectiveMetric} />
          <Metric label="Activado" value={detail.activatedAt} />
          <Metric label="Tráfico" value={detail.traffic} />
          <Metric label="Origen" value={detail.origin} />
        </div>
      ) : (
        <div className="experiment-detail-metrics">
          <Metric label="Métrica objetivo" value={experiment.objectiveMetric} />
          <Metric label="Versión A" value={experiment.variantA} />
          <Metric label="Versión B" value={experiment.variantB} />
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="experiment-detail-metric">
      <span className="experiment-detail-metric-label">{label}</span>
      <span className="experiment-detail-metric-value">{value}</span>
    </div>
  );
}

function ResultsSection({
  detail,
}: {
  detail: ExperimentDetailRecord;
}) {
  return (
    <section className="experiment-detail-results">
      <header className="experiment-detail-results-header">
        <h2 className="experiment-detail-results-title">Resultados</h2>
        <span className="experiment-detail-results-caption">
          Métrica objetivo · {detail.objectiveMetric}
        </span>
      </header>
      <VariantRow badge="A" variant={detail.variantA} />
      <VariantRow badge="B" variant={detail.variantB} />
      <p className="experiment-detail-notes">{detail.measurementNotes}</p>
    </section>
  );
}

function VariantRow({
  badge,
  variant,
}: {
  badge: string;
  variant: { label: string; description: string; exposed: number; conversion: number };
}) {
  const conversion = `${variant.conversion.toFixed(1).replace(".", ",")} %`;
  return (
    <div className="experiment-detail-variant">
      <div className="experiment-detail-variant-head">
        <div className="experiment-detail-variant-title-group">
          <span className="experiment-detail-variant-badge">{badge}</span>
          <span className="experiment-detail-variant-title">{variant.label}</span>
        </div>
        <span className="experiment-detail-variant-conversion">{conversion}</span>
      </div>
      <p className="experiment-detail-variant-desc">{variant.description}</p>
      <div className="experiment-detail-variant-bar-row">
        <div className="experiment-detail-variant-bar-track">
          <div
            className={`experiment-detail-variant-bar-fill experiment-detail-variant-bar-fill-${badge.toLowerCase()}`}
            style={{ width: `${variant.conversion * 100}%` }}
          />
        </div>
        <span className="experiment-detail-variant-exposed">
          {variant.exposed.toLocaleString("es-ES")} visitas expuestas
        </span>
      </div>
    </div>
  );
}

function CommentsPanel({
  detail,
}: {
  detail?: NonNullable<ReturnType<typeof selectExperimentById>>["detail"];
}) {
  if (!detail) {
    return <section className="experiment-detail-panel" />;
  }
  return (
    <section className="experiment-detail-panel">
      <h2 className="experiment-detail-panel-title">Comentarios</h2>
      <div className="experiment-detail-comments">
        {detail.comments.map(([initials, header, text]) => (
          <div key={header} className="experiment-detail-comment">
            <span className="experiment-detail-comment-avatar">{initials}</span>
            <div className="experiment-detail-comment-body">
              <span className="experiment-detail-comment-header">{header}</span>
              <p className="experiment-detail-comment-text">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function NotesPanel({
  detail,
}: {
  detail?: NonNullable<ReturnType<typeof selectExperimentById>>["detail"];
}) {
  if (!detail) {
    return <section className="experiment-detail-panel" />;
  }
  return (
    <section className="experiment-detail-panel">
      <h2 className="experiment-detail-panel-title">Notas de medición</h2>
      <p className="experiment-detail-panel-notes">{detail.measurementNotes}</p>
      <h3 className="experiment-detail-panel-subtitle">Tags</h3>
      <div className="experiment-detail-tags">
        {detail.tags.map((tag) => (
          <span key={tag} className="experiment-detail-tag">
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}