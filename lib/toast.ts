type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

type ToastListener = (toasts: ToastMessage[]) => void;

class ToastManager {
  private toasts: ToastMessage[] = [];
  private listeners: Set<ToastListener> = new Set();

  public subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  public show(message: string, type: ToastType = "info", duration = 4000) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast = { id, message, type };
    this.toasts.push(toast);
    this.notify();

    setTimeout(() => {
      this.dismiss(id);
    }, duration);
  }

  public success(message: string, duration?: number) {
    this.show(message, "success", duration);
  }

  public error(message: string, duration?: number) {
    this.show(message, "error", duration);
  }

  public info(message: string, duration?: number) {
    this.show(message, "info", duration);
  }

  public warning(message: string, duration?: number) {
    this.show(message, "warning", duration);
  }

  public dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }
}

export const toast = new ToastManager();
