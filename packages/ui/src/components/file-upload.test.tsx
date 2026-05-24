import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { FileUpload, FileUploadItem, fileUploadVariants } from "./file-upload";

// ---------------------------------------------------------------------------
// jsdom polyfills required by React Aria Components
// ---------------------------------------------------------------------------
beforeAll(() => {
  globalThis.ResizeObserver ||= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Element.prototype.scrollIntoView ||= () => {};
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeFile(
  name: string,
  size: number,
  type = "image/png",
  lastModified = 1_700_000_000_000
): File {
  const content = "x".repeat(size);
  const file = new File([content], name, { type, lastModified });
  // File.size is read-only and derived from the blob content, but for small
  // test files this matches naturally.
  return file;
}

const photo = makeFile("photo.png", 1024, "image/png");
const doc = makeFile("document.pdf", 2048, "application/pdf");

// ---------------------------------------------------------------------------
// FileUpload — structural tests
// ---------------------------------------------------------------------------

describe("FileUpload", () => {
  it("renders the root wrapper with data-slot='file-upload'", () => {
    render(<FileUpload />);
    const root = document.querySelector("[data-slot='file-upload']");
    expect(root).toBeInTheDocument();
  });

  it("renders the dropzone with data-slot='file-upload-dropzone'", () => {
    render(<FileUpload />);
    const zone = document.querySelector("[data-slot='file-upload-dropzone']");
    expect(zone).toBeInTheDocument();
  });

  it("renders a 'Browse files' button inside the dropzone", () => {
    render(<FileUpload />);
    const btn = screen.getByRole("button", { name: /browse files/i });
    expect(btn).toBeInTheDocument();
  });

  it("does not render the file list when no files are selected", () => {
    render(<FileUpload />);
    const list = document.querySelector("[data-slot='file-upload-list']");
    expect(list).toBeNull();
  });

  it("renders one FileUploadItem per file in value", () => {
    render(<FileUpload value={[photo, doc]} />);
    const items = document.querySelectorAll("[data-slot='file-upload-item']");
    expect(items).toHaveLength(2);
  });

  it("renders the file list when files are present", () => {
    render(<FileUpload value={[photo]} />);
    const list = document.querySelector("[data-slot='file-upload-list']");
    expect(list).toBeInTheDocument();
  });

  it("shows the file name and formatted size for each file", () => {
    render(<FileUpload value={[photo]} />);
    expect(screen.getByText("photo.png")).toBeInTheDocument();
    // photo has 1024 bytes → "1.0 KB"
    expect(screen.getByText("1.0 KB")).toBeInTheDocument();
  });

  it("calls onValueChange with the file removed when the remove button is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<FileUpload onValueChange={handleChange} value={[photo, doc]} />);

    const removeBtn = screen.getByRole("button", {
      name: `Remove ${photo.name}`,
    });
    await user.click(removeBtn);

    expect(handleChange).toHaveBeenCalledOnce();
    // Only doc should remain
    const [remaining] = handleChange.mock.calls[0] as [File[]];
    expect(remaining).toHaveLength(1);
    expect(remaining[0]?.name).toBe("document.pdf");
  });

  it("applies the 'sm' size variant class to the dropzone", () => {
    render(<FileUpload size="sm" />);
    const zone = document.querySelector("[data-slot='file-upload-dropzone']");
    expect(zone?.className).toContain("py-6");
  });

  it("applies the 'lg' size variant class to the dropzone", () => {
    render(<FileUpload size="lg" />);
    const zone = document.querySelector("[data-slot='file-upload-dropzone']");
    expect(zone?.className).toContain("py-14");
  });

  it("applies disabled styling to the root when disabled", () => {
    render(<FileUpload disabled />);
    const root = document.querySelector("[data-slot='file-upload']");
    expect(root?.className).toContain("pointer-events-none");
    expect(root?.className).toContain("opacity-50");
  });
});

// ---------------------------------------------------------------------------
// FileUploadItem
// ---------------------------------------------------------------------------

describe("FileUploadItem", () => {
  it("renders with data-slot='file-upload-item'", () => {
    render(<FileUploadItem file={photo} />);
    const item = document.querySelector("[data-slot='file-upload-item']");
    expect(item).toBeInTheDocument();
  });

  it("displays the file name", () => {
    render(<FileUploadItem file={doc} />);
    expect(screen.getByText("document.pdf")).toBeInTheDocument();
  });

  it("displays the formatted file size", () => {
    // doc has 2048 bytes → "2.0 KB"
    render(<FileUploadItem file={doc} />);
    expect(screen.getByText("2.0 KB")).toBeInTheDocument();
  });

  it("calls onRemove when the remove button is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<FileUploadItem file={photo} onRemove={onRemove} />);
    await user.click(
      screen.getByRole("button", { name: `Remove ${photo.name}` })
    );
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("does not render a remove button when onRemove is not provided", () => {
    render(<FileUploadItem file={photo} />);
    expect(
      screen.queryByRole("button", { name: `Remove ${photo.name}` })
    ).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// fileUploadVariants helper
// ---------------------------------------------------------------------------

describe("fileUploadVariants", () => {
  it("includes 'py-10' for the default size", () => {
    expect(fileUploadVariants({ size: "default" })).toContain("py-10");
  });

  it("includes 'py-6' for the sm size", () => {
    expect(fileUploadVariants({ size: "sm" })).toContain("py-6");
  });

  it("includes 'py-14' for the lg size", () => {
    expect(fileUploadVariants({ size: "lg" })).toContain("py-14");
  });
});

// ---------------------------------------------------------------------------
// formatBytes — indirect assertion via rendered text
// ---------------------------------------------------------------------------

describe("formatBytes (via rendered text)", () => {
  it("shows '1.0 KB' for a 1024-byte file", () => {
    const f = makeFile("test.txt", 1024, "text/plain");
    render(<FileUploadItem file={f} />);
    expect(screen.getByText("1.0 KB")).toBeInTheDocument();
  });

  it("shows '0 B' for an empty file", () => {
    const f = new File([], "empty.txt", { type: "text/plain" });
    render(<FileUploadItem file={f} />);
    expect(screen.getByText("0 B")).toBeInTheDocument();
  });
});
