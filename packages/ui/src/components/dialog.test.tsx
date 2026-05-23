import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

function Fixture() {
  return (
    <Dialog>
      <DialogTrigger>Open dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm deletion</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button type="button">Delete</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("does not show dialog content before the trigger is clicked", () => {
    render(<Fixture />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the dialog when the trigger is clicked", async () => {
    render(<Fixture />);
    await userEvent.click(screen.getByRole("button", { name: "Open dialog" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("renders the dialog title and description", async () => {
    render(<Fixture />);
    await userEvent.click(screen.getByRole("button", { name: "Open dialog" }));
    expect(await screen.findByText("Confirm deletion")).toBeInTheDocument();
    expect(
      screen.getByText("This action cannot be undone.")
    ).toBeInTheDocument();
  });

  it("closes the dialog when the built-in close button is clicked", async () => {
    render(<Fixture />);
    await userEvent.click(screen.getByRole("button", { name: "Open dialog" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    const closeBtn = screen.getByRole("button", { name: /close/i });
    await userEvent.click(closeBtn);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders content when dialog is opened with defaultOpen", async () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Already open</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Already open")).toBeInTheDocument();
  });
});
