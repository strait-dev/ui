import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "./item";

function ItemFixture() {
  return (
    <ItemGroup>
      <Item>
        <ItemMedia>icon</ItemMedia>
        <ItemContent>
          <ItemTitle>Jane Smith</ItemTitle>
          <ItemDescription>Admin</ItemDescription>
        </ItemContent>
        <ItemActions>
          <button type="button">More</button>
        </ItemActions>
      </Item>
    </ItemGroup>
  );
}

describe("Item", () => {
  it("ItemGroup renders with role list", () => {
    render(<ItemFixture />);
    expect(screen.getByRole("list")).toHaveAttribute("data-slot", "item-group");
  });

  it("Item renders as a div by default", () => {
    render(<Item>content</Item>);
    const item = document.querySelector("[data-slot=item]");
    expect(item?.tagName).toBe("DIV");
  });

  it("Item renders as an anchor when given a render prop", () => {
    render(
      // biome-ignore lint/a11y/useAnchorContent: Item injects children into the anchor at runtime.
      <Item render={<a href="/users/1" />}>
        <ItemTitle>Link Item</ItemTitle>
      </Item>
    );
    const item = document.querySelector("[data-slot=item]");
    expect(item?.tagName).toBe("A");
    expect(item).toHaveAttribute("href", "/users/1");
  });

  it("renders content parts with correct data-slots", () => {
    render(<ItemFixture />);
    expect(screen.getByText("Jane Smith")).toHaveAttribute(
      "data-slot",
      "item-title"
    );
    expect(screen.getByText("Admin")).toHaveAttribute(
      "data-slot",
      "item-description"
    );
    expect(
      screen.getByText("More").closest("[data-slot=item-actions]")
    ).toHaveAttribute("data-slot", "item-actions");
  });

  it("ItemMedia applies variant attribute", () => {
    render(<ItemMedia variant="icon">svg</ItemMedia>);
    const media = screen.getByText("svg").closest("[data-slot=item-media]");
    expect(media).toHaveAttribute("data-variant", "icon");
  });

  it("ItemHeader and ItemFooter render with correct data-slots", () => {
    render(
      <Item>
        <ItemHeader>header</ItemHeader>
        <ItemFooter>footer</ItemFooter>
      </Item>
    );
    expect(
      screen.getByText("header").closest("[data-slot=item-header]")
    ).toHaveAttribute("data-slot", "item-header");
    expect(
      screen.getByText("footer").closest("[data-slot=item-footer]")
    ).toHaveAttribute("data-slot", "item-footer");
  });
});
