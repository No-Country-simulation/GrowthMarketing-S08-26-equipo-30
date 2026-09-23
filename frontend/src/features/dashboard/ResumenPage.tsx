import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import MetricCard from "@/components/ui/MetricCard";
import FunnelSummary from "@/components/charts/FunnelSummary";
import VisitsTrend from "@/components/charts/VisitsTrend";
import ChannelQualityDonut from "@/components/charts/ChannelQualityDonut";
import { resumenData } from "@/features/dashboard/resumenData";
import type { AppView } from "@/components/layout/layoutTypes";

interface ResumenPageProps {
  onNavigate: (view: AppView) => void;
}

export default function ResumenPage({ onNavigate }: ResumenPageProps) {
  const data = resumenData;
  return (
    <div className="resumen-root">
      <Topbar breadcrumb={data.breadcrumb} filters={data.filters} />
      <Sidebar nav={data.nav} user={data.user} onNavigate={onNavigate} />
      <main className="main">
        <section className="main-top">
          <header className="page-header">
            <h1 className="page-title">{data.title}</h1>
            <p className="page-subtitle">{data.subtitle}</p>
          </header>
          <div className="kpi-row">
            {data.metrics.map((metric) => (
              <MetricCard key={metric.label} data={metric} />
            ))}
          </div>
          <FunnelSummary
            steps={data.funnel}
            section={data.funnelSection}
            onNavigate={() => onNavigate("funnel")}
          />
        </section>
        <section className="bottom-row">
          <VisitsTrend data={data.visitTrend} />
          <ChannelQualityDonut
            data={data.channelQuality}
            section={data.channelQualitySection}
          />
        </section>
      </main>
    </div>
  );
}