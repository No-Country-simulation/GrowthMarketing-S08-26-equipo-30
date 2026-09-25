import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import CampaignTrackingCard from "@/components/campaigns/CampaignTrackingCard";
import CampaignFormModal from "@/features/campaigns/CampaignFormModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import eyeBody from "@/assets/icons/figma/eye-body.svg";
import { campanasData } from "@/features/campaigns/campanasData";
import { useDemo } from "@/demo/DemoProvider";
import { selectCampaigns } from "@/demo/demoSelectors";
import type { CampaignRecord } from "@/demo/demoTypes";

export default function CampanasPage() {
  const { state, dispatch } = useDemo();
  const [searchParams] = useSearchParams();
  const channelParam = searchParams.get("channel");
  const segmentParam = searchParams.get("segment");
  const data = campanasData;
  const campaigns = selectCampaigns(state, {
    channel: channelParam,
    segment: segmentParam,
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formSession, setFormSession] = useState(0);
  const [editing, setEditing] = useState<CampaignRecord | null>(null);
  const [deleting, setDeleting] = useState<CampaignRecord | null>(null);

  const handlePauseResume = (id: string) => {
    const campaign = state.campaigns.find((item) => item.id === id);
    if (!campaign) {
      return;
    }
    dispatch({
      type: "CAMPAIGN_SET_STATUS",
      id,
      status: campaign.status === "activo" ? "pausado" : "activo",
    });
  };

  const handleFinalize = (id: string) => {
    dispatch({ type: "CAMPAIGN_SET_STATUS", id, status: "finalizado" });
  };

  const handleSave = (campaign: CampaignRecord) => {
    if (editing) {
      dispatch({ type: "CAMPAIGN_UPDATE", campaign });
    } else {
      dispatch({ type: "CAMPAIGN_CREATE", campaign });
    }
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <main className="campanas-main">
      <header className="campanas-header-wrap">
        <div className="campanas-page-header">
          <div className="campanas-header-row">
            <h1 className="page-title">{data.title}</h1>
            <button
              type="button"
              className="new-entity-button"
              onClick={() => {
                setEditing(null);
                setFormSession((s) => s + 1);
                setFormOpen(true);
              }}
            >
              {data.newButtonLabel}
            </button>
          </div>
          <p className="page-subtitle">{data.subtitle}</p>
        </div>
      </header>
      <div className="campanas-notice">
        <img className="campanas-notice-icon" src={eyeBody} alt="" />
        <span className="campanas-notice-text">{data.notice}</span>
      </div>
      {campaigns.length === 0 ? (
        <div className="demo-empty-state">
          No hay campañas que coincidan con los filtros actuales.
        </div>
      ) : (
        <div className="campanas-list">
          {campaigns.map((campaign) => (
            <CampaignTrackingCard
              key={campaign.id}
              data={campaign}
              expanded={expandedId === campaign.id}
              onToggle={() =>
                setExpandedId((current) =>
                  current === campaign.id ? null : campaign.id,
                )
              }
              onEdit={() => {
                const record = state.campaigns.find(
                  (item) => item.id === campaign.id,
                );
                if (record) {
                  setEditing(record);
                  setFormSession((s) => s + 1);
                  setFormOpen(true);
                }
              }}
              onPauseResume={() => handlePauseResume(campaign.id)}
              onFinalize={() => handleFinalize(campaign.id)}
              onDelete={() => {
                const record = state.campaigns.find(
                  (item) => item.id === campaign.id,
                );
                if (record) {
                  setDeleting(record);
                }
              }}
            />
          ))}
        </div>
      )}

      <CampaignFormModal
        key={formSession}
        open={formOpen}
        campaign={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Eliminar campaña"
        message={`Se eliminará la campaña “${deleting?.title ?? ""}” y su seguimiento. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        tone="danger"
        onConfirm={() => {
          if (deleting) {
            dispatch({ type: "CAMPAIGN_DELETE", id: deleting.id });
          }
          setDeleting(null);
        }}
        onCancel={() => setDeleting(null)}
      />
    </main>
  );
}