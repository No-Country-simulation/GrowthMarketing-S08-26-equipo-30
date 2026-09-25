import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import arrowCircleIcon from "@/assets/icons/figma/arrow-up-right-circle-fill.svg";
import funnelBody from "@/assets/icons/figma/funnel-body.svg";
import broadcastBody from "@/assets/icons/figma/broadcast-body.svg";
import type { OpportunityView } from "@/demo/demoSelectors";
import type {
  OpportunityImpact,
  OpportunityRecord,
  OpportunitySource,
} from "@/demo/demoTypes";

interface OpportunityCardProps {
  data: OpportunityView;
  onCreateHypothesis?: (opportunity: OpportunityRecord) => void;
  onEdit?: (opportunity: OpportunityRecord) => void;
  onDiscard?: (id: string) => void;
  onReopen?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const IMPACT_LABEL: Record<OpportunityImpact, string> = {
  alto: "Impacto alto",
  medio: "Impacto medio",
};

const SOURCE_ICON: Record<OpportunitySource, string> = {
  funnel: funnelBody,
  canales: broadcastBody,
};

export default function OpportunityCard({
  data,
  onCreateHypothesis,
  onEdit,
  onDiscard,
  onReopen,
  onDelete,
}: OpportunityCardProps) {
  const navigate = useNavigate();
  const { record } = data;
  const isHigh = record.impact === "alto";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const handlePointer = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  const status = record.status;
  const hasCreate = status === "abierta" && onCreateHypothesis;
  const showExperiment = status === "enExperimento";
  const showReopen = status === "descartada" && onReopen;

  return (
    <article className="opportunity-card">
      <div className="opportunity-content">
        <span
          className={`opportunity-index ${
            isHigh ? "opportunity-index-high" : "opportunity-index-medium"
          }`}
        >
          {data.index}
        </span>
        <div className="opportunity-body">
          <div className="opportunity-title-row">
            <h3 className="opportunity-title">{record.title}</h3>
            <div className="opportunity-tags">
              <span className="opportunity-source-pill">
                <img
                  className="opportunity-source-icon"
                  src={SOURCE_ICON[record.source]}
                  alt=""
                />
                {record.sourceLabel}
              </span>
              <span
                className={`opportunity-impact-pill ${
                  isHigh ? "opportunity-impact-high" : "opportunity-impact-medium"
                }`}
              >
                {IMPACT_LABEL[record.impact]}
              </span>
              {status !== "abierta" ? (
                <span className={`opportunity-status-pill opportunity-status-pill-${status}`}>
                  {status === "enExperimento"
                    ? "En experimento"
                    : "Descartada"}
                </span>
              ) : null}
              {onEdit || onDiscard || onReopen || onDelete ? (
                <div ref={menuRef} className="opportunity-menu">
                  <button
                    type="button"
                    className="opportunity-menu-trigger"
                    onClick={() => setMenuOpen((current) => !current)}
                    aria-label={`Acciones de la oportunidad ${record.title}`}
                    aria-expanded={menuOpen}
                    aria-haspopup="menu"
                  >
                    <span aria-hidden="true">⋯</span>
                  </button>
                  {menuOpen ? (
                    <div className="opportunity-menu-popover" role="menu">
                      {onEdit ? (
                        <button
                          type="button"
                          role="menuitem"
                          className="opportunity-menu-item"
                          onClick={() => {
                            setMenuOpen(false);
                            onEdit(record);
                          }}
                        >
                          Editar
                        </button>
                      ) : null}
                      {status === "abierta" && onDiscard ? (
                        <button
                          type="button"
                          role="menuitem"
                          className="opportunity-menu-item"
                          onClick={() => {
                            setMenuOpen(false);
                            onDiscard(record.id);
                          }}
                        >
                          Descartar
                        </button>
                      ) : null}
                      {status === "descartada" && onReopen ? (
                        <button
                          type="button"
                          role="menuitem"
                          className="opportunity-menu-item"
                          onClick={() => {
                            setMenuOpen(false);
                            onReopen(record.id);
                          }}
                        >
                          Reabrir
                        </button>
                      ) : null}
                      {onDelete ? (
                        <button
                          type="button"
                          role="menuitem"
                          className="opportunity-menu-item opportunity-menu-item-danger"
                          onClick={() => {
                            setMenuOpen(false);
                            onDelete(record.id);
                          }}
                        >
                          Eliminar
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
          <p className="opportunity-description">{record.description}</p>
          <div className="opportunity-metrics">
            <div className="opportunity-metric">
              <span className="opportunity-metric-label">Usuarios en juego</span>
              <span className="opportunity-metric-value">{data.usersAtStakeText}</span>
            </div>
            <div className="opportunity-metric">
              <span className="opportunity-metric-label">etapa</span>
              <span className="opportunity-metric-value">{record.stage}</span>
            </div>
            <div className="opportunity-metric">
              <span className="opportunity-metric-label">Métrica objetivo</span>
              <span className="opportunity-metric-value">
                {record.objectiveMetric}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="opportunity-card-right">
        {hasCreate ? (
          <button
            type="button"
            className="opportunity-cta"
            onClick={() => onCreateHypothesis(record)}
          >
            <span className="opportunity-cta-text">Crear hipótesis</span>
            <img className="opportunity-cta-icon" src={arrowCircleIcon} alt="" />
          </button>
        ) : null}
        {showExperiment && data.experiment ? (
          <button
            type="button"
            className="opportunity-cta opportunity-cta-secondary"
            onClick={() => navigate(`/experimentos/${data.experiment!.id}`)}
          >
            <span className="opportunity-cta-text">Ver experimento</span>
            <img className="opportunity-cta-icon" src={arrowCircleIcon} alt="" />
          </button>
        ) : null}
        {showReopen ? (
          <button
            type="button"
            className="opportunity-cta opportunity-cta-secondary"
            onClick={() => onReopen(record.id)}
          >
            <span className="opportunity-cta-text">Reabrir</span>
            <img className="opportunity-cta-icon" src={arrowCircleIcon} alt="" />
          </button>
        ) : null}
      </div>
    </article>
  );
}