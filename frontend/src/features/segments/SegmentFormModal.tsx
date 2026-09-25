import { useState } from "react";
import DemoDialog from "@/components/ui/DemoDialog";
import type { SegmentRecord } from "@/demo/demoTypes";

interface SegmentFormModalProps {
  open: boolean;
  segment: SegmentRecord | null;
  onClose: () => void;
  onSave: (segment: SegmentRecord) => void;
}

const INTENT_OPTIONS: { label: string; tone: SegmentRecord["intentTone"] }[] = [
  { label: "Intención baja", tone: "low" },
  { label: "Intención media", tone: "medium" },
  { label: "Intención alta", tone: "high" },
  { label: "Cliente", tone: "customer" },
];

const COLOR_OPTIONS = ["#C24A3A", "#1751C8", "#276A60", "#FFB412", "#CE8BFF"];

export default function SegmentFormModal({
  open,
  segment,
  onClose,
  onSave,
}: SegmentFormModalProps) {
  const [name, setName] = useState(segment?.name ?? "");
  const [intent, setIntent] = useState(
    segment?.intent ?? "Intención baja",
  );
  const [description, setDescription] = useState(segment?.description ?? "");
  const [users, setUsers] = useState(
    segment ? String(segment.users) : "0",
  );
  const [converted, setConverted] = useState(
    segment ? String(segment.converted) : "0",
  );
  const [color, setColor] = useState(segment?.color ?? "#1751C8");

  const usersNumber = Number.parseInt(users, 10) || 0;
  const convertedNumber = Number.parseInt(converted, 10) || 0;
  const validationError =
    convertedNumber > usersNumber
      ? "Los convertidos no pueden superar a los usuarios."
      : null;

  const canSubmit =
    name.trim().length > 0 &&
    !Number.isNaN(usersNumber) &&
    usersNumber >= 0 &&
    convertedNumber >= 0 &&
    !validationError;

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }
    const tone =
      INTENT_OPTIONS.find((option) => option.label === intent)?.tone ?? "low";
    onSave({
      ...(segment ?? {
        id: crypto.randomUUID(),
        order: "99",
        wide: false,
        baseBarWidth: 194,
        conversionBarWidth: 0,
      }),
      name: name.trim(),
      intent,
      intentTone: tone,
      description: description.trim(),
      users: usersNumber,
      converted: convertedNumber,
      color,
    });
  };

  return (
    <DemoDialog
      open={open}
      title={segment ? "Editar segmento" : "Nuevo segmento"}
      subtitle="El segmento se recalcula sobre los usuarios del período seleccionado."
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
            {segment ? "Guardar cambios" : "Crear segmento"}
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
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej. Early adopters"
          />
        </label>
        <label className="demo-form-field">
          <span className="demo-form-label">Intención</span>
          <select
            className="demo-select"
            value={intent}
            onChange={(event) => setIntent(event.target.value)}
          >
            {INTENT_OPTIONS.map((option) => (
              <option key={option.label} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="demo-form-field demo-form-field-full">
          <span className="demo-form-label">Descripción</span>
          <textarea
            className="demo-textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe las señales que definen a este segmento."
          />
        </label>
        <label className="demo-form-field">
          <span className="demo-form-label">Usuarios</span>
          <input
            className="demo-input"
            type="number"
            min="0"
            value={users}
            onChange={(event) => setUsers(event.target.value)}
          />
        </label>
        <label className="demo-form-field">
          <span className="demo-form-label">Convertidos</span>
          <input
            className="demo-input"
            type="number"
            min="0"
            value={converted}
            onChange={(event) => setConverted(event.target.value)}
          />
        </label>
        <fieldset className="demo-form-field demo-form-field-full">
          <legend className="demo-form-label">Color</legend>
          <div className="demo-color-row">
            {COLOR_OPTIONS.map((option) => (
              <label key={option} className="demo-color-option">
                <input
                  type="radio"
                  name="segment-color"
                  value={option}
                  checked={color === option}
                  onChange={() => setColor(option)}
                />
                <span
                  className="demo-color-swatch"
                  style={{ background: option }}
                  aria-hidden="true"
                />
              </label>
            ))}
          </div>
        </fieldset>
        {validationError ? (
          <p className="demo-form-error demo-form-field-full">{validationError}</p>
        ) : null}
      </div>
    </DemoDialog>
  );
}