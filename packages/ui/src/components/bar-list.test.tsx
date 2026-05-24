import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BarList } from "./bar-list";

const data = [
  { name: "/home", value: 4200 },
  { name: "/pricing", value: 980 },
  { name: "/docs", value: 2480 },
];

describe("BarList", () => {
  it("renders the root", () => {
    const { container } = render(<BarList data={data} />);
    expect(
      container.querySelector("[data-slot='bar-list']")
    ).toBeInTheDocument();
  });

  it("renders every row label", () => {
    const { getByText } = render(<BarList data={data} />);
    for (const row of data) {
      expect(getByText(row.name)).toBeInTheDocument();
    }
  });

  it("sorts descending by value by default", () => {
    const { container } = render(<BarList data={data} />);
    const labels = [...container.querySelectorAll("p.truncate")].map(
      (el) => el.textContent
    );
    // First column holds the names in sorted order: 4200, 2480, 980
    expect(labels.slice(0, 3)).toEqual(["/home", "/docs", "/pricing"]);
  });

  it("sorts ascending when requested", () => {
    const { container } = render(<BarList data={data} sortOrder="ascending" />);
    const labels = [...container.querySelectorAll("p.truncate")].map(
      (el) => el.textContent
    );
    expect(labels.slice(0, 3)).toEqual(["/pricing", "/docs", "/home"]);
  });

  it("formats the value column", () => {
    const { getByText } = render(
      <BarList data={data} valueFormatter={(v) => `${v} hits`} />
    );
    expect(getByText("4200 hits")).toBeInTheDocument();
  });

  it("renders rows as buttons when onValueChange is set", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <BarList data={data} onValueChange={onValueChange} />
    );
    const buttons = container.querySelectorAll("button");
    expect(buttons).toHaveLength(data.length);
    fireEvent.click(buttons[0] as HTMLButtonElement);
    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: "/home" })
    );
  });

  it("renders a link when a row has an href", () => {
    const { getByRole } = render(
      <BarList data={[{ name: "Pricing", value: 100, href: "/pricing" }]} />
    );
    const link = getByRole("link", { name: "Pricing" });
    expect(link).toHaveAttribute("href", "/pricing");
  });
});
