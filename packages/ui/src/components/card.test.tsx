import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

describe("Card", () => {
  it("renders with the card data-slot", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.querySelector("[data-slot='card']")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(<Card>Hello Card</Card>);
    expect(screen.getByText("Hello Card")).toBeInTheDocument();
  });

  it("applies data-size='default' by default", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.querySelector("[data-slot='card']")).toHaveAttribute(
      "data-size",
      "default"
    );
  });

  it("applies data-size='sm' when size='sm'", () => {
    const { container } = render(<Card size="sm">Content</Card>);
    expect(container.querySelector("[data-slot='card']")).toHaveAttribute(
      "data-size",
      "sm"
    );
  });

  it("forwards extra className", () => {
    const { container } = render(
      <Card className="my-custom-class">Content</Card>
    );
    expect(container.querySelector("[data-slot='card']")).toHaveClass(
      "my-custom-class"
    );
  });
});

describe("CardHeader", () => {
  it("renders with the card-header data-slot", () => {
    const { container } = render(
      <Card>
        <CardHeader>Header</CardHeader>
      </Card>
    );
    expect(
      container.querySelector("[data-slot='card-header']")
    ).toBeInTheDocument();
  });
});

describe("CardTitle", () => {
  it("renders with the card-title data-slot", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>My Title</CardTitle>
        </CardHeader>
      </Card>
    );
    expect(
      container.querySelector("[data-slot='card-title']")
    ).toBeInTheDocument();
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });
});

describe("CardDescription", () => {
  it("renders with the card-description data-slot", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardDescription>A description</CardDescription>
        </CardHeader>
      </Card>
    );
    expect(
      container.querySelector("[data-slot='card-description']")
    ).toBeInTheDocument();
    expect(screen.getByText("A description")).toBeInTheDocument();
  });
});

describe("CardAction", () => {
  it("renders with the card-action data-slot", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardAction>
            <button type="button">More</button>
          </CardAction>
        </CardHeader>
      </Card>
    );
    expect(
      container.querySelector("[data-slot='card-action']")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "More" })).toBeInTheDocument();
  });
});

describe("CardContent", () => {
  it("renders with the card-content data-slot", () => {
    const { container } = render(
      <Card>
        <CardContent>Body text</CardContent>
      </Card>
    );
    expect(
      container.querySelector("[data-slot='card-content']")
    ).toBeInTheDocument();
    expect(screen.getByText("Body text")).toBeInTheDocument();
  });
});

describe("CardFooter", () => {
  it("renders with the card-footer data-slot", () => {
    const { container } = render(
      <Card>
        <CardFooter>Footer text</CardFooter>
      </Card>
    );
    expect(
      container.querySelector("[data-slot='card-footer']")
    ).toBeInTheDocument();
    expect(screen.getByText("Footer text")).toBeInTheDocument();
  });
});

describe("Card composition", () => {
  it("renders a fully composed card with all sub-parts", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Invoice</CardTitle>
          <CardDescription>Due May 30</CardDescription>
          <CardAction>
            <button aria-label="More options" type="button">
              ...
            </button>
          </CardAction>
        </CardHeader>
        <CardContent>Invoice details here</CardContent>
        <CardFooter>Total: $100</CardFooter>
      </Card>
    );
    expect(container.querySelector("[data-slot='card']")).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='card-header']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='card-title']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='card-description']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='card-action']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='card-content']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='card-footer']")
    ).toBeInTheDocument();
    expect(screen.getByText("Invoice")).toBeInTheDocument();
    expect(screen.getByText("Due May 30")).toBeInTheDocument();
    expect(screen.getByText("Invoice details here")).toBeInTheDocument();
    expect(screen.getByText("Total: $100")).toBeInTheDocument();
  });
});
