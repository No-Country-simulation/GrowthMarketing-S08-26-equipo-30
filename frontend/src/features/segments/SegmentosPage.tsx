import type { AppView } from "@/components/layout/layoutTypes";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import SegmentDistributionChart from "@/components/segments/SegmentDistributionChart";
import SegmentCard from "@/components/segments/SegmentCard";
import { segmentosData } from "@/features/segments/segmentosData";

interface SegmentosPageProps {
  onNavigate: (view: AppView) => void;
}

export default function SegmentosPage({ onNavigate }: SegmentosPageProps) {
  const data = segmentosData;
  const [topCards, wideCards] = data.cards.reduce(
    ([top, wide], card) =>
      card.wide ? [top, [...wide, card]] : [[...top, card], wide],
    [[] as typeof data.cards, [] as typeof data.cards]
  );
  return (
    <div className="segmentos-root">
      <Topbar
        variant="segmentos"
        breadcrumb={data.breadcrumb}
        filters={data.filters}
      />
      <Sidebar nav={data.nav} user={data.user} onNavigate={onNavigate} />
      <main className="segmentos-main">
        <header className="segmentos-header">
          <h1 className="page-title">{data.title}</h1>
          <p className="page-subtitle">{data.subtitle}</p>
        </header>
        <SegmentDistributionChart distribution={data.distribution} />
        <section className="segments-section">
          <div className="segments-section-header">
            <h2 className="segments-section-title">{data.sectionTitle}</h2>
            <p className="segments-section-subtitle">{data.sectionSubtitle}</p>
          </div>
          <div className="segments-grid">
            <div className="segments-grid-row">
              {topCards.map((card) => (
                <SegmentCard key={card.order} data={card} />
              ))}
            </div>
            <div className="segments-grid-row">
              {wideCards.map((card) => (
                <SegmentCard key={card.order} data={card} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}