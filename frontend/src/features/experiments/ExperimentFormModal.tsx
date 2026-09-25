import { useState } from "react";
import DemoDialog from "@/components/ui/DemoDialog";
import megaphoneIcon from "@/assets/icons/figma/megaphone.svg";
import type { ExperimentRecord, ExperimentType, OpportunityRecord } from "@/demo/demoTypes";
import { DEMO_USER } from "@/components/layout/navConfig";

interface ExperimentFormModalProps {
  open: boolean;
  experiment?: ExperimentRecord | null;
  opportunity?: OpportunityRecord | null;
  onClose: () => void;
  onSave: (experiment: ExperimentRecord) => void;
}

const EXPERIMENT_TYPES: ExperimentType[] = [
  "Canal",
  "Segmentación",
  "Anuncio",
  "Landing",
  "CTA",
  "Onboarding",
  "Oferta",
  "Retención",
];

export default function ExperimentFormModal({
  open,
  experiment,
  opportunity,
  onClose,
  onSave,
}: ExperimentFormModalProps) {
  const [hypothesis, setHypothesis] = useState(
    experiment?.hypothesis ?? opportunity?.description ?? "",
  );
  const [type, setType] = useState<ExperimentType>(
    experiment?.type ?? "Landing",
  );
  const [variantA, setVariantA] = useState(experiment?.variantA ?? "");
  const [variantB, setVariantB] = useState(experiment?.variantB ?? "");
  const [objectiveMetric, setObjectiveMetric] = useState(
    experiment?.objectiveMetric ?? opportunity?.objectiveMetric ?? "",
  );
  const [owner, setOwner] = useState(experiment?.owner ?? DEMO_USER.name);

  const isEditing = Boolean(experiment);
  const canSubmit =
    hypothesis.trim().length > 0 &&
    variantA.trim().length > 0 &&
    variantB.trim().length > 0 &&
    objectiveMetric.trim().length > 0 &&
    owner.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }
    const campaign =
      experiment?.campaign ?? opportunity?.title ?? "Nuevo experimento";
    onSave({
      ...(experiment ?? {
        id: crypto.randomUUID(),
        status: "planificado" as const,
        dateLabel: "Creado el 6 sep 2026",
      }),
      campaign,
      type,
      hypothesis: hypothesis.trim(),
      variantA: variantA.trim(),
      variantB: variantB.trim(),
      objectiveMetric: objectiveMetric.trim(),
      owner: owner.trim(),
      opportunityId: experiment?.opportunityId ?? opportunity?.id,
    });
  };

  return (
    <DemoDialog
      open={open}
      title={isEditing ? "Editar hipótesis" : "Crear hipótesis"}
      subtitle={
        isEditing
          ? "El experimento quedará en estado Planificado."
          : "Se creará un experimento en estado Planificado."
      }
      onClose={onClose}
      width="wide"
      footer={
        <>
          <button type="button" className="demo-button-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="demo-button"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {isEditing ? "Guardar cambios" : "Crear hipótesis"}
          </button>
        </>
      }
    >
      {opportunity && !isEditing ? (
        <div className="create-hypothesis-origin demo-origin-box">
          <span className="create-hypothesis-origin-tag">
            <img
              className="create-hypothesis-origin-icon"
              src={megaphoneIcon}
              alt=""
            />
            <span>Oportunidad de origen · {opportunity.title}</span>
          </span>
          <p className="create-hypothesis-origin-desc">{opportunity.description}</p>
        </div>
      ) : null}

      <div className="demo-form-grid">
        <label className="demo-form-field demo-form-field-full">
          <span className="demo-form-label">Hipótesis</span>
          <textarea
            className="demo-textarea"
            value={hypothesis}
            onChange={(event) => setHypothesis(event.target.value)}
            placeholder="Si …, entonces subirá …"
          />
        </label>
        <fieldset className="demo-form-field demo-form-field-full">
          <legend className="demo-form-label">Tipo de experimento</legend>
          <div className="demo-pills-row">
            {EXPERIMENT_TYPES.map((option) => (
              <button
                key={option}
                type="button"
                className={`create-hypothesis-pill${
                  type === option ? " create-hypothesis-pill-active" : ""
                }`}
                onClick={() => setType(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="demo-form-field">
          <span className="demo-form-label">Versión A</span>
          <input
            className="demo-input"
            type="text"
            value={variantA}
            onChange={(event) => setVariantA(event.target.value)}
            placeholder="Versión actual"
          />
        </label>
        <label className="demo-form-field">
          <span className="demo-form-label">Versión B</span>
          <input
            className="demo-input"
            type="text"
            value={variantB}
            onChange={(event) => setVariantB(event.target.value)}
            placeholder="Versión propuesta"
          />
        </label>
        <label className="demo-form-field">
          <span className="demo-form-label">Métrica objetivo</span>
          <input
            className="demo-input"
            type="text"
            value={objectiveMetric}
            onChange={(event) => setObjectiveMetric(event.target.value)}
            placeholder="Ej. Conversión a registro"
          />
        </label>
        <label className="demo-form-field">
          <span className="demo-form-label">Responsable</span>
          <input
            className="demo-input"
            type="text"
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
          />
        </label>
      </div>
    </DemoDialog>
  );
}