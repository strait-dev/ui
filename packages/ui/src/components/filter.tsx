"use client";

import { FilterIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import * as React from "react";

import { cn } from "../utils/index";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/** Supported field value types for a {@link FilterFieldDef}. */
export type FilterFieldType = "text" | "number" | "select" | "date";

/**
 * All operators that can be used in a {@link FilterRule}.
 *
 * Not every operator is valid for every field type — the default operator
 * sets are constrained by {@link DEFAULT_OPERATORS}.
 */
export type FilterOperator =
  | "is"
  | "is_not"
  | "contains"
  | "does_not_contain"
  | "starts_with"
  | "ends_with"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "before"
  | "after"
  | "on";

/** A label/value pair for `select`-type fields. */
export type FilterFieldOption = { label: string; value: string };

/**
 * Definition of a filterable field.
 *
 * @remarks
 * `options` is required when `type` is `"select"`. `operators` overrides the
 * default operator list for the field type.
 */
export type FilterFieldDef = {
  /** Unique machine identifier for this field. */
  id: string;
  /** Human-readable label shown in the builder and chips. */
  label: string;
  /** Determines which operators and value editor are offered. */
  type: FilterFieldType;
  /** Required when `type` is `"select"`. */
  options?: FilterFieldOption[];
  /** Override the default operator list derived from `type`. */
  operators?: FilterOperator[];
  /** Optional icon shown next to the field name in the picker. */
  icon?: IconSvgElement;
};

/**
 * A single active filter rule produced by {@link Filter}.
 *
 * @remarks
 * `value` is always stored as a string. For `date` fields it uses ISO
 * `yyyy-MM-dd` format.
 */
export type FilterRule = {
  /** Unique row id — generated via `crypto.randomUUID()`. */
  id: string;
  /** {@link FilterFieldDef.id} this rule targets. */
  field: string;
  operator: FilterOperator;
  /** String-encoded value. */
  value: string;
};

// ---------------------------------------------------------------------------
// Operator helpers (exported for consumers)
// ---------------------------------------------------------------------------

/**
 * Default operator sets keyed by field type.
 *
 * Override per-field via {@link FilterFieldDef.operators}.
 */
export const DEFAULT_OPERATORS: Record<FilterFieldType, FilterOperator[]> = {
  text: [
    "is",
    "is_not",
    "contains",
    "does_not_contain",
    "starts_with",
    "ends_with",
  ],
  number: ["is", "is_not", "gt", "lt", "gte", "lte"],
  select: ["is", "is_not"],
  date: ["on", "before", "after"],
};

/**
 * Human-readable labels for every {@link FilterOperator}.
 *
 * Used both in the builder picker and in active-rule chips.
 */
export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  is: "is",
  is_not: "is not",
  contains: "contains",
  does_not_contain: "does not contain",
  starts_with: "starts with",
  ends_with: "ends with",
  gt: "greater than",
  lt: "less than",
  gte: "greater than or equal",
  lte: "less than or equal",
  before: "before",
  after: "after",
  on: "on",
};

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Resolve the operator list for a given field definition. */
function resolveOperators(field: FilterFieldDef): FilterOperator[] {
  return field.operators ?? DEFAULT_OPERATORS[field.type];
}

/** Find a field by id; returns undefined when not found. */
function findField(
  fields: FilterFieldDef[],
  id: string
): FilterFieldDef | undefined {
  return fields.find((f) => f.id === id);
}

/** Resolve the display label for a stored value in a select field. */
function resolveSelectLabel(field: FilterFieldDef, value: string): string {
  const opt = field.options?.find((o) => o.value === value);
  return opt?.label ?? value;
}

/** Format an ISO date string (yyyy-MM-dd) as a locale date. */
function formatDateValue(iso: string): string {
  if (!iso) {
    return iso;
  }
  const [year, month, day] = iso.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }
  return d.toLocaleDateString();
}

/** Resolve the display string for a rule's value column. */
function resolveValueLabel(field: FilterFieldDef, value: string): string {
  switch (field.type) {
    case "select":
      return resolveSelectLabel(field, value);
    case "date":
      return formatDateValue(value);
    default:
      return value;
  }
}

// ---------------------------------------------------------------------------
// Builder step type
// ---------------------------------------------------------------------------

type BuilderStep = "field" | "operator" | "value";

interface BuilderState {
  fieldId: string | null;
  operator: FilterOperator | null;
  step: BuilderStep;
}

const BUILDER_INITIAL: BuilderState = {
  step: "field",
  fieldId: null,
  operator: null,
};

// ---------------------------------------------------------------------------
// Value editor
// ---------------------------------------------------------------------------

