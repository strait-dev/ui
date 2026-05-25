import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Scrollspy } from "./scrollspy";

type Section = { id: string; title: string };

const SECTIONS: Section[] = [
  { id: "one", title: "One" },
  { id: "two", title: "Two" },
  { id: "three", title: "Three" },
];

function Harness({
  className,
  onUpdate,
}: {
  className?: string;
  onUpdate?: (id: string) => void;
}) {
  return (
    <div>
      <Scrollspy className={className} history={false} onUpdate={onUpdate}>
        <nav>
          {SECTIONS.map((section) => (
            <a
              data-scrollspy-anchor={section.id}
              href={`#${section.id}`}
              key={section.id}
            >
              {section.title}
            </a>
          ))}
        </nav>
      </Scrollspy>
      {SECTIONS.map((section) => (
        <section id={section.id} key={section.id}>
          {section.title}
        </section>
      ))}
    </div>
  );
}

describe("Scrollspy", () => {
  it("renders the root with the scrollspy data-slot", () => {
    const { container } = render(<Harness />);
    expect(container.querySelector('[data-slot="scrollspy"]')).not.toBeNull();
  });

  it("renders each anchor link", () => {
    render(<Harness />);
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("forwards className to the root", () => {
    const { container } = render(<Harness className="root-x" />);
    expect(container.querySelector('[data-slot="scrollspy"]')).toHaveClass(
      "root-x"
    );
  });

  it("marks an anchor active once mounted", async () => {
    const { container } = render(<Harness />);
    await waitFor(() => {
      expect(
        container.querySelectorAll('[data-active="true"]').length
      ).toBeGreaterThan(0);
    });
  });

  it("activates the clicked anchor and reports it via onUpdate", async () => {
    const onUpdate = vi.fn();
    render(<Harness onUpdate={onUpdate} />);
    const link = screen.getByRole("link", { name: "Two" });
    fireEvent.click(link);
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith("two");
      expect(link).toHaveAttribute("data-active", "true");
    });
  });
});
