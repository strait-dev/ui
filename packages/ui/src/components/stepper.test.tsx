import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "./stepper";

function BasicStepper({
  defaultValue = 0,
  value,
  onValueChange,
}: {
  defaultValue?: number;
  value?: number;
  onValueChange?: (v: number) => void;
}) {
  return (
    <Stepper
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      value={value}
    >
      <StepperItem step={0}>
        <StepperTrigger>
          <StepperIndicator />
          <StepperTitle>Step One</StepperTitle>
        </StepperTrigger>
      </StepperItem>
      <StepperSeparator />
      <StepperItem step={1}>
        <StepperTrigger>
          <StepperIndicator />
          <StepperTitle>Step Two</StepperTitle>
        </StepperTrigger>
      </StepperItem>
      <StepperSeparator />
      <StepperItem step={2}>
        <StepperTrigger>
          <StepperIndicator />
          <StepperTitle>Step Three</StepperTitle>
        </StepperTrigger>
      </StepperItem>
    </Stepper>
  );
}

describe("Stepper", () => {
  it("renders with data-slot='stepper'", () => {
    const { container } = render(<BasicStepper />);
    expect(
      container.querySelector("[data-slot='stepper']")
    ).toBeInTheDocument();
  });

  it("renders step titles", () => {
    render(<BasicStepper />);
    expect(screen.getByText("Step One")).toBeInTheDocument();
    expect(screen.getByText("Step Two")).toBeInTheDocument();
    expect(screen.getByText("Step Three")).toBeInTheDocument();
  });

  it("marks the first step as active by default", () => {
    const { container } = render(<BasicStepper defaultValue={0} />);
    const items = container.querySelectorAll("[data-slot='stepper-item']");
    expect(items[0]).toHaveAttribute("data-state", "active");
    expect(items[1]).toHaveAttribute("data-state", "inactive");
    expect(items[2]).toHaveAttribute("data-state", "inactive");
  });

  it("marks steps before active step as completed", () => {
    const { container } = render(<BasicStepper defaultValue={1} />);
    const items = container.querySelectorAll("[data-slot='stepper-item']");
    expect(items[0]).toHaveAttribute("data-state", "completed");
    expect(items[1]).toHaveAttribute("data-state", "active");
  });

  it("advances to next step when trigger is clicked", async () => {
    const { container } = render(<BasicStepper defaultValue={0} />);
    const triggers = screen.getAllByRole("button");
    await userEvent.click(triggers[1]);
    const items = container.querySelectorAll("[data-slot='stepper-item']");
    expect(items[1]).toHaveAttribute("data-state", "active");
  });

  it("calls onValueChange when a trigger is clicked", async () => {
    const onValueChange = vi.fn();
    render(<BasicStepper onValueChange={onValueChange} />);
    const triggers = screen.getAllByRole("button");
    await userEvent.click(triggers[2]);
    expect(onValueChange).toHaveBeenCalledWith(2);
  });

  it("renders data-slot='stepper-indicator' on indicators", () => {
    const { container } = render(<BasicStepper />);
    const indicators = container.querySelectorAll(
      "[data-slot='stepper-indicator']"
    );
    expect(indicators.length).toBe(3);
  });

  it("renders data-slot='stepper-title' on titles", () => {
    const { container } = render(<BasicStepper />);
    const titles = container.querySelectorAll("[data-slot='stepper-title']");
    expect(titles.length).toBe(3);
  });

  it("renders data-slot='stepper-separator'", () => {
    const { container } = render(<BasicStepper />);
    const separators = container.querySelectorAll(
      "[data-slot='stepper-separator']"
    );
    expect(separators.length).toBe(2);
  });

  it("uses controlled value when provided", () => {
    const { container } = render(<BasicStepper value={2} />);
    const items = container.querySelectorAll("[data-slot='stepper-item']");
    expect(items[2]).toHaveAttribute("data-state", "active");
  });

  it("supports vertical orientation", () => {
    const { container } = render(
      <Stepper orientation="vertical">
        <StepperItem step={0}>
          <StepperTrigger>
            <StepperIndicator />
            <StepperTitle>Vertical Step</StepperTitle>
          </StepperTrigger>
        </StepperItem>
      </Stepper>
    );
    const stepper = container.querySelector("[data-slot='stepper']");
    expect(stepper).toHaveAttribute("data-orientation", "vertical");
  });

  it("disables a step trigger when disabled prop is set", () => {
    render(
      <Stepper>
        <StepperItem disabled step={0}>
          <StepperTrigger>
            <StepperIndicator />
            <StepperTitle>Disabled Step</StepperTitle>
          </StepperTrigger>
        </StepperItem>
      </Stepper>
    );
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
  });

  it("renders StepperDescription", () => {
    render(
      <Stepper>
        <StepperItem step={0}>
          <StepperTrigger>
            <StepperIndicator />
            <StepperTitle>Step</StepperTitle>
          </StepperTrigger>
          <StepperDescription>Step description text</StepperDescription>
        </StepperItem>
      </Stepper>
    );
    expect(screen.getByText("Step description text")).toBeInTheDocument();
    const desc = screen.getByText("Step description text");
    expect(desc).toHaveAttribute("data-slot", "stepper-description");
  });
});

