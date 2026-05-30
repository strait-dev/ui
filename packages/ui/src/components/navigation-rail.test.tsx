import { Home01Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import {
  NavigationRail,
  NavigationRailFooter,
  NavigationRailHeader,
  NavigationRailItem,
  NavigationRailSection,
} from "./navigation-rail";

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

function BasicRail() {
  return (
    <NavigationRail>
      <NavigationRailHeader>
        <span>Logo</span>
      </NavigationRailHeader>
      <NavigationRailSection>
        <NavigationRailItem active icon={Home01Icon} label="Home" />
        <NavigationRailItem icon={Settings01Icon} label="Settings" />
      </NavigationRailSection>
      <NavigationRailFooter>
        <NavigationRailItem icon={Home01Icon} label="Profile" />
      </NavigationRailFooter>
    </NavigationRail>
  );
}

describe("NavigationRail", () => {
  it("renders with data-slot='navigation-rail'", () => {
    const { container } = render(<BasicRail />);
    expect(
      container.querySelector("[data-slot='navigation-rail']")
    ).toBeInTheDocument();
  });

  it("renders header with data-slot='navigation-rail-header'", () => {
    const { container } = render(<BasicRail />);
    expect(
      container.querySelector("[data-slot='navigation-rail-header']")
    ).toBeInTheDocument();
  });

  it("renders section with data-slot='navigation-rail-section'", () => {
    const { container } = render(<BasicRail />);
    expect(
      container.querySelector("[data-slot='navigation-rail-section']")
    ).toBeInTheDocument();
  });

  it("renders footer with data-slot='navigation-rail-footer'", () => {
    const { container } = render(<BasicRail />);
    expect(
      container.querySelector("[data-slot='navigation-rail-footer']")
    ).toBeInTheDocument();
  });

  it("renders item buttons with data-slot='navigation-rail-item'", () => {
    const { container } = render(<BasicRail />);
    const items = container.querySelectorAll(
      "[data-slot='navigation-rail-item']"
    );
    expect(items.length).toBeGreaterThanOrEqual(2);
  });

  it("renders sr-only labels for accessibility", () => {
    render(<BasicRail />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders header content", () => {
    render(<BasicRail />);
    expect(screen.getByText("Logo")).toBeInTheDocument();
  });

  it("calls onClick when item is clicked", async () => {
    const onClick = vi.fn();
    render(
      <NavigationRail>
        <NavigationRailSection>
          <NavigationRailItem
            icon={Home01Icon}
            label="Home"
            onClick={onClick}
          />
        </NavigationRailSection>
      </NavigationRail>
    );
    const button = screen.getByRole("button", { name: /home/i });
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders disabled item", () => {
    render(
      <NavigationRail>
        <NavigationRailSection>
          <NavigationRailItem disabled icon={Home01Icon} label="Home" />
        </NavigationRailSection>
      </NavigationRail>
    );
    const button = screen.getByRole("button", { name: /home/i });
    expect(button).toBeDisabled();
  });

  it("applies right orientation", () => {
    const { container } = render(
      <NavigationRail orientation="right">
        <NavigationRailSection>
          <NavigationRailItem icon={Home01Icon} label="Home" />
        </NavigationRailSection>
      </NavigationRail>
    );
    const rail = container.querySelector("[data-slot='navigation-rail']");
    expect(rail).toHaveClass("order-last");
  });
});
