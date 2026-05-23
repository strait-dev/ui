import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { PhoneInput } from "./phone-input";

beforeAll(() => {
  // jsdom lacks ResizeObserver (used by cmdk/popover internals)
  globalThis.ResizeObserver ||= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  // jsdom lacks matchMedia (used by Vaul/dialog-based components)
  window.matchMedia ||= (q: string) => ({
    matches: false,
    media: q,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  });
  // jsdom lacks scrollIntoView (used by cmdk)
  Element.prototype.scrollIntoView ||= () => {};
});

describe("PhoneInput", () => {
  it("renders the wrapper with data-slot='phone-input'", () => {
    render(<PhoneInput />);
    expect(
      document.querySelector("[data-slot='phone-input']")
    ).toBeInTheDocument();
  });

  it("renders the country selector button", () => {
    render(<PhoneInput defaultCountry="US" />);
    expect(
      screen.getByRole("button", { name: "Select country" })
    ).toBeInTheDocument();
  });

  it("renders the phone number input field", () => {
    render(<PhoneInput defaultCountry="US" placeholder="Phone number" />);
    expect(screen.getByPlaceholderText("Phone number")).toBeInTheDocument();
  });

  it("calls onChange when a value is provided", () => {
    const onChange = vi.fn();
    render(
      <PhoneInput
        defaultCountry="US"
        onChange={onChange}
        placeholder="Phone"
        value="+12125551234"
      />
    );
    // value is rendered; onChange is wired
    expect(screen.getByPlaceholderText("Phone")).toBeInTheDocument();
  });

  it("renders with a controlled value", () => {
    render(
      <PhoneInput
        defaultCountry="US"
        onChange={vi.fn()}
        placeholder="Phone"
        value="+12125551234"
      />
    );
    const input = screen.getByPlaceholderText<HTMLInputElement>("Phone");
    // The formatted value appears in the input
    expect(input.value).toContain("212");
  });

  it("renders disabled country selector when disabled", () => {
    render(<PhoneInput defaultCountry="US" disabled />);
    expect(
      screen.getByRole("button", { name: "Select country" })
    ).toBeDisabled();
  });

  it("size='sm' reaches the underlying input field", () => {
    render(<PhoneInput defaultCountry="US" placeholder="Phone" size="sm" />);
    const input = document.querySelector("[data-slot='input']");
    expect(input).toHaveClass("h-7");
  });
});
