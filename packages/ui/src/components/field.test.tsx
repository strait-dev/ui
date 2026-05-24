import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "./field";

describe("Field", () => {
  it("renders a group role with the field data-slot", () => {
    render(
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <input id="email" />
      </Field>
    );
    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("data-slot", "field");
  });

  it("forwards orientation to data-orientation attribute", () => {
    render(
      <Field orientation="horizontal">
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <input id="email" />
      </Field>
    );
    expect(screen.getByRole("group")).toHaveAttribute(
      "data-orientation",
      "horizontal"
    );
  });

  it("renders FieldLabel with field-label data-slot", () => {
    render(
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <input id="name" />
      </Field>
    );
    expect(screen.getByText("Name")).toHaveAttribute(
      "data-slot",
      "field-label"
    );
  });

  it("renders FieldDescription with field-description data-slot", () => {
    render(
      <Field>
        <FieldDescription>Helper text</FieldDescription>
      </Field>
    );
    expect(screen.getByText("Helper text")).toHaveAttribute(
      "data-slot",
      "field-description"
    );
  });

  it("renders FieldError with role alert when children provided", () => {
    render(
      <Field>
        <FieldError>This field is required</FieldError>
      </Field>
    );
    const error = screen.getByRole("alert");
    expect(error).toHaveAttribute("data-slot", "field-error");
    expect(error).toHaveTextContent("This field is required");
  });

  it("renders FieldError from errors array", () => {
    render(
      <Field>
        <FieldError errors={[{ message: "Invalid email" }]} />
      </Field>
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid email");
  });

  it("renders nothing when FieldError has no content", () => {
    const { container } = render(
      <Field>
        <FieldError />
      </Field>
    );
    expect(container.querySelector("[data-slot='field-error']")).toBeNull();
  });

  it("renders FieldSet with field-set data-slot and FieldLegend", () => {
    render(
      <FieldSet>
        <FieldLegend>Notifications</FieldLegend>
      </FieldSet>
    );
    const fieldset = screen.getByRole("group");
    expect(fieldset).toHaveAttribute("data-slot", "field-set");
    expect(screen.getByText("Notifications")).toHaveAttribute(
      "data-slot",
      "field-legend"
    );
  });

  it("renders FieldGroup with field-group data-slot", () => {
    const { container } = render(
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="x">X</FieldLabel>
          <input id="x" />
        </Field>
      </FieldGroup>
    );
    expect(
      container.querySelector("[data-slot='field-group']")
    ).toBeInTheDocument();
  });

  it("renders FieldContent with field-content data-slot", () => {
    const { container } = render(
      <Field>
        <FieldContent>
          <FieldDescription>Hint</FieldDescription>
        </FieldContent>
      </Field>
    );
    expect(
      container.querySelector("[data-slot='field-content']")
    ).toBeInTheDocument();
  });

  it("forwards size to data-size attribute on the field root", () => {
    render(
      <Field size="lg">
        <FieldLabel htmlFor="sz-input">Label</FieldLabel>
        <input id="sz-input" />
      </Field>
    );
    expect(screen.getByRole("group")).toHaveAttribute("data-size", "lg");
  });

  it("defaults data-size to default when size is omitted", () => {
    render(
      <Field>
        <FieldLabel htmlFor="def-input">Label</FieldLabel>
        <input id="def-input" />
      </Field>
    );
    expect(screen.getByRole("group")).toHaveAttribute("data-size", "default");
  });
});
