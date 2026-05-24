import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { InputWithAddons } from "./input-with-addons";

describe("InputWithAddons", () => {
  it("renders the outer wrapper with data-slot='input-with-addons'", () => {
    render(<InputWithAddons placeholder="Site" />);
    expect(
      document.querySelector("[data-slot='input-with-addons']")
    ).toBeInTheDocument();
  });

  it("renders a leading addon when provided", () => {
    render(<InputWithAddons leading="https://" placeholder="Site" />);
    expect(screen.getByText("https://")).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='leading-addon']")
    ).toBeInTheDocument();
  });

  it("renders a trailing addon when provided", () => {
    render(<InputWithAddons placeholder="Site" trailing=".com" />);
    expect(screen.getByText(".com")).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='trailing-addon']")
    ).toBeInTheDocument();
  });

  it("does not render addon slots when omitted", () => {
    render(<InputWithAddons placeholder="Site" />);
    expect(
      document.querySelector("[data-slot='leading-addon']")
    ).not.toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='trailing-addon']")
    ).not.toBeInTheDocument();
  });

  it("renders both leading and trailing addons together", () => {
    render(
      <InputWithAddons leading="https://" placeholder="Site" trailing=".com" />
    );
    expect(screen.getByText("https://")).toBeInTheDocument();
    expect(screen.getByText(".com")).toBeInTheDocument();
  });

  it("accepts user input", async () => {
    render(<InputWithAddons leading="https://" placeholder="yoursite" />);
    const input = screen.getByPlaceholderText<HTMLInputElement>("yoursite");
    await userEvent.type(input, "stripe");
    expect(input).toHaveValue("stripe");
  });

  it("forwards native input props like disabled", () => {
    render(<InputWithAddons disabled placeholder="Site" />);
    expect(screen.getByPlaceholderText("Site")).toBeDisabled();
  });

  it("accepts a containerClassName", () => {
    render(
      <InputWithAddons containerClassName="my-container" placeholder="Site" />
    );
    const wrapper = document.querySelector("[data-slot='input-with-addons']");
    expect(wrapper).toHaveClass("my-container");
  });
});
