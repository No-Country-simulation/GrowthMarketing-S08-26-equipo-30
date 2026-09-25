import {
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import xLgIcon from "@/assets/icons/figma/x-lg.svg";

interface DemoDialogProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: "default" | "wide";
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function DemoDialog({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
  width = "default",
}: DemoDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    triggerRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      const body = dialogRef.current?.querySelector<HTMLElement>(".demo-dialog-body");
      const focusable =
        body?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ??
        dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable) {
        focusable.focus();
      } else {
        dialogRef.current?.focus();
      }
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="demo-dialog-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`demo-dialog${width === "wide" ? " demo-dialog-wide" : ""}`}
      >
        <header className="demo-dialog-header">
          <div className="demo-dialog-heading">
            <h2 className="demo-dialog-title">{title}</h2>
            {subtitle ? (
              <p className="demo-dialog-subtitle">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            className="demo-dialog-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <img src={xLgIcon} alt="" />
          </button>
        </header>
        <div className="demo-dialog-body">{children}</div>
        {footer ? <footer className="demo-dialog-footer">{footer}</footer> : null}
      </div>
    </div>
  );
}