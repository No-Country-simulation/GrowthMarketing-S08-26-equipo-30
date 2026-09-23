import { useState } from "react";
import type { AppView } from "@/components/layout/layoutTypes";
import type {
  ExperimentCardData,
  ExperimentStatus,
} from "@/features/experiments/experimentsData";
import { experimentsData } from "@/features/experiments/experimentsData";
import ResumenPage from "@/features/dashboard/ResumenPage";
import FunnelPage from "@/features/funnel/FunnelPage";
import CanalesPage from "@/features/channels/CanalesPage";
import CampanasPage from "@/features/campaigns/CampanasPage";
import SegmentosPage from "@/features/segments/SegmentosPage";
import OportunidadesPage from "@/features/opportunities/OportunidadesPage";
import ExperimentosPage from "@/features/experiments/ExperimentosPage";
import ExperimentDetailPage from "@/features/experiments/ExperimentDetailPage";

export default function App() {
  const [view, setView] = useState<AppView>("resumen");
  const [createdExperiments, setCreatedExperiments] = useState<ExperimentCardData[]>([]);
  const [selectedExperimentId, setSelectedExperimentId] = useState<string | null>(null);
  const [closedOverrides, setClosedOverrides] = useState<
    Record<string, ExperimentCardData>
  >({});

  const handleCreateExperiment = (experiment: ExperimentCardData) => {
    setCreatedExperiments((prev) => [experiment, ...prev]);
    setView("experimentos");
  };

  const handleOpenExperimentDetail = (id: string) => {
    setSelectedExperimentId(id);
    setView("experimentoDetalle");
  };

  const handleCloseExperiment = (
    id: string,
    status: ExperimentStatus,
    learning: string
  ) => {
    const existing =
      closedOverrides[id] ??
      createdExperiments.find((experiment) => experiment.id === id) ??
      experimentsData.experiments.find((experiment) => experiment.id === id);
    if (!existing) {
      return;
    }
    setClosedOverrides((prev) => ({
      ...prev,
      [id]: {
        ...existing,
        status,
        result: "A 4,5 % · B 5,6 %",
        learning,
        dateLabel: "Cerrado el 6 sep 2026",
      },
    }));
    setView("experimentos");
  };

  const findExperiment = (id: string): ExperimentCardData | null =>
    closedOverrides[id] ??
    createdExperiments.find((experiment) => experiment.id === id) ??
    experimentsData.experiments.find((experiment) => experiment.id === id) ??
    null;

  if (view === "funnel") {
    return <FunnelPage onNavigate={setView} />;
  }
  if (view === "canales") {
    return <CanalesPage onNavigate={setView} />;
  }
  if (view === "segmentos") {
    return <SegmentosPage onNavigate={setView} />;
  }
  if (view === "campanas") {
    return <CampanasPage onNavigate={setView} />;
  }
  if (view === "oportunidades") {
    return (
      <OportunidadesPage
        onNavigate={setView}
        onCreateExperiment={handleCreateExperiment}
      />
    );
  }
  if (view === "experimentos") {
    return (
      <ExperimentosPage
        onNavigate={setView}
        createdExperiments={createdExperiments}
        closedOverrides={closedOverrides}
        onOpenExperimentDetail={handleOpenExperimentDetail}
      />
    );
  }
  if (view === "experimentoDetalle") {
    const experiment = selectedExperimentId
      ? findExperiment(selectedExperimentId)
      : null;
    if (experiment) {
      return (
        <ExperimentDetailPage
          onNavigate={setView}
          experiment={experiment}
          onCloseExperiment={handleCloseExperiment}
        />
      );
    }
    return (
      <ExperimentosPage
        onNavigate={setView}
        createdExperiments={createdExperiments}
        closedOverrides={closedOverrides}
        onOpenExperimentDetail={handleOpenExperimentDetail}
      />
    );
  }
  return <ResumenPage onNavigate={setView} />;
}