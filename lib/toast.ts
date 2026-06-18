"use client";

export type ToastKind = "success" | "error" | "info" | "warning";

export interface ToastEvent {
  id: string;
  kind: ToastKind;
  message: string;
  duration?: number;
}

type Listener = (event: ToastEvent) => void;

const listeners = new Set<Listener>();

export function subscribeToasts(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit(event: ToastEvent) {
  listeners.forEach((fn) => fn(event));
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export const toast = {
  success(message: string, duration = 3500) {
    emit({ id: makeId(), kind: "success", message, duration });
  },
  error(message: string, duration = 5000) {
    emit({ id: makeId(), kind: "error", message, duration });
  },
  info(message: string, duration = 3500) {
    emit({ id: makeId(), kind: "info", message, duration });
  },
  warning(message: string, duration = 4000) {
    emit({ id: makeId(), kind: "warning", message, duration });
  },
};
