import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExperimentCard from "@/components/experiments/ExperimentCard";
import ExperimentFormModal from "@/features/experiments/ExperimentFormModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { experimentosData } from "@/features/experiments/experimentsData";
import { useDemo } from "@/demo/DemoProvider";
import { selectExperiments } from "@/demo/demoSelectors";
import type { ExperimentRecord } from "@/demo/demoTypes";

export default function ExperimentosPage() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const data = experimentosData;
  const experiments = selectExperiments(state);
  const [editing, setEditing] = useState<ExperimentRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formSession, setFormSession] = useState(0);
  const [deleting, setDeleting] = useState<ExperimentRecord | null>(null);
  const [launching, setLaunching] = useState<ExperimentRecord | null>(null);

  const handleSave = (experiment: ExperimentRecord) => {
    if (editing) {
      dispatch({ type: "EXPERIMENT_UPDATE", experiment });
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleLaunch = (id: string) => {
    dispatch({ type: "EXPERIMENT_LAUNCH", id });
    navigate(`/experimentos/${id}`);
  };

  return (
    <main className="experimentos-main">
      <header className="experimentos-header-wrap">
        <div className="experimentos-page-header">
          <h1 className="page-title">{data.title}</h1>
          <p className="page-subtitle">{data.subtitle}</p>
        </div>
      </header>
      {experiments.length === 0 ? (
        <div className="demo-empty-state">
          No hay experimentos para “{state.filters.search.trim()}”.
        </div>
      ) : (
        <div className="experiments-list">
          {experiments.map((experiment) => (
            <ExperimentCard
              key={experiment.id}
              data={experiment}
              onOpenDetail={(id) => navigate(`/experimentos/${id}`)}
              onEdit={(id) => {
                const record = state.experiments.find((item) => item.id === id);
                if (record) {
                  setEditing(record);
                  setFormSession((s) => s + 1);
                  setFormOpen(true);
                }
              }}
              onLaunch={(id) => {
                const record = state.experiments.find((item) => item.id === id);
                if (record) {
                  setLaunching(record);
                }
              }}
              onDelete={(id) => {
                const record = state.experiments.find((item) => item.id === id);
                if (record) {
                  setDeleting(record);
                }
              }}
            />
          ))}
        </div>
      )}

      <ExperimentFormModal
        key={formSession}
        open={formOpen}
        experiment={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={launching !== null}
        title="Lanzar experimento"
        message={`Se activará el experimento “${launching?.campaign ?? ""}” con la fecha fija de la demo (6 sep 2026) y quedará en estado En curso.`}
        confirmLabel="Lanzar"
        onConfirm={() => {
          if (launching) {
            handleLaunch(launching.id);
          }
          setLaunching(null);
        }}
        onCancel={() => setLaunching(null)}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Eliminar experimento"
        message={`Se eliminará el experimento planificado “${deleting?.campaign ?? ""}” y su oportunidad de origen volverá a estar abierta.`}
        confirmLabel="Eliminar"
        tone="danger"
        onConfirm={() => {
          if (deleting) {
            dispatch({ type: "EXPERIMENT_DELETE", id: deleting.id });
          }
          setDeleting(null);
        }}
        onCancel={() => setDeleting(null)}
      />
    </main>
  );
}