import { useNavigate } from "react-router-dom";
import MetricCard from "@/components/ui/MetricCard";
import FunnelSummary from "@/components/charts/FunnelSummary";
import VisitsTrend from "@/components/charts/VisitsTrend";
import ChannelQualityDonut from "@/components/charts/ChannelQualityDonut";
import { resumenData } from "@/features/dashboard/resumenData";
import { useDemo } from "@/demo/DemoProvider";
import {
  selectChannelQuality,
  selectDashboardKpis,
  selectDashboardMetrics,
  selectFunnel,
} from "@/demo/demoSelectors";
import { buildTrendSeries, DATE_RANGE_LABELS } from "@/demo/demoScenarios";
import { formatNumber } from "@/demo/demoFormat";

const KPI_STAGES = ["visitas", "registros", "clientes", "retenidos"];

export default function ResumenPage() {
  const { state } = useDemo();
  const navigate = useNavigate();
  const data = resumenData;
  const dashboard = selectDashboardMetrics(state);
  const kpis = selectDashboardKpis(state);
  const funnel = selectFunnel(state);
  const quality = selectChannelQuality(state);
  const range = DATE_RANGE_LABELS[state.filters.dateRange];

  const subtitle = `${range.label} (${range.range}) ${data.subtitleSuffix}`;
  const qualitySubtitle = data.channelQualitySection.subtitleTemplate.replace(
    "{registrations}",
    formatNumber(dashboard.registrations),
  );
  const trendSeries = buildTrendSeries(dashboard.visits);

  return (
    <main className="main">
      <section className="main-top">
        <header className="page-header">
          <h1 className="page-title">{data.title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </header>
        <div className="kpi-row">
          {kpis.map((metric, index) => (
            <MetricCard
              key={metric.label}
              data={metric}
              onClick={() => navigate(`/funnel?stage=${KPI_STAGES[index]}`)}
              ariaLabel={`Ver etapa ${KPI_STAGES[index]} en el funnel`}
            />
          ))}
        </div>
        <FunnelSummary
          steps={funnel.summarySteps}
          section={data.funnelSection}
          onNavigate={() => navigate("/funnel")}
        />
      </section>
      <section className="bottom-row">
        <VisitsTrend data={data.visitTrend} series={trendSeries} />
        <ChannelQualityDonut
          data={quality}
          section={{
            title: data.channelQualitySection.title,
            subtitle: qualitySubtitle,
            footer: data.channelQualitySection.footer,
          }}
          onSelectQuality={(qualityValue) =>
            navigate(`/canales?quality=${qualityValue}`)
          }
        />
      </section>
    </main>
  );
}