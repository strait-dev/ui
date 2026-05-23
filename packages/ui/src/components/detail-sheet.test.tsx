import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import {
  DetailSheet,
  DetailSheetRow,
  DetailSheetSection,
} from "./detail-sheet";

// ---------------------------------------------------------------------------
// jsdom polyfills required by Base UI's Dialog (Sheet) primitive
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

type FixtureProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  footer?: React.ReactNode;
};

function Fixture({
  open = true,
  onOpenChange = vi.fn(),
  footer,
}: FixtureProps) {
  return (
    <DetailSheet
      footer={footer}
      meta="run-id: abc-123"
      onOpenChange={onOpenChange}
      open={open}
      title="Deployment #d-42"
    >
      <DetailSheetSection heading="Summary">
        <DetailSheetRow label="Status">deployed</DetailSheetRow>
        <DetailSheetRow label="Region">us-east-1</DetailSheetRow>
      </DetailSheetSection>
    </DetailSheet>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("DetailSheet", () => {
  it("renders title and meta when open", async () => {
    render(<Fixture open />);
    expect(await screen.findByText("Deployment #d-42")).toBeInTheDocument();
    expect(screen.getByText("run-id: abc-123")).toBeInTheDocument();
  });

  it("does not render title when closed", () => {
    render(<Fixture open={false} />);
    expect(screen.queryByText("Deployment #d-42")).not.toBeInTheDocument();
  });

  it("renders children when open", async () => {
    render(<Fixture open />);
    expect(await screen.findByText("deployed")).toBeInTheDocument();
    expect(screen.getByText("us-east-1")).toBeInTheDocument();
  });

  it("renders footer content when provided", async () => {
    render(
      <Fixture footer={<button type="button">Close panel</button>} open />
    );
    expect(
      await screen.findByRole("button", { name: "Close panel" })
    ).toBeInTheDocument();
  });

  it("does not render footer when footer prop is omitted", async () => {
    render(<Fixture open />);
    await screen.findByText("Deployment #d-42");
    expect(
      screen.queryByRole("button", { name: "Close panel" })
    ).not.toBeInTheDocument();
  });

  it("calls onOpenChange(false) when the built-in close button is clicked", async () => {
    const handleOpenChange = vi.fn();
    render(<Fixture onOpenChange={handleOpenChange} open />);
    await screen.findByRole("dialog");
    const closeBtn = screen.getByRole("button", { name: /close/i });
    await userEvent.click(closeBtn);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("has data-slot='detail-sheet' on the sheet popup element", async () => {
    render(<Fixture open />);
    await screen.findByRole("dialog");
    // data-slot="detail-sheet" is passed to SheetContent which spreads it
    // onto SheetPrimitive.Popup — the same element that carries role="dialog".
    const slotEl = document.querySelector("[data-slot='detail-sheet']");
    expect(slotEl).not.toBeNull();
  });
});

describe("DetailSheetSection", () => {
  it("renders the heading", () => {
    render(
      <DetailSheetSection heading="Metadata">
        <span>child</span>
      </DetailSheetSection>
    );
    expect(screen.getByText("Metadata")).toBeInTheDocument();
  });

  it("has data-slot='detail-sheet-section'", () => {
    render(
      <DetailSheetSection heading="Metadata">
        <span>child</span>
      </DetailSheetSection>
    );
    const section = document.querySelector(
      "[data-slot='detail-sheet-section']"
    );
    expect(section).not.toBeNull();
  });

  it("renders children inside the section", () => {
    render(
      <DetailSheetSection heading="Config">
        <span>a value</span>
      </DetailSheetSection>
    );
    expect(screen.getByText("a value")).toBeInTheDocument();
  });
});

describe("DetailSheetRow", () => {
  it("renders label and value", () => {
    render(<DetailSheetRow label="Region">us-east-1</DetailSheetRow>);
    expect(screen.getByText("Region")).toBeInTheDocument();
    expect(screen.getByText("us-east-1")).toBeInTheDocument();
  });

  it("has data-slot='detail-sheet-row'", () => {
    render(<DetailSheetRow label="Region">us-east-1</DetailSheetRow>);
    const row = document.querySelector("[data-slot='detail-sheet-row']");
    expect(row).not.toBeNull();
  });

  it("accepts a custom className", () => {
    render(
      <DetailSheetRow className="custom-class" label="Key">
        val
      </DetailSheetRow>
    );
    const row = document.querySelector("[data-slot='detail-sheet-row']");
    expect(row?.classList.contains("custom-class")).toBe(true);
  });
});
