import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./popover";

function Fixture() {
  return (
    <Popover>
      <PopoverTrigger>More info</PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Details</PopoverTitle>
          <PopoverDescription>
            Extra context about this item.
          </PopoverDescription>
        </PopoverHeader>
        <p>Body content here.</p>
      </PopoverContent>
    </Popover>
  );
}

describe("Popover", () => {
  it("does not show popover content before trigger is clicked", () => {
    render(<Fixture />);
    expect(screen.queryByText("Details")).not.toBeInTheDocument();
  });

  it("opens the popover when the trigger is clicked", async () => {
    render(<Fixture />);
    await userEvent.click(screen.getByRole("button", { name: "More info" }));
    expect(await screen.findByText("Details")).toBeInTheDocument();
  });

  it("shows the description and body content when open", async () => {
    render(<Fixture />);
    await userEvent.click(screen.getByRole("button", { name: "More info" }));
    expect(
      await screen.findByText("Extra context about this item.")
    ).toBeInTheDocument();
    expect(screen.getByText("Body content here.")).toBeInTheDocument();
  });

  it("closes the popover when the trigger is clicked again", async () => {
    render(<Fixture />);
    const trigger = screen.getByRole("button", { name: "More info" });
    await userEvent.click(trigger);
    await screen.findByText("Details");
    await userEvent.click(trigger);
    expect(screen.queryByText("Details")).not.toBeInTheDocument();
  });

  it("renders content when open is controlled to true", async () => {
    render(
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <p>Controlled popover content.</p>
        </PopoverContent>
      </Popover>
    );
    expect(
      await screen.findByText("Controlled popover content.")
    ).toBeInTheDocument();
  });
});
