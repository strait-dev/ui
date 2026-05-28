"use client";

import {
  Cancel01Icon,
  CloudUploadIcon,
  DragDropVerticalIcon,
  Image01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { cn } from "../utils/index";
import { Button } from "./button";
import {
  FileUpload,
  FileUploadDropzone,
  type FileWithPreview,
  formatBytes,
  useFileUpload,
} from "./file-upload";
import { Progress } from "./progress";
import { Sortable, SortableItem, SortableItemHandle } from "./sortable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const meta = {
  title: "Forms/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A drag-and-drop file upload built on the headless `useFileUpload`",
          "hook and native File APIs.",
          "",
          "The `FileUpload` component is a styled default (dropzone + list). For",
          "bespoke layouts — avatars, galleries, tables, sortable grids — compose",
          "`useFileUpload` directly with the `FileUploadDropzone` part and your",
          "own markup, as the variant stories below demonstrate.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — drag files in or click to browse. */
export const Playground: Story = {
  args: {
    accept: "image/*,.pdf",
    className: "w-96",
  },
};

/** Multiple files — append, dedupe, and remove individually. */
export const Multiple: Story = {
  args: {
    className: "w-96",
    multiple: true,
  },
};

/** All three dropzone sizes — `sm`, `default`, and `lg`. */
export const Sizes: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <FileUpload key={size} label={`Size: ${size}`} size={size} />
      ))}
    </div>
  ),
};

/** Disabled — the dropzone and browse button are non-interactive. */
export const Disabled: Story = {
  args: {
    className: "w-96",
    disabled: true,
  },
};

/**
 * Validation — `accept` and `maxSize` reject non-matching files. The first
 * rejection message is shown beneath the dropzone.
 */
export const Validation: Story = {
  args: {
    accept: "image/*",
    className: "w-96",
    maxSize: 1024 * 512,
  },
};

/**
 * Avatar — a circular single-image dropzone. Composes `useFileUpload` with a
 * round drop target and an overlaid remove button.
 */
export const Avatar: Story = {
  render: () => {
    function AvatarUpload() {
      const [{ files, isDragging }, actions] = useFileUpload({
        accept: "image/*",
      });
      const current = files[0];

      return (
        <div className="flex flex-col items-center gap-3">
          <button
            className={cn(
              "relative size-24 overflow-hidden rounded-full border-2 border-input border-dashed transition-colors",
              isDragging && "border-ring bg-accent"
            )}
            onClick={actions.openFileDialog}
            onDragEnter={actions.handleDragEnter}
            onDragLeave={actions.handleDragLeave}
            onDragOver={actions.handleDragOver}
            onDrop={actions.handleDrop}
            type="button"
          >
            <input {...actions.getInputProps()} className="sr-only" />
            {current?.preview ? (
              <img
                alt={current.file.name}
                className="size-full object-cover"
                height={96}
                src={current.preview}
                width={96}
              />
            ) : (
              <span className="flex size-full items-center justify-center text-muted-foreground">
                <HugeiconsIcon icon={Image01Icon} size={28} />
              </span>
            )}
          </button>
          {current ? (
            <Button
              onClick={() => actions.removeFile(current.id)}
              size="sm"
              variant="outline"
            >
              Remove
            </Button>
          ) : (
            <p className="text-muted-foreground text-xs">Upload an avatar</p>
          )}
        </div>
      );
    }
    return <AvatarUpload />;
  },
};

/**
 * Compact — an inline dropzone with a horizontal thumbnail strip, suited to
 * dense toolbars.
 */
