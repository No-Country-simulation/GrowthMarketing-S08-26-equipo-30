import { useState } from "react";
import type { AppView } from "@/components/layout/layoutTypes";
import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";
import CloseExperimentModal from "@/components/experiments/CloseExperimentModal";
import type { ExperimentCloseResult } from "@/components/experiments/CloseExperimentModal";
import { experimentsData } from "@/features/experiments/experimentsData";
import type {
  ExperimentCardData,
  ExperimentDetailData,
  ExperimentStatus,
} from "@/features/experiments/experimentsData";

interface ExperimentDetailPageProps {
  onNavigate: (view: AppView) => void;
  experiment: ExperimentCardData;
  onCloseExperiment: (
    id: string,
    status: ExperimentStatus,
    learning: string
  ) => void;
}

const STATUS_LABEL: Record<ExperimentStatus, string> = {
  planificado: "Planificado",
  enCurso: "En curso",
  validado: "Validado",
  noValidado: "No validado",
};

export default function ExperimentDetailPage({
  onNavigate,
  experiment,
  onCloseExperiment,
}: ExperimentDetailPageProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const data = experimentsData;
  const detail = experiment.detail;

  const handleConfirmClose = (result: ExperimentCloseResult, learning: string) => {
    setModalOpen(false);
    onCloseExperiment(experiment.id, result, learning);
  };

  return (
    <div className="experiment-detail-root">
      <Topbar
        variant="experimentos"
        breadcrumb="GrowthHub / Experimentos / Detalle del experimento"
        filters={data.filters}
      />
      <Sidebar nav={data.nav} user={data.user} onNavigate={onNavigate} />
      <main className="experiment-detail-main">
        <SummarySection experiment={experiment} detail={detail} />
        {detail ? <ResultsSection detail={detail} /> : null}
        <div className="experiment-detail-two-col">
          <CommentsPanel detail={detail} />
          <NotesPanel detail={detail} />
        </div>
        <section className="experiment-detail-close-card">
          <div className="experiment-detail-close-info">
            <h2 className="experiment-detail-close-title">
              ¿Cerrar el experimento?
            </h2>
            <p className="experiment-detail-close-text">
              Se guardará el resultado y el aprendizaje cargado por el equipo.
            </p>
          </div>
          <button
            type="button"
            className="experiment-detail-close-btn"
            onClick={() => setModalOpen(true)}
          >
            Cerrar experimento
          </button>
        </section>
      </main>
      <CloseExperimentModal
        experiment={experiment}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onConfirm={handleConfirmClose}
      />
    </div>
  );
}

function SummarySection({
  experiment,
  detail,
}: {
  experiment: ExperimentCardData;
  detail?: ExperimentDetailData;
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
      ) : null}
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

function ResultsSection({ detail }: { detail: ExperimentDetailData }) {
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
  variant: ExperimentDetailData["variantA"];
}) {
  return (
    <div className="experiment-detail-variant">
      <div className="experiment-detail-variant-head">
        <div className="experiment-detail-variant-title-group">
          <span className="experiment-detail-variant-badge">{badge}</span>
          <span className="experiment-detail-variant-title">{variant.label}</span>
        </div>
        <span className="experiment-detail-variant-conversion">
          {variant.conversion}
        </span>
      </div>
      <p className="experiment-detail-variant-desc">{variant.description}</p>
      <div className="experiment-detail-variant-bar-row">
        <div className="experiment-detail-variant-bar-track">
          <div
            className={`experiment-detail-variant-bar-fill experiment-detail-variant-bar-fill-${badge.toLowerCase()}`}
            style={{ width: variant.barWidth }}
          />
        </div>
        <span className="experiment-detail-variant-exposed">
          {variant.exposed}
        </span>
      </div>
    </div>
  );
}

function CommentsPanel({ detail }: { detail?: ExperimentDetailData }) {
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

function NotesPanel({ detail }: { detail?: ExperimentDetailData }) {
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