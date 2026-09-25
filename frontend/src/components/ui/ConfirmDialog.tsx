import type { ReactNode } from "react";
import DemoDialog from "@/components/ui/DemoDialog";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "primary" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancelar",
  tone = "primary",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <DemoDialog
      open={open}
      title={title}
      subtitle="Esta acción se guarda localmente en este navegador."
      onClose={onCancel}
      footer={
        <>
          <button type="button" className="demo-button-ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`demo-button demo-button-${tone}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="confirm-dialog-message">{message}</div>
    </DemoDialog>
  );
}