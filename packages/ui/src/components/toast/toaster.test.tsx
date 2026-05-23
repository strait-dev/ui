import { render } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { Toaster } from "./toaster";

beforeAll(() => {
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
});

describe("Toaster", () => {
  it("mounts without throwing", () => {
    expect(() => render(<Toaster />)).not.toThrow();
  });

  it("renders a section element in the document (Sonner portal)", () => {
    render(<Toaster />);
    // Sonner renders a <section> as the toaster root element
    const section = document.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("has aria-live attribute for accessibility", () => {
    render(<Toaster />);
    const section = document.querySelector("section[aria-live]");
    expect(section).toBeInTheDocument();
  });

  it("renders with position prop without throwing", () => {
    expect(() => render(<Toaster position="top-right" />)).not.toThrow();
  });

  it("renders with richColors prop without throwing", () => {
    expect(() => render(<Toaster richColors />)).not.toThrow();
  });
});
