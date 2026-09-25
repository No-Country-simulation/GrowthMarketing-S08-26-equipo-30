import { useDemo } from "@/demo/DemoProvider";
import xLgIcon from "@/assets/icons/figma/x-lg.svg";

export default function ToastRegion() {
  const { toasts, dismissToast } = useDemo();
  if (toasts.length === 0) {
    return null;
  }
  return (
    <div className="toast-region" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.tone}`}
          role="status"
        >
          <span className="toast-message">{toast.message}</span>
          <button
            type="button"
            className="toast-dismiss"
            onClick={() => dismissToast(toast.id)}
            aria-label="Cerrar notificación"
          >
            <img src={xLgIcon} alt="" />
          </button>
        </div>
      ))}
    </div>
  );
}