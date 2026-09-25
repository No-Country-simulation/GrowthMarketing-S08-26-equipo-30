import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OpportunityCard from "@/components/opportunities/OpportunityCard";
import OpportunityFormModal from "@/features/opportunities/OpportunityFormModal";
import ExperimentFormModal from "@/features/experiments/ExperimentFormModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { oportunidadesData } from "@/features/opportunities/oportunidadesData";
import { useDemo } from "@/demo/DemoProvider";
import { selectDashboardMetrics, selectOpportunities } from "@/demo/demoSelectors";
import { DATE_RANGE_LABELS } from "@/demo/demoScenarios";
import { formatNumber } from "@/demo/demoFormat";
import type {
  ExperimentRecord,
  OpportunityRecord,
} from "@/demo/demoTypes";

export default function OportunidadesPage() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const data = oportunidadesData;
  const [searchParams] = useSearchParams();
  const stageParam = searchParams.get("stage");
  const opportunities = selectOpportunities(state, { stage: stageParam });

  const [opportunityForm, setOpportunityForm] = useState<{
    open: boolean;
    opportunity: OpportunityRecord | null;
  }>({ open: false, opportunity: null });
  const [hypothesisFlow, setHypothesisFlow] = useState<OpportunityRecord | null>(
    null,
  );
  const [deleting, setDeleting] = useState<OpportunityRecord | null>(null);
  const [opportunityFormSession, setOpportunityFormSession] = useState(0);
  const [hypothesisSession, setHypothesisSession] = useState(0);

  const range = DATE_RANGE_LABELS[state.filters.dateRange];
  const visits = formatNumber(selectDashboardMetrics(state).visits);
  const subtitle = data.subtitleTemplate
    .replace("{period}", range.label.toLowerCase())
    .replace("{visits}", visits);

  const handleCreateHypothesis = (opportunity: OpportunityRecord) => {
    setHypothesisSession((s) => s + 1);
    setHypothesisFlow(opportunity);
  };

  const handleSaveHypothesis = (experiment: ExperimentRecord) => {
    dispatch({ type: "EXPERIMENT_CREATE", experiment });
    if (hypothesisFlow) {
      dispatch({
        type: "OPPORTUNITY_SET_STATUS",
        id: hypothesisFlow.id,
        status: "enExperimento",
      });
    }
    setHypothesisFlow(null);
    navigate("/experimentos");
  };

  const handleSaveOpportunity = (opportunity: OpportunityRecord) => {
    if (opportunityForm.opportunity) {
      dispatch({ type: "OPPORTUNITY_UPDATE", opportunity });
    } else {
      dispatch({ type: "OPPORTUNITY_CREATE", opportunity });
    }
    setOpportunityForm({ open: false, opportunity: null });
  };

  return (
    <main className="oportunidades-main">
      <header className="oportunidades-header-wrap">
        <div className="oportunidades-page-header">
          <div className="oportunidades-header-row">
            <h1 className="page-title">{data.title}</h1>
            <button
              type="button"
              className="new-entity-button"
              onClick={() => {
                setOpportunityFormSession((s) => s + 1);
                setOpportunityForm({ open: true, opportunity: null });
              }}
            >
              {data.newButtonLabel}
            </button>
          </div>
          <p className="page-subtitle">{subtitle}</p>
        </div>
      </header>
      {opportunities.length === 0 ? (
        <div className="demo-empty-state">
          {stageParam
            ? `No hay oportunidades para la etapa “${stageParam}”.`
            : `No hay oportunidades para “${state.filters.search.trim()}”.`}
        </div>
      ) : (
        <div className="opportunities-list">
          {opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.record.id}
              data={opportunity}
              onCreateHypothesis={handleCreateHypothesis}
              onEdit={(record) => {
                setOpportunityFormSession((s) => s + 1);
                setOpportunityForm({ open: true, opportunity: record });
              }}
              onDiscard={(id) =>
                dispatch({ type: "OPPORTUNITY_SET_STATUS", id, status: "descartada" })
              }
              onReopen={(id) =>
                dispatch({ type: "OPPORTUNITY_SET_STATUS", id, status: "abierta" })
              }
              onDelete={(id) => {
                const record = state.opportunities.find((item) => item.id === id);
                if (record) {
                  setDeleting(record);
                }
              }}
            />
          ))}
        </div>
      )}

      <OpportunityFormModal
        key={`op-form-${opportunityFormSession}`}
        open={opportunityForm.open}
        opportunity={opportunityForm.opportunity}
        onClose={() => setOpportunityForm({ open: false, opportunity: null })}
        onSave={handleSaveOpportunity}
      />

      <ExperimentFormModal
        key={`hyp-form-${hypothesisSession}`}
        open={hypothesisFlow !== null}
        opportunity={hypothesisFlow}
        onClose={() => setHypothesisFlow(null)}
        onSave={handleSaveHypothesis}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Eliminar oportunidad"
        message={`Se eliminará la oportunidad “${deleting?.title ?? ""}”. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        tone="danger"
        onConfirm={() => {
          if (deleting) {
            dispatch({ type: "OPPORTUNITY_DELETE", id: deleting.id });
          }
          setDeleting(null);
        }}
        onCancel={() => setDeleting(null)}
      />
    </main>
  );
}