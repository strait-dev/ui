import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

function Fixture() {
  return (
    <Accordion>
      <AccordionItem value="shipping">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>Ships in 2 days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionTrigger>Returns</AccordionTrigger>
        <AccordionContent>30 day window.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("renders triggers collapsed by default", () => {
    render(<Fixture />);
    const trigger = screen.getByRole("button", { name: "Shipping" });
    expect(trigger).toHaveAttribute("data-slot", "accordion-trigger");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("expands a panel when its trigger is clicked", async () => {
    render(<Fixture />);
    const trigger = screen.getByRole("button", { name: "Shipping" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Ships in 2 days.")).toBeVisible();
  });

  it("collapses an open panel when its trigger is clicked again", async () => {
    render(<Fixture />);
    const trigger = screen.getByRole("button", { name: "Shipping" });
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("applies the default item divider with no variant", () => {
    const { container } = render(<Fixture />);
    const item = container.querySelector('[data-slot="accordion-item"]');
    expect(item).toHaveClass("not-last:border-b");
  });

  it("applies outline item classes when variant=outline", () => {
    const { container } = render(
      <Accordion variant="outline">
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>Body</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const item = container.querySelector('[data-slot="accordion-item"]');
    expect(item).toHaveClass("rounded-lg", "border", "px-4");
  });

  it("applies solid item classes when variant=solid", () => {
    const { container } = render(
      <Accordion variant="solid">
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>Body</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const item = container.querySelector('[data-slot="accordion-item"]');
    expect(item).toHaveClass("rounded-lg", "bg-muted", "px-4");
  });

  it("renders chevron icons by default for the trigger indicator", () => {
    const { container } = render(<Fixture />);
    expect(
      container.querySelectorAll('[data-slot="accordion-trigger-icon"]').length
    ).toBe(4);
  });

  it("renders plus/minus icons when indicator='plus-minus'", () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger indicator="plus-minus">A</AccordionTrigger>
          <AccordionContent>Body</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(
      container.querySelectorAll('[data-slot="accordion-trigger-icon"]').length
    ).toBe(2);
  });

  it("omits the built-in indicator when indicator='none'", () => {
    const { container } = render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger indicator="none">A</AccordionTrigger>
          <AccordionContent>Body</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(
      container.querySelectorAll('[data-slot="accordion-trigger-icon"]').length
    ).toBe(0);
  });

  it("lets an item override the inherited variant", () => {
    const { container } = render(
      <Accordion variant="solid">
        <AccordionItem value="a" variant="outline">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>Body</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const item = container.querySelector('[data-slot="accordion-item"]');
    expect(item).toHaveClass("border");
    expect(item).not.toHaveClass("bg-muted/50");
  });
});
