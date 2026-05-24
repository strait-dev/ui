import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import {
  createFilter,
  createFilterGroup,
  DEFAULT_I18N,
  DEFAULT_OPERATORS,
  type Filter,
  type FilterFieldConfig,
  Filters,
  FiltersContent,
} from "./filter";

// ---------------------------------------------------------------------------
// Polyfills required by cmdk / popover in jsdom
// ---------------------------------------------------------------------------

beforeAll(() => {
  globalThis.ResizeObserver ||= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Element.prototype.scrollIntoView ||= () => {};
});

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const textField: FilterFieldConfig = {
  key: "name",
  label: "Name",
  type: "text",
};

const selectField: FilterFieldConfig = {
  key: "status",
  label: "Status",
  type: "select",
  options: [
    { value: "active", label: "Active" },
    { value: "archived", label: "Archived" },
  ],
};

const multiField: FilterFieldConfig = {
  key: "labels",
  label: "Labels",
  type: "multiselect",
  options: [
    { value: "bug", label: "Bug" },
    { value: "feature", label: "Feature" },
  ],
};

const allFields = [textField, selectField, multiField];

function chip(container: HTMLElement, index = 0) {
  return container.querySelectorAll("[data-slot='filter-chip']")[index] as
    | HTMLElement
    | undefined;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Filters", () => {
  /* ---------------------------------------------------------------------- */
  /* Container + chips                                                        */
  /* ---------------------------------------------------------------------- */

  describe("rendering", () => {
    it("renders the container with data-slot='filter'", () => {
      const { container } = render(
        <Filters fields={allFields} filters={[]} onChange={vi.fn()} />
      );
      expect(
        container.querySelector("[data-slot='filter']")
      ).toBeInTheDocument();
    });

    it("renders no chips when there are no filters", () => {
      const { container } = render(
        <Filters fields={allFields} filters={[]} onChange={vi.fn()} />
      );
      expect(
        container.querySelectorAll("[data-slot='filter-chip']")
      ).toHaveLength(0);
    });

    it("renders one chip per filter", () => {
      const filters: Filter[] = [
        { id: "r1", field: "name", operator: "contains", values: ["Alice"] },
        { id: "r2", field: "status", operator: "is", values: ["active"] },
      ];
      const { container } = render(
        <Filters fields={allFields} filters={filters} onChange={vi.fn()} />
      );
      expect(
        container.querySelectorAll("[data-slot='filter-chip']")
      ).toHaveLength(2);
    });

    it("shows the field label, operator label, and value in a select chip", () => {
      const filters: Filter[] = [
        { id: "r1", field: "status", operator: "is", values: ["active"] },
      ];
      const { container } = render(
        <Filters fields={allFields} filters={filters} onChange={vi.fn()} />
      );
      const first = chip(container);
      expect(first?.textContent).toContain("Status");
      expect(
        first?.querySelector("[data-slot='filter-operator']")?.textContent
      ).toBe("is");
      // Select value resolves to its option label, not the raw value.
      expect(
        first?.querySelector("[data-slot='filter-value']")?.textContent
      ).toContain("Active");
    });

    it("renders a text field's value inside an input", () => {
      const filters: Filter[] = [
        { id: "r1", field: "name", operator: "contains", values: ["Alice"] },
      ];
      const { container } = render(
        <Filters fields={allFields} filters={filters} onChange={vi.fn()} />
      );
      const input = chip(container)?.querySelector("input");
      expect(input).toBeInTheDocument();
      expect((input as HTMLInputElement).value).toBe("Alice");
    });

    it("skips a filter whose field is unknown", () => {
      const filters: Filter[] = [
        { id: "r1", field: "ghost", operator: "is", values: ["x"] },
      ];
      const { container } = render(
        <Filters fields={allFields} filters={filters} onChange={vi.fn()} />
      );
      expect(
        container.querySelectorAll("[data-slot='filter-chip']")
      ).toHaveLength(0);
    });
  });

  /* ---------------------------------------------------------------------- */
  /* Operator value clearing                                                  */
  /* ---------------------------------------------------------------------- */

  describe("empty / not_empty operators", () => {
    it("hides the value selector for the empty operator", () => {
      const filters: Filter[] = [
        { id: "r1", field: "status", operator: "empty", values: [] },
      ];
      const { container } = render(
        <Filters fields={allFields} filters={filters} onChange={vi.fn()} />
      );
      const first = chip(container);
      expect(
        first?.querySelector("[data-slot='filter-operator']")?.textContent
      ).toBe("is empty");
      expect(
        first?.querySelector("[data-slot='filter-value']")
      ).not.toBeInTheDocument();
    });
  });

  /* ---------------------------------------------------------------------- */
  /* Removing a chip                                                          */
  /* ---------------------------------------------------------------------- */

  describe("removing", () => {
    it("calls onChange without the removed filter", () => {
      const onChange = vi.fn();
      const filters: Filter[] = [
        { id: "r1", field: "name", operator: "contains", values: ["Alice"] },
        { id: "r2", field: "status", operator: "is", values: ["active"] },
      ];
      const { container } = render(
        <Filters fields={allFields} filters={filters} onChange={onChange} />
      );
      const removeBtn = chip(container)?.querySelector(
        "[data-slot='filter-remove']"
      ) as HTMLElement;
      fireEvent.click(removeBtn);

      expect(onChange).toHaveBeenCalledOnce();
      const [next] = onChange.mock.calls[0] as [Filter[]];
      expect(next).toHaveLength(1);
      expect(next[0]?.id).toBe("r2");
    });
  });

  /* ---------------------------------------------------------------------- */
  /* Add-filter trigger                                                       */
  /* ---------------------------------------------------------------------- */

  describe("add-filter trigger", () => {
    it("renders the default trigger with data-slot='filter-add'", () => {
      const { container } = render(
        <Filters fields={allFields} filters={[]} onChange={vi.fn()} />
      );
      const trigger = container.querySelector("[data-slot='filter-add']");
      expect(trigger).toBeInTheDocument();
      expect(trigger?.textContent).toContain(DEFAULT_I18N.addFilter);
    });

    it("opens the field picker and lists selectable fields", () => {
      render(
        <Filters
          fields={[textField, selectField]}
          filters={[]}
          onChange={vi.fn()}
        />
      );
      fireEvent.click(screen.getByText(DEFAULT_I18N.addFilter));
      expect(screen.getAllByText("Name").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Status").length).toBeGreaterThan(0);
    });

    it("hides the trigger when every field is used and allowMultiple is false", () => {
      const filters: Filter[] = [
        { id: "r1", field: "name", operator: "is", values: ["a"] },
        { id: "r2", field: "status", operator: "is", values: ["active"] },
      ];
      const { container } = render(
        <Filters
          allowMultiple={false}
          fields={[textField, selectField]}
          filters={filters}
          onChange={vi.fn()}
        />
      );
      expect(
        container.querySelector("[data-slot='filter-add']")
      ).not.toBeInTheDocument();
    });

    it("uses the custom trigger element when provided", () => {
      render(
        <Filters
          fields={allFields}
          filters={[]}
          onChange={vi.fn()}
          trigger={<button type="button">Add a filter</button>}
        />
      );
      expect(screen.getByText("Add a filter")).toBeInTheDocument();
    });
  });

  /* ---------------------------------------------------------------------- */
  /* i18n                                                                     */
  /* ---------------------------------------------------------------------- */

  describe("i18n", () => {
    it("applies a partial i18n override to the trigger label", () => {
      render(
        <Filters
          fields={allFields}
          filters={[]}
          i18n={{ addFilter: "Filtrar" }}
          onChange={vi.fn()}
        />
      );
      expect(screen.getByText("Filtrar")).toBeInTheDocument();
    });

    it("applies an operator label override to the chip", () => {
      const filters: Filter[] = [
        { id: "r1", field: "status", operator: "is", values: ["active"] },
      ];
      const { container } = render(
        <Filters
          fields={allFields}
          filters={filters}
          i18n={{ operators: { is: "equals" } }}
          onChange={vi.fn()}
        />
      );
      expect(
        chip(container)?.querySelector("[data-slot='filter-operator']")
          ?.textContent
      ).toBe("equals");
    });
  });

  /* ---------------------------------------------------------------------- */
  /* FiltersContent                                                           */
  /* ---------------------------------------------------------------------- */

  describe("FiltersContent", () => {
    it("renders chips without an add trigger", () => {
      const filters: Filter[] = [
        { id: "r1", field: "status", operator: "is", values: ["active"] },
      ];
      const { container } = render(
        <FiltersContent
          fields={allFields}
          filters={filters}
          onChange={vi.fn()}
        />
      );
      expect(
        container.querySelectorAll("[data-slot='filter-chip']")
      ).toHaveLength(1);
      expect(
        container.querySelector("[data-slot='filter-add']")
      ).not.toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

describe("exports", () => {
  it("DEFAULT_OPERATORS covers each field type", () => {
    expect(DEFAULT_OPERATORS.select.map((o) => o.value)).toEqual([
      "is",
      "is_not",
      "empty",
      "not_empty",
    ]);
    expect(DEFAULT_OPERATORS.text.some((o) => o.value === "contains")).toBe(
      true
    );
    expect(
      DEFAULT_OPERATORS.multiselect.some((o) => o.value === "is_any_of")
    ).toBe(true);
  });

  it("DEFAULT_I18N exposes operator labels", () => {
    expect(DEFAULT_I18N.addFilter).toBe("Filter");
    expect(DEFAULT_I18N.operators.is).toBe("is");
    expect(DEFAULT_I18N.operators.isNot).toBe("is not");
  });

  it("createFilter generates an id and defaults the operator to 'is'", () => {
    const f = createFilter("status");
    expect(f.field).toBe("status");
    expect(f.operator).toBe("is");
    expect(f.values).toEqual([]);
    expect(f.id).toBeTruthy();
  });

  it("createFilter honours an explicit operator and values", () => {
    const f = createFilter("status", "is_not", ["active"]);
    expect(f.operator).toBe("is_not");
    expect(f.values).toEqual(["active"]);
  });

  it("createFilter produces unique ids", () => {
    expect(createFilter("a").id).not.toBe(createFilter("a").id);
  });

  it("createFilterGroup bundles fields and filters", () => {
    const group = createFilterGroup("g1", "Group", [selectField]);
    expect(group.id).toBe("g1");
    expect(group.label).toBe("Group");
    expect(group.filters).toEqual([]);
    expect(group.fields).toHaveLength(1);
  });
});
