import type { AppView } from "@/components/layout/layoutTypes";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import FunnelAlert from "@/components/funnel/FunnelAlert";
import FunnelDetailChart from "@/components/funnel/FunnelDetailChart";
import FunnelMetricCard from "@/components/funnel/FunnelMetricCard";
import { funnelData } from "@/features/funnel/funnelData";

interface FunnelPageProps {
  onNavigate: (view: AppView) => void;
}

export default function FunnelPage({ onNavigate }: FunnelPageProps) {
  const data = funnelData;
  return (
    <div className="funnel-root">
      <Topbar
        variant="funnel"
        breadcrumb={data.breadcrumb}
        filters={data.filters}
      />
      <Sidebar nav={data.nav} user={data.user} onNavigate={onNavigate} />
      <main className="funnel-main">
        <header className="funnel-header-wrap">
          <div className="funnel-page-header">
            <h1 className="page-title">{data.title}</h1>
            <p className="page-subtitle">{data.subtitle}</p>
          </div>
        </header>
        <FunnelAlert alert={data.alert} />
        <FunnelDetailChart
          title={data.detail.title}
          legend={data.detail.legend}
          stages={data.stages}
        />
        <div className="funnel-metrics-row">
          {data.metrics.map((metric) => (
            <FunnelMetricCard key={metric.label} data={metric} />
          ))}
        </div>
      </main>
    </div>
  );
}