import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";

function BreadcrumbFixture() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Components</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

describe("Breadcrumb", () => {
  it("renders a navigation landmark with aria-label breadcrumb", () => {
    render(<BreadcrumbFixture />);
    expect(
      screen.getByRole("navigation", { name: "breadcrumb" })
    ).toHaveAttribute("data-slot", "breadcrumb");
  });

  it("renders breadcrumb links as anchors", () => {
    render(<BreadcrumbFixture />);
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink.tagName).toBe("A");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders current page with aria-current and aria-disabled", () => {
    render(<BreadcrumbFixture />);
    const page = screen.getByText("Components");
    expect(page).toHaveAttribute("aria-current", "page");
    expect(page).toHaveAttribute("aria-disabled", "true");
    expect(page).toHaveAttribute("data-slot", "breadcrumb-page");
  });

  it("renders separator with aria-hidden and data-slot", () => {
    render(<BreadcrumbFixture />);
    const separators = document.querySelectorAll(
      "[data-slot=breadcrumb-separator]"
    );
    expect(separators.length).toBe(2);
    expect(separators[0]).toHaveAttribute("aria-hidden", "true");
  });

  it("renders BreadcrumbList as an ordered list", () => {
    render(<BreadcrumbFixture />);
    const list = document.querySelector("[data-slot=breadcrumb-list]");
    expect(list?.tagName).toBe("OL");
  });

  it("renders BreadcrumbEllipsis with data-slot and aria-hidden", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const ellipsis = document.querySelector("[data-slot=breadcrumb-ellipsis]");
    expect(ellipsis).toHaveAttribute("data-slot", "breadcrumb-ellipsis");
    expect(ellipsis).toHaveAttribute("aria-hidden", "true");
  });
});
