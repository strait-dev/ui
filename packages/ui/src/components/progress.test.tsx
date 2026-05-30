import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { Progress, ProgressLabel, ProgressValue } from "./progress";

beforeAll(() => {
  globalThis.ResizeObserver ||= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("Progress", () => {
  it("renders with role progressbar and the progress data-slot", () => {
    render(<Progress value={50} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("data-slot", "progress");
  });

  it("reflects value via aria-valuenow", () => {
    render(<Progress value={75} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "75");
  });

  it("renders the progress track and indicator", () => {
    const { container } = render(<Progress value={40} />);
    expect(
      container.querySelector('[data-slot="progress-track"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="progress-indicator"]')
    ).toBeInTheDocument();
  });

  it("renders ProgressLabel as a child with the progress-label data-slot", () => {
    const { container } = render(
      <Progress value={30}>
        <ProgressLabel>Uploading</ProgressLabel>
      </Progress>
    );
    const label = container.querySelector('[data-slot="progress-label"]');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Uploading");
  });

  it("renders ProgressValue with the progress-value data-slot", () => {
    const { container } = render(
      <Progress value={60}>
        <ProgressValue />
      </Progress>
    );
    expect(
      container.querySelector('[data-slot="progress-value"]')
    ).toBeInTheDocument();
  });

  it("reflects aria-valuemin and aria-valuemax", () => {
    render(<Progress value={20} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("size lg applies h-2.5 to the progress track", () => {
    const { container } = render(<Progress size="lg" value={50} />);
    const track = container.querySelector('[data-slot="progress-track"]');
    expect(track).toHaveClass("h-2.5");
  });

  it("variant success applies bg-success to the progress indicator", () => {
    const { container } = render(<Progress value={50} variant="success" />);
    const indicator = container.querySelector(
      '[data-slot="progress-indicator"]'
    );
    expect(indicator).toHaveClass("bg-success");
  });
});
