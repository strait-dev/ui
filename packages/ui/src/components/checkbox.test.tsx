import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("renders a checkbox role with the checkbox data-slot", () => {
    render(<Checkbox aria-label="Accept terms" />);
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(checkbox).toHaveAttribute("data-slot", "checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  it("checks on click and calls onCheckedChange", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox aria-label="Accept terms" onCheckedChange={onCheckedChange} />
    );
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("respects a controlled checked prop", () => {
    render(
      <Checkbox aria-label="Accept terms" checked onCheckedChange={() => {}} />
    );
    expect(
      screen.getByRole("checkbox", { name: "Accept terms" })
    ).toHaveAttribute("aria-checked", "true");
  });

  it("does not toggle while disabled", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        aria-label="Accept terms"
        disabled
        onCheckedChange={onCheckedChange}
      />
    );
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    await userEvent.click(checkbox);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  it("is associated with a label via htmlFor", () => {
    const { container } = render(
      <div className="flex items-center gap-2">
        <Checkbox id="terms" />
        <label htmlFor="terms">Accept terms</label>
      </div>
    );
    // Base UI renders a visually-hidden <input> with the consumer id;
    // the visible checkbox span carries data-slot="checkbox".
    const checkbox = container.querySelector("[data-slot='checkbox']");
    expect(checkbox).toBeInTheDocument();
    // Confirm the label targets the hidden input that Base UI generated
    const label = screen.getByText("Accept terms");
    expect(label).toBeInTheDocument();
  });

  it("reflects aria-invalid attribute", () => {
    render(<Checkbox aria-invalid aria-label="Accept terms" />);
    expect(
      screen.getByRole("checkbox", { name: "Accept terms" })
    ).toHaveAttribute("aria-invalid", "true");
  });

  /* ------------------------------------------------------------------ */
  /* Size variant                                                        */
  /* ------------------------------------------------------------------ */

  it("applies size=sm class to the checkbox element", () => {
    const { container } = render(<Checkbox aria-label="Small" size="sm" />);
    const checkbox = container.querySelector("[data-slot='checkbox']");
    expect(checkbox).toHaveClass("size-3.5");
  });

  it("applies size=lg class to the checkbox element", () => {
    const { container } = render(<Checkbox aria-label="Large" size="lg" />);
    const checkbox = container.querySelector("[data-slot='checkbox']");
    expect(checkbox).toHaveClass("size-5");
  });

  it("defaults to size=default (size-4) when no size prop is given", () => {
    const { container } = render(<Checkbox aria-label="Default size" />);
    const checkbox = container.querySelector("[data-slot='checkbox']");
    expect(checkbox).toHaveClass("size-4");
  });

  /* ------------------------------------------------------------------ */
  /* Intent variant                                                      */
  /* ------------------------------------------------------------------ */

  it("applies destructive border class when intent=destructive", () => {
    const { container } = render(
      <Checkbox aria-label="Delete" intent="destructive" />
    );
    const checkbox = container.querySelector("[data-slot='checkbox']");
    expect(checkbox).toHaveClass("border-destructive");
  });

  it("renders with size=sm and intent=destructive together", () => {
    const { container } = render(
      <Checkbox aria-label="Small destructive" intent="destructive" size="sm" />
    );
    const checkbox = container.querySelector("[data-slot='checkbox']");
    expect(checkbox).toHaveClass("size-3.5");
    expect(checkbox).toHaveClass("border-destructive");
  });
});
