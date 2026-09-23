import type { AppView } from "@/components/layout/layoutTypes";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import CampaignTrackingCard from "@/components/campaigns/CampaignTrackingCard";
import eyeBody from "@/assets/icons/figma/eye-body.svg";
import { campanasData } from "@/features/campaigns/campanasData";

interface CampanasPageProps {
  onNavigate: (view: AppView) => void;
}

export default function CampanasPage({ onNavigate }: CampanasPageProps) {
  const data = campanasData;
  return (
    <div className="campanas-root">
      <Topbar
        variant="campanas"
        breadcrumb={data.breadcrumb}
        filters={data.filters}
      />
      <Sidebar nav={data.nav} user={data.user} onNavigate={onNavigate} />
      <main className="campanas-main">
        <header className="campanas-header-wrap">
          <div className="campanas-page-header">
            <h1 className="page-title">{data.title}</h1>
            <p className="page-subtitle">{data.subtitle}</p>
          </div>
        </header>
        <div className="campanas-notice">
          <img className="campanas-notice-icon" src={eyeBody} alt="" />
          <span className="campanas-notice-text">{data.notice}</span>
        </div>
        <div className="campanas-list">
          {data.campaigns.map((campaign) => (
            <CampaignTrackingCard key={campaign.id} data={campaign} />
          ))}
        </div>
      </main>
    </div>
  );
}