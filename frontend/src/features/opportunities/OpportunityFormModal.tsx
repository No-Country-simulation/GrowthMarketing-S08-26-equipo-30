import { useState } from "react";
import DemoDialog from "@/components/ui/DemoDialog";
import type { OpportunityRecord } from "@/demo/demoTypes";
import { useDemo } from "@/demo/DemoProvider";

interface OpportunityFormModalProps {
  open: boolean;
  opportunity: OpportunityRecord | null;
  onClose: () => void;
  onSave: (opportunity: OpportunityRecord) => void;
}

const STAGE_OPTIONS: { label: string; key: string }[] = [
  { label: "Activados → Clientes", key: "activados|clientes" },
  { label: "Registros → Activados", key: "registros|activados" },
  { label: "Clientes → Retenidos", key: "clientes|retenidos" },
];

export default function OpportunityFormModal({
  open,
  opportunity,
  onClose,
  onSave,
}: OpportunityFormModalProps) {
  const { state } = useDemo();
  const [title, setTitle] = useState(opportunity?.title ?? "");
  const [impact, setImpact] = useState<OpportunityRecord["impact"]>(
    opportunity?.impact ?? "medio",
  );
  const [source, setSource] = useState<OpportunityRecord["source"]>(
    opportunity?.source ?? "funnel",
  );
  const [stage, setStage] = useState(opportunity?.stage ?? STAGE_OPTIONS[0].label);
  const [channelId, setChannelId] = useState(
    opportunity?.channelId ?? state.channels[0]?.id ?? "",
  );
  const [description, setDescription] = useState(opportunity?.description ?? "");
  const [usersAtStake, setUsersAtStake] = useState(
    opportunity ? String(opportunity.usersAtStake) : "0",
  );
  const [objectiveMetric, setObjectiveMetric] = useState(
    opportunity?.objectiveMetric ?? "",
  );

  const usersNumber = Number.parseInt(usersAtStake, 10) || 0;
  const channel = state.channels.find((item) => item.id === channelId);
  const canSubmit =
    title.trim().length > 0 &&
    usersNumber >= 0 &&
    (source === "funnel" ? stage.trim().length > 0 : Boolean(channel));

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }
    const stageOption = STAGE_OPTIONS.find((option) => option.label === stage);
    const funnelRecord: OpportunityRecord = {
      ...(opportunity ?? {
        id: crypto.randomUUID(),
        status: "abierta" as const,
      }),
      title: title.trim(),
      impact,
      source,
      sourceLabel:
        source === "canales"
          ? `Canales · ${channel?.name ?? ""}`
          : `Funnel · ${stage}`,
      stage: source === "canales" ? "Adquisición" : stage,
      stageKey:
        source === "canales"
          ? "adquisicion"
          : (stageOption?.key ?? "clientes|retenidos"),
      channelId: source === "canales" ? channelId : undefined,
      description: description.trim(),
      usersAtStake: usersNumber,
      objectiveMetric: objectiveMetric.trim(),
    };
    onSave(funnelRecord);
  };

  return (
    <DemoDialog
      open={open}
      title={opportunity ? "Editar oportunidad" : "Nueva oportunidad"}
      subtitle="Se generan a partir de caídas del funnel o del rendimiento de canales."
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
            {opportunity ? "Guardar cambios" : "Crear oportunidad"}
          </button>
        </>
      }
    >
      <div className="demo-form-grid">
        <label className="demo-form-field demo-form-field-full">
          <span className="demo-form-label">Título</span>
          <input
            className="demo-input"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ej. Mejorar la activación en onboarding"
          />
        </label>
        <fieldset className="demo-form-field">
          <legend className="demo-form-label">Impacto</legend>
          <div className="demo-radio-row">
            <label className="demo-radio">
              <input
                type="radio"
                name="opportunity-impact"
                value="alto"
                checked={impact === "alto"}
                onChange={() => setImpact("alto")}
              />
              <span>Alto</span>
            </label>
            <label className="demo-radio">
              <input
                type="radio"
                name="opportunity-impact"
                value="medio"
                checked={impact === "medio"}
                onChange={() => setImpact("medio")}
              />
              <span>Medio</span>
            </label>
          </div>
        </fieldset>
        <fieldset className="demo-form-field">
          <legend className="demo-form-label">Origen</legend>
          <div className="demo-radio-row">
            <label className="demo-radio">
              <input
                type="radio"
                name="opportunity-source"
                value="funnel"
                checked={source === "funnel"}
                onChange={() => setSource("funnel")}
              />
              <span>Funnel</span>
            </label>
            <label className="demo-radio">
              <input
                type="radio"
                name="opportunity-source"
                value="canales"
                checked={source === "canales"}
                onChange={() => setSource("canales")}
              />
              <span>Canales</span>
            </label>
          </div>
        </fieldset>
        {source === "funnel" ? (
          <label className="demo-form-field">
            <span className="demo-form-label">Etapa</span>
            <select
              className="demo-select"
              value={stage}
              onChange={(event) => setStage(event.target.value)}
            >
              {STAGE_OPTIONS.map((option) => (
                <option key={option.label} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label className="demo-form-field">
            <span className="demo-form-label">Canal</span>
            <select
              className="demo-select"
              value={channelId}
              onChange={(event) => setChannelId(event.target.value)}
            >
              {state.channels.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="demo-form-field">
          <span className="demo-form-label">Usuarios en juego</span>
          <input
            className="demo-input"
            type="number"
            min="0"
            value={usersAtStake}
            onChange={(event) => setUsersAtStake(event.target.value)}
          />
        </label>
        <label className="demo-form-field">
          <span className="demo-form-label">Métrica objetivo</span>
          <input
            className="demo-input"
            type="text"
            value={objectiveMetric}
            onChange={(event) => setObjectiveMetric(event.target.value)}
            placeholder="Ej. Conversión a pago"
          />
        </label>
        <label className="demo-form-field demo-form-field-full">
          <span className="demo-form-label">Descripción</span>
          <textarea
            className="demo-textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe la fuga detectada y su impacto."
          />
        </label>
      </div>
    </DemoDialog>
  );
}