interface ValueEditorProps {
  field: FilterFieldDef;
  onCommit: (value: string) => void;
}

/**
 * Renders the appropriate value editor for the field's type.
 *
 * @remarks
 * - `text` / `number` → `Input` with confirm button (Enter or click).
 * - `select` → `Command` list of the field's `options`; selecting commits immediately.
 * - `date` → `<Input type="date">` with confirm button. ISO date committed as `yyyy-MM-dd`.
 */
function ValueEditor({ field, onCommit }: ValueEditorProps) {
  const [localValue, setLocalValue] = React.useState("");

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && localValue.trim()) {
      onCommit(localValue.trim());
    }
  }

  function handleConfirm() {
    if (localValue.trim()) {
      onCommit(localValue.trim());
    }
  }

  switch (field.type) {
    case "text":
      return (
        <div className="flex flex-col gap-2 p-2">
          <Input
            autoFocus
            className="h-7 text-xs"
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Enter ${field.label.toLowerCase()}…`}
            size="sm"
            value={localValue}
          />
          <Button
            className="w-full"
            disabled={!localValue.trim()}
            onClick={handleConfirm}
            size="sm"
            variant="outline"
          >
            Apply
          </Button>
        </div>
      );

    case "number":
      return (
        <div className="flex flex-col gap-2 p-2">
          <Input
            autoFocus
            className="h-7 text-xs"
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter value…"
            size="sm"
            type="number"
            value={localValue}
          />
          <Button
            className="w-full"
            disabled={!localValue.trim()}
            onClick={handleConfirm}
            size="sm"
            variant="outline"
          >
            Apply
          </Button>
        </div>
      );

    case "select": {
      const options = field.options ?? [];
      return (
        <Command>
          <CommandInput placeholder="Search options…" />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  onSelect={() => onCommit(opt.value)}
                  value={opt.value}
                >
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      );
    }

    case "date":
      return (
        <div className="flex flex-col gap-2 p-2">
          <Input
            autoFocus
            className="h-7 text-xs"
            onChange={(e) => setLocalValue(e.target.value)}
            size="sm"
            type="date"
            value={localValue}
          />
          <Button
            className="w-full"
            disabled={!localValue}
            onClick={() => {
              if (localValue) {
                onCommit(localValue);
              }
            }}
            size="sm"
            variant="outline"
          >
            Apply
          </Button>
        </div>
      );

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Multi-step builder (inside Popover)
// ---------------------------------------------------------------------------

interface FilterBuilderProps {
  fields: FilterFieldDef[];
  onAdd: (rule: Omit<FilterRule, "id">) => void;
  onClose: () => void;
}

function FilterBuilder({ fields, onAdd, onClose }: FilterBuilderProps) {
  const [state, setState] = React.useState<BuilderState>(BUILDER_INITIAL);

  const activeField = state.fieldId ? findField(fields, state.fieldId) : null;

  function selectField(fieldId: string) {
    setState({ step: "operator", fieldId, operator: null });
  }

  function selectOperator(op: FilterOperator) {
    setState((prev) => ({ ...prev, step: "value", operator: op }));
  }

  function commitValue(value: string) {
    if (!(state.fieldId && state.operator)) {
      return;
    }
    onAdd({ field: state.fieldId, operator: state.operator, value });
    onClose();
  }

  // Step: field picker
  if (state.step === "field") {
    return (
      <Command>
        <CommandInput placeholder="Search fields…" />
        <CommandList>
          <CommandEmpty>No fields found.</CommandEmpty>
          <CommandGroup>
            {fields.map((f) => (
              <CommandItem
                key={f.id}
                onSelect={() => selectField(f.id)}
                value={f.id}
              >
                {f.icon ? (
                  <HugeiconsIcon className="size-3.5" icon={f.icon} />
                ) : (
                  <HugeiconsIcon className="size-3.5" icon={FilterIcon} />
                )}
                {f.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  }

  // Step: operator picker
  if (state.step === "operator" && activeField) {
    const operators = resolveOperators(activeField);
    return (
      <div>
        <div className="border-b px-2 py-1.5 text-muted-foreground text-xs">
          {activeField.label}
        </div>
        <Command>
          <CommandList>
            <CommandGroup>
              {operators.map((op) => (
                <CommandItem
                  key={op}
                  onSelect={() => selectOperator(op)}
                  value={op}
                >
                  {OPERATOR_LABELS[op]}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    );
  }

  // Step: value editor
  if (state.step === "value" && activeField && state.operator) {
    return (
      <div>
        <div className="border-b px-2 py-1.5 text-muted-foreground text-xs">
          {activeField.label}{" "}
          <span className="font-medium text-foreground">
            {OPERATOR_LABELS[state.operator]}
          </span>
        </div>
        <ValueEditor field={activeField} onCommit={commitValue} />
      </div>
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Filter (public component)
// ---------------------------------------------------------------------------

/**
 * Props for {@link Filter}.
 *
 * @remarks
 * Supports both controlled (`value` + `onChange`) and uncontrolled
 * (`defaultValue`) usage. When `maxFilters` is set, the "Add filter" trigger
 * is disabled once the limit is reached.
 */
export interface FilterProps {
  className?: string;
  /**
   * Initial rules for uncontrolled mode.
   * Ignored when `value` is provided.
   */
  defaultValue?: FilterRule[];
  /** Field definitions that can be filtered on. */
  fields: FilterFieldDef[];
  /**
   * Maximum number of simultaneous active rules.
   * Hides the "Add filter" trigger when the limit is reached.
   */
  maxFilters?: number;
  /** Called whenever the rule list changes. */
  onChange?: (rules: FilterRule[]) => void;
  /**
   * Controlled rule list. Pair with {@link FilterProps.onChange}.
   * When provided, the component renders in controlled mode.
   */
  value?: FilterRule[];
}

/**
 * Faceted filter builder (Linear / corr.sh style).
 *
 * Active filter rules render as removable {@link Badge} chips. An "Add filter"
 * {@link Popover} + {@link Command} flow builds new rules in three steps:
 * pick field → pick operator → enter value.
 *
 * @remarks
 * - Controlled (`value` + `onChange`) and uncontrolled (`defaultValue`)
 *   patterns are both supported.
 * - `maxFilters` disables the "Add filter" trigger once the limit is reached.
 * - Date values are stored and committed as ISO `yyyy-MM-dd` strings.
 * - For `select` fields the stored value is resolved back to its option label
 *   in the chip display.
 *
 * @example
 * ```tsx
 * // Uncontrolled
 * <Filter
 *   fields={[
 *     { id: "status", label: "Status", type: "select", options: [
 *       { label: "Active", value: "active" },
 *       { label: "Archived", value: "archived" },
 *     ]},
 *     { id: "name", label: "Name", type: "text" },
 *   ]}
 *   onChange={(rules) => console.log(rules)}
 * />
 *
 * // Controlled
 * const [rules, setRules] = React.useState<FilterRule[]>([]);
 * <Filter fields={fields} value={rules} onChange={setRules} />
 * ```
 */
function Filter({
  fields,
  value,
  defaultValue,
  onChange,
  maxFilters,
  className,
}: FilterProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<FilterRule[]>(
    defaultValue ?? []
  );

  const rules = isControlled ? (value as FilterRule[]) : internal;

  const [popoverOpen, setPopoverOpen] = React.useState(false);

  function commit(next: FilterRule[]) {
    if (!isControlled) {
      setInternal(next);
    }
    onChange?.(next);
  }

  function addRule(partial: Omit<FilterRule, "id">) {
    if (maxFilters !== undefined && rules.length >= maxFilters) {
      return;
    }
    const newRule: FilterRule = {
      id: crypto.randomUUID(),
      ...partial,
    };
    commit([...rules, newRule]);
  }

  function removeRule(id: string) {
    commit(rules.filter((r) => r.id !== id));
  }

  const atMax = maxFilters !== undefined && rules.length >= maxFilters;

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      data-slot="filter"
    >
      {rules.map((rule) => {
        const field = findField(fields, rule.field);
        if (!field) {
          return null;
        }

        const chipLabel = `${field.label} ${OPERATOR_LABELS[rule.operator]} ${resolveValueLabel(field, rule.value)}`;

        return (
          <Badge
            className="cursor-default"
            data-slot="filter-chip"
            dismissible
            key={rule.id}
            onDismiss={() => removeRule(rule.id)}
            size="lg"
            variant="secondary"
          >
            {field.icon ? (
              <HugeiconsIcon className="size-3" icon={field.icon} />
            ) : null}
            {chipLabel}
          </Badge>
        );
      })}

      {atMax ? null : (
        <Popover
          onOpenChange={(open) => {
            setPopoverOpen(open);
          }}
          open={popoverOpen}
        >
          <PopoverTrigger render={<Button size="sm" variant="outline" />}>
            <HugeiconsIcon className="size-3.5" icon={PlusSignIcon} />
            Add filter
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-64 p-0"
            side="bottom"
            sideOffset={4}
          >
            <FilterBuilder
              fields={fields}
              onAdd={addRule}
              onClose={() => setPopoverOpen(false)}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

export { Filter };
