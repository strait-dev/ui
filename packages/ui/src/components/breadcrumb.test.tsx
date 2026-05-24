import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";

beforeAll(() => {
  globalThis.ResizeObserver ||= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Element.prototype.scrollIntoView ||= () => {};
});

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

  // -------------------------------------------------------------------------
  // Size axis
  // -------------------------------------------------------------------------

  it("sets data-size=default on the nav when no size prop is given", () => {
    render(<BreadcrumbFixture />);
    const nav = screen.getByRole("navigation", { name: "breadcrumb" });
    expect(nav).toHaveAttribute("data-size", "default");
  });

  it("sets data-size=sm on the nav when size='sm' is given", () => {
    render(
      <Breadcrumb size="sm">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const nav = screen.getByRole("navigation", { name: "breadcrumb" });
    expect(nav).toHaveAttribute("data-size", "sm");
  });

  it("sets data-size=lg on the nav when size='lg' is given", () => {
    render(
      <Breadcrumb size="lg">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const nav = screen.getByRole("navigation", { name: "breadcrumb" });
    expect(nav).toHaveAttribute("data-size", "lg");
  });

  // -------------------------------------------------------------------------
  // Default separator prop
  // -------------------------------------------------------------------------

  it("renders per-item separators when no root separator prop is given", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Docs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    const separators = document.querySelectorAll(
      "[data-slot=breadcrumb-separator]"
    );
    expect(separators.length).toBe(1);
  });

  it("renders custom root separator via the separator prop", () => {
    render(
      <Breadcrumb separator={<span data-testid="custom-sep">/</span>}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Docs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    // The custom separator node should be rendered inside the separator li
    expect(screen.getByTestId("custom-sep")).toBeInTheDocument();
  });

  it("prefers per-item children over the root separator prop", () => {
    render(
      <Breadcrumb separator={<span data-testid="root-sep">/</span>}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {/* Explicit children override the root separator */}
          <BreadcrumbSeparator>
            <span data-testid="item-sep">›</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Docs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId("item-sep")).toBeInTheDocument();
    expect(screen.queryByTestId("root-sep")).not.toBeInTheDocument();
  });
});
