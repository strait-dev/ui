import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

// Vaul (the underlying drawer library) calls window.matchMedia in effects.
// jsdom does not implement matchMedia, so we stub it before the tests run.
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

function Fixture() {
  return (
    <Drawer>
      <DrawerTrigger>Open drawer</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Refine the list below.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">Drawer body content.</div>
      </DrawerContent>
    </Drawer>
  );
}

describe("Drawer", () => {
  it("does not show drawer content before the trigger is clicked", () => {
    render(<Fixture />);
    expect(screen.queryByText("Filters")).not.toBeInTheDocument();
  });

  it("opens the drawer when the trigger is clicked", async () => {
    render(<Fixture />);
    await userEvent.click(screen.getByRole("button", { name: "Open drawer" }));
    expect(await screen.findByText("Filters")).toBeInTheDocument();
  });

  it("renders title, description, and body content when open", async () => {
    render(<Fixture />);
    await userEvent.click(screen.getByRole("button", { name: "Open drawer" }));
    expect(await screen.findByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Refine the list below.")).toBeInTheDocument();
    expect(screen.getByText("Drawer body content.")).toBeInTheDocument();
  });

  it("content title has the correct data-slot attribute", async () => {
    render(<Fixture />);
    await userEvent.click(screen.getByRole("button", { name: "Open drawer" }));
    const title = await screen.findByText("Filters");
    expect(title).toHaveAttribute("data-slot", "drawer-title");
  });

  it("renders content when open is controlled to true", async () => {
    render(
      <Drawer open>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Pre-opened drawer</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    expect(await screen.findByText("Pre-opened drawer")).toBeInTheDocument();
  });
});
