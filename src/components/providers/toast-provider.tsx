"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Toast = {
  id: string;
  title: string;
  description: string;
  tone?: "info" | "critical" | "success";
};

const ToastContext = createContext<{ notify: (toast: Omit<Toast, "id">) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = crypto.randomUUID();
      setToasts((current) => [{ ...toast, id }, ...current].slice(0, 4));
      window.setTimeout(() => dismiss(id), 6500);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 grid w-[calc(100vw-2rem)] max-w-sm gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 24, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.98 }}
              className={cn(
                "rounded-lg border bg-slate-950/90 p-4 text-white shadow-2xl backdrop-blur-xl",
                toast.tone === "critical" ? "border-rose-400/35" : toast.tone === "success" ? "border-emerald-300/35" : "border-cyan-300/30",
              )}
            >
              <div className="flex items-start gap-3">
                {toast.tone === "success" ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-200" /> : <ShieldAlert className="mt-0.5 h-5 w-5 text-cyan-200" />}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{toast.title}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-300">{toast.description}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => dismiss(toast.id)} aria-label="Dismiss alert">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
