import { useState } from "react";
import DemoDialog from "@/components/ui/DemoDialog";
import type { CampaignRecord } from "@/demo/demoTypes";
import { useDemo } from "@/demo/DemoProvider";

interface CampaignFormModalProps {
  open: boolean;
  campaign: CampaignRecord | null;
  onClose: () => void;
  onSave: (campaign: CampaignRecord) => void;
}

export default function CampaignFormModal({ open, campaign, onClose, onSave }: CampaignFormModalProps) {
  const { state } = useDemo();
  const [title, setTitle] = useState(campaign?.title ?? "");
  const [objective, setObjective] = useState(campaign?.objective ?? "");
  const [budget, setBudget] = useState(campaign?.budget !== undefined ? String(campaign.budget) : "0");
  const [startDate, setStartDate] = useState(campaign?.startDate ?? "");
  const [endDate, setEndDate] = useState(campaign?.endDate ?? "");
  const [channelIds, setChannelIds] = useState<string[]>(campaign?.channels ?? []);

  const budgetNumber = Number.parseFloat(budget.replace(",", "."));
  const errors = {
    title: title.trim() ? "" : "El nombre es obligatorio.",
    objective: objective.trim() ? "" : "El objetivo es obligatorio.",
    budget: !Number.isNaN(budgetNumber) && budgetNumber >= 0 ? "" : "El presupuesto debe ser mayor o igual a cero.",
    startDate: startDate ? "" : "La fecha inicial es obligatoria.",
    endDate: endDate && (!startDate || endDate >= startDate) ? "" : "La fecha final no puede ser anterior a la inicial.",
    channels: channelIds.length ? "" : "Seleccioná al menos un canal.",
  };
  const canSubmit = Object.values(errors).every((error) => !error);

  const toggleChannel = (id: string) => {
    setChannelIds((current) => current.includes(id) ? current.filter((channel) => channel !== id) : [...current, id]);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSave({
      ...(campaign ?? { id: crypto.randomUUID(), segmentId: state.segments[0]?.id ?? "" }),
      title: title.trim(),
      objective: objective.trim(),
      budget: budgetNumber,
      startDate,
      endDate,
      dateRange: `${startDate} - ${endDate}`,
      channels: channelIds,
      status: campaign?.status ?? "activo",
      visits: campaign?.visits ?? 0,
      registrations: campaign?.registrations ?? 0,
      customers: campaign?.customers ?? 0,
      retained: campaign?.retained ?? 0,
      metricsBarWidths: campaign?.metricsBarWidths ?? [212, 0, 0, 0],
    });
  };

  return (
    <DemoDialog
      open={open}
      title={campaign ? "Editar campaña" : "Registrar campaña"}
      subtitle="Asociá la campaña a uno o varios canales. Las métricas se calculan con eventos del funnel."
      onClose={onClose}
      width="wide"
      footer={
        <>
          <button type="button" className="demo-button-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="demo-button" onClick={handleSubmit} disabled={!canSubmit}>
            {campaign ? "Guardar cambios" : "Registrar campaña"}
          </button>
        </>
      }
    >
      <div className="demo-form-grid">
        <label className="demo-form-field">
          <span className="demo-form-label">Nombre</span>
          <input className="demo-input" aria-label="Nombre" type="text" value={title} onChange={(event) => setTitle(event.target.value)} />
          {errors.title ? <span className="demo-form-error">{errors.title}</span> : null}
        </label>
        <label className="demo-form-field">
          <span className="demo-form-label">Objetivo</span>
          <input className="demo-input" aria-label="Objetivo" type="text" value={objective} onChange={(event) => setObjective(event.target.value)} />
          {errors.objective ? <span className="demo-form-error">{errors.objective}</span> : null}
        </label>
        <label className="demo-form-field">
          <span className="demo-form-label">Presupuesto USD</span>
          <input className="demo-input" aria-label="Presupuesto USD" type="number" min="0" step="0.01" value={budget} onChange={(event) => setBudget(event.target.value)} />
          {errors.budget ? <span className="demo-form-error">{errors.budget}</span> : null}
        </label>
        <label className="demo-form-field">
          <span className="demo-form-label">Inicio</span>
          <input className="demo-input" aria-label="Inicio" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          {errors.startDate ? <span className="demo-form-error">{errors.startDate}</span> : null}
        </label>
        <label className="demo-form-field">
          <span className="demo-form-label">Fin</span>
          <input className="demo-input" aria-label="Fin" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          {errors.endDate ? <span className="demo-form-error">{errors.endDate}</span> : null}
        </label>
        <fieldset className="demo-form-field demo-form-field-full">
          <legend className="demo-form-label">Canales</legend>
          <div className="demo-checkbox-row">
            {state.channels.map((channel) => (
              <label key={channel.id} className="demo-checkbox">
                <input type="checkbox" checked={channelIds.includes(channel.id)} onChange={() => toggleChannel(channel.id)} />
                <span>{channel.name}</span>
              </label>
            ))}
          </div>
          {errors.channels ? <span className="demo-form-error">{errors.channels}</span> : null}
        </fieldset>
      </div>
    </DemoDialog>
  );
}
