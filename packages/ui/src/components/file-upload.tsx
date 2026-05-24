"use client";

import {
  Cancel01Icon,
  CloudUploadIcon,
  File01Icon,
  Image01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import {
  DropZone,
  type DropZoneProps,
  FileTrigger,
} from "react-aria-components";
import { cn } from "../utils/index";
import { Button } from "./button";

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

/**
 * CVA recipe that controls the size of the `FileUpload` dropzone area.
 *
 * @remarks
 * Three sizes are offered — `sm`, `default`, and `lg` — which scale the
 * vertical padding of the dropzone and the cloud icon. Pair with the
 * `size` prop on `FileUpload`.
 */
const fileUploadVariants = cva(
  "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-input border-dashed bg-background text-center transition-colors",
  {
    variants: {
      size: {
        sm: "px-4 py-6",
        default: "px-6 py-10",
        lg: "px-8 py-14",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Format a byte count as a human-readable string.
 *
 * @remarks
 * Chooses the most readable unit among B, KB, MB, and GB and formats the
 * value to one decimal place. Values below 1 KB are shown as whole bytes
 * (no decimal).
 *
 * @example
 * ```ts
 * formatBytes(0);       // "0 B"
 * formatBytes(1024);    // "1.0 KB"
 * formatBytes(1536);    // "1.5 KB"
 * formatBytes(1048576); // "1.0 MB"
 * ```
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Derive the leading icon to show for a file based on its MIME type.
 *
 * @remarks
 * Returns `Image01Icon` for image files (`image/*`) and `File01Icon` for
 * everything else.
 */
function iconFor(file: File): typeof Image01Icon {
  if (file.type.startsWith("image/")) {
    return Image01Icon;
  }
  return File01Icon;
}

/**
 * Build a stable React key for a `File` object.
 *
 * Combines name, size, and last-modified timestamp so that two files with
 * the same name but different content produce distinct keys.
 */
function fileKey(file: File, index: number): string {
  return `${file.name}-${file.size}-${file.lastModified}-${index}`;
}

/**
 * Return an appropriate cloud-upload icon size (in pixels) for the given
 * dropzone size variant. Extracted to avoid nested ternary expressions.
 */
function dropzoneIconSize(
  size: "sm" | "default" | "lg" | null | undefined
): number {
  if (size === "lg") {
    return 40;
  }
  if (size === "sm") {
    return 24;
  }
  return 32;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

interface ValidationResult {
  accepted: File[];
  rejectedMessage?: string;
}

/**
 * Check whether a single file's MIME type matches the `accept` list.
 *
 * @remarks
 * The matching strategy (in priority order):
 * 1. Exact MIME match — `"image/png"` matches `"image/png"`.
 * 2. Wildcard MIME match — `"image/*"` matches any `"image/…"` type.
 * 3. Extension match — `".png"` matches a file whose name ends with `.png`
 *    (case-insensitive). This covers cases where the browser cannot
 *    determine the MIME type from the file itself.
 *
 * If `accept` is empty or undefined every file is considered acceptable.
 */
function matchesAccept(file: File, accept: string[]): boolean {
  if (accept.length === 0) {
    return true;
  }

  return accept.some((pattern) => {
    // Wildcard family: "image/*"
    if (pattern.endsWith("/*")) {
      const family = pattern.slice(0, -2);
      return file.type.startsWith(`${family}/`);
    }
    // Extension pattern: ".png"
    if (pattern.startsWith(".")) {
      return file.name.toLowerCase().endsWith(pattern.toLowerCase());
    }
    // Exact MIME: "image/png"
    return file.type === pattern;
  });
}

/**
 * Validate a list of candidate files against size and type constraints.
 *
 * @param candidates - Files to validate.
 * @param accept - Accepted MIME types / file extensions (empty = any).
 * @param maxSize - Maximum bytes per file (undefined = no limit).
 * @returns An object with `accepted` files and an optional `rejectedMessage`
 *   describing the **first** rejection reason encountered.
 */
function validateFiles(
  candidates: File[],
  accept: string[],
  maxSize: number | undefined
): ValidationResult {
  const accepted: File[] = [];
  let rejectedMessage: string | undefined;

  for (const file of candidates) {
    if (maxSize !== undefined && file.size > maxSize) {
      if (rejectedMessage === undefined) {
        rejectedMessage = `${file.name} exceeds the maximum size`;
      }
      continue;
    }

    if (!matchesAccept(file, accept)) {
      if (rejectedMessage === undefined) {
        rejectedMessage = `${file.name} is not an accepted file type`;
      }
      continue;
    }

    accepted.push(file);
  }

  return { accepted, rejectedMessage };
}

// ---------------------------------------------------------------------------
// FileUploadItem
// ---------------------------------------------------------------------------

/** Props for the {@link FileUploadItem} component. */
export interface FileUploadItemProps {
  /** Additional class names applied to the list item element. */
  className?: string;
  /** The `File` object to display. */
  file: File;
  /** Called when the user clicks the remove button. */
  onRemove?: () => void;
}

/**
 * A single row in the file list, showing the file's icon, name, size,
 * and a remove button.
 *
 * @remarks
 * This component is intentionally presentational — it receives a `File`
 * and an optional `onRemove` callback, and renders a styled `<li>` with:
 * - A leading icon (`Image01Icon` for images, `File01Icon` for everything
 *   else), rendered via `HugeiconsIcon`.
 * - The file name (truncated with `truncate` when it overflows).
 * - The human-readable file size via `formatBytes`.
 * - A ghost remove `Button` carrying `aria-label="Remove <filename>"`.
 *
 * @example
 * ```tsx
 * <FileUploadItem
 *   file={myFile}
 *   onRemove={() => removeFile(myFile)}
 * />
 * ```
 */
export function FileUploadItem({
  file,
  onRemove,
  className,
}: FileUploadItemProps) {
  const Icon = iconFor(file);

  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-md border border-input bg-background px-3 py-2",
        className
      )}
      data-slot="file-upload-item"
    >
      {/* Leading file-type icon */}
      <span className="shrink-0 text-muted-foreground">
        <HugeiconsIcon icon={Icon} size={18} />
      </span>

      {/* File info */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground text-sm">
          {file.name}
        </p>
        <p className="text-muted-foreground text-xs">
          {formatBytes(file.size)}
        </p>
      </div>

      {/* Remove button */}
      {onRemove !== undefined && (
        <Button
          aria-label={`Remove ${file.name}`}
          className="shrink-0"
          onClick={onRemove}
          size="icon-sm"
          variant="ghost"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={14} />
        </Button>
      )}
    </li>
  );
}

// ---------------------------------------------------------------------------
// FileUpload
// ---------------------------------------------------------------------------

/** Props for the {@link FileUpload} component. */
export interface FileUploadProps
  extends Omit<DropZoneProps, "onDrop" | "children" | "className">,
    VariantProps<typeof fileUploadVariants> {
  /**
   * Accepted MIME types and/or file extensions (e.g. `["image/png", ".pdf"]`).
   * Passed to the OS file picker via `FileTrigger` and used for client-side
   * validation. When omitted every file type is accepted.
   */
  accept?: string[];

  /** Additional class names applied to the outer wrapper `<div>`. */
  className?: string;

  /**
   * Initial file list for uncontrolled usage.
   *
   * @defaultValue []
   */
  defaultValue?: File[];

  /** Disables the entire widget (dropzone + browse button). */
  disabled?: boolean;

  /**
   * Prompt shown inside the dropzone above the "Browse files" button.
   *
   * @defaultValue "Drag & drop files here, or"
   */
  label?: React.ReactNode;

  /**
   * Maximum file size in bytes. Files exceeding this limit are rejected and
   * `onError` is called with a descriptive message.
   */
  maxSize?: number;

  /**
   * Allow selecting and dropping multiple files at once.
   *
   * @defaultValue false
   */
  multiple?: boolean;

  /**
   * Called with a human-readable message when one or more files are rejected
   * due to type or size constraints. Only the **first** rejection per drop /
   * browse interaction is reported.
   */
  onError?: (message: string) => void;

  /**
   * Called whenever the accepted file list changes — both in controlled and
   * uncontrolled mode.
   */
  onValueChange?: (files: File[]) => void;

  /**
   * Controlled file list. When provided the component is in controlled mode
   * and `onValueChange` must update this value externally.
   */
  value?: File[];
}

/**
 * A drag-and-drop file upload zone with an optional file browser trigger.
 *
 * @remarks
 * Built on React Aria Components `DropZone` and `FileTrigger`, so it is
 * fully keyboard- and screen-reader-accessible out of the box.
 *
 * ### Controlled vs. uncontrolled
 * Pass `value` + `onValueChange` for controlled mode. Omit `value` (optionally
 * supply `defaultValue`) for uncontrolled mode — the component manages its own
 * internal list and still calls `onValueChange` on every change.
 *
 * ### Validation
 * Accepted file types are constrained by `accept` and `maxSize`. The first
 * rejected file per interaction triggers `onError`.
 *
 * ### Deduplication
 * In `multiple` mode incoming files are appended and deduplicated by
 * `name + size`. In single-file mode the existing list is replaced.
 *
 * @example
 * ```tsx
 * // Uncontrolled, single file
 * <FileUpload
 *   accept={["image/*"]}
 *   maxSize={5 * 1024 * 1024}
 *   onValueChange={(files) => console.log(files)}
 *   onError={(msg) => alert(msg)}
 * />
 *
 * // Controlled, multiple files
 * const [files, setFiles] = React.useState<File[]>([]);
 * <FileUpload
 *   multiple
 *   value={files}
 *   onValueChange={setFiles}
 * />
 * ```
 */
export function FileUpload({
  accept = [],
  multiple = false,
  maxSize,
  value,
  defaultValue = [],
  onValueChange,
  onError,
  disabled = false,
  size,
  className,
  label = "Drag & drop files here, or",
  ...dropZoneProps
}: FileUploadProps) {
  // Internal state — only used in uncontrolled mode.
  const [internalFiles, setInternalFiles] =
    React.useState<File[]>(defaultValue);

  // Resolve the active file list: controlled takes priority.
  const files = value === undefined ? internalFiles : value;

  /**
   * Commit a new file list — updates internal state (uncontrolled) and always
   * calls `onValueChange`.
   */
  function commit(nextFiles: File[]): void {
    if (value === undefined) {
      setInternalFiles(nextFiles);
    }
    onValueChange?.(nextFiles);
  }

  /**
   * Merge validated candidates into the current list.
   * In single-file mode the list is replaced. In multiple mode new files are
   * appended and deduplicated by `name + size`.
   */
  function mergeFiles(candidates: File[]): void {
    const { accepted, rejectedMessage } = validateFiles(
      candidates,
      accept,
      maxSize
    );

    if (rejectedMessage !== undefined) {
      onError?.(rejectedMessage);
    }

    if (accepted.length === 0) {
      return;
    }

    if (!multiple) {
      commit([accepted[0]]);
      return;
    }

    // Append + dedupe by name+size
    const existing = new Set(files.map((f) => `${f.name}-${f.size}`));
    const fresh = accepted.filter((f) => !existing.has(`${f.name}-${f.size}`));
    commit([...files, ...fresh]);
  }

  /** Handle files dropped onto the dropzone. */
  async function handleDrop(
    e: Parameters<NonNullable<DropZoneProps["onDrop"]>>[0]
  ): Promise<void> {
    const fileItems = e.items.filter((item) => item.kind === "file");
    const resolved = await Promise.all(
      fileItems.map((item) =>
        (item as { kind: "file"; getFile: () => Promise<File> }).getFile()
      )
    );
    mergeFiles(resolved);
  }

  /** Handle files selected via the OS picker. */
  function handleSelect(fileList: FileList | null): void {
    if (fileList === null) {
      return;
    }
    mergeFiles(Array.from(fileList));
  }

  /** Remove a file by its index in the list. */
  function removeFile(index: number): void {
    commit(files.filter((_, i) => i !== index));
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      data-slot="file-upload"
    >
      {/* Drop zone */}
      <DropZone
        {...dropZoneProps}
        className={(renderProps) =>
          cn(
            fileUploadVariants({ size }),
            renderProps.isDropTarget && "border-ring bg-accent"
          )
        }
        data-slot="file-upload-dropzone"
        isDisabled={disabled}
        onDrop={handleDrop}
      >
        {/* Cloud upload icon */}
        <span className="text-muted-foreground">
          <HugeiconsIcon icon={CloudUploadIcon} size={dropzoneIconSize(size)} />
        </span>

        {/* Prompt label */}
        <p className="text-muted-foreground text-sm">{label}</p>

        {/* Browse button */}
        <FileTrigger
          acceptedFileTypes={accept.length > 0 ? accept : undefined}
          allowsMultiple={multiple}
          onSelect={handleSelect}
        >
          <Button disabled={disabled} size="sm" variant="outline">
            Browse files
          </Button>
        </FileTrigger>
      </DropZone>

      {/* File list — hidden when empty */}
      {files.length > 0 && (
        <ul
          aria-label="Selected files"
          className="flex flex-col gap-2"
          data-slot="file-upload-list"
        >
          {files.map((file, index) => (
            <FileUploadItem
              file={file}
              key={fileKey(file, index)}
              onRemove={() => removeFile(index)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { fileUploadVariants, formatBytes };
