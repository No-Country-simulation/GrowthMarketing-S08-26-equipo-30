import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import OpportunityCard from "@/components/opportunities/OpportunityCard";
import CreateHypothesisModal from "@/components/opportunities/CreateHypothesisModal";
import { oportunidadesData } from "@/features/opportunities/oportunidadesData";
import type {
  OpportunityCardData,
} from "@/features/opportunities/oportunidadesData";
import type { ExperimentCardData } from "@/features/experiments/experimentsData";
import type { AppView } from "@/components/layout/layoutTypes";

interface OportunidadesPageProps {
  onNavigate: (view: AppView) => void;
  onCreateExperiment: (experiment: ExperimentCardData) => void;
}

export default function OportunidadesPage({
  onNavigate,
  onCreateExperiment,
}: OportunidadesPageProps) {
  const data = oportunidadesData;
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<OpportunityCardData | null>(null);

  const handleConfirm = () => {
    onCreateExperiment({
      id: `exp-${Date.now()}`,
      status: "planificado",
      type: "Landing",
      campaign: "Q3 · Meta prospecting ES",
      owner: "Marina Costa",
      dateLabel: "Creado el 23 sep 2026",
      hypothesis:
        "Si la landing de Meta habla de ahorro de tiempo en lugar de precio, subirá la conversión a registro.",
    });
    setSelectedOpportunity(null);
  };

  return (
    <div className="oportunidades-root">
      <Topbar
        variant="oportunidades"
        breadcrumb={data.breadcrumb}
        filters={data.filters}
      />
      <Sidebar nav={data.nav} user={data.user} onNavigate={onNavigate} />
      <main className="oportunidades-main">
        <header className="oportunidades-header-wrap">
          <div className="oportunidades-page-header">
            <h1 className="page-title">{data.title}</h1>
            <p className="page-subtitle">{data.subtitle}</p>
          </div>
        </header>
        <div className="opportunities-list">
          {data.opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              data={opportunity}
              onCreateHypothesis={setSelectedOpportunity}
            />
          ))}
        </div>
      </main>
      {selectedOpportunity ? (
        <CreateHypothesisModal
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
          onConfirm={handleConfirm}
        />
      ) : null}
    </div>
  );
}