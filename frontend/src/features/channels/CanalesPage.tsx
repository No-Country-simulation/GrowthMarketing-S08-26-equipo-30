import { useNavigate, useSearchParams } from "react-router-dom";
import ChannelConversionChart from "@/components/channels/ChannelConversionChart";
import ChannelComparisonTable from "@/components/channels/ChannelComparisonTable";
import { canalesData } from "@/features/channels/canalesData";
import { useDemo } from "@/demo/DemoProvider";
import { selectChannels } from "@/demo/demoSelectors";

export default function CanalesPage() {
  const { state } = useDemo();
  const navigate = useNavigate();
  const data = canalesData;
  const [searchParams] = useSearchParams();
  const qualityParam = searchParams.get("quality");
  const view = selectChannels(state);

  const channels = qualityParam
    ? view.channels.filter((channel) => channel.quality === qualityParam)
    : view.channels;

  return (
    <main className="canales-main">
      <header className="canales-header-wrap">
        <div className="canales-page-header">
          <h1 className="page-title">{data.title}</h1>
          <p className="page-subtitle">{data.subtitle}</p>
        </div>
      </header>
      <ChannelConversionChart
        section={data.conversionSection}
        channels={channels}
        onSelectChannel={(id) => navigate(`/campanas?channel=${id}`)}
      />
      <ChannelComparisonTable
        section={data.comparisonSection}
        channels={channels}
        total={view.total}
        onSelectChannel={(id) => navigate(`/campanas?channel=${id}`)}
      />
    </main>
  );
}