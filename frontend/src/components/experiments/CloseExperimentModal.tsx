import { useState } from "react";
import DemoDialog from "@/components/ui/DemoDialog";
import type { ExperimentView } from "@/demo/demoSelectors";

export type ExperimentCloseResult = "validado" | "noValidado";

interface CloseExperimentModalProps {
  experiment: ExperimentView;
  open: boolean;
  onCancel: () => void;
  onConfirm: (
    result: ExperimentCloseResult,
    conversionA: number,
    conversionB: number,
    learning: string,
  ) => void;
}

export default function CloseExperimentModal({
  experiment,
  open,
  onCancel,
  onConfirm,
}: CloseExperimentModalProps) {
  const [selectedResult, setSelectedResult] =
    useState<ExperimentCloseResult | null>(null);
  const [conversionA, setConversionA] = useState("");
  const [conversionB, setConversionB] = useState("");
  const [learning, setLearning] = useState("");

  const conversionANumber = parseFloat(conversionA.replace(",", "."));
  const conversionBNumber = parseFloat(conversionB.replace(",", "."));
  const conversionsValid =
    !Number.isNaN(conversionANumber) &&
    !Number.isNaN(conversionBNumber) &&
    conversionANumber >= 0 &&
    conversionBNumber >= 0;
  const canConfirm =
    selectedResult !== null &&
    conversionsValid &&
    learning.trim().length > 0;

  const handleConfirm = () => {
    if (!canConfirm || !selectedResult) {
      return;
    }
    onConfirm(
      selectedResult,
      conversionANumber,
      conversionBNumber,
      learning.trim(),
    );
  };

  return (
    <DemoDialog
      open={open}
      title="Cerrar experimento"
      subtitle="Se guardará el resultado, las conversiones y el aprendizaje del experimento"
      onClose={onCancel}
      width="wide"
      footer={
        <>
          <button type="button" className="demo-button-ghost" onClick={onCancel}>
            Cancelar
          </button>
          <button
            type="button"
            className={`demo-button${canConfirm ? " demo-button-enabled" : ""}`}
            onClick={handleConfirm}
            disabled={!canConfirm}
          >
            Cerrar experimento
          </button>
        </>
      }
    >
      <div className="close-experiment-about">
        <span className="close-experiment-about-title">{experiment.campaign}</span>
        <p className="close-experiment-about-text">{experiment.hypothesis}</p>
      </div>
      <div className="demo-form-grid">
        <fieldset className="demo-form-field demo-form-field-full">
          <legend className="demo-form-label">Resultado</legend>
          <div className="close-experiment-result-cards">
            <button
              type="button"
              className={`close-experiment-result-card${
                selectedResult === "validado"
                  ? " close-experiment-result-card-active"
                  : ""
              }`}
              onClick={() => setSelectedResult("validado")}
            >
              <span className="close-experiment-result-title">Validado</span>
              <span className="close-experiment-result-desc">
                La hipótesis se cumplió
              </span>
            </button>
            <button
              type="button"
              className={`close-experiment-result-card${
                selectedResult === "noValidado"
                  ? " close-experiment-result-card-active"
                  : ""
              }`}
              onClick={() => setSelectedResult("noValidado")}
            >
              <span className="close-experiment-result-title">No validado</span>
              <span className="close-experiment-result-desc">
                La hipótesis no se cumplió
              </span>
            </button>
          </div>
        </fieldset>
        <label className="demo-form-field">
          <span className="demo-form-label">Conversión A (%)</span>
          <input
            className="demo-input"
            type="text"
            inputMode="decimal"
            value={conversionA}
            onChange={(event) => setConversionA(event.target.value)}
            placeholder="Ej. 4,5"
          />
        </label>
        <label className="demo-form-field">
          <span className="demo-form-label">Conversión B (%)</span>
          <input
            className="demo-input"
            type="text"
            inputMode="decimal"
            value={conversionB}
            onChange={(event) => setConversionB(event.target.value)}
            placeholder="Ej. 5,6"
          />
        </label>
        <label className="demo-form-field demo-form-field-full">
          <span className="demo-form-label">Aprendizaje</span>
          <textarea
            className="demo-textarea"
            placeholder="¿Qué aprendió el equipo?"
            value={learning}
            onChange={(event) => setLearning(event.target.value)}
          />
        </label>
      </div>
    </DemoDialog>
  );
}