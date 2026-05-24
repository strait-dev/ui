import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RadioGroup, RadioGroupItem } from "./radio-group";

function Fixture({
  defaultValue,
  onValueChange,
}: {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <RadioGroup defaultValue={defaultValue} onValueChange={onValueChange}>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="starter" value="starter" />
        <label htmlFor="starter">Starter</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="pro" value="pro" />
        <label htmlFor="pro">Pro</label>
      </div>
    </RadioGroup>
  );
}

describe("RadioGroup", () => {
  it("renders radio buttons with the radio-group data-slot", () => {
    const { container } = render(<Fixture />);
    const group = container.querySelector("[data-slot='radio-group']");
    expect(group).toBeInTheDocument();
    const items = container.querySelectorAll("[data-slot='radio-group-item']");
    expect(items).toHaveLength(2);
  });

  it("each item has role radio", () => {
    render(<Fixture />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(2);
  });

  it("selects an item on click and calls onValueChange", async () => {
    const onValueChange = vi.fn();
    render(<Fixture onValueChange={onValueChange} />);
    const starter = screen.getByRole("radio", { name: "Starter" });
    await userEvent.click(starter);
    expect(starter).toHaveAttribute("aria-checked", "true");
    expect(onValueChange).toHaveBeenCalledWith("starter", expect.anything());
  });

  it("respects a defaultValue to pre-select an item", () => {
    render(<Fixture defaultValue="pro" />);
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByRole("radio", { name: "Starter" })).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  it("only allows one item checked at a time", async () => {
    render(<Fixture />);
    await userEvent.click(screen.getByRole("radio", { name: "Starter" }));
    await userEvent.click(screen.getByRole("radio", { name: "Pro" }));
    expect(screen.getByRole("radio", { name: "Pro" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByRole("radio", { name: "Starter" })).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  it("forwards data-size to the radio-group root", () => {
    const { container } = render(<Fixture />);
    // Default size
    expect(
      container.querySelector("[data-slot='radio-group']")
    ).toHaveAttribute("data-size", "default");
  });

  it("sets data-size=lg on the group when size=lg is passed", () => {
    const { container } = render(
      <RadioGroup size="lg">
        <div className="flex items-center gap-2">
          <RadioGroupItem id="lg-a" value="a" />
          <label htmlFor="lg-a">A</label>
        </div>
      </RadioGroup>
    );
    expect(
      container.querySelector("[data-slot='radio-group']")
    ).toHaveAttribute("data-size", "lg");
  });

  it("sets data-size=sm on the group when size=sm is passed", () => {
    const { container } = render(
      <RadioGroup size="sm">
        <div className="flex items-center gap-2">
          <RadioGroupItem id="sm-a" value="a" />
          <label htmlFor="sm-a">A</label>
        </div>
      </RadioGroup>
    );
    expect(
      container.querySelector("[data-slot='radio-group']")
    ).toHaveAttribute("data-size", "sm");
  });
});
