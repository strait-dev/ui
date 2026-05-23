import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Slider } from "./slider";

/**
 * Base UI renders the slider thumb as a styled <div> and places a visually-
 * hidden <input type="range"> inside it for accessibility.  The hidden input
 * carries the ARIA slider semantics (aria-valuenow, aria-label, etc.).
 * Because it is hidden via clip-path / overflow it is inaccessible to
 * getByRole, so we query it directly via container.querySelectorAll.
 *
 * NOTE: When defaultValue is a scalar the component falls back to
 * _values = [min, max] for counting thumbs, so a scalar value produces
 * TWO thumbs (both show the same valuenow). The array form is the canonical
 * way to control the number of thumbs.
 */
describe("Slider", () => {
  it("renders a slider root with the slider data-slot", () => {
    const { container } = render(
      <Slider aria-label="Volume" defaultValue={[40]} />
    );
    const root = container.querySelector("[data-slot='slider']");
    expect(root).toBeInTheDocument();
  });

  it("renders one hidden range input for a single-thumb array defaultValue", () => {
    const { container } = render(
      <Slider aria-label="Volume" defaultValue={[40]} />
    );
    const inputs = container.querySelectorAll("input[type='range']");
    expect(inputs).toHaveLength(1);
    expect(inputs[0]).toHaveAttribute("aria-label", "Volume");
    expect(inputs[0]).toHaveAttribute("aria-valuenow", "40");
  });

  it("renders two hidden range inputs for a two-thumb range defaultValue", () => {
    const { container } = render(
      <Slider aria-label="Range" defaultValue={[20, 80]} />
    );
    const inputs = container.querySelectorAll("input[type='range']");
    expect(inputs).toHaveLength(2);
  });

  it("renders the track and range data-slots", () => {
    const { container } = render(
      <Slider aria-label="Volume" defaultValue={[50]} />
    );
    expect(
      container.querySelector("[data-slot='slider-track']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='slider-range']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='slider-thumb']")
    ).toBeInTheDocument();
  });

  it("respects controlled value via hidden range input", () => {
    const { container } = render(
      <Slider aria-label="Volume" onValueChange={vi.fn()} value={[30]} />
    );
    const input = container.querySelector("input[type='range']");
    expect(input).toHaveAttribute("aria-valuenow", "30");
  });

  it("passes min and max to the range inputs", () => {
    const { container } = render(
      <Slider aria-label="Volume" defaultValue={[5]} max={10} min={0} />
    );
    const input = container.querySelector("input[type='range']");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "10");
  });

  /* ------------------------------------------------------------------ */
  /* Size variant                                                        */
  /* ------------------------------------------------------------------ */

  it("applies sm track thickness class when size=sm", () => {
    const { container } = render(
      <Slider aria-label="Volume" defaultValue={[40]} size="sm" />
    );
    const track = container.querySelector("[data-slot='slider-track']");
    // sm size → data-horizontal:h-0.5 applied via cva
    expect(track?.className).toContain("h-0.5");
  });

  it("applies lg track thickness class when size=lg", () => {
    const { container } = render(
      <Slider aria-label="Volume" defaultValue={[40]} size="lg" />
    );
    const track = container.querySelector("[data-slot='slider-track']");
    expect(track?.className).toContain("h-1.5");
  });

  it("applies sm thumb size class when size=sm", () => {
    const { container } = render(
      <Slider aria-label="Volume" defaultValue={[40]} size="sm" />
    );
    const thumb = container.querySelector("[data-slot='slider-thumb']");
    expect(thumb).toHaveClass("size-2.5");
  });

  /* ------------------------------------------------------------------ */
  /* Intent variant                                                      */
  /* ------------------------------------------------------------------ */

  it("applies success bg class to the range when intent=success", () => {
    const { container } = render(
      <Slider aria-label="Volume" defaultValue={[40]} intent="success" />
    );
    const range = container.querySelector("[data-slot='slider-range']");
    expect(range).toHaveClass("bg-success");
  });

  it("applies destructive border/ring class to the thumb when intent=destructive", () => {
    const { container } = render(
      <Slider aria-label="Volume" defaultValue={[40]} intent="destructive" />
    );
    const thumb = container.querySelector("[data-slot='slider-thumb']");
    expect(thumb).toHaveClass("border-destructive");
  });

  it("combines size=lg and intent=warning correctly", () => {
    const { container } = render(
      <Slider
        aria-label="Volume"
        defaultValue={[40]}
        intent="warning"
        size="lg"
      />
    );
    const range = container.querySelector("[data-slot='slider-range']");
    const thumb = container.querySelector("[data-slot='slider-thumb']");
    expect(range).toHaveClass("bg-warning");
    expect(thumb).toHaveClass("size-4");
  });
});
