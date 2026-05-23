import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { InputWithStartIcon } from "./input-with-start-icon";

describe("InputWithStartIcon", () => {
  it("renders the wrapper with data-slot='input-with-start-icon'", () => {
    render(<InputWithStartIcon placeholder="Search" />);
    expect(
      document.querySelector("[data-slot='input-with-start-icon']")
    ).toBeInTheDocument();
  });

  it("renders the input with data-slot='input'", () => {
    render(<InputWithStartIcon placeholder="Search" />);
    expect(document.querySelector("[data-slot='input']")).toBeInTheDocument();
  });

  it("renders an icon in the icon slot", () => {
    render(
      <InputWithStartIcon
        icon={<span data-testid="search-icon" />}
        placeholder="Search"
      />
    );
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='icon']")).toBeInTheDocument();
  });

  it("renders the label when provided", () => {
    render(
      <InputWithStartIcon id="search" label="Search" placeholder="Search…" />
    );
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='label']")).toBeInTheDocument();
  });

  it("links label htmlFor to input id", () => {
    render(
      <InputWithStartIcon id="my-input" label="Name" placeholder="Name" />
    );
    const label = screen.getByText("Name");
    expect(label).toHaveAttribute("for", "my-input");
  });

  it("does not render a label when label prop is omitted", () => {
    render(<InputWithStartIcon placeholder="Search" />);
    expect(
      document.querySelector("[data-slot='label']")
    ).not.toBeInTheDocument();
  });

  it("accepts user input", async () => {
    render(<InputWithStartIcon placeholder="Search" />);
    const input = screen.getByPlaceholderText<HTMLInputElement>("Search");
    await userEvent.type(input, "query");
    expect(input).toHaveValue("query");
  });

  it("is disabled when the disabled prop is set", () => {
    render(<InputWithStartIcon disabled placeholder="Search" />);
    expect(screen.getByPlaceholderText("Search")).toBeDisabled();
  });

  it("accepts a containerClassName on the inner wrapper", () => {
    render(
      <InputWithStartIcon
        containerClassName="my-wrapper"
        placeholder="Search"
      />
    );
    expect(document.querySelector("[data-slot='input-container']")).toHaveClass(
      "my-wrapper"
    );
  });
});
