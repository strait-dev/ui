import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import {
  DEFAULT_OPERATORS,
  Filter,
  type FilterFieldDef,
  type FilterRule,
  OPERATOR_LABELS,
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

const textField: FilterFieldDef = {
  id: "name",
  label: "Name",
  type: "text",
};

const numberField: FilterFieldDef = {
  id: "age",
  label: "Age",
  type: "number",
};

const selectField: FilterFieldDef = {
  id: "status",
  label: "Status",
  type: "select",
  options: [
    { label: "Active", value: "active" },
    { label: "Archived", value: "archived" },
  ],
};

const dateField: FilterFieldDef = {
  id: "created_at",
  label: "Created at",
  type: "date",
};

const allFields = [textField, numberField, selectField, dateField];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Filter", () => {
  /* ---------------------------------------------------------------------- */
  /* Renders chips for defaultValue rules                                     */
  /* ---------------------------------------------------------------------- */

  describe("defaultValue chips", () => {
    it("renders a chip for each default rule with the correct label", () => {
      const rules: FilterRule[] = [
        { id: "r1", field: "name", operator: "contains", value: "Alice" },
        { id: "r2", field: "status", operator: "is", value: "active" },
      ];

      const { container } = render(
        <Filter defaultValue={rules} fields={allFields} />
      );

      const chips = container.querySelectorAll("[data-slot='filter-chip']");
      expect(chips).toHaveLength(2);

      // chip 1: text field
      expect(chips[0]?.textContent).toContain("Name");
      expect(chips[0]?.textContent).toContain(OPERATOR_LABELS.contains);
      expect(chips[0]?.textContent).toContain("Alice");

      // chip 2: select field — value should be resolved to "Active" label
      expect(chips[1]?.textContent).toContain("Status");
      expect(chips[1]?.textContent).toContain(OPERATOR_LABELS.is);
      expect(chips[1]?.textContent).toContain("Active");
    });

    it("renders the filter container with data-slot='filter'", () => {
      const { container } = render(<Filter fields={allFields} />);
      expect(
        container.querySelector("[data-slot='filter']")
      ).toBeInTheDocument();
    });

    it("renders no chips when no rules are provided", () => {
      const { container } = render(<Filter fields={allFields} />);
      expect(
        container.querySelectorAll("[data-slot='filter-chip']")
      ).toHaveLength(0);
    });
  });

  /* ---------------------------------------------------------------------- */
  /* Removing a chip                                                          */
  /* ---------------------------------------------------------------------- */

  describe("removing chips", () => {
    it("calls onChange without the removed rule when a chip is dismissed", () => {
      const onChange = vi.fn();
      const rules: FilterRule[] = [
        { id: "r1", field: "name", operator: "contains", value: "Alice" },
        { id: "r2", field: "age", operator: "gt", value: "30" },
      ];

      const { container } = render(
        <Filter defaultValue={rules} fields={allFields} onChange={onChange} />
      );

      const chips = container.querySelectorAll("[data-slot='filter-chip']");
      // Dismiss the first chip
      const dismissBtn = chips[0]?.querySelector(
        "[data-slot='badge-dismiss']"
      ) as HTMLElement;
      fireEvent.click(dismissBtn);

      expect(onChange).toHaveBeenCalledOnce();
      const [updatedRules] = onChange.mock.calls[0] as [FilterRule[]];
      expect(updatedRules).toHaveLength(1);
      expect(updatedRules[0]?.id).toBe("r2");
    });

    it("removes the chip from the UI when dismissed (uncontrolled)", () => {
      const rules: FilterRule[] = [
        { id: "r1", field: "name", operator: "is", value: "Bob" },
      ];

      const { container } = render(
        <Filter defaultValue={rules} fields={allFields} />
      );

      let chips = container.querySelectorAll("[data-slot='filter-chip']");
      expect(chips).toHaveLength(1);

      const dismissBtn = chips[0]?.querySelector(
        "[data-slot='badge-dismiss']"
      ) as HTMLElement;
      fireEvent.click(dismissBtn);

      chips = container.querySelectorAll("[data-slot='filter-chip']");
      expect(chips).toHaveLength(0);
    });
  });

  /* ---------------------------------------------------------------------- */
  /* Controlled mode                                                          */
  /* ---------------------------------------------------------------------- */

  describe("controlled mode", () => {
    it("reflects externally provided value prop", () => {
      const rules: FilterRule[] = [
        { id: "r1", field: "status", operator: "is_not", value: "archived" },
      ];

      const { container } = render(
        <Filter fields={allFields} onChange={vi.fn()} value={rules} />
      );

      const chips = container.querySelectorAll("[data-slot='filter-chip']");
      expect(chips).toHaveLength(1);
      expect(chips[0]?.textContent).toContain("Archived");
    });

    it("does not update internal state in controlled mode", () => {
      const onChange = vi.fn();
      const rules: FilterRule[] = [
        { id: "r1", field: "name", operator: "is", value: "Test" },
      ];

      const { container } = render(
        <Filter fields={allFields} onChange={onChange} value={rules} />
      );

      const dismissBtn = container.querySelector(
        "[data-slot='badge-dismiss']"
      ) as HTMLElement;
      fireEvent.click(dismissBtn);

      // onChange is called, but value prop is still the same externally
      expect(onChange).toHaveBeenCalledOnce();
      // chip still there because value hasn't changed externally
      expect(
        container.querySelectorAll("[data-slot='filter-chip']")
      ).toHaveLength(1);
    });
  });

  /* ---------------------------------------------------------------------- */
  /* maxFilters                                                               */
  /* ---------------------------------------------------------------------- */

  describe("maxFilters", () => {
    it("hides the 'Add filter' trigger when maxFilters is reached", () => {
      const rules: FilterRule[] = [
        { id: "r1", field: "name", operator: "is", value: "Alice" },
        { id: "r2", field: "age", operator: "gt", value: "18" },
      ];

      render(
        <Filter
          defaultValue={rules}
          fields={allFields}
          maxFilters={2}
          onChange={vi.fn()}
        />
      );

      // "Add filter" button should not be present
      expect(screen.queryByText("Add filter")).toBeNull();
    });

    it("shows the 'Add filter' trigger when below maxFilters", () => {
      const rules: FilterRule[] = [
        { id: "r1", field: "name", operator: "is", value: "Alice" },
      ];

      render(
        <Filter
          defaultValue={rules}
          fields={allFields}
          maxFilters={3}
          onChange={vi.fn()}
        />
      );

      expect(screen.getByText("Add filter")).toBeInTheDocument();
    });

    it("shows the 'Add filter' trigger when maxFilters is not set", () => {
      render(<Filter fields={allFields} />);
      expect(screen.getByText("Add filter")).toBeInTheDocument();
    });
  });

  /* ---------------------------------------------------------------------- */
  /* Operator/label maps                                                      */
  /* ---------------------------------------------------------------------- */

  describe("exported maps", () => {
    it("DEFAULT_OPERATORS covers all field types", () => {
      expect(DEFAULT_OPERATORS.text).toContain("contains");
      expect(DEFAULT_OPERATORS.number).toContain("gt");
      expect(DEFAULT_OPERATORS.select).toEqual(["is", "is_not"]);
      expect(DEFAULT_OPERATORS.date).toContain("before");
    });

    it("OPERATOR_LABELS has human-readable labels", () => {
      expect(OPERATOR_LABELS.is_not).toBe("is not");
      expect(OPERATOR_LABELS.does_not_contain).toBe("does not contain");
      expect(OPERATOR_LABELS.gte).toBe("greater than or equal");
    });
  });

  /* ---------------------------------------------------------------------- */
  /* Opening popover shows field options                                      */
  /* ---------------------------------------------------------------------- */

  describe("add-filter popover", () => {
    it("renders the 'Add filter' button", () => {
      render(<Filter fields={allFields} />);
      expect(screen.getByText("Add filter")).toBeInTheDocument();
    });

    it("opens the popover and shows field options when trigger is clicked", () => {
      render(<Filter fields={[textField, selectField]} />);

      const trigger = screen.getByText("Add filter");
      fireEvent.click(trigger);

      // Field options should appear in the command list
      // (cmdk renders them in the DOM when open)
      expect(screen.getAllByText("Name").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Status").length).toBeGreaterThan(0);
    });
  });
});
