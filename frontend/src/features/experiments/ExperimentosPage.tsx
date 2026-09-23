import type { AppView } from "@/components/layout/layoutTypes";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import ExperimentCard from "@/components/experiments/ExperimentCard";
import { experimentsData } from "@/features/experiments/experimentsData";
import type { ExperimentCardData } from "@/features/experiments/experimentsData";

interface ExperimentosPageProps {
  onNavigate: (view: AppView) => void;
  createdExperiments: ExperimentCardData[];
  onOpenExperimentDetail: (id: string) => void;
  closedOverrides?: Record<string, ExperimentCardData>;
}

export default function ExperimentosPage({
  onNavigate,
  createdExperiments,
  onOpenExperimentDetail,
  closedOverrides = {},
}: ExperimentosPageProps) {
  const data = experimentsData;
  const experiments = [
    ...createdExperiments.map(
      (experiment) => closedOverrides[experiment.id] ?? experiment
    ),
    ...data.experiments.map(
      (experiment) => closedOverrides[experiment.id] ?? experiment
    ),
  ];
  return (
    <div className="experimentos-root">
      <Topbar
        variant="experimentos"
        breadcrumb={data.breadcrumb}
        filters={data.filters}
      />
      <Sidebar nav={data.nav} user={data.user} onNavigate={onNavigate} />
      <main className="experimentos-main">
        <header className="experimentos-header-wrap">
          <div className="experimentos-page-header">
            <h1 className="page-title">{data.title}</h1>
            <p className="page-subtitle">{data.subtitle}</p>
          </div>
        </header>
        <div className="experiments-list">
          {experiments.map((experiment) => (
            <ExperimentCard
              key={experiment.id}
              data={experiment}
              onOpenDetail={onOpenExperimentDetail}
            />
          ))}
        </div>
      </main>
    </div>
  );
}