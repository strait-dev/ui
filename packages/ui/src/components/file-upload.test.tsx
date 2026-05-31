import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadList,
  type FileWithPreview,
  formatBytes,
  useFileUpload,
} from "./file-upload";

beforeAll(() => {
  // jsdom lacks object-URL helpers used for image previews.
  globalThis.URL.createObjectURL ||= () => "blob:mock";
  globalThis.URL.revokeObjectURL ||= () => {
    // no-op
  };
});

function makeFile(name: string, type = "text/plain", size = 10): File {
  const file = new File(["x".repeat(size)], name, { type });
  // Pin size for predictable assertions.
  Object.defineProperty(file, "size", { value: size });
  return file;
}

function makePreviewFile(name: string): FileWithPreview {
  return { file: makeFile(name), id: name };
}

describe("FileUpload", () => {
  it("renders a dropzone with data-slot='file-upload-dropzone'", () => {
    render(<FileUpload />);
    expect(
      document.querySelector("[data-slot='file-upload-dropzone']")
    ).toBeInTheDocument();
  });

  it("applies the size variant to the dropzone", () => {
    render(<FileUpload size="sm" />);
    expect(
      document.querySelector("[data-slot='file-upload-dropzone']")
    ).toHaveClass("py-6");
  });

  it("merges a custom className onto the wrapper", () => {
    render(<FileUpload className="custom-class" />);
    expect(document.querySelector("[data-slot='file-upload']")).toHaveClass(
      "custom-class"
    );
  });

  it("disables the browse button when disabled", () => {
    render(<FileUpload disabled />);
    expect(screen.getByRole("button", { name: "Browse files" })).toBeDisabled();
  });

  it("adds a selected file to the list", () => {
    render(<FileUpload />);
    const input =
      document.querySelector<HTMLInputElement>("input[type='file']");
    expect(input).not.toBeNull();
    act(() => {
      fireEvent.change(input as HTMLInputElement, {
        target: { files: [makeFile("notes.txt")] },
      });
    });
    expect(screen.getByText("notes.txt")).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='file-upload-item']")
    ).toBeInTheDocument();
  });
});

describe("FileUploadDropzone", () => {
  it("reflects the dragging state via data-dragging", () => {
    render(<FileUploadDropzone dragging>drop</FileUploadDropzone>);
    expect(
      document.querySelector("[data-slot='file-upload-dropzone']")
    ).toHaveAttribute("data-dragging", "true");
  });
});

describe("FileUploadList", () => {
  it("renders a labelled list", () => {
    render(<FileUploadList />);
    expect(screen.getByRole("list")).toHaveAttribute(
      "aria-label",
      "Selected files"
    );
  });
});

describe("FileUploadItem", () => {
  it("shows the file name and size", () => {
    render(<FileUploadItem file={makePreviewFile("report.pdf")} />);
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
    expect(screen.getByText("10 B")).toBeInTheDocument();
  });

  it("calls onRemove when the remove button is clicked", () => {
    const onRemove = vi.fn();
    render(
      <FileUploadItem
        file={makePreviewFile("report.pdf")}
        onRemove={onRemove}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Remove report.pdf" }));
    expect(onRemove).toHaveBeenCalledOnce();
  });
});

describe("formatBytes", () => {
  it("formats common magnitudes", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(1024 * 1024)).toBe("1.0 MB");
  });
});

describe("useFileUpload", () => {
  it("replaces the file in single mode", () => {
    const { result } = renderHook(() => useFileUpload());
    act(() => result.current[1].addFiles([makeFile("a.txt")]));
    act(() => result.current[1].addFiles([makeFile("b.txt")]));
    expect(result.current[0].files).toHaveLength(1);
    expect(result.current[0].files[0]?.file.name).toBe("b.txt");
  });

  it("appends and dedupes in multiple mode", () => {
    const { result } = renderHook(() => useFileUpload({ multiple: true }));
    act(() => result.current[1].addFiles([makeFile("a.txt")]));
    act(() =>
      result.current[1].addFiles([makeFile("a.txt"), makeFile("c.txt")])
    );
    expect(result.current[0].files.map((f) => f.file.name)).toEqual([
      "a.txt",
      "c.txt",
    ]);
  });

  it("rejects files that exceed maxSize", () => {
    const onError = vi.fn();
    const { result } = renderHook(() => useFileUpload({ maxSize: 5, onError }));
    act(() =>
      result.current[1].addFiles([makeFile("big.txt", "text/plain", 10)])
    );
    expect(result.current[0].files).toHaveLength(0);
    expect(result.current[0].errors).toHaveLength(1);
    expect(onError).toHaveBeenCalled();
  });

  it("removes a file by id", () => {
    const { result } = renderHook(() => useFileUpload({ multiple: true }));
    act(() => result.current[1].addFiles([makeFile("a.txt")]));
    const id = result.current[0].files[0]?.id as string;
    act(() => result.current[1].removeFile(id));
    expect(result.current[0].files).toHaveLength(0);
  });
});
