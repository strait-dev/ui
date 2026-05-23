import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./alert";

describe("Alert", () => {
  it("renders with role alert and data-slot", () => {
    render(<Alert>Message</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("data-slot", "alert");
  });

  it("renders AlertTitle and AlertDescription with correct data-slots", () => {
    render(
      <Alert>
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>Please try again later.</AlertDescription>
      </Alert>
    );
    expect(screen.getByText("Something went wrong")).toHaveAttribute(
      "data-slot",
      "alert-title"
    );
    expect(screen.getByText("Please try again later.")).toHaveAttribute(
      "data-slot",
      "alert-description"
    );
  });

  it("applies destructive variant classes", () => {
    render(<Alert variant="destructive">Danger</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("text-destructive-accent");
  });

  it("applies default variant classes", () => {
    render(<Alert variant="default">Info</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("bg-card");
  });

  it.each([
    ["info", "text-info-accent"],
    ["success", "text-success-accent"],
    ["warning", "text-warning-accent"],
  ] as const)("applies %s intent variant classes", (variant, expected) => {
    render(<Alert variant={variant}>Intent</Alert>);
    expect(screen.getByRole("alert")).toHaveClass(expected);
  });

  it("renders AlertAction with data-slot", () => {
    render(
      <Alert>
        <AlertTitle>Notice</AlertTitle>
        <AlertAction>
          <button type="button">Dismiss</button>
        </AlertAction>
      </Alert>
    );
    const action = screen
      .getByText("Dismiss")
      .closest("[data-slot=alert-action]");
    expect(action).toHaveAttribute("data-slot", "alert-action");
  });

  it("merges custom className", () => {
    render(<Alert className="custom-class">Test</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("custom-class");
  });
});
