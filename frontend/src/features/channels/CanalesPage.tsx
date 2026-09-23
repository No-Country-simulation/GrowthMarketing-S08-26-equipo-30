import type { AppView } from "@/components/layout/layoutTypes";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import ChannelConversionChart from "@/components/channels/ChannelConversionChart";
import ChannelComparisonTable from "@/components/channels/ChannelComparisonTable";
import { canalesData } from "@/features/channels/canalesData";

interface CanalesPageProps {
  onNavigate: (view: AppView) => void;
}

export default function CanalesPage({ onNavigate }: CanalesPageProps) {
  const data = canalesData;
  return (
    <div className="canales-root">
      <Topbar
        variant="canales"
        breadcrumb={data.breadcrumb}
        filters={data.filters}
      />
      <Sidebar nav={data.nav} user={data.user} onNavigate={onNavigate} />
      <main className="canales-main">
        <header className="canales-header-wrap">
          <div className="canales-page-header">
            <h1 className="page-title">{data.title}</h1>
            <p className="page-subtitle">{data.subtitle}</p>
          </div>
        </header>
        <ChannelConversionChart
          section={data.conversionSection}
          channels={data.channels}
        />
        <ChannelComparisonTable
          section={data.comparisonSection}
          channels={data.channels}
        />
      </main>
    </div>
  );
}