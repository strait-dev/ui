import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  QRCode,
  QRCodeDownload,
  QRCodeOverlay,
  QRCodeSkeleton,
} from "./qr-code";

const meta = {
  title: "Data Display/QR Code",
  component: QRCode,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A composable QR code component built on `qrcode.react`.",
          "",
          "The `<QRCode>` root renders an SVG QR code and provides context to",
          "sub-components via React context. Use the following building blocks:",
          "",
          "- **`<QRCode>`** — root; renders the SVG and exposes `--qr-code-size`.",
          '- **`<QRCodeOverlay>`** — absolutely-centred logo patch (use `level="H"`).',
          "- **`<QRCodeDownload>`** — button that downloads the QR as SVG or PNG.",
          "- **`<QRCodeSkeleton>`** — pulsing placeholder while data loads.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    value: {
      control: "text",
      description: "Data to encode (URL, plain text, etc.).",
    },
    size: {
      control: { type: "number", min: 64, max: 512, step: 8 },
      description: "Pixel dimensions of the QR code square.",
      table: { defaultValue: { summary: "160" } },
    },
    level: {
      control: "select",
      options: ["L", "M", "Q", "H"],
      description:
        "Reed–Solomon error-correction level. Use `H` when adding an overlay.",
      table: { defaultValue: { summary: "M" } },
    },
    bgColor: {
      control: "color",
      description: "Background colour of the QR code.",
    },
    fgColor: {
      control: "color",
      description: "Foreground (module) colour of the QR code.",
    },
    margin: {
      control: { type: "number", min: 0, max: 10 },
      description: "Quiet-zone margin in QR modules (not pixels).",
      table: { defaultValue: { summary: "0" } },
    },
  },
  args: {
    value: "https://example.com",
    size: 160,
    level: "M",
    margin: 0,
  },
} satisfies Meta<typeof QRCode>;

export default meta;

type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * Interactive playground — adjust `value`, `size`, `level`, and colours
 * in the controls panel.
 */
export const Playground: Story = {};

/**
 * Centre overlay at `level="H"` (30 % error correction) so the logo
 * occludes ~25 % of modules without breaking scannability.
 */
export const WithOverlay: Story = {
  args: {
    value: "https://example.com",
    size: 200,
    level: "H",
  },
  render: (args) => (
    <QRCode {...args}>
      <QRCodeOverlay>
        {/* Placeholder logo — replace with your <img src="…" /> */}
        <div className="flex size-full items-center justify-center rounded bg-primary font-bold text-[8px] text-primary-foreground">
          LOGO
        </div>
      </QRCodeOverlay>
    </QRCode>
  ),
};

/** Download button beneath the QR code — exports as SVG by default. */
export const WithDownloadButton: Story = {
  args: {
    value: "https://example.com",
    size: 160,
  },
  render: (args) => (
    <div className="flex flex-col items-center gap-3">
      <QRCode {...args}>
        <QRCodeDownload filename="my-qrcode" size="sm" variant="outline" />
      </QRCode>
    </div>
  ),
};

/** Download as PNG — only works in a real browser (not jsdom). */
export const DownloadPNG: Story = {
  args: {
    value: "https://example.com",
    size: 200,
  },
  render: (args) => (
    <div className="flex flex-col items-center gap-3">
      <QRCode {...args}>
        <QRCodeDownload
          filename="my-qrcode"
          format="png"
          size="sm"
          variant="secondary"
        >
          Download PNG
        </QRCodeDownload>
      </QRCode>
    </div>
  ),
};

/** Pulsing skeleton placeholder while QR code data is loading. */
export const SkeletonLoading: Story = {
  render: () => (
    <div
      aria-busy="true"
      aria-label="Loading QR code"
      className="inline-block"
      role="status"
    >
      <QRCodeSkeleton size={160} />
    </div>
  ),
};

/**
 * All four error-correction levels side-by-side.
 * Higher levels produce denser codes but survive more damage / occlusion.
 */
export const ErrorCorrectionLevels: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {(["L", "M", "Q", "H"] as const).map((level) => (
        <div className="flex flex-col items-center gap-2" key={level}>
          <QRCode level={level} size={140} value="https://example.com" />
          <span className="font-mono text-muted-foreground text-sm">
            level="{level}"
          </span>
        </div>
      ))}
    </div>
  ),
};

/**
 * Custom foreground and background colours — brand the QR to match your
 * design system palette.
 */
export const CustomColours: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <QRCode
        bgColor="#f0f0ff"
        fgColor="#6366f1"
        size={160}
        value="https://example.com"
      />
      <QRCode
        bgColor="#f8fafc"
        fgColor="#0f172a"
        size={160}
        value="https://example.com"
      />
      <QRCode
        bgColor="#000000"
        fgColor="#ffffff"
        size={160}
        value="https://example.com"
      />
    </div>
  ),
};

/**
 * Full composition — overlay + download button in a single `<QRCode>` tree.
 */
export const FullComposition: Story = {
  args: {
    value: "https://example.com",
    size: 200,
    level: "H",
  },
  render: (args) => (
    <div className="flex flex-col items-center gap-4">
      <QRCode {...args}>
        <QRCodeOverlay>
          <div className="flex size-full items-center justify-center rounded bg-primary font-bold text-[8px] text-primary-foreground">
            LOGO
          </div>
        </QRCodeOverlay>
        <QRCodeDownload
          className="absolute -bottom-10"
          filename="full-composition"
          size="sm"
          variant="outline"
        />
      </QRCode>
    </div>
  ),
};
