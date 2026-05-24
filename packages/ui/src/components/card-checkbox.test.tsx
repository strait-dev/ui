import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CardCheckboxGroup, CardCheckboxItem } from "./card-checkbox";

describe("CardCheckboxGroup", () => {
  it("renders with the card-checkbox-group data-slot", () => {
    const { container } = render(
      <CardCheckboxGroup>
        <CardCheckboxItem label="Option A" />
      </CardCheckboxGroup>
    );
    expect(
      container.querySelector("[data-slot='card-checkbox-group']")
    ).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <CardCheckboxGroup>
        <CardCheckboxItem label="Option A" />
        <CardCheckboxItem label="Option B" />
      </CardCheckboxGroup>
    );
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });
});

describe("CardCheckboxItem", () => {
  it("renders with the card-checkbox-item data-slot", () => {
    const { container } = render(<CardCheckboxItem label="Newsletter" />);
    expect(
      container.querySelector("[data-slot='card-checkbox-item']")
    ).toBeInTheDocument();
  });

  it("renders the label text", () => {
    render(<CardCheckboxItem label="Subscribe" />);
    expect(screen.getByText("Subscribe")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <CardCheckboxItem
        description="Receive weekly updates."
        label="Newsletter"
      />
    );
    expect(screen.getByText("Receive weekly updates.")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    const { container } = render(<CardCheckboxItem label="Newsletter" />);
    expect(container.querySelector("p")).not.toBeInTheDocument();
  });

  it("renders an icon when provided", () => {
    render(
      <CardCheckboxItem
        icon={<span data-testid="icon">icon</span>}
        label="Newsletter"
      />
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders a checkbox element", () => {
    render(<CardCheckboxItem id="terms" label="Accept terms" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  it("calls onCheckedChange when clicked", async () => {
    const onCheckedChange = vi.fn();
    render(
      <CardCheckboxItem
        id="accept"
        label="Accept"
        onCheckedChange={onCheckedChange}
      />
    );
    const checkbox = screen.getByRole("checkbox");
    await userEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("does not call onCheckedChange when disabled", async () => {
    const onCheckedChange = vi.fn();
    render(
      <CardCheckboxItem
        disabled
        id="accept-disabled"
        label="Accept"
        onCheckedChange={onCheckedChange}
      />
    );
    const checkbox = screen.getByRole("checkbox");
    await userEvent.click(checkbox);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("links label and description via id-based IDs", () => {
    const { container } = render(
      <CardCheckboxItem
        description="Weekly digest"
        id="newsletter"
        label="Newsletter"
      />
    );
    expect(
      container.querySelector("[id='newsletter-label']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[id='newsletter-description']")
    ).toBeInTheDocument();
  });

  it("applies compact variant without error", () => {
    const { container } = render(
      <CardCheckboxItem label="Compact" variant="compact" />
    );
    expect(
      container.querySelector("[data-slot='card-checkbox-item']")
    ).toBeInTheDocument();
  });

  it("applies layout=start without error", () => {
    const { container } = render(
      <CardCheckboxItem
        description="Some long text here"
        label="With description"
        layout="start"
      />
    );
    expect(
      container.querySelector("[data-slot='card-checkbox-item']")
    ).toBeInTheDocument();
  });
});
