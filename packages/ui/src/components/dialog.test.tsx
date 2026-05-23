import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

beforeAll(() => {
  globalThis.ResizeObserver ||= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Element.prototype.scrollIntoView ||= () => {};
});

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

  describe("DialogContent size variants", () => {
    it("applies sm:max-w-2xl for size=lg", async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent size="lg">
            <DialogHeader>
              <DialogTitle>Large dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
      const dialog = await screen.findByRole("dialog");
      expect(dialog.className).toContain("sm:max-w-2xl");
    });

    it("applies sm:max-w-sm for the default size (matching original max-width)", async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Default dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
      const dialog = await screen.findByRole("dialog");
      expect(dialog.className).toContain("sm:max-w-sm");
    });

    it("applies sm:max-w-sm for size=sm", async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>Small dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
      const dialog = await screen.findByRole("dialog");
      expect(dialog.className).toContain("sm:max-w-sm");
    });

    it("applies sm:max-w-4xl for size=xl", async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent size="xl">
            <DialogHeader>
              <DialogTitle>XL dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
      const dialog = await screen.findByRole("dialog");
      expect(dialog.className).toContain("sm:max-w-4xl");
    });

    it("applies full-size classes for size=full", async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent size="full">
            <DialogHeader>
              <DialogTitle>Full dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
      const dialog = await screen.findByRole("dialog");
      expect(dialog.className).toContain("max-h-[calc(100vh-2rem)]");
    });
  });

  describe("DialogHeader accent prop", () => {
    it("applies destructive tint class when accent=destructive", async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogHeader accent="destructive">
              <DialogTitle>Delete account</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
      await screen.findByRole("dialog");
      const header = document.querySelector("[data-slot='dialog-header']");
      expect(header?.className).toContain("text-destructive");
    });

    it("does not apply destructive tint by default", async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Normal dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
      await screen.findByRole("dialog");
      const header = document.querySelector("[data-slot='dialog-header']");
      expect(header?.className).not.toContain("text-destructive");
    });
  });
});
