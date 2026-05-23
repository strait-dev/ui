import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  alertDialogContentVariants,
} from "./alert-dialog";

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
    <AlertDialog>
      <AlertDialogTrigger>Delete account</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

describe("AlertDialog", () => {
  it("does not show alert dialog content before the trigger is clicked", () => {
    render(<Fixture />);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("opens the alert dialog when the trigger is clicked", async () => {
    render(<Fixture />);
    await userEvent.click(
      screen.getByRole("button", { name: "Delete account" })
    );
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
  });

  it("renders the title and description when open", async () => {
    render(<Fixture />);
    await userEvent.click(
      screen.getByRole("button", { name: "Delete account" })
    );
    expect(await screen.findByText("Are you sure?")).toBeInTheDocument();
    expect(
      screen.getByText("This will permanently delete your account.")
    ).toBeInTheDocument();
  });

  it("closes when the cancel button is clicked", async () => {
    render(<Fixture />);
    await userEvent.click(
      screen.getByRole("button", { name: "Delete account" })
    );
    await screen.findByRole("alertdialog");
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("renders content when defaultOpen is true", async () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opened by default</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("Opened by default")).toBeInTheDocument();
  });

  describe("size axis", () => {
    it("applies data-size='default' by default", async () => {
      render(<Fixture />);
      await userEvent.click(
        screen.getByRole("button", { name: "Delete account" })
      );
      const dialog = await screen.findByRole("alertdialog");
      expect(dialog).toHaveAttribute("data-size", "default");
    });

    it("applies data-size='sm' when size='sm'", async () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Small dialog</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
      const dialog = await screen.findByRole("alertdialog");
      expect(dialog).toHaveAttribute("data-size", "sm");
    });

    it("applies data-size='lg' when size='lg'", async () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent size="lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Large dialog</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
      const dialog = await screen.findByRole("alertdialog");
      expect(dialog).toHaveAttribute("data-size", "lg");
    });

    it("applies data-size='xl' when size='xl'", async () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent size="xl">
            <AlertDialogHeader>
              <AlertDialogTitle>XL dialog</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
      const dialog = await screen.findByRole("alertdialog");
      expect(dialog).toHaveAttribute("data-size", "xl");
    });

    it("applies data-size='full' when size='full'", async () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent size="full">
            <AlertDialogHeader>
              <AlertDialogTitle>Full dialog</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
      const dialog = await screen.findByRole("alertdialog");
      expect(dialog).toHaveAttribute("data-size", "full");
    });

    it("alertDialogContentVariants generates expected class for lg", () => {
      expect(alertDialogContentVariants({ size: "lg" })).toContain(
        "sm:max-w-2xl"
      );
    });

    it("alertDialogContentVariants generates expected class for xl", () => {
      expect(alertDialogContentVariants({ size: "xl" })).toContain(
        "sm:max-w-4xl"
      );
    });
  });

  describe("accent axis on AlertDialogHeader", () => {
    it("applies destructive accent class to the header when accent='destructive'", async () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader accent="destructive">
              <AlertDialogTitle>Delete everything</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
      await screen.findByRole("alertdialog");
      const header = screen
        .getByText("Delete everything")
        .closest("[data-slot='alert-dialog-header']");
      expect(header).not.toBeNull();
      // The destructive child-selector class is present on the header element
      expect(header?.className).toContain(
        "*:data-[slot=alert-dialog-title]:text-destructive"
      );
    });

    it("does not apply destructive class when accent is not set", async () => {
      render(
        <AlertDialog defaultOpen>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Normal title</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
      await screen.findByRole("alertdialog");
      const header = screen
        .getByText("Normal title")
        .closest("[data-slot='alert-dialog-header']");
      expect(header?.className).not.toContain("text-destructive");
    });
  });
});
