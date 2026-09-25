import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { DEMO_USER } from "@/components/layout/navConfig";
import { useDemo } from "@/demo/DemoProvider";

export default function UserMenu() {
  const { resetDemo } = useDemo();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handlePointer = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
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
  }, [open]);

  const handleConfirmReset = () => {
    setConfirmOpen(false);
    resetDemo();
    navigate("/");
  };

  return (
    <div ref={containerRef} className="user-menu">
      <button
        type="button"
        className="user-menu-trigger"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Menú de usuario"
      >
        <div className="user-avatar">{DEMO_USER.initials}</div>
        <div className="user-info">
          <span className="user-name">{DEMO_USER.name}</span>
          <span className="user-role">{DEMO_USER.role}</span>
        </div>
      </button>
      {open ? (
        <div className="user-menu-popover" role="menu">
          <div className="user-menu-note">Datos guardados localmente</div>
          <button
            type="button"
            className="user-menu-item"
            role="menuitem"
            onClick={() => setConfirmOpen(true)}
          >
            Reiniciar demo
          </button>
        </div>
      ) : null}
      <ConfirmDialog
        open={confirmOpen}
        title="Reiniciar demo"
        message="Se restaurará el estado inicial y se borrarán los cambios guardados en este navegador."
        confirmLabel="Reiniciar"
        tone="danger"
        onConfirm={handleConfirmReset}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}