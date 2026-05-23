import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
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
} from "./alert-dialog";

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
});
