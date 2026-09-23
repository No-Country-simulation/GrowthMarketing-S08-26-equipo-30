import { useState } from "react";
import xLgIcon from "@/assets/icons/figma/x-lg.svg";
import megaphoneIcon from "@/assets/icons/figma/megaphone.svg";
import arrowRightShortIcon from "@/assets/icons/figma/arrow-right-short.svg";
import type { OpportunityCardData } from "@/features/opportunities/oportunidadesData";

interface CreateHypothesisModalProps {
  opportunity: OpportunityCardData;
  onClose: () => void;
  onConfirm: () => void;
}

const EXPERIMENT_TYPES = [
  "Canal",
  "Segmentación",
  "Anuncio",
  "Landing activo",
  "CTA",
  "Onboarding",
  "Oferta",
  "Retención",
];

export default function CreateHypothesisModal({
  opportunity,
  onClose,
  onConfirm,
}: CreateHypothesisModalProps) {
  const [selectedType, setSelectedType] = useState("Landing activo");

  return (
    <div className="create-hypothesis-overlay">
      <div className="create-hypothesis-modal">
        <header className="create-hypothesis-header">
          <div className="create-hypothesis-heading">
            <h2 className="create-hypothesis-title">Crear hipótesis</h2>
            <p className="create-hypothesis-subtitle">
              Se creará un experimento en estado Planificado
            </p>
          </div>
          <button
            type="button"
            className="create-hypothesis-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <img src={xLgIcon} alt="" />
          </button>
        </header>

        <div className="create-hypothesis-origin">
          <span className="create-hypothesis-origin-tag">
            <img className="create-hypothesis-origin-icon" src={megaphoneIcon} alt="" />
            <span>Oportunidad de origen · {opportunity.index}</span>
          </span>
          <h3 className="create-hypothesis-origin-title">{opportunity.title}</h3>
          <p className="create-hypothesis-origin-desc">{opportunity.description}</p>
        </div>

        <div className="create-hypothesis-field">
          <span className="create-hypothesis-label">Hipótesis</span>
          <div className="create-hypothesis-hypothesis">
            Si la landing de Meta habla de ahorro de tiempo en lugar de precio, subirá la
            conversión a registro
          </div>
        </div>

        <div className="create-hypothesis-field">
          <span className="create-hypothesis-label">Tipo de experimento</span>
          <div className="create-hypothesis-pills">
            {EXPERIMENT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={`create-hypothesis-pill${
                  selectedType === type ? " create-hypothesis-pill-active" : ""
                }`}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="create-hypothesis-field">
          <span className="create-hypothesis-label">Versiones</span>
          <div className="create-hypothesis-versions">
            <div className="create-hypothesis-version">
              <span className="create-hypothesis-version-badge">A</span>
              <span className="create-hypothesis-version-text">
                Landing actual con enfoque en precio
              </span>
            </div>
            <img
              className="create-hypothesis-versions-arrow"
              src={arrowRightShortIcon}
              alt=""
            />
            <div className="create-hypothesis-version create-hypothesis-version-active">
              <span className="create-hypothesis-version-badge">B</span>
              <span className="create-hypothesis-version-text">
                Landing con enfoque en ahorro de tiempo
              </span>
            </div>
          </div>
        </div>

        <footer className="create-hypothesis-footer">
          <button type="button" className="create-hypothesis-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="create-hypothesis-submit" onClick={onConfirm}>
            Crear hipótesis
          </button>
        </footer>
      </div>
    </div>
  );
}