/* ------------------------------------------------------------------ */
/* Size axis                                                           */
/* ------------------------------------------------------------------ */

describe("Stepper size prop", () => {
  it("sets data-size='default' by default", () => {
    const { container } = render(<BasicStepper />);
    const stepper = container.querySelector("[data-slot='stepper']");
    expect(stepper).toHaveAttribute("data-size", "default");
  });

  it("sets data-size='sm' when size='sm'", () => {
    const { container } = render(
      <Stepper size="sm">
        <StepperItem step={0}>
          <StepperTrigger>
            <StepperIndicator />
            <StepperTitle>Step</StepperTitle>
          </StepperTrigger>
        </StepperItem>
      </Stepper>
    );
    const stepper = container.querySelector("[data-slot='stepper']");
    expect(stepper).toHaveAttribute("data-size", "sm");
  });

  it("applies sm size class to StepperIndicator", () => {
    const { container } = render(
      <Stepper size="sm">
        <StepperItem step={0}>
          <StepperTrigger>
            <StepperIndicator />
          </StepperTrigger>
        </StepperItem>
      </Stepper>
    );
    const indicator = container.querySelector(
      "[data-slot='stepper-indicator']"
    );
    expect(indicator?.className).toContain(
      "group-data-[size=sm]/stepper:size-6"
    );
  });

  it("applies sm size class to StepperTitle", () => {
    const { container } = render(
      <Stepper size="sm">
        <StepperItem step={0}>
          <StepperTrigger>
            <StepperIndicator />
            <StepperTitle>Title</StepperTitle>
          </StepperTrigger>
        </StepperItem>
      </Stepper>
    );
    const title = container.querySelector("[data-slot='stepper-title']");
    expect(title?.className).toContain("group-data-[size=sm]/stepper:text-xs");
  });

  it("applies sm size class to StepperDescription", () => {
    const { container } = render(
      <Stepper size="sm">
        <StepperItem step={0}>
          <StepperTrigger>
            <StepperIndicator />
          </StepperTrigger>
          <StepperDescription>Desc</StepperDescription>
        </StepperItem>
      </Stepper>
    );
    const desc = container.querySelector("[data-slot='stepper-description']");
    expect(desc?.className).toContain("group-data-[size=sm]/stepper:text-xs");
  });
});

/* ------------------------------------------------------------------ */
/* Compact variant                                                     */
/* ------------------------------------------------------------------ */

describe("Stepper compact prop", () => {
  it("sets data-compact='false' by default", () => {
    const { container } = render(<BasicStepper />);
    const stepper = container.querySelector("[data-slot='stepper']");
    expect(stepper).toHaveAttribute("data-compact", "false");
  });

  it("sets data-compact='true' when compact=true", () => {
    const { container } = render(
      <Stepper compact>
        <StepperItem step={0}>
          <StepperTrigger>
            <StepperIndicator />
          </StepperTrigger>
        </StepperItem>
      </Stepper>
    );
    const stepper = container.querySelector("[data-slot='stepper']");
    expect(stepper).toHaveAttribute("data-compact", "true");
  });

  it("applies compact gap class to the stepper root", () => {
    const { container } = render(
      <Stepper compact>
        <StepperItem step={0}>
          <StepperTrigger>
            <StepperIndicator />
          </StepperTrigger>
        </StepperItem>
      </Stepper>
    );
    const stepper = container.querySelector("[data-slot='stepper']");
    expect(stepper?.className).toContain("data-[compact=true]:gap-1");
  });

  it("applies compact separator class to StepperSeparator", () => {
    const { container } = render(
      <Stepper compact orientation="vertical">
        <StepperItem step={0}>
          <StepperTrigger>
            <StepperIndicator />
          </StepperTrigger>
        </StepperItem>
        <StepperSeparator />
        <StepperItem step={1}>
          <StepperTrigger>
            <StepperIndicator />
          </StepperTrigger>
        </StepperItem>
      </Stepper>
    );
    const sep = container.querySelector("[data-slot='stepper-separator']");
    expect(sep?.className).toContain(
      "group-data-[compact=true]/stepper:group-data-[orientation=vertical]/stepper:h-8"
    );
  });
});
