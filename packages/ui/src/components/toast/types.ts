import type { ExternalToast } from "sonner";

/** Inline action button rendered alongside a toast. */
export interface ToastAction {
  label: string;
  onClick: () => void;
}

/**
 * Options shared by `toast.success/error/warning/info/loading`.
 *
 * Extends Sonner's {@link ExternalToast} (so `duration`, `id`, `position`, …
 * pass straight through) and narrows `action`/`description` to the
 * design-system shape.
 */
export interface BaseToastOptions extends Omit<ExternalToast, "action"> {
  action?: ToastAction;
  description?: string;
  dismissible?: boolean;
  duration?: number;
}

/**
 * Options for `toast.promise` — maps directly onto Sonner's native promise
 * toast (loading → success | error).
 */
export interface PromiseToastOptions<T> {
  error: string | ((error: unknown) => string);
  loading: string;
  success: string | ((data: T) => string);
}

/**
 * Options for `toast.confirm` — a minimal confirmation prompt built from
 * Sonner's native `action` (confirm) and `cancel` buttons.
 */
export interface ConfirmToastOptions {
  cancelLabel?: string;
  confirmLabel?: string;
  description?: string;
  duration?: number;
  onCancel?: () => void;
  onConfirm: () => void | Promise<void>;
  onError?: (error: unknown) => void;
}

/** The imperative toast API. */
export interface Toast {
  confirm: (title: string, options: ConfirmToastOptions) => string | number;
  dismiss: (id?: string | number) => void;
  error: (title: string, options?: BaseToastOptions) => string | number;
  info: (title: string, options?: BaseToastOptions) => string | number;
  loading: (
    title: string,
    options?: Omit<BaseToastOptions, "action">
  ) => string | number;
  promise: <T>(
    promise: Promise<T>,
    options: PromiseToastOptions<T>
  ) => Promise<T>;
  success: (title: string, options?: BaseToastOptions) => string | number;
  warning: (title: string, options?: BaseToastOptions) => string | number;
}
