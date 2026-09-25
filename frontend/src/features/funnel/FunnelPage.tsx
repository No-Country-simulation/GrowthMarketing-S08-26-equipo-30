import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FunnelAlert from "@/components/funnel/FunnelAlert";
import FunnelDetailChart from "@/components/funnel/FunnelDetailChart";
import FunnelMetricCard from "@/components/funnel/FunnelMetricCard";
import { funnelData } from "@/features/funnel/funnelData";
import { useDemo } from "@/demo/DemoProvider";
import { selectFunnel } from "@/demo/demoSelectors";
import { DATE_RANGE_LABELS } from "@/demo/demoScenarios";

export default function FunnelPage() {
  const { state } = useDemo();
  const navigate = useNavigate();
  const data = funnelData;
  const funnel = selectFunnel(state);
  const [searchParams] = useSearchParams();
  const stageParam = searchParams.get("stage");
  const listRef = useRef<HTMLDivElement>(null);

  const rangeLabel = DATE_RANGE_LABELS[state.filters.dateRange].label.toLowerCase();
  const subtitle = `${data.subtitlePreface}${rangeLabel}. ${data.subtitleSuffix}`;

  const CLICKABLE_STAGES = ["registros", "activados", "clientes", "retenidos"];

  useEffect(() => {
    if (!stageParam) {
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      const row = listRef.current?.querySelector(
        `[data-stage="${stageParam.toLowerCase()}"]`,
      );
      row?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [stageParam]);

const handleSelectStage = (stage: string) => {
  if (!CLICKABLE_STAGES.includes(stage)) {
    return;
  }
  navigate(`/oportunidades?stage=${stage}`);
};

return (
  <main className="funnel-main">
    <header className="funnel-header-wrap">
      <div className="funnel-page-header">
        <h1 className="page-title">{data.title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
    </header>
    <FunnelAlert
      alert={funnel.alert}
      onOpenOpportunity={() => navigate("/oportunidades?stage=activados")}
    />
    <div ref={listRef}>
      <FunnelDetailChart
        title={data.detail.title}
        legend={data.detail.legend}
        stages={funnel.stages}
        selectableStages={CLICKABLE_STAGES}
        onSelectStage={handleSelectStage}
        highlightStage={stageParam}
      />
    </div>
      <div className="funnel-metrics-row">
        {funnel.metrics.map((metric) => (
          <FunnelMetricCard key={metric.label} data={metric} />
        ))}
      </div>
    </main>
  );
}