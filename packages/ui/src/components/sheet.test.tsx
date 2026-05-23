import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

function Fixture({
  side,
}: {
  side?: "top" | "right" | "bottom" | "left";
} = {}) {
  return (
    <Sheet>
      <SheetTrigger>Open settings</SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Manage your preferences.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

describe("Sheet", () => {
  it("does not show sheet content before the trigger is clicked", () => {
    render(<Fixture />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the sheet when the trigger is clicked", async () => {
    render(<Fixture />);
    await userEvent.click(
      screen.getByRole("button", { name: "Open settings" })
    );
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("renders the title and description when open", async () => {
    render(<Fixture />);
    await userEvent.click(
      screen.getByRole("button", { name: "Open settings" })
    );
    expect(await screen.findByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Manage your preferences.")).toBeInTheDocument();
  });

  it("closes when the built-in close button is clicked", async () => {
    render(<Fixture />);
    await userEvent.click(
      screen.getByRole("button", { name: "Open settings" })
    );
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("applies data-side to the sheet content", async () => {
    render(<Fixture side="left" />);
    await userEvent.click(
      screen.getByRole("button", { name: "Open settings" })
    );
    const content = await screen.findByRole("dialog");
    expect(content).toHaveAttribute("data-side", "left");
  });
});
