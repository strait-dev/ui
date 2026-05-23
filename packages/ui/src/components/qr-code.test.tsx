import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  QRCode,
  QRCodeDownload,
  QRCodeOverlay,
  QRCodeSkeleton,
} from "./qr-code";

// ---------------------------------------------------------------------------
// QRCode (root + SVG)
// ---------------------------------------------------------------------------

describe("QRCode", () => {
  it("renders a wrapper div with data-slot='qr-code'", () => {
    const { container } = render(<QRCode value="https://example.com" />);
    const wrapper = container.querySelector("[data-slot='qr-code']");
    expect(wrapper).not.toBeNull();
  });

  it("renders an <svg> inside the wrapper", () => {
    const { container } = render(<QRCode value="https://example.com" />);
    const svg = container.querySelector("[data-slot='qr-code'] svg");
    expect(svg).not.toBeNull();
  });

  it("passes size to the SVG's width and height attributes", () => {
    const { container } = render(
      <QRCode size={200} value="https://example.com" />
    );
    const svg = container.querySelector("[data-slot='qr-code'] svg");
    expect(svg).not.toBeNull();
    // QRCodeSVG sets width/height as attributes
    expect(svg?.getAttribute("width")).toBe("200");
    expect(svg?.getAttribute("height")).toBe("200");
  });

  it("exposes --qr-code-size CSS custom property on the wrapper", () => {
    const { container } = render(
      <QRCode size={120} value="https://example.com" />
    );
    const wrapper = container.querySelector<HTMLDivElement>(
      "[data-slot='qr-code']"
    );
    expect(wrapper).not.toBeNull();
    expect(wrapper?.style.getPropertyValue("--qr-code-size")).toBe("120px");
  });

  it("accepts additional className", () => {
    const { container } = render(
      <QRCode className="custom-class" value="https://example.com" />
    );
    const wrapper = container.querySelector("[data-slot='qr-code']");
    expect(wrapper?.classList.contains("custom-class")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// QRCodeOverlay
// ---------------------------------------------------------------------------

describe("QRCodeOverlay", () => {
  it("renders with data-slot='qr-code-overlay'", () => {
    const { container } = render(
      <QRCode level="H" value="https://example.com">
        <QRCodeOverlay>
          <span>Logo</span>
        </QRCodeOverlay>
      </QRCode>
    );
    const overlay = container.querySelector("[data-slot='qr-code-overlay']");
    expect(overlay).not.toBeNull();
  });

  it("renders children inside the overlay", () => {
    render(
      <QRCode level="H" value="https://example.com">
        <QRCodeOverlay>
          <span data-testid="logo">Logo</span>
        </QRCodeOverlay>
      </QRCode>
    );
    expect(screen.getByTestId("logo")).not.toBeNull();
  });

  it("overlay is a descendant of the qr-code root", () => {
    const { container } = render(
      <QRCode level="H" value="https://example.com">
        <QRCodeOverlay />
      </QRCode>
    );
    const overlay = container.querySelector(
      "[data-slot='qr-code'] [data-slot='qr-code-overlay']"
    );
    expect(overlay).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// QRCodeSkeleton
// ---------------------------------------------------------------------------

describe("QRCodeSkeleton", () => {
  it("renders with data-slot='qr-code-skeleton'", () => {
    const { container } = render(<QRCodeSkeleton />);
    const skeleton = container.querySelector("[data-slot='qr-code-skeleton']");
    expect(skeleton).not.toBeNull();
  });

  it("applies size as inline width and height", () => {
    const { container } = render(<QRCodeSkeleton size={200} />);
    const skeleton = container.querySelector<HTMLElement>(
      "[data-slot='qr-code-skeleton']"
    );
    expect(skeleton).not.toBeNull();
    expect(skeleton?.style.width).toBe("200px");
    expect(skeleton?.style.height).toBe("200px");
  });

  it("uses the default size of 160 when no size is supplied", () => {
    const { container } = render(<QRCodeSkeleton />);
    const skeleton = container.querySelector<HTMLElement>(
      "[data-slot='qr-code-skeleton']"
    );
    expect(skeleton?.style.width).toBe("160px");
    expect(skeleton?.style.height).toBe("160px");
  });
});

// ---------------------------------------------------------------------------
// QRCodeDownload
// ---------------------------------------------------------------------------

describe("QRCodeDownload", () => {
  it("renders as a button element", () => {
    render(
      <QRCode value="https://example.com">
        <QRCodeDownload />
      </QRCode>
    );
    // The Button primitive renders a <button> element
    const button = screen.getByRole("button");
    expect(button).not.toBeNull();
    expect(button.tagName.toLowerCase()).toBe("button");
  });

  it("renders default Download label text", () => {
    render(
      <QRCode value="https://example.com">
        <QRCodeDownload />
      </QRCode>
    );
    expect(screen.getByText("Download")).not.toBeNull();
  });

  it("clicking the download button does not throw", async () => {
    const user = userEvent.setup();
    render(
      <QRCode value="https://example.com">
        <QRCodeDownload />
      </QRCode>
    );
    const button = screen.getByRole("button");
    // Should not throw even without a real SVG/canvas environment
    await expect(user.click(button)).resolves.not.toThrow();
  });

  it("renders custom children when provided", () => {
    render(
      <QRCode value="https://example.com">
        <QRCodeDownload>Export</QRCodeDownload>
      </QRCode>
    );
    expect(screen.getByText("Export")).not.toBeNull();
  });
});
