import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { FileUpload } from "./file-upload";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a synthetic File for seeding stories. */
function makeFile(name: string, sizeBytes: number, type: string): File {
  return new File(["x".repeat(sizeBytes)], name, { type });
}

const sampleImage = makeFile("profile-photo.png", 204_800, "image/png");
const samplePdf = makeFile(
  "onboarding-guide.pdf",
  1_048_576,
  "application/pdf"
);

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "Forms/File Upload",
  component: FileUpload,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A drag-and-drop file upload zone built on React Aria Components `DropZone`",
          "and `FileTrigger`, with an optional OS file-picker trigger.",
          "",
          "### Features",
          "- Controlled **and** uncontrolled modes via `value` / `defaultValue` + `onValueChange`.",
          "- Per-file removal with stable keys (no index-only keys).",
          "- Client-side validation: `accept` (MIME types + extensions) and `maxSize` (bytes).",
          "- Three sizes: `sm`, `default`, `lg`.",
          "- Fully keyboard- and screen-reader-accessible.",
          "",
          "### Key props",
          "- **`accept`** — `string[]` of MIME types / extensions (e.g. `['image/*', '.pdf']`).",
          "- **`multiple`** — allow more than one file.",
          "- **`maxSize`** — maximum file size in bytes.",
          "- **`value` / `onValueChange`** — controlled file list.",
          "- **`defaultValue`** — initial list for uncontrolled usage.",
          "- **`onError`** — callback for validation failures.",
          "- **`disabled`** — disables the entire widget.",
          "- **`label`** — custom prompt text inside the dropzone.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    multiple: {
      control: "boolean",
      description: "Allow multiple files to be selected or dropped.",
      table: { defaultValue: { summary: "false" } },
    },
    disabled: {
      control: "boolean",
      description: "Disable the dropzone and browse button.",
      table: { defaultValue: { summary: "false" } },
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "Controls dropzone padding and icon size.",
      table: { defaultValue: { summary: "default" } },
    },
    maxSize: {
      control: "number",
      description: "Maximum file size in bytes.",
    },
    label: {
      control: "text",
      description: "Prompt text shown inside the dropzone.",
    },
  },
  args: {
    multiple: false,
    disabled: false,
    size: "default",
  },
} satisfies Meta<typeof FileUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * Interactive playground — toggle `multiple`, `disabled`, and `size` in the
 * controls panel. Files selected via "Browse files" appear in the list below
 * the dropzone.
 */
export const Playground: Story = {
  render: (args) => (
    <div className="max-w-md">
      <FileUpload {...args} />
    </div>
  ),
};

function MultipleDemo(args: React.ComponentProps<typeof FileUpload>) {
  const [files, setFiles] = React.useState<File[]>([sampleImage, samplePdf]);

  return (
    <div className="max-w-md">
      <FileUpload {...args} multiple onValueChange={setFiles} value={files} />
    </div>
  );
}

/**
 * Controlled multiple-file mode, pre-seeded with two files.
 * New files can be added via browse or drag-and-drop; each row has a remove
 * button.
 */
export const Multiple: Story = {
  render: (args) => <MultipleDemo {...args} />,
};

/**
 * All three size variants side-by-side so you can compare the dropzone
 * heights and icon scaling.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col gap-8">
      <div>
        <p className="mb-2 font-medium text-muted-foreground text-sm">
          size="sm"
        </p>
        <FileUpload label="Drag & drop files here, or" size="sm" />
      </div>
      <div>
        <p className="mb-2 font-medium text-muted-foreground text-sm">
          size="default"
        </p>
        <FileUpload label="Drag & drop files here, or" size="default" />
      </div>
      <div>
        <p className="mb-2 font-medium text-muted-foreground text-sm">
          size="lg"
        </p>
        <FileUpload label="Drag & drop files here, or" size="lg" />
      </div>
    </div>
  ),
};

function WithMaxSizeDemo() {
  const [files, setFiles] = React.useState<File[]>([]);

  return (
    <div className="max-w-md">
      <FileUpload
        label="Max 500 KB per file — drag & drop or"
        maxSize={500 * 1024}
        multiple
        onError={(msg) => console.error("[FileUpload] Rejected:", msg)}
        onValueChange={setFiles}
        value={files}
      />
    </div>
  );
}

/**
 * File-size validation — the `maxSize` is capped at 500 KB. Try uploading a
 * larger file: the error is logged to the browser console via `onError`.
 */
export const WithMaxSize: Story = {
  render: () => <WithMaxSizeDemo />,
};

/**
 * Disabled state — the dropzone and browse button are non-interactive.
 * Pre-seeded with one file to show how the disabled list looks.
 */
export const Disabled: Story = {
  render: () => (
    <div className="max-w-md">
      <FileUpload
        disabled
        label="Drag & drop files here, or"
        value={[sampleImage]}
      />
    </div>
  ),
};

function ImagesOnlyDemo() {
  const [files, setFiles] = React.useState<File[]>([]);

  return (
    <div className="max-w-md">
      <FileUpload
        accept={["image/*"]}
        label="Drop images here, or"
        multiple
        onError={(msg) => console.error("[FileUpload] Rejected:", msg)}
        onValueChange={setFiles}
        value={files}
      />
    </div>
  );
}

/**
 * Restricted to images only — passing `accept={["image/*"]}` filters both the
 * OS file picker and drag-and-drop validation.
 */
export const ImagesOnly: Story = {
  render: () => <ImagesOnlyDemo />,
};
