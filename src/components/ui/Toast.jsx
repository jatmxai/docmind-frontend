import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastContext = createContext(null);

const TONES = {
  success: {
    icon: CheckCircle2,
    ring: "ring-emerald-500/30",
    bg: "from-emerald-500/10 to-emerald-500/0",
    iconColor: "text-emerald-300",
  },
  error: {
    icon: XCircle,
    ring: "ring-rose-500/30",
    bg: "from-rose-500/10 to-rose-500/0",
    iconColor: "text-rose-300",
  },
  warning: {
    icon: AlertTriangle,
    ring: "ring-amber-500/30",
    bg: "from-amber-500/10 to-amber-500/0",
    iconColor: "text-amber-300",
  },
  info: {
    icon: Info,
    ring: "ring-accent-500/30",
    bg: "from-accent-500/10 to-accent-500/0",
    iconColor: "text-accent-300",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback((toast) => {
    const id = ++idRef.current;
    const next = { id, ttl: 4500, tone: "info", ...toast };
    setToasts((t) => [...t, next]);
    if (next.ttl > 0) {
      setTimeout(() => dismiss(id), next.ttl);
    }
    return id;
  }, [dismiss]);

  const api = {
    push,
    dismiss,
    success: (title, description) => push({ tone: "success", title, description }),
    error: (title, description) => push({ tone: "error", title, description, ttl: 6000 }),
    warning: (title, description) => push({ tone: "warning", title, description }),
    info: (title, description) => push({ tone: "info", title, description }),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  const tone = TONES[toast.tone] ?? TONES.info;
  const Icon = tone.icon;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto rounded-xl ring-1 px-3.5 py-3 flex gap-2.5 items-start",
        "bg-ink-900/90 backdrop-blur-xl shadow-glow",
        "transition-all duration-200 ease-out",
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4",
        tone.ring
      )}
    >
      <div className={cn("absolute inset-0 rounded-xl bg-gradient-to-br opacity-50", tone.bg)} />
      <div className={cn("relative flex-none mt-0.5", tone.iconColor)}>
        <Icon size={16} />
      </div>
      <div className="relative min-w-0 flex-1">
        {toast.title && <p className="text-sm font-medium text-zinc-100">{toast.title}</p>}
        {toast.description && (
          <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="relative flex-none -mt-0.5 -mr-1 p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors"
        aria-label="Dismiss"
      >
        <X size={13} />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
