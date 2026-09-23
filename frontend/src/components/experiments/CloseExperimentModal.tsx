import { useState } from "react";
import xLgIcon from "@/assets/icons/figma/x-lg.svg";
import type { ExperimentCardData } from "@/features/experiments/experimentsData";

export type ExperimentCloseResult = "validado" | "noValidado";

interface CloseExperimentModalProps {
  experiment: ExperimentCardData;
  open: boolean;
  onCancel: () => void;
  onConfirm: (result: ExperimentCloseResult, learning: string) => void;
}

export default function CloseExperimentModal({
  experiment,
  open,
  onCancel,
  onConfirm,
}: CloseExperimentModalProps) {
  const [selectedResult, setSelectedResult] =
    useState<ExperimentCloseResult | null>(null);
  const [learning, setLearning] = useState("");

  if (!open) {
    return null;
  }

  const canConfirm = selectedResult !== null && learning.trim().length > 0;

  return (
    <div className="close-experiment-overlay">
      <div className="close-experiment-modal">
        <header className="close-experiment-header">
          <div className="close-experiment-heading">
            <h2 className="close-experiment-title">Cerrar experimento</h2>
            <p className="close-experiment-subtitle">
              Se guardará el resultado y el aprendizaje del experimento
            </p>
          </div>
          <button
            type="button"
            className="close-experiment-close"
            onClick={onCancel}
            aria-label="Cerrar"
          >
            <img src={xLgIcon} alt="" />
          </button>
        </header>

        <div className="close-experiment-about">
          <span className="close-experiment-about-title">
            {experiment.campaign}
          </span>
          <p className="close-experiment-about-text">{experiment.hypothesis}</p>
        </div>

        <div className="close-experiment-field">
          <span className="close-experiment-label">Resultado</span>
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
        </div>

        <div className="close-experiment-field">
          <span className="close-experiment-label">Aprendizaje</span>
          <textarea
            className="close-experiment-learning"
            placeholder="¿Qué aprendió el equipo?"
            value={learning}
            onChange={(event) => setLearning(event.target.value)}
          />
        </div>

        <footer className="close-experiment-footer">
          <button
            type="button"
            className="close-experiment-cancel"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={`close-experiment-submit${
              canConfirm ? " close-experiment-submit-enabled" : ""
            }`}
            disabled={!canConfirm}
            onClick={() => {
              if (selectedResult) {
                onConfirm(selectedResult, learning.trim());
              }
            }}
          >
            Cerrar experimento
          </button>
        </footer>
      </div>
    </div>
  );
}