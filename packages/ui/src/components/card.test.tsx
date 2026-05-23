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

  it("applies data-size='lg' when size='lg'", () => {
    const { container } = render(<Card size="lg">Content</Card>);
    expect(container.querySelector("[data-slot='card']")).toHaveAttribute(
      "data-size",
      "lg"
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

/* ------------------------------------------------------------------ */
/* Variant axis                                                        */
/* ------------------------------------------------------------------ */

describe("Card variant prop", () => {
  it("renders variant='default' with bg-card and ring classes", () => {
    const { container } = render(<Card variant="default">Content</Card>);
    const card = container.querySelector("[data-slot='card']");
    expect(card?.className).toContain("bg-card");
    expect(card?.className).toContain("ring-1");
  });

  it("renders variant='outline' with border class and bg-card", () => {
    const { container } = render(<Card variant="outline">Content</Card>);
    const card = container.querySelector("[data-slot='card']");
    expect(card?.className).toContain("border");
    expect(card?.className).toContain("bg-card");
    // should NOT have ring-1
    expect(card?.className).not.toContain("ring-1");
  });

  it("renders variant='ghost' with bg-transparent", () => {
    const { container } = render(<Card variant="ghost">Content</Card>);
    const card = container.querySelector("[data-slot='card']");
    expect(card?.className).toContain("bg-transparent");
    // should NOT have ring-1 or border from cardVariants
    expect(card?.className).not.toContain("ring-1");
  });
});

/* ------------------------------------------------------------------ */
/* lg size cascade                                                     */
/* ------------------------------------------------------------------ */

describe("Card size='lg' cascade", () => {
  it("applies lg gap/py classes on the root", () => {
    const { container } = render(<Card size="lg">Content</Card>);
    const card = container.querySelector("[data-slot='card']");
    expect(card?.className).toContain("data-[size=lg]:gap-6");
    expect(card?.className).toContain("data-[size=lg]:py-6");
  });

  it("applies lg px class on CardHeader", () => {
    const { container } = render(
      <Card size="lg">
        <CardHeader>Header</CardHeader>
      </Card>
    );
    const header = container.querySelector("[data-slot='card-header']");
    expect(header?.className).toContain("group-data-[size=lg]/card:px-6");
  });

  it("applies lg px class on CardContent", () => {
    const { container } = render(
      <Card size="lg">
        <CardContent>Body</CardContent>
      </Card>
    );
    const content = container.querySelector("[data-slot='card-content']");
    expect(content?.className).toContain("group-data-[size=lg]/card:px-6");
  });

  it("applies lg px/py classes on CardFooter", () => {
    const { container } = render(
      <Card size="lg">
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    const footer = container.querySelector("[data-slot='card-footer']");
    expect(footer?.className).toContain("group-data-[size=lg]/card:px-6");
    expect(footer?.className).toContain("group-data-[size=lg]/card:py-3.5");
  });
});

/* ------------------------------------------------------------------ */
/* Sub-parts                                                           */
/* ------------------------------------------------------------------ */

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
