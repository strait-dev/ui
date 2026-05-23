import { type ExternalToast, toast as sonnerToast } from "sonner";
import type {
  BaseToastOptions,
  ConfirmToastOptions,
  PromiseToastOptions,
  Toast,
} from "./types";

const DEFAULT_CONFIRM_LABEL = "Confirm";
const DEFAULT_CANCEL_LABEL = "Cancel";

/** Map the design-system options onto Sonner's native `ExternalToast` shape. */
function toExternal(options?: BaseToastOptions): ExternalToast | undefined {
  if (!options) {
    return;
  }
  const { action, ...rest } = options;
  return action ? { ...rest, action } : rest;
}

/** Run a confirm handler, routing both sync and async failures to `onError`. */
function runConfirm(options: ConfirmToastOptions): void {
  try {
    const result = options.onConfirm();
    if (result instanceof Promise) {
      result.catch((error: unknown) => options.onError?.(error));
    }
  } catch (error) {
    options.onError?.(error);
  }
}

/**
 * Thin, strongly-typed wrapper around Sonner's imperative `toast` API.
 *
 * Each method renders Sonner's built-in styled toast (themed by
 * {@link Toaster}); there is no custom renderer. `confirm` is the only
 * composite — it builds a prompt from Sonner's native `action`/`cancel`
 * buttons.
 *
 * @remarks
 * - `success/error/warning/info` accept an optional `action`
 *   (`{ label, onClick }`) that renders an inline button.
 * - `loading` stays visible until dismissed or replaced (e.g. by `promise`).
 * - `promise` delegates to Sonner's native promise toast and resolves to the
 *   original promise's value so you can keep awaiting it.
 * - `dismiss()` closes a specific toast by id, or all toasts when called with
 *   no argument.
 *
 * @example
 * ```ts
 * import { toast } from "@strait/ui/toast";
 *
 * toast.success("File saved");
 * toast.error("Upload failed", { description: "Check your network." });
 * toast.confirm("Delete this item?", { onConfirm: () => remove() });
 * ```
 */
export const toast: Toast = {
  success: (title, options) => sonnerToast.success(title, toExternal(options)),

  error: (title, options) => sonnerToast.error(title, toExternal(options)),

  warning: (title, options) => sonnerToast.warning(title, toExternal(options)),

  info: (title, options) => sonnerToast.info(title, toExternal(options)),

  loading: (title, options) => sonnerToast.loading(title, toExternal(options)),

  promise: <T,>(
    promise: Promise<T>,
    options: PromiseToastOptions<T>
  ): Promise<T> => {
    sonnerToast.promise(promise, {
      loading: options.loading,
      success: options.success,
      error: options.error,
    });
    return promise;
  },

  confirm: (title, options) =>
    sonnerToast(title, {
      description: options.description,
      duration: options.duration ?? Number.POSITIVE_INFINITY,
      action: {
        label: options.confirmLabel ?? DEFAULT_CONFIRM_LABEL,
        onClick: () => runConfirm(options),
      },
      cancel: {
        label: options.cancelLabel ?? DEFAULT_CANCEL_LABEL,
        onClick: () => options.onCancel?.(),
      },
    }),

  dismiss: sonnerToast.dismiss,
};
