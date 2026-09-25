import type { MouseEvent } from "react";

export interface EntityActionItem {
  label: string;
  onClick: () => void;
  tone?: "default" | "danger" | "primary";
  disabled?: boolean;
  ariaLabel?: string;
}

interface EntityActionsProps {
  actions: EntityActionItem[];
  compact?: boolean;
}

export default function EntityActions({ actions, compact }: EntityActionsProps) {
  return (
    <div className={`entity-actions${compact ? " entity-actions-compact" : ""}`}>
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          className={`entity-action entity-action-${action.tone ?? "default"}`}
          onClick={(event: MouseEvent) => {
            event.stopPropagation();
            action.onClick();
          }}
          disabled={action.disabled}
          aria-label={action.ariaLabel ?? action.label}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}