import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./input-group";

describe("InputGroup", () => {
  it("renders with data-slot='input-group' and role='group'", () => {
    render(<InputGroup data-testid="ig" />);
    const el = screen.getByTestId("ig");
    expect(el).toHaveAttribute("data-slot", "input-group");
    expect(el).toHaveAttribute("role", "group");
  });

  it("accepts a className", () => {
    render(<InputGroup className="custom-class" data-testid="ig" />);
    expect(screen.getByTestId("ig")).toHaveClass("custom-class");
  });
});

describe("InputGroupAddon", () => {
  it("renders with data-slot='input-group-addon'", () => {
    render(<InputGroupAddon data-testid="addon">$</InputGroupAddon>);
    expect(screen.getByTestId("addon")).toHaveAttribute(
      "data-slot",
      "input-group-addon"
    );
  });

  it("defaults to inline-start align", () => {
    render(<InputGroupAddon data-testid="addon">$</InputGroupAddon>);
    expect(screen.getByTestId("addon")).toHaveAttribute(
      "data-align",
      "inline-start"
    );
  });

  it("forwards align prop as data-align", () => {
    render(
      <InputGroupAddon align="inline-end" data-testid="addon">
        %
      </InputGroupAddon>
    );
    expect(screen.getByTestId("addon")).toHaveAttribute(
      "data-align",
      "inline-end"
    );
  });
});

describe("InputGroupButton", () => {
  it("renders a button with default type='button'", () => {
    render(<InputGroupButton>Go</InputGroupButton>);
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn).toHaveAttribute("type", "button");
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<InputGroupButton onClick={onClick}>Go</InputGroupButton>);
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("supports type='submit'", () => {
    render(<InputGroupButton type="submit">Submit</InputGroupButton>);
    expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute(
      "type",
      "submit"
    );
  });
});

describe("InputGroupText", () => {
  it("renders children as a span", () => {
    render(<InputGroupText>USD</InputGroupText>);
    expect(screen.getByText("USD").tagName).toBe("SPAN");
  });
});

describe("InputGroupInput", () => {
  it("renders an input with data-slot='input-group-control'", () => {
    render(<InputGroupInput placeholder="Search" />);
    const input = screen.getByPlaceholderText("Search");
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("data-slot", "input-group-control");
  });

  it("accepts user input", async () => {
    render(<InputGroupInput placeholder="Search" />);
    const input = screen.getByPlaceholderText<HTMLInputElement>("Search");
    await userEvent.type(input, "hello");
    expect(input).toHaveValue("hello");
  });

  it("is disabled when the disabled prop is set", () => {
    render(<InputGroupInput disabled placeholder="Search" />);
    expect(screen.getByPlaceholderText("Search")).toBeDisabled();
  });
});

describe("InputGroupTextarea", () => {
  it("renders a textarea with data-slot='input-group-control'", () => {
    render(<InputGroupTextarea placeholder="Notes" />);
    const ta = screen.getByPlaceholderText("Notes");
    expect(ta.tagName).toBe("TEXTAREA");
    expect(ta).toHaveAttribute("data-slot", "input-group-control");
  });
});

describe("InputGroup composition", () => {
  it("renders input and addon together", () => {
    render(
      <InputGroup>
        <InputGroupAddon align="inline-start">$</InputGroupAddon>
        <InputGroupInput placeholder="Amount" />
      </InputGroup>
    );
    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Amount")).toBeInTheDocument();
  });
});
