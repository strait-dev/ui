import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock Sonner's imperative API so we can assert the wrappers delegate to it.
const sonnerToast = Object.assign(vi.fn(), {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  loading: vi.fn(),
  promise: vi.fn(),
  dismiss: vi.fn(),
});

vi.mock("sonner", () => ({ toast: sonnerToast }));

const { toast } = await import("./toast");

describe("toast", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("delegates success/error/warning/info/loading to the matching Sonner method", () => {
    toast.success("Saved");
    toast.error("Failed");
    toast.warning("Careful");
    toast.info("Heads up");
    toast.loading("Working");

    expect(sonnerToast.success).toHaveBeenCalledWith("Saved", undefined);
    expect(sonnerToast.error).toHaveBeenCalledWith("Failed", undefined);
    expect(sonnerToast.warning).toHaveBeenCalledWith("Careful", undefined);
    expect(sonnerToast.info).toHaveBeenCalledWith("Heads up", undefined);
    expect(sonnerToast.loading).toHaveBeenCalledWith("Working", undefined);
  });

  it("passes through description and maps the action option", () => {
    const onClick = vi.fn();
    toast.success("Saved", {
      description: "All good",
      action: { label: "Undo", onClick },
    });

    expect(sonnerToast.success).toHaveBeenCalledWith("Saved", {
      description: "All good",
      action: { label: "Undo", onClick },
    });
  });

  it("delegates promise to Sonner and resolves to the original promise value", async () => {
    const promise = Promise.resolve({ name: "report.pdf" });
    const result = toast.promise(promise, {
      loading: "Uploading…",
      success: (data) => `${data.name} uploaded`,
      error: "Upload failed",
    });

    expect(sonnerToast.promise).toHaveBeenCalledOnce();
    await expect(result).resolves.toEqual({ name: "report.pdf" });
  });

  it("builds a confirm toast with native action and cancel buttons", () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    toast.confirm("Delete?", {
      confirmLabel: "Delete",
      cancelLabel: "Keep",
      onConfirm,
      onCancel,
    });

    expect(sonnerToast).toHaveBeenCalledOnce();
    const [title, options] = sonnerToast.mock.calls[0] as [
      string,
      {
        action: { label: string; onClick: () => void };
        cancel: { label: string; onClick: () => void };
      },
    ];
    expect(title).toBe("Delete?");
    expect(options.action.label).toBe("Delete");
    expect(options.cancel.label).toBe("Keep");

    options.action.onClick();
    expect(onConfirm).toHaveBeenCalledOnce();

    options.cancel.onClick();
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("routes a rejected async confirm handler to onError", async () => {
    const error = new Error("boom");
    const onError = vi.fn();
    toast.confirm("Delete?", {
      onConfirm: () => Promise.reject(error),
      onError,
    });

    const [, options] = sonnerToast.mock.calls[0] as [
      string,
      { action: { onClick: () => void } },
    ];
    options.action.onClick();
    // Allow the rejected promise's catch handler to run.
    await Promise.resolve();
    expect(onError).toHaveBeenCalledWith(error);
  });

  it("uses default confirm/cancel labels when omitted", () => {
    toast.confirm("Proceed?", { onConfirm: vi.fn() });

    const [, options] = sonnerToast.mock.calls[0] as [
      string,
      { action: { label: string }; cancel: { label: string } },
    ];
    expect(options.action.label).toBe("Confirm");
    expect(options.cancel.label).toBe("Cancel");
  });
});
