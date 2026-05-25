"use client";

import {
  Cancel01Icon,
  CloudUploadIcon,
  File01Icon,
  Image01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../utils/index";
import { Button } from "./button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Metadata describing a file that already exists on the server, used to seed
 * the upload list (via `initialFiles`) without a local `File` object.
 */
export type FileMetadata = {
  /** Stable identifier for the file. */
  id: string;
  /** Display name. */
  name: string;
  /** Size in bytes. */
  size: number;
  /** MIME type (e.g. `"image/png"`). */
  type: string;
  /** Remote URL used as the preview source. */
  url: string;
};

/**
 * A file tracked by {@link useFileUpload} — either a freshly selected local
 * `File` or a pre-existing {@link FileMetadata} record, paired with a stable
 * id and an optional preview URL.
 */
export type FileWithPreview = {
  /** The underlying local `File` or remote {@link FileMetadata}. */
  file: File | FileMetadata;
  /** Stable identifier, used as the React key and for removal. */
  id: string;
  /** Object URL (local images) or remote URL used to render a thumbnail. */
  preview?: string;
};

/** Configuration options for {@link useFileUpload}. */
export type FileUploadOptions = {
  /**
   * Accepted MIME types and/or extensions as a comma-separated string
   * (e.g. `"image/*,.pdf"`). `"*"` accepts everything.
   *
   * @defaultValue "*"
   */
  accept?: string;
  /** Files to seed the list with on mount. */
  initialFiles?: FileMetadata[];
  /**
   * Maximum number of files, only enforced when `multiple` is `true`.
   *
   * @defaultValue Infinity
   */
  maxFiles?: number;
  /**
   * Maximum size per file in bytes.
   *
   * @defaultValue Infinity
   */
  maxSize?: number;
  /**
   * Allow selecting and dropping more than one file.
   *
   * @defaultValue false
   */
  multiple?: boolean;
  /** Called with the newly added files whenever files are added. */
  onFilesAdded?: (addedFiles: FileWithPreview[]) => void;
  /** Called with the full list whenever it changes (add or remove). */
  onFilesChange?: (files: FileWithPreview[]) => void;
  /** Called with human-readable messages when files are rejected. */
  onError?: (errors: string[]) => void;
};

/** Reactive state returned by {@link useFileUpload}. */
export type FileUploadState = {
  /** Validation messages from the most recent interaction. */
  errors: string[];
  /** The current list of tracked files. */
  files: FileWithPreview[];
  /** Whether a drag is currently hovering the drop target. */
  isDragging: boolean;
};

/** Imperative actions returned by {@link useFileUpload}. */
export type FileUploadActions = {
  /** Validate and add files from a `FileList` or array. */
  addFiles: (files: FileList | File[]) => void;
  /** Clear the current validation errors. */
  clearErrors: () => void;
  /** Remove every file and revoke any object URLs. */
  clearFiles: () => void;
  /** Build props for a hidden `<input type="file">`, including a `ref`. */
  getInputProps: (
    props?: React.ComponentProps<"input">
  ) => React.ComponentProps<"input"> & {
    ref: React.Ref<HTMLInputElement>;
  };
  /** `dragenter` handler that marks the drop target active. */
  handleDragEnter: (e: React.DragEvent<HTMLElement>) => void;
  /** `dragleave` handler that clears the active state when leaving. */
  handleDragLeave: (e: React.DragEvent<HTMLElement>) => void;
  /** `dragover` handler that allows the drop. */
  handleDragOver: (e: React.DragEvent<HTMLElement>) => void;
  /** `drop` handler that adds the dropped files. */
  handleDrop: (e: React.DragEvent<HTMLElement>) => void;
  /** Open the OS file picker. */
  openFileDialog: () => void;
  /** Remove a single file by its id, revoking its object URL. */
  removeFile: (id: string) => void;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Format a byte count as a human-readable string.
 *
 * @remarks
 * Chooses the most readable unit among B, KB, MB, and GB and formats the
 * value to one decimal place. Values below 1 KB are shown as whole bytes.
 *
 * @example
 * ```ts
 * formatBytes(0);       // "0 B"
 * formatBytes(1536);    // "1.5 KB"
 * formatBytes(1048576); // "1.0 MB"
 * ```
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }
  if (!Number.isFinite(bytes)) {
    return "∞";
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

/** Stable dedupe key for a file, combining its name and size. */
function dedupeKey(file: File | FileMetadata): string {
  return `${file.name}-${file.size}`;
}

/** Derive the leading icon for a file based on its MIME type. */
function iconFor(file: File | FileMetadata): typeof Image01Icon {
  if (file.type.startsWith("image/")) {
    return Image01Icon;
  }
  return File01Icon;
}

/** Generate a unique id for a freshly selected `File`. */
function uniqueId(file: File | FileMetadata): string {
  if (file instanceof File) {
    return `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
  return file.id;
}

/** Create an object-URL preview for local image files only. */
function previewFor(file: File | FileMetadata): string | undefined {
  if (file instanceof File) {
    return file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : undefined;
  }
  return file.url;
}

/** Revoke object URLs for any local image previews in the list. */
function revokePreviews(files: FileWithPreview[]): void {
  for (const item of files) {
    if (
      item.preview &&
      item.file instanceof File &&
      item.file.type.startsWith("image/")
    ) {
      URL.revokeObjectURL(item.preview);
    }
  }
}

/** Check whether a file matches a comma-separated `accept` string. */
function fileMatchesAccept(file: File | FileMetadata, accept: string): boolean {
  const types = accept
    .split(",")
    .map((type) => type.trim())
    .filter(Boolean);
  if (types.length === 0) {
    return true;
  }
  const fileType = file.type || "";
  const extension = `.${file.name.split(".").pop() ?? ""}`;

  return types.some((type) => {
    if (type.startsWith(".")) {
      return extension.toLowerCase() === type.toLowerCase();
    }
    if (type.endsWith("/*")) {
      return fileType.startsWith(type.slice(0, -1));
    }
    return fileType === type;
  });
}

/** Validate a single file, returning an error message or `null`. */
function validateFile(
  file: File | FileMetadata,
  accept: string,
  maxSize: number
): string | null {
  if (file.size > maxSize) {
    return `File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`;
  }
  if (accept !== "*" && !fileMatchesAccept(file, accept)) {
    return `File "${file.name}" is not an accepted file type.`;
  }
  return null;
}

interface ProcessOptions {
  accept: string;
  existing: FileWithPreview[];
  maxFiles: number;
  maxSize: number;
  multiple: boolean;
}

/** Validate incoming files against the current list and constraints. */
function processIncoming(
  incoming: File[],
  { accept, existing, maxFiles, maxSize, multiple }: ProcessOptions
): { errors: string[]; valid: FileWithPreview[] } {
  if (
    multiple &&
    maxFiles !== Number.POSITIVE_INFINITY &&
    existing.length + incoming.length > maxFiles
  ) {
    return {
      errors: [`You can only upload a maximum of ${maxFiles} files.`],
      valid: [],
    };
  }

  const errors: string[] = [];
  const valid: FileWithPreview[] = [];
  const seen = new Set(existing.map((item) => dedupeKey(item.file)));

  for (const file of incoming) {
    if (multiple && seen.has(dedupeKey(file))) {
      continue;
    }
    const error = validateFile(file, accept, maxSize);
    if (error) {
      errors.push(error);
      continue;
    }
    seen.add(dedupeKey(file));
    valid.push({ file, id: uniqueId(file), preview: previewFor(file) });
  }

  return { errors, valid };
}

// ---------------------------------------------------------------------------
// useFileUpload
// ---------------------------------------------------------------------------

/**
 * Headless file-upload hook built on native File / drag-and-drop APIs.
 *
 * @remarks
 * Returns a `[state, actions]` tuple. Wire `actions` up to your own markup —
 * the {@link FileUpload} component is a styled default, but custom layouts
 * (avatars, galleries, tables) compose the hook directly.
 *
 * @example
 * ```tsx
 * const [{ files, isDragging }, actions] = useFileUpload({ accept: "image/*" });
 * return (
 *   <div onDragOver={actions.handleDragOver} onDrop={actions.handleDrop}>
 *     <input {...actions.getInputProps()} className="sr-only" />
 *     <button onClick={actions.openFileDialog}>Browse</button>
 *   </div>
 * );
 * ```
 */
export function useFileUpload(
  options: FileUploadOptions = {}
): [FileUploadState, FileUploadActions] {
  const {
    accept = "*",
    initialFiles = [],
    maxFiles = Number.POSITIVE_INFINITY,
    maxSize = Number.POSITIVE_INFINITY,
    multiple = false,
    onFilesAdded,
    onFilesChange,
    onError,
  } = options;

  const [state, setState] = React.useState<FileUploadState>(() => ({
    errors: [],
    files: initialFiles.map((file) => ({
      file,
      id: file.id,
      preview: file.url,
    })),
    isDragging: false,
  }));

  const inputRef = React.useRef<HTMLInputElement>(null);

  const addFiles = React.useCallback(
    (incoming: FileList | File[]) => {
      if (!incoming || incoming.length === 0) {
        return;
      }
      const list = Array.from(incoming);
      const candidates = multiple ? list : list.slice(0, 1);

      setState((prev) => {
        const existing = multiple ? prev.files : [];
        if (!multiple) {
          revokePreviews(prev.files);
        }
        const { valid, errors } = processIncoming(candidates, {
          accept,
          existing,
          maxFiles,
          maxSize,
          multiple,
        });
        const files = multiple ? [...prev.files, ...valid] : valid;

        if (valid.length > 0) {
          onFilesAdded?.(valid);
        }
        if (valid.length > 0 || errors.length > 0) {
          onFilesChange?.(files);
        }
        if (errors.length > 0) {
          onError?.(errors);
        }
        return { ...prev, errors, files };
      });

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [accept, maxFiles, maxSize, multiple, onError, onFilesAdded, onFilesChange]
  );

  const removeFile = React.useCallback(
    (id: string) => {
      setState((prev) => {
        const target = prev.files.find((item) => item.id === id);
        if (target) {
          revokePreviews([target]);
        }
        const files = prev.files.filter((item) => item.id !== id);
        onFilesChange?.(files);
        return { ...prev, errors: [], files };
      });
    },
    [onFilesChange]
  );

  const clearFiles = React.useCallback(() => {
    setState((prev) => {
      revokePreviews(prev.files);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      onFilesChange?.([]);
      return { ...prev, errors: [], files: [] };
    });
  }, [onFilesChange]);

  const clearErrors = React.useCallback(() => {
    setState((prev) => ({ ...prev, errors: [] }));
  }, []);

  const handleDragEnter = React.useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setState((prev) => ({ ...prev, isDragging: true }));
    },
    []
  );

  const handleDragLeave = React.useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.currentTarget.contains(e.relatedTarget as Node)) {
        return;
      }
      setState((prev) => ({ ...prev, isDragging: false }));
    },
    []
  );

  const handleDragOver = React.useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
    },
    []
  );

  const handleDrop = React.useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setState((prev) => ({ ...prev, isDragging: false }));
      if (inputRef.current?.disabled) {
        return;
      }
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const handleFileChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files);
      }
    },
    [addFiles]
  );

  const openFileDialog = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  const getInputProps = React.useCallback(
    (props: React.ComponentProps<"input"> = {}) => ({
      ...props,
      accept: props.accept || accept,
      multiple: props.multiple === undefined ? multiple : props.multiple,
      onChange: handleFileChange,
      ref: inputRef,
      type: "file" as const,
    }),
    [accept, handleFileChange, multiple]
  );

  return [
    state,
    {
      addFiles,
      clearErrors,
      clearFiles,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
    },
  ];
}

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

/**
 * CVA recipe controlling the size of the {@link FileUploadDropzone} area.
 *
 * @remarks
 * Three sizes — `sm`, `default`, and `lg` — scale the dropzone padding. Pair
 * with the `size` prop on `FileUploadDropzone` or `FileUpload`.
 */
const fileUploadVariants = cva(
  "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-input border-dashed bg-background text-center outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-[dragging=true]:border-ring data-[dragging=true]:bg-accent",
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

/** Density of the dropzone area. */
export type FileUploadSize = "sm" | "default" | "lg";

/**
 * Return an appropriate cloud-upload icon size (in pixels) for the given
 * dropzone size variant.
 */
function dropzoneIconSize(size: FileUploadSize | null | undefined): number {
  if (size === "lg") {
    return 40;
  }
  if (size === "sm") {
    return 24;
  }
  return 32;
}

// ---------------------------------------------------------------------------
// FileUploadDropzone
// ---------------------------------------------------------------------------

/** Props for the {@link FileUploadDropzone} component. */
export interface FileUploadDropzoneProps extends React.ComponentProps<"div"> {
  /** Whether a drag is currently hovering — toggles the active styling. */
  isDragging?: boolean;
  /** Density of the dropzone. */
  size?: FileUploadSize;
}

/**
 * The dashed drop target. A presentational `<div>` — wire drag handlers and
 * `onClick` from {@link useFileUpload} via props.
 *
 * @example
 * ```tsx
 * <FileUploadDropzone
 *   isDragging={isDragging}
 *   onDragEnter={handleDragEnter}
 *   onDrop={handleDrop}
 *   onClick={openFileDialog}
 * >
 *   <input {...getInputProps()} className="sr-only" />
 *   Drop files here
 * </FileUploadDropzone>
 * ```
 */
export function FileUploadDropzone({
  className,
  isDragging = false,
  size = "default",
  children,
  ...props
}: FileUploadDropzoneProps) {
  return (
    <div
      className={cn(fileUploadVariants({ size }), className)}
      data-dragging={isDragging}
      data-slot="file-upload-dropzone"
      {...props}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// FileUploadList
// ---------------------------------------------------------------------------

/** Props for the {@link FileUploadList} component. */
export type FileUploadListProps = React.ComponentProps<"ul">;

/**
 * A vertical list wrapper for {@link FileUploadItem}s. Defaults to an
 * accessible label and a stacked layout.
 */
export function FileUploadList({
  className,
  "aria-label": ariaLabel = "Selected files",
  ...props
}: FileUploadListProps) {
  return (
    <ul
      aria-label={ariaLabel}
      className={cn("flex flex-col gap-2", className)}
      data-slot="file-upload-list"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// FileUploadItem
// ---------------------------------------------------------------------------

/** Props for the {@link FileUploadItem} component. */
export interface FileUploadItemProps {
  /** Additional class names applied to the list item element. */
  className?: string;
  /** The tracked file to display. */
  file: FileWithPreview;
  /** Called when the user clicks the remove button. */
  onRemove?: () => void;
}

/**
 * A single row in the file list — a thumbnail (for images) or type icon, the
 * file name, its human-readable size, and a remove button.
 */
export function FileUploadItem({
  file,
  onRemove,
  className,
}: FileUploadItemProps) {
  const { name, size } = file.file;
  const isImage = file.file.type.startsWith("image/");

  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-md border border-input bg-background px-3 py-2",
        className
      )}
      data-slot="file-upload-item"
    >
      <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground">
        {isImage && file.preview ? (
          <img
            alt={name}
            className="size-full object-cover"
            height={36}
            src={file.preview}
            width={36}
          />
        ) : (
          <HugeiconsIcon icon={iconFor(file.file)} size={18} />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground text-sm">{name}</p>
        <p className="text-muted-foreground text-xs">{formatBytes(size)}</p>
      </div>

      {onRemove !== undefined && (
        <Button
          aria-label={`Remove ${name}`}
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
export interface FileUploadProps {
  /**
   * Accepted MIME types and/or extensions as a comma-separated string
   * (e.g. `"image/*,.pdf"`). When omitted every type is accepted.
   */
  accept?: string;
  /** Additional class names applied to the outer wrapper. */
  className?: string;
  /** Files to seed the list with on mount. */
  defaultFiles?: FileMetadata[];
  /** Disables the dropzone and browse button. */
  disabled?: boolean;
  /**
   * Prompt shown inside the dropzone above the browse button.
   *
   * @defaultValue "Drag & drop files here, or"
   */
  label?: React.ReactNode;
  /** Maximum number of files (only enforced when `multiple`). */
  maxFiles?: number;
  /** Maximum size per file in bytes. */
  maxSize?: number;
  /**
   * Allow selecting and dropping multiple files.
   *
   * @defaultValue false
   */
  multiple?: boolean;
  /** Called with human-readable messages when files are rejected. */
  onError?: (errors: string[]) => void;
  /** Called with the full list whenever it changes. */
  onValueChange?: (files: FileWithPreview[]) => void;
  /** Density of the dropzone. */
  size?: FileUploadSize;
}

/**
 * A drag-and-drop file upload zone with a browse button and a file list,
 * built on the headless {@link useFileUpload} hook and native File APIs.
 *
 * @remarks
 * The component is uncontrolled — it owns its file list and reports changes
 * via `onValueChange`. For bespoke layouts (avatars, galleries, tables),
 * compose {@link useFileUpload} with your own markup instead.
 *
 * @example
 * ```tsx
 * <FileUpload
 *   accept="image/*"
 *   maxSize={5 * 1024 * 1024}
 *   multiple
 *   onValueChange={(files) => console.log(files)}
 *   onError={(errors) => console.warn(errors)}
 * />
 * ```
 */
export function FileUpload({
  accept,
  className,
  defaultFiles,
  disabled = false,
  label = "Drag & drop files here, or",
  maxFiles,
  maxSize,
  multiple = false,
  onError,
  onValueChange,
  size = "default",
}: FileUploadProps) {
  const [{ files, isDragging, errors }, actions] = useFileUpload({
    accept,
    initialFiles: defaultFiles,
    maxFiles,
    maxSize,
    multiple,
    onError,
    onFilesChange: onValueChange,
  });

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      data-slot="file-upload"
    >
      <FileUploadDropzone
        isDragging={isDragging}
        onClick={actions.openFileDialog}
        onDragEnter={actions.handleDragEnter}
        onDragLeave={actions.handleDragLeave}
        onDragOver={actions.handleDragOver}
        onDrop={actions.handleDrop}
        role="button"
        size={size}
        tabIndex={0}
      >
        <input {...actions.getInputProps({ disabled })} className="sr-only" />
        <span className="text-muted-foreground">
          <HugeiconsIcon icon={CloudUploadIcon} size={dropzoneIconSize(size)} />
        </span>
        <p className="text-muted-foreground text-sm">{label}</p>
        <Button
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            actions.openFileDialog();
          }}
          size="sm"
          type="button"
          variant="outline"
        >
          Browse files
        </Button>
      </FileUploadDropzone>

      {errors.length > 0 && (
        <p
          className="text-destructive text-sm"
          data-slot="file-upload-error"
          role="alert"
        >
          {errors[0]}
        </p>
      )}

      {files.length > 0 && (
        <FileUploadList>
          {files.map((file) => (
            <FileUploadItem
              file={file}
              key={file.id}
              onRemove={() => actions.removeFile(file.id)}
            />
          ))}
        </FileUploadList>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { fileUploadVariants, formatBytes };
