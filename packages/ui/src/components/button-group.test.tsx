import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
} from "./button-group";

describe("ButtonGroup", () => {
  it("renders a group role with the button-group data-slot", () => {
    render(
      <ButtonGroup aria-label="Text formatting">
        <Button variant="outline">Bold</Button>
      </ButtonGroup>
    );
    const group = screen.getByRole("group", { name: "Text formatting" });
    expect(group).toHaveAttribute("data-slot", "button-group");
  });

  it("reflects the orientation on the data-orientation attribute", () => {
    render(
      <ButtonGroup aria-label="Actions" orientation="vertical">
        <Button variant="outline">Up</Button>
        <Button variant="outline">Down</Button>
      </ButtonGroup>
    );
    const group = screen.getByRole("group", { name: "Actions" });
    expect(group).toHaveAttribute("data-orientation", "vertical");
  });

  it("defaults to horizontal orientation when orientation is omitted", () => {
    render(
      <ButtonGroup aria-label="Actions">
        <Button variant="outline">A</Button>
      </ButtonGroup>
    );
    const group = screen.getByRole("group", { name: "Actions" });
    expect(group).not.toHaveAttribute("data-orientation");
  });

  it("renders ButtonGroupText with the button-group-text data-slot", () => {
    render(
      <ButtonGroup aria-label="Unit">
        <ButtonGroupText>px</ButtonGroupText>
      </ButtonGroup>
    );
    expect(screen.getByText("px")).toHaveAttribute(
      "data-slot",
      "button-group-text"
    );
  });

  it("renders ButtonGroupSeparator with the button-group-separator data-slot", () => {
    const { container } = render(
      <ButtonGroup aria-label="Tools">
        <Button variant="outline">A</Button>
        <ButtonGroupSeparator />
        <Button variant="outline">B</Button>
      </ButtonGroup>
    );
    const sep = container.querySelector('[data-slot="button-group-separator"]');
    expect(sep).toBeInTheDocument();
  });

  it("exposes a buttonGroupVariants helper", () => {
    expect(buttonGroupVariants({ orientation: "vertical" })).toContain(
      "flex-col"
    );
  });
});
