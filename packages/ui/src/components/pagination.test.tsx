import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

function PaginationFixture() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="/page/1" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/page/1">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/page/2" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="/page/3" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

describe("Pagination", () => {
  it("renders a navigation landmark with aria-label pagination", () => {
    render(<PaginationFixture />);
    expect(
      screen.getByRole("navigation", { name: "pagination" })
    ).toHaveAttribute("data-slot", "pagination");
  });

  it("renders page links as anchors with data-slot", () => {
    render(<PaginationFixture />);
    const links = document.querySelectorAll("[data-slot=pagination-link]");
    expect(links.length).toBeGreaterThan(0);
    expect(links[0].tagName).toBe("A");
  });

  it("active link has aria-current page and data-active", () => {
    render(<PaginationFixture />);
    const activeLink = document.querySelector(
      "[data-slot=pagination-link][data-active=true]"
    );
    expect(activeLink).toHaveAttribute("aria-current", "page");
    expect(activeLink).toHaveAttribute("href", "/page/2");
  });

  it("renders Previous and Next links with aria-labels", () => {
    render(<PaginationFixture />);
    // PaginationLink renders as <a role="button"> via Button nativeButton=false
    expect(
      screen.getByRole("button", { name: "Go to previous page" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to next page" })
    ).toBeInTheDocument();
  });

  it("renders PaginationEllipsis with data-slot and aria-hidden", () => {
    render(<PaginationFixture />);
    const ellipsis = document.querySelector("[data-slot=pagination-ellipsis]");
    expect(ellipsis).toHaveAttribute("data-slot", "pagination-ellipsis");
    expect(ellipsis).toHaveAttribute("aria-hidden");
  });

  it("renders PaginationContent as an unordered list", () => {
    render(<PaginationFixture />);
    const list = document.querySelector("[data-slot=pagination-content]");
    expect(list?.tagName).toBe("UL");
  });
});
