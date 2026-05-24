import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { Tag, TagGroup, TagList, tagVariants } from "./tag-group";

beforeAll(() => {
  globalThis.ResizeObserver ||= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Element.prototype.scrollIntoView ||= () => {};
});

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const items = ["alpha", "beta", "gamma"];

function BasicGroup() {
  return (
    <TagGroup label="Tags">
      <TagList>
        {items.map((t) => (
          <Tag id={t} key={t} textValue={t}>
            {t}
          </Tag>
        ))}
      </TagList>
    </TagGroup>
  );
}

/* ------------------------------------------------------------------ */
/* Tests                                                               */
/* ------------------------------------------------------------------ */

describe("TagGroup", () => {
  it("renders the group with data-slot='tag-group'", () => {
    render(<BasicGroup />);
    expect(
      document.querySelector("[data-slot='tag-group']")
    ).toBeInTheDocument();
  });

  it("renders the list with data-slot='tag-list'", () => {
    render(<BasicGroup />);
    expect(
      document.querySelector("[data-slot='tag-list']")
    ).toBeInTheDocument();
  });

  it("renders one tag per item with data-slot='tag'", () => {
    render(<BasicGroup />);
    const tags = document.querySelectorAll("[data-slot='tag']");
    expect(tags).toHaveLength(items.length);
  });

  it("renders the label text", () => {
    render(<BasicGroup />);
    expect(screen.getByText("Tags")).toBeInTheDocument();
  });

  it("calls onSelectionChange when a tag is clicked in single-select mode", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    render(
      <TagGroup onSelectionChange={onSelectionChange} selectionMode="single">
        <TagList>
          {items.map((t) => (
            <Tag id={t} key={t} textValue={t}>
              {t}
            </Tag>
          ))}
        </TagList>
      </TagGroup>
    );

    await user.click(screen.getByText("alpha"));
    expect(onSelectionChange).toHaveBeenCalled();
  });

  it("calls onRemove when the remove button is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(
      <TagGroup onRemove={onRemove}>
        <TagList>
          {items.map((t) => (
            <Tag id={t} key={t} textValue={t}>
              {t}
            </Tag>
          ))}
        </TagList>
      </TagGroup>
    );

    // Find all remove buttons (slot="remove" renders a button)
    const removeBtns = document.querySelectorAll("button[slot='remove']");
    expect(removeBtns.length).toBeGreaterThan(0);

    await user.click(removeBtns[0] as HTMLElement);
    expect(onRemove).toHaveBeenCalled();
  });

  it("applies variant classes to the tag element", () => {
    const { container } = render(
      <TagGroup>
        <TagList>
          <Tag id="t1" textValue="Default" variant="default">
            Default
          </Tag>
          <Tag id="t2" textValue="Secondary" variant="secondary">
            Secondary
          </Tag>
          <Tag id="t3" textValue="Outline" variant="outline">
            Outline
          </Tag>
        </TagList>
      </TagGroup>
    );

    const tags = container.querySelectorAll("[data-slot='tag']");
    expect(tags[0]).toHaveClass("bg-secondary");
    expect(tags[1]).toHaveClass("bg-muted");
    expect(tags[2]).toHaveClass("border-input");
  });

  it("marks a disabled tag with data-disabled attribute", () => {
    render(
      <TagGroup disabledKeys={["beta"]}>
        <TagList>
          {items.map((t) => (
            <Tag id={t} key={t} textValue={t}>
              {t}
            </Tag>
          ))}
        </TagList>
      </TagGroup>
    );

    const betaTag = screen
      .getByText("beta")
      .closest("[data-slot='tag']") as HTMLElement;
    expect(betaTag).toHaveAttribute("data-disabled");
  });

  it("forwards a custom className onto the tag-group wrapper", () => {
    render(
      <TagGroup className="custom-group-class">
        <TagList>
          <Tag id="t" textValue="T">
            T
          </Tag>
        </TagList>
      </TagGroup>
    );

    const group = document.querySelector("[data-slot='tag-group']");
    expect(group).toHaveClass("custom-group-class");
  });

  it("tagVariants helper returns expected classes for outline variant", () => {
    const cls = tagVariants({ variant: "outline" });
    expect(cls).toContain("border-input");
    expect(cls).toContain("bg-transparent");
  });
});
