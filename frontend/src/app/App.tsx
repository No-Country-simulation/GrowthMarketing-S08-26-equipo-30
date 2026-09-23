import { useState } from "react";
import type { AppView } from "@/components/layout/layoutTypes";
import type { ExperimentCardData } from "@/features/experiments/experimentsData";
import ResumenPage from "@/features/dashboard/ResumenPage";
import FunnelPage from "@/features/funnel/FunnelPage";
import CanalesPage from "@/features/channels/CanalesPage";
import OportunidadesPage from "@/features/opportunities/OportunidadesPage";
import ExperimentosPage from "@/features/experiments/ExperimentosPage";

export default function App() {
  const [view, setView] = useState<AppView>("resumen");
  const [createdExperiments, setCreatedExperiments] = useState<ExperimentCardData[]>([]);

  const handleCreateExperiment = (experiment: ExperimentCardData) => {
    setCreatedExperiments((prev) => [experiment, ...prev]);
    setView("experimentos");
  };

  if (view === "funnel") {
    return <FunnelPage onNavigate={setView} />;
  }
  if (view === "canales") {
    return <CanalesPage onNavigate={setView} />;
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
      />
    );
  }
  return <ResumenPage onNavigate={setView} />;
}