export const Compact: Story = {
  render: () => {
    function CompactUpload() {
      const [{ files, isDragging }, actions] = useFileUpload({
        accept: "image/*",
        multiple: true,
      });

      return (
        // biome-ignore lint/a11y/noStaticElementInteractions: drop zone; the actionable control is the inner browse button.
        // biome-ignore lint/a11y/noNoninteractiveElementInteractions: drop zone; the actionable control is the inner browse button.
        <div
          className={cn(
            "flex w-[28rem] items-center gap-3 rounded-lg border border-input border-dashed p-3 transition-colors",
            isDragging && "border-ring bg-accent"
          )}
          onDragEnter={actions.handleDragEnter}
          onDragLeave={actions.handleDragLeave}
          onDragOver={actions.handleDragOver}
          onDrop={actions.handleDrop}
        >
          <input {...actions.getInputProps()} className="sr-only" />
          <Button onClick={actions.openFileDialog} size="sm" variant="outline">
            <HugeiconsIcon icon={CloudUploadIcon} size={16} />
            Browse
          </Button>
          <div className="flex flex-1 items-center gap-2 overflow-x-auto">
            {files.length === 0 ? (
              <span className="text-muted-foreground text-sm">
                Drop images here
              </span>
            ) : (
              files.map((file) => (
                <div className="group/item relative shrink-0" key={file.id}>
                  <img
                    alt={file.file.name}
                    className="size-12 rounded-md border border-input object-cover"
                    height={48}
                    src={file.preview}
                    width={48}
                  />
                  <button
                    className="absolute -end-1.5 -top-1.5 hidden size-5 items-center justify-center rounded-full bg-foreground text-background group-hover/item:flex"
                    onClick={() => actions.removeFile(file.id)}
                    type="button"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      );
    }
    return <CompactUpload />;
  },
};

/** Gallery — an image grid with hover-to-remove and a clear-all action. */
export const Gallery: Story = {
  render: () => {
    function GalleryUpload() {
      const [{ files, isDragging }, actions] = useFileUpload({
        accept: "image/*",
        multiple: true,
      });

      return (
        <div className="w-[40rem] space-y-4">
          <FileUploadDropzone
            isDragging={isDragging}
            onClick={actions.openFileDialog}
            onDragEnter={actions.handleDragEnter}
            onDragLeave={actions.handleDragLeave}
            onDragOver={actions.handleDragOver}
            onDrop={actions.handleDrop}
            role="button"
            tabIndex={0}
          >
            <input {...actions.getInputProps()} className="sr-only" />
            <span className="text-muted-foreground">
              <HugeiconsIcon icon={CloudUploadIcon} size={32} />
            </span>
            <p className="text-muted-foreground text-sm">
              Drag & drop images, or click to browse
            </p>
          </FileUploadDropzone>

          {files.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                {files.length} image{files.length === 1 ? "" : "s"}
              </span>
              <Button onClick={actions.clearFiles} size="sm" variant="ghost">
                Clear all
              </Button>
            </div>
          )}

          <div className="grid grid-cols-4 gap-3">
            {files.map((file) => (
              <div className="group/item relative aspect-square" key={file.id}>
                <img
                  alt={file.file.name}
                  className="size-full rounded-lg border border-input object-cover"
                  height={150}
                  src={file.preview}
                  width={150}
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-foreground/50 opacity-0 transition-opacity group-hover/item:opacity-100">
                  <Button
                    onClick={() => actions.removeFile(file.id)}
                    size="icon-sm"
                    variant="secondary"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return <GalleryUpload />;
  },
};

/** Progress — a list of cards each showing a simulated upload progress bar. */
export const WithProgress: Story = {
  render: () => {
    function ProgressUpload() {
      const [files, setFiles] = useState<FileWithPreview[]>([]);
      const [progress, setProgress] = useState<Record<string, number>>({});
      const [{ isDragging }, actions] = useFileUpload({
        multiple: true,
        onFilesChange: setFiles,
      });

      useEffect(() => {
        const timer = window.setInterval(() => {
          setProgress((prev) => {
            const next = { ...prev };
            let changed = false;
            for (const file of files) {
              const value = next[file.id] ?? 0;
              if (value < 100) {
                next[file.id] = Math.min(100, value + 10);
                changed = true;
              }
            }
            return changed ? next : prev;
          });
        }, 300);
        return () => window.clearInterval(timer);
      }, [files]);

      return (
        <div className="w-[32rem] space-y-4">
          <FileUploadDropzone
            isDragging={isDragging}
            onClick={actions.openFileDialog}
            onDragEnter={actions.handleDragEnter}
            onDragLeave={actions.handleDragLeave}
            onDragOver={actions.handleDragOver}
            onDrop={actions.handleDrop}
            role="button"
            tabIndex={0}
          >
            <input {...actions.getInputProps()} className="sr-only" />
            <span className="text-muted-foreground">
              <HugeiconsIcon icon={CloudUploadIcon} size={32} />
            </span>
            <p className="text-muted-foreground text-sm">
              Drag & drop files to upload
            </p>
          </FileUploadDropzone>

          <div className="space-y-2">
            {files.map((file) => (
              <div
                className="rounded-lg border border-input bg-background p-3"
                key={file.id}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-sm">
                    {file.file.name}
                  </span>
                  <span className="shrink-0 text-muted-foreground text-xs">
                    {formatBytes(file.file.size)}
                  </span>
                </div>
                <Progress size="sm" value={progress[file.id] ?? 0} />
              </div>
            ))}
          </div>
        </div>
      );
    }
    return <ProgressUpload />;
  },
};

/** Table — files listed in a data table with type, size, and remove action. */
export const TableList: Story = {
  render: () => {
    function TableUpload() {
      const [{ files, isDragging }, actions] = useFileUpload({
        multiple: true,
      });

      return (
        <div className="w-[40rem] space-y-4">
          <FileUploadDropzone
            isDragging={isDragging}
            onClick={actions.openFileDialog}
            onDragEnter={actions.handleDragEnter}
            onDragLeave={actions.handleDragLeave}
            onDragOver={actions.handleDragOver}
            onDrop={actions.handleDrop}
            role="button"
            size="sm"
            tabIndex={0}
          >
            <input {...actions.getInputProps()} className="sr-only" />
            <span className="text-muted-foreground">
              <HugeiconsIcon icon={CloudUploadIcon} size={24} />
            </span>
            <p className="text-muted-foreground text-sm">Add files</p>
          </FileUploadDropzone>

          {files.length > 0 && (
            <div className="rounded-lg border border-input">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">
                        {file.file.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {file.file.type || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatBytes(file.file.size)}
                      </TableCell>
                      <TableCell>
                        <Button
                          aria-label={`Remove ${file.file.name}`}
                          onClick={() => actions.removeFile(file.id)}
                          size="icon-sm"
                          variant="ghost"
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      );
    }
    return <TableUpload />;
  },
};

/** Cover image — a full-width banner dropzone with a hover action overlay. */
export const CoverImage: Story = {
  render: () => {
    function CoverUpload() {
      const [{ files, isDragging }, actions] = useFileUpload({
        accept: "image/*",
      });
      const current = files[0];

      return (
        <div className="w-[40rem]">
          {/* biome-ignore lint/a11y/noStaticElementInteractions: drop zone; the actionable controls are the inner buttons. */}
          {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: drop zone; the actionable controls are the inner buttons. */}
          <div
            className={cn(
              "group relative aspect-[21/9] overflow-hidden rounded-xl border border-input border-dashed transition-colors",
              isDragging && "border-ring bg-accent"
            )}
            onDragEnter={actions.handleDragEnter}
            onDragLeave={actions.handleDragLeave}
            onDragOver={actions.handleDragOver}
            onDrop={actions.handleDrop}
          >
            <input {...actions.getInputProps()} className="sr-only" />
            {current?.preview ? (
              <>
                <img
                  alt={current.file.name}
                  className="size-full object-cover"
                  height={300}
                  src={current.preview}
                  width={700}
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/0 opacity-0 transition group-hover:bg-foreground/40 group-hover:opacity-100">
                  <Button
                    onClick={actions.openFileDialog}
                    size="sm"
                    variant="secondary"
                  >
                    Change cover
                  </Button>
                  <Button
                    onClick={() => actions.removeFile(current.id)}
                    size="sm"
                    variant="destructive"
                  >
                    Remove
                  </Button>
                </div>
              </>
            ) : (
              <button
                className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground"
                onClick={actions.openFileDialog}
                type="button"
              >
                <HugeiconsIcon icon={Image01Icon} size={32} />
                <span className="text-sm">Upload a cover image</span>
              </button>
            )}
          </div>
        </div>
      );
    }
    return <CoverUpload />;
  },
};

type GalleryImage = { id: string; src: string };

const seedImages: GalleryImage[] = [
  { id: "img-1", src: "https://picsum.photos/seed/strait1/240/240" },
  { id: "img-2", src: "https://picsum.photos/seed/strait2/240/240" },
  { id: "img-3", src: "https://picsum.photos/seed/strait3/240/240" },
  { id: "img-4", src: "https://picsum.photos/seed/strait4/240/240" },
];

/**
 * Sortable — a reorderable image grid that composes the `Sortable` component.
 * Drag the handle to reorder; uploaded files are appended to the grid.
 */
export const SortableGrid: Story = {
  render: () => {
    function SortableUpload() {
      const [images, setImages] = useState<GalleryImage[]>(seedImages);
      const [, actions] = useFileUpload({
        accept: "image/*",
        multiple: true,
        onFilesAdded: (added) => {
          setImages((prev) => [
            ...prev,
            ...added.map((file) => ({
              id: file.id,
              src: file.preview ?? "",
            })),
          ]);
        },
      });

      return (
        <div className="w-[40rem] space-y-4">
          <Sortable
            getItemValue={(item) => item.id}
            onValueChange={setImages}
            strategy="grid"
            value={images}
          >
            <div className="grid grid-cols-4 gap-3">
              {images.map((item) => (
                <SortableItem key={item.id} value={item.id}>
                  <div className="group/item relative aspect-square rounded-lg border border-input bg-accent/40">
                    <img
                      alt=""
                      className="pointer-events-none size-full rounded-lg object-cover"
                      height={150}
                      src={item.src}
                      width={150}
                    />
                    <SortableItemHandle className="absolute start-2 top-2 cursor-grab opacity-0 transition-opacity group-hover/item:opacity-100">
                      <Button size="icon-sm" variant="secondary">
                        <HugeiconsIcon icon={DragDropVerticalIcon} size={14} />
                      </Button>
                    </SortableItemHandle>
                    <Button
                      className="absolute end-2 top-2 opacity-0 transition-opacity group-hover/item:opacity-100"
                      onClick={() =>
                        setImages((prev) =>
                          prev.filter((image) => image.id !== item.id)
                        )
                      }
                      size="icon-sm"
                      variant="secondary"
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={14} />
                    </Button>
                  </div>
                </SortableItem>
              ))}
            </div>
          </Sortable>

          <Button onClick={actions.openFileDialog} size="sm" variant="outline">
            <input {...actions.getInputProps()} className="sr-only" />
            <HugeiconsIcon icon={CloudUploadIcon} size={16} />
            Add images
          </Button>
        </div>
      );
    }
    return <SortableUpload />;
  },
};
