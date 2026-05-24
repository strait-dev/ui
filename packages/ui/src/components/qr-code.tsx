"use client";

import { Download04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { QRCodeSVG } from "qrcode.react";
import type React from "react";
import { createContext, useContext, useRef } from "react";

import { cn } from "../utils/index";
import { Button } from "./button";
import { Skeleton } from "./skeleton";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface QRCodeContextValue {
  size: number;
  svgRef: React.RefObject<SVGSVGElement | null>;
  value: string;
}

const QRCodeContext = createContext<QRCodeContextValue | null>(null);

function useQRCodeContext(): QRCodeContextValue {
  const ctx = useContext(QRCodeContext);
  if (!ctx) {
    throw new Error(
      "QRCode sub-components must be rendered inside a <QRCode> root."
    );
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// QRCode
// ---------------------------------------------------------------------------

/** Props for {@link QRCode}. */
export interface QRCodeProps
  extends Omit<
    React.ComponentProps<"div">,
    "children" | "className" | "style"
  > {
  /** Background colour for the QR code modules. Defaults to the library default (`#ffffff`). */
  bgColor?: string;
  /** Nested content — typically {@link QRCodeOverlay} and/or {@link QRCodeDownload}. */
  children?: React.ReactNode;
  /** Additional CSS classes applied to the wrapper `<div>`. */
  className?: string;
  /** Foreground colour for the QR code modules. Defaults to the library default (`#000000`). */
  fgColor?: string;
  /**
   * Reed–Solomon error-correction level.
   * - `"L"` — 7 % correction (highest data density)
   * - `"M"` — 15 % correction (default)
   * - `"Q"` — 25 % correction
   * - `"H"` — 30 % correction (lowest data density — required when using {@link QRCodeOverlay})
   * @defaultValue "M"
   */
  level?: "L" | "M" | "Q" | "H";
  /**
   * Quiet-zone margin expressed in QR *modules* (not pixels).
   * @defaultValue 0
   */
  margin?: number;
  /**
   * Pixel size of the rendered QR code square.
   * @defaultValue 160
   */
  size?: number;
  /** Inline style overrides for the wrapper `<div>`. */
  style?: React.CSSProperties;
  /** The data to encode into the QR code (e.g. a URL or plain text). */
  value: string;
}

/**
 * Root component that renders an SVG QR code and provides context to all
 * child sub-components.
 *
 * @remarks
 * The wrapper `<div>` exposes a `--qr-code-size` CSS custom property so that
 * child components can size themselves relative to the QR code without
 * prop-drilling. To place a logo in the centre use {@link QRCodeOverlay}
 * and set `level="H"` (30 % error correction) so the code remains scannable
 * after the logo occludes ~25 % of the modules.
 *
 * @example
 * ```tsx
 * <QRCode value="https://example.com" size={200} level="H">
 *   <QRCodeOverlay>
 *     <img src="/logo.svg" alt="Logo" className="size-full object-contain" />
 *   </QRCodeOverlay>
 *   <QRCodeDownload filename="my-qr" />
 * </QRCode>
 * ```
 */
function QRCode({
  value,
  size = 160,
  level = "M",
  bgColor,
  fgColor,
  margin = 0,
  className,
  style,
  children,
  ...props
}: QRCodeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <QRCodeContext.Provider value={{ svgRef, value, size }}>
      <div
        className={cn(
          "relative inline-flex items-center justify-center",
          className
        )}
        data-slot="qr-code"
        style={
          {
            ["--qr-code-size" as string]: `${size}px`,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        <QRCodeSVG
          level={level}
          ref={svgRef}
          size={size}
          value={value}
          {...(bgColor === undefined ? {} : { bgColor })}
          {...(fgColor === undefined ? {} : { fgColor })}
          marginSize={margin}
        />
        {children}
      </div>
    </QRCodeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// QRCodeOverlay
// ---------------------------------------------------------------------------

/** Props for {@link QRCodeOverlay}. */
export interface QRCodeOverlayProps extends React.ComponentProps<"div"> {
  /** Logo, icon, or any content to display centred over the QR code. */
  children?: React.ReactNode;
}

/**
 * Absolutely-centred overlay for placing a logo or icon on top of the QR code.
 *
 * @remarks
 * The overlay is sized to 25 % of `--qr-code-size` (the parent {@link QRCode}
 * root's dimension). A centre logo occupies roughly 25 % of the QR code
 * surface, which exceeds the `"L"` and `"M"` error-correction thresholds.
 * **Always use `level="H"` on the parent `<QRCode>` when rendering an
 * overlay**, otherwise the code may become unreadable.
 *
 * @example
 * ```tsx
 * <QRCode value="https://example.com" level="H" size={200}>
 *   <QRCodeOverlay>
 *     <img src="/logo.svg" alt="" className="size-full object-contain" />
 *   </QRCodeOverlay>
 * </QRCode>
 * ```
 */
function QRCodeOverlay({
  className,
  children,
  style,
  ...props
}: QRCodeOverlayProps) {
  return (
    <div
      className={cn(
        "absolute flex items-center justify-center rounded-md bg-background p-1 shadow-sm",
        className
      )}
      data-slot="qr-code-overlay"
      style={{
        width: "calc(var(--qr-code-size) * 0.25)",
        height: "calc(var(--qr-code-size) * 0.25)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// QRCodeDownload
// ---------------------------------------------------------------------------

/** Props for {@link QRCodeDownload}. */
export interface QRCodeDownloadProps
  extends React.ComponentProps<typeof Button> {
  /**
   * Base filename (without extension) for the downloaded file.
   * @defaultValue "qrcode"
   */
  filename?: string;
  /**
   * Export format.
   * - `"svg"` — lossless vector, works in all environments.
   * - `"png"` — rasterised at the QR code's native `size`.
   * @defaultValue "svg"
   */
  format?: "svg" | "png";
}

/**
 * A button that downloads the QR code as either an SVG or PNG file.
 *
 * @remarks
 * Reads the shared {@link QRCodeContext} for the underlying `<svg>` reference
 * and the `size` value. The SVG is serialised with `XMLSerializer`; PNG export
 * draws the SVG onto a `<canvas>` before converting to a Blob. Both paths
 * trigger a programmatic `<a download>` click and revoke the object URL
 * immediately after.
 *
 * No-ops gracefully when `svgRef.current` is `null` (e.g. during SSR or
 * before the first paint).
 *
 * @example
 * ```tsx
 * <QRCode value="https://example.com">
 *   <QRCodeDownload filename="my-qr" format="png" />
 * </QRCode>
 * ```
 */
function QRCodeDownload({
  filename = "qrcode",
  format = "svg",
  children,
  onClick,
  ...props
}: QRCodeDownloadProps) {
  const { svgRef, size } = useQRCodeContext();

  function triggerDownload(url: string, name: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleClick(
    event: Parameters<NonNullable<QRCodeDownloadProps["onClick"]>>[0]
  ) {
    onClick?.(event);
    if (!svgRef.current) {
      return;
    }

    const svgEl = svgRef.current;
    const serialized = new XMLSerializer().serializeToString(svgEl);

    if (format === "svg") {
      const blob = new Blob([serialized], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, `${filename}.svg`);
      return;
    }

    // PNG — requires a real browser canvas; no-op in jsdom.
    if (typeof HTMLCanvasElement === "undefined") {
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const img = new Image();
    const svgBlob = new Blob([serialized], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (!blob) {
          return;
        }
        const pngUrl = URL.createObjectURL(blob);
        triggerDownload(pngUrl, `${filename}.png`);
      }, "image/png");
    };
    img.src = url;
  }

  return (
    <Button onClick={handleClick} {...props}>
      {children ?? (
        <>
          <HugeiconsIcon icon={Download04Icon} />
          Download
        </>
      )}
    </Button>
  );
}

// ---------------------------------------------------------------------------
// QRCodeSkeleton
// ---------------------------------------------------------------------------

/** Props for {@link QRCodeSkeleton}. */
export interface QRCodeSkeletonProps extends React.ComponentProps<"div"> {
  /**
   * Pixel size of the skeleton square — should match the intended {@link QRCode} `size`.
   * @defaultValue 160
   */
  size?: number;
}

/**
 * Pulsing placeholder displayed while the QR code data is being fetched or
 * the component is suspended.
 *
 * @remarks
 * Wrap a group of skeletons in a container with `aria-busy="true"` and
 * `aria-label="Loading…"` for screen-reader compatibility.
 *
 * @example
 * ```tsx
 * <div aria-busy="true" aria-label="Loading QR code">
 *   <QRCodeSkeleton size={200} />
 * </div>
 * ```
 */
function QRCodeSkeleton({
  size = 160,
  className,
  style,
  ...props
}: QRCodeSkeletonProps) {
  return (
    <Skeleton
      className={cn("rounded-lg", className)}
      data-slot="qr-code-skeleton"
      style={{ width: size, height: size, ...style }}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { QRCode, QRCodeDownload, QRCodeOverlay, QRCodeSkeleton };
