import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./switch";

describe("Switch", () => {
  it("renders a switch role with the switch data-slot", () => {
    render(<Switch aria-label="Wifi" />);
    const toggle = screen.getByRole("switch", { name: "Wifi" });
    expect(toggle).toHaveAttribute("data-slot", "switch");
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("toggles its checked state and calls onCheckedChange", async () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Wifi" onCheckedChange={onCheckedChange} />);
    const toggle = screen.getByRole("switch", { name: "Wifi" });
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("respects a controlled checked prop", () => {
    render(<Switch aria-label="Wifi" checked onCheckedChange={() => {}} />);
    expect(screen.getByRole("switch", { name: "Wifi" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("does not toggle while disabled", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch aria-label="Wifi" disabled onCheckedChange={onCheckedChange} />,
    );
    const toggle = screen.getByRole("switch", { name: "Wifi" });
    await userEvent.click(toggle);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("forwards the size to the data-size attribute", () => {
    render(<Switch aria-label="Wifi" size="sm" />);
    expect(screen.getByRole("switch", { name: "Wifi" })).toHaveAttribute(
      "data-size",
      "sm",
    );
  });
});
