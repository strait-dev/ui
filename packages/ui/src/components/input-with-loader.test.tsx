import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { InputWithLoader } from "./input-with-loader";

describe("InputWithLoader", () => {
  it("renders the wrapper with data-slot='input-with-loader'", () => {
    render(<InputWithLoader placeholder="Search" />);
    expect(
      document.querySelector("[data-slot='input-with-loader']")
    ).toBeInTheDocument();
  });

  it("renders the input with data-slot='input'", () => {
    render(<InputWithLoader placeholder="Search" />);
    expect(document.querySelector("[data-slot='input']")).toBeInTheDocument();
  });

  it("does not render start slot when no icon and not loading", () => {
    render(<InputWithLoader placeholder="Search" />);
    expect(
      document.querySelector("[data-slot='start-icon']")
    ).not.toBeInTheDocument();
  });

  it("renders the icon in the start slot when icon is provided", () => {
    render(
      <InputWithLoader
        icon={<span data-testid="my-icon" />}
        placeholder="Search"
      />
    );
    expect(screen.getByTestId("my-icon")).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='start-icon']")
    ).toBeInTheDocument();
  });

  it("renders a spinner (not the icon) when loading is true", () => {
    render(
      <InputWithLoader
        icon={<span data-testid="my-icon" />}
        loading
        placeholder="Search"
      />
    );
    // The static icon should not be visible when loading
    expect(screen.queryByTestId("my-icon")).not.toBeInTheDocument();
    // Start slot should still be rendered (with the spinner)
    expect(
      document.querySelector("[data-slot='start-icon']")
    ).toBeInTheDocument();
  });

  it("renders spinner when loading is true with no icon", () => {
    render(<InputWithLoader loading placeholder="Search" />);
    expect(
      document.querySelector("[data-slot='start-icon']")
    ).toBeInTheDocument();
  });

  it("renders end icon button when endIcon is provided", () => {
    render(
      <InputWithLoader
        endIcon={<span data-testid="clear-icon" />}
        endIconAriaLabel="Clear"
        placeholder="Search"
      />
    );
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
    expect(screen.getByTestId("clear-icon")).toBeInTheDocument();
  });

  it("does not render end icon when not provided", () => {
    render(<InputWithLoader placeholder="Search" />);
    expect(
      document.querySelector("[data-slot='end-icon']")
    ).not.toBeInTheDocument();
  });

  it("calls onEndIconClick when end icon button is clicked", async () => {
    const onEndIconClick = vi.fn();
    render(
      <InputWithLoader
        endIcon={<span />}
        endIconAriaLabel="Clear"
        onEndIconClick={onEndIconClick}
        placeholder="Search"
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(onEndIconClick).toHaveBeenCalledTimes(1);
  });

  it("accepts user input", async () => {
    render(<InputWithLoader placeholder="Search" />);
    const input = screen.getByPlaceholderText<HTMLInputElement>("Search");
    await userEvent.type(input, "hello");
    expect(input).toHaveValue("hello");
  });
});
