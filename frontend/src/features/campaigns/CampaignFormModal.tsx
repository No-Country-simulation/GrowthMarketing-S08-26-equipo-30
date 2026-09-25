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

export default function CampaignFormModal({
  open,
  campaign,
  onClose,
  onSave,
}: CampaignFormModalProps) {
  const { state } = useDemo();
  const [title, setTitle] = useState(campaign?.title ?? "");
  const [dateRange, setDateRange] = useState(campaign?.dateRange ?? "");
  const [channelIds, setChannelIds] = useState<string[]>(
    campaign?.channels ?? [],
  );
  const [status, setStatus] = useState<CampaignRecord["status"]>(
    campaign?.status ?? "activo",
  );
  const [visits, setVisits] = useState(
    campaign ? String(campaign.visits) : "0",
  );
  const [registrations, setRegistrations] = useState(
    campaign ? String(campaign.registrations) : "0",
  );
  const [customers, setCustomers] = useState(
    campaign ? String(campaign.customers) : "0",
  );
  const [retained, setRetained] = useState(
    campaign ? String(campaign.retained) : "0",
  );

  const visitsN = Number.parseInt(visits, 10) || 0;
  const registrationsN = Number.parseInt(registrations, 10) || 0;
  const customersN = Number.parseInt(customers, 10) || 0;
  const retainedN = Number.parseInt(retained, 10) || 0;

  const hierarchyError = !(
    retainedN <= customersN &&
    customersN <= registrationsN &&
    registrationsN <= visitsN
  )
    ? "Los valores deben cumplir: retenidos ≤ clientes ≤ registros ≤ visitas."
    : null;
  const negativeError =
    visitsN < 0 || registrationsN < 0 || customersN < 0 || retainedN < 0
      ? "Los valores no pueden ser negativos."
      : null;
  const error = hierarchyError ?? negativeError;

  const canSubmit =
    title.trim().length > 0 && channelIds.length > 0 && !error;

  const toggleChannel = (id: string) => {
    setChannelIds((current) =>
      current.includes(id)
        ? current.filter((channel) => channel !== id)
        : [...current, id],
    );
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }
    const visitWidth = 212;
    const registrationsWidth = visitsN
      ? Math.max(1, Math.round((visitWidth * registrationsN) / visitsN))
      : 0;
    const customersWidth = registrationsN
      ? Math.max(1, Math.round((visitWidth * customersN) / registrationsN))
      : 0;
    const retainedWidth = customersN
      ? Math.max(1, Math.round((visitWidth * retainedN) / customersN))
      : 0;
    onSave({
      ...(campaign ?? {
        id: crypto.randomUUID(),
        segmentId: state.segments[0]?.id ?? "",
      }),
      title: title.trim(),
      status,
      dateRange: dateRange.trim() || "Sin fecha de fin",
      channels: channelIds,
      visits: visitsN,
      registrations: registrationsN,
      customers: customersN,
      retained: retainedN,
      metricsBarWidths: [
        visitWidth,
        registrationsWidth,
        customersWidth,
        retainedWidth,
      ],
    });
  };

  return (
    <DemoDialog
      open={open}
      title={campaign ? "Editar campaña" : "Nueva campaña"}
      subtitle="Las conversiones y la retención se calculan automáticamente."
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
            {campaign ? "Guardar cambios" : "Crear campaña"}
          </button>
        </>
      }
    >
      <div className="demo-form-grid">
        <label className="demo-form-field">
          <span className="demo-form-label">Nombre</span>
          <input
            className="demo-input"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ej. Q4 · Prospecting LATAM"
          />
        </label>
        <label className="demo-form-field">
          <span className="demo-form-label">Rango de fechas</span>
          <input
            className="demo-input"
            type="text"
            value={dateRange}
            onChange={(event) => setDateRange(event.target.value)}
            placeholder="Ej. 1 ago – 6 sep 2026"
          />
        </label>
        <fieldset className="demo-form-field demo-form-field-full">
          <legend className="demo-form-label">Canales</legend>
          <div className="demo-checkbox-row">
            {state.channels.map((channel) => {
              const checked = channelIds.includes(channel.id);
              return (
                <label key={channel.id} className="demo-checkbox">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleChannel(channel.id)}
                  />
                  <span>{channel.name}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <fieldset className="demo-form-field demo-form-field-full">
          <legend className="demo-form-label">Estado</legend>
          <div className="demo-radio-row">
            {(
              [
                ["activo", "Activo"],
                ["pausado", "Pausado"],
                ["finalizado", "Finalizado"],
              ] as [CampaignRecord["status"], string][]
            ).map(([value, label]) => (
              <label key={value} className="demo-radio">
                <input
                  type="radio"
                  name="campaign-status"
                  value={value}
                  checked={status === value}
                  onChange={() => setStatus(value)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="demo-form-field">
          <span className="demo-form-label">Visitas</span>
          <input
            className="demo-input"
            type="number"
            min="0"
            value={visits}
            onChange={(event) => setVisits(event.target.value)}
          />
        </label>
        <label className="demo-form-field">
          <span className="demo-form-label">Registros</span>
          <input
            className="demo-input"
            type="number"
            min="0"
            value={registrations}
            onChange={(event) => setRegistrations(event.target.value)}
          />
        </label>
        <label className="demo-form-field">
          <span className="demo-form-label">Clientes</span>
          <input
            className="demo-input"
            type="number"
            min="0"
            value={customers}
            onChange={(event) => setCustomers(event.target.value)}
          />
        </label>
        <label className="demo-form-field">
          <span className="demo-form-label">Retenidos</span>
          <input
            className="demo-input"
            type="number"
            min="0"
            value={retained}
            onChange={(event) => setRetained(event.target.value)}
          />
        </label>
        {error ? (
          <p className="demo-form-error demo-form-field-full">{error}</p>
        ) : null}
      </div>
    </DemoDialog>
  );
}