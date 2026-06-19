"use client";

import { useEffect, useState } from "react";
import { toast, ToastMessage } from "@/lib/toast";

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return toast.subscribe((newToasts) => {
      setToasts(newToasts);
    });
  }, []);

  if (toasts.length === 0) return null;

  const getAlertClass = (type: string) => {
    switch (type) {
      case "success": return "alert-success text-white";
      case "error": return "alert-error text-white";
      case "warning": return "alert-warning text-black";
      default: return "alert-info text-white";
    }
  };

  return (
    <div className="toast toast-top toast-end z-50 p-4 space-y-2 mt-16 max-w-sm w-full">
      {toasts.map((t) => (
        <div key={t.id} className={`alert shadow-lg flex justify-between items-center text-sm py-3 ${getAlertClass(t.type)}`}>
          <span>{t.message}</span>
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="btn btn-ghost btn-circle btn-xs hover:bg-black/10 ml-2"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
