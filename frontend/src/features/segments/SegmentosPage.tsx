import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SegmentDistributionChart from "@/components/segments/SegmentDistributionChart";
import SegmentCard from "@/components/segments/SegmentCard";
import SegmentFormModal from "@/features/segments/SegmentFormModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { segmentosData } from "@/features/segments/segmentosData";
import { useDemo } from "@/demo/DemoProvider";
import { selectSegments } from "@/demo/demoSelectors";
import { DATE_RANGE_LABELS } from "@/demo/demoScenarios";
import { formatNumber } from "@/demo/demoFormat";
import type { SegmentRecord } from "@/demo/demoTypes";

export default function SegmentosPage() {
  const { state, dispatch, notify } = useDemo();
  const navigate = useNavigate();
  const data = segmentosData;
  const view = selectSegments(state);
  const [formOpen, setFormOpen] = useState(false);
  const [formSession, setFormSession] = useState(0);
  const [editing, setEditing] = useState<SegmentRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [substituteFlow, setSubstituteFlow] = useState<{
    id: string;
    campaignTitles: string[];
  } | null>(null);
  const [substituteId, setSubstituteId] = useState("");

  const periodText = DATE_RANGE_LABELS[state.filters.dateRange].label.toLowerCase();
  const subtitle = data.subtitleTemplate
    .replace("{users}", formatNumber(view.totalUsers))
    .replace("{period}", periodText);
  const distributionSubtitle = data.distribution.subtitleTemplate.replace(
    "{users}",
    formatNumber(view.totalUsers),
  );

  const [topCards, wideCards] = view.items.reduce(
    ([top, wide], card) =>
      card.wide ? [top, [...wide, card]] : [[...top, card], wide],
    [[] as typeof view.items, [] as typeof view.items],
  );

  const handleDelete = (id: string) => {
    if (state.segments.length <= 1) {
      notify("No se puede eliminar el último segmento", "error");
      return;
    }
    const usedBy = state.campaigns.filter(
      (campaign) => campaign.segmentId === id,
    );
    if (usedBy.length > 0) {
      const fallback =
        state.segments.find((segment) => segment.id !== id)?.id ?? "";
      setSubstituteId(fallback);
      setSubstituteFlow({
        id,
        campaignTitles: usedBy.map((campaign) => campaign.title),
      });
    } else {
      setDeletingId(id);
    }
  };

  const confirmDelete = () => {
    if (deletingId) {
      dispatch({ type: "SEGMENT_DELETE", id: deletingId });
    }
    setDeletingId(null);
  };

  const confirmSubstituteDelete = () => {
    if (substituteFlow) {
      dispatch({
        type: "SEGMENT_DELETE",
        id: substituteFlow.id,
        substituteId,
      });
    }
    setSubstituteFlow(null);
  };

  const handleSave = (segment: SegmentRecord) => {
    if (editing) {
      dispatch({ type: "SEGMENT_UPDATE", segment });
    } else {
      const maxUsers = Math.max(...state.segments.map((item) => item.users), 0);
      const maxConverted = Math.max(
        ...state.segments.map((item) => item.converted),
        0,
      );
      const maxBaseWidth = Math.max(
        ...state.segments.map((item) => item.baseBarWidth),
        0,
      );
      const maxConversionWidth = Math.max(
        ...state.segments.map((item) => item.conversionBarWidth),
        0,
      );
      dispatch({
        type: "SEGMENT_CREATE",
        segment: {
          ...segment,
          order: String(state.segments.length + 1).padStart(2, "0"),
          baseBarWidth:
            maxUsers > 0 && maxBaseWidth > 0
              ? Math.max(1, Math.round((maxBaseWidth * segment.users) / maxUsers))
              : 194,
          conversionBarWidth:
            maxConverted > 0 && maxConversionWidth > 0
              ? Math.max(
                  1,
                  Math.round(
                    (maxConversionWidth * segment.converted) / maxConverted,
                  ),
                )
              : 0,
        },
      });
    }
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <main className="segmentos-main">
      <header className="segmentos-header">
        <h1 className="page-title">{data.title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </header>
      <SegmentDistributionChart
        distribution={{
          title: data.distribution.title,
          subtitle: distributionSubtitle,
          insight: data.distribution.insight,
        }}
        items={view.items}
        onSelect={(id) => navigate(`/campanas?segment=${id}`)}
      />
      <section className="segments-section">
        <div className="segments-section-header-row">
          <div className="segments-section-header">
            <h2 className="segments-section-title">{data.sectionTitle}</h2>
            <p className="segments-section-subtitle">{data.sectionSubtitle}</p>
          </div>
          <button
            type="button"
            className="new-entity-button"
            onClick={() => {
              setEditing(null);
              setFormSession((s) => s + 1);
              setFormOpen(true);
            }}
          >
            Nuevo segmento
          </button>
        </div>
        {view.items.length === 0 ? (
          <div className="demo-empty-state">
            No hay segmentos para “{state.filters.search.trim()}”.
          </div>
        ) : (
          <div className="segments-grid">
            <div className="segments-grid-row">
              {topCards.map((card) => (
                <SegmentCard
                  key={card.id}
                  data={card}
                  onOpen={(id) => navigate(`/campanas?segment=${id}`)}
                  onEdit={(id) => {
                    const segment = state.segments.find((item) => item.id === id);
                    if (segment) {
                      setEditing(segment);
                      setFormSession((s) => s + 1);
                      setFormOpen(true);
                    }
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            <div className="segments-grid-row">
              {wideCards.map((card) => (
                <SegmentCard
                  key={card.id}
                  data={card}
                  onOpen={(id) => navigate(`/campanas?segment=${id}`)}
                  onEdit={(id) => {
                    const segment = state.segments.find((item) => item.id === id);
                    if (segment) {
                      setEditing(segment);
                      setFormSession((s) => s + 1);
                      setFormOpen(true);
                    }
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      <SegmentFormModal
        key={formSession}
        open={formOpen}
        segment={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deletingId !== null}
        title="Eliminar segmento"
        message="Se eliminará el segmento y se recalculará la distribución. Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        tone="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />

      <ConfirmDialog
        open={substituteFlow !== null}
        title="Segmento usado por campañas"
        message={
          <div className="confirm-dialog-flow">
            <p>
              El segmento se usa en {substituteFlow?.campaignTitles.length} campaña
              {substituteFlow && substituteFlow.campaignTitles.length > 1 ? "s" : ""}:
            </p>
            <ul>
              {substituteFlow?.campaignTitles.map((title) => (
                <li key={title}>{title}</li>
              ))}
            </ul>
            <p>Elegí un segmento sustituto para esas campañas:</p>
            <select
              className="demo-select"
              value={substituteId}
              onChange={(event) => setSubstituteId(event.target.value)}
            >
              {state.segments
                .filter((segment) => segment.id !== substituteFlow?.id)
                .map((segment) => (
                  <option key={segment.id} value={segment.id}>
                    {segment.name}
                  </option>
                ))}
            </select>
          </div>
        }
        confirmLabel="Eliminar y reasignar"
        tone="danger"
        onConfirm={confirmSubstituteDelete}
        onCancel={() => setSubstituteFlow(null)}
      />
    </main>
  );
}