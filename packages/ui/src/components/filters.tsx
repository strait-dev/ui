"use client";

import {
  AlertCircleIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  PlusSignIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "../utils/index";
import { Button } from "./button";
import { ButtonGroup, ButtonGroupText } from "./button-group";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "./command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "./input-group";
import { Kbd } from "./kbd";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/** The kind of value a {@link FilterFieldConfig} edits. */
export type FilterFieldType =
  | "select"
  | "multiselect"
  | "text"
  | "custom"
  | "separator";

/** A single option for `select` / `multiselect` fields. */
export interface FilterOption {
  /** Extra classes for the option row. */
  className?: string;
  /** Optional leading icon. */
  icon?: IconSvgElement;
  /** Human-readable label shown in lists and the value trigger. */
  label: string;
  /** Stored value committed to the {@link Filter}. */
  value: string;
}

/** An operator entry: a machine `value` paired with a display `label`. */
export interface FilterOperator {
  label: string;
  value: string;
}

/** Arguments passed to a field's {@link FilterFieldConfig.customRenderer}. */
export interface CustomRendererProps {
  /** The {@link FilterFieldConfig} whose value is being edited. */
  field: FilterFieldConfig;
  /** Callback to commit a new set of selected values for this filter. */
  onChange: (values: string[]) => void;
  /** The operator value currently applied to the filter chip. */
  operator: string;
  /** Currently selected values for this filter. */
  values: string[];
}

/**
 * Definition of one filterable field.
 *
 * @remarks
 * `options` is required for `select` / `multiselect`. `operators` overrides
 * the default operator list derived from `type`. A `separator` field renders
 * nothing and is skipped in the picker — use it (inside a group) to space
 * entries.
 */
export interface FilterFieldConfig {
  /** Extra classes for the value-selector popover/input. */
  className?: string;
  /** Render a bespoke value editor inside the chip. */
  customRenderer?: (props: CustomRendererProps) => React.ReactNode;
  /** Operator applied when the filter is first added. */
  defaultOperator?: string;
  /** Child fields when this entry is a {@link FilterFieldGroup}. */
  fields?: FilterFieldConfig[];
  /** Group heading — used when this entry is a {@link FilterFieldGroup}. */
  group?: string;
  /** Optional leading icon. */
  icon?: IconSvgElement;
  /** Unique machine key. Required for a field to be selectable. */
  key?: string;
  /** Human-readable label shown in the picker and chip. */
  label?: string;
  /** Cap the number of selected values for `multiselect`. */
  maxSelections?: number;
  /** Override the default operator list for this field. */
  operators?: FilterOperator[];
  /** Options for `select` / `multiselect`. */
  options?: FilterOption[];
  /** RegExp source validated on blur for the `text` value editor. */
  pattern?: string;
  /** Placeholder for the `text` value editor. */
  placeholder?: string;
  /** Leading addon for the `text` value editor. */
  prefix?: React.ReactNode;
  /** Show the search box in option lists. @default true */
  searchable?: boolean;
  /** Trailing addon for the `text` value editor. */
  suffix?: React.ReactNode;
  /** Determines the operator set and value editor. @default "select" */
  type?: FilterFieldType;
  /** Custom validator for the `text` value editor. */
  validation?: (
    value: unknown
  ) => boolean | { valid: boolean; message?: string };
}

/** A labelled group of fields rendered as a section in the picker. */
export interface FilterFieldGroup {
  fields: FilterFieldConfig[];
  group?: string;
}

/** Either a flat field list or a list of grouped fields. */
export type FilterFieldsConfig = FilterFieldConfig[] | FilterFieldGroup[];

/** A single active filter produced by {@link Filters}. */
export interface Filter {
  /** {@link FilterFieldConfig.key} this filter targets. */
  field: string;
  /** Unique id — generate via {@link createFilter}. */
  id: string;
  /** Operator `value` currently applied. */
  operator: string;
  /** Selected values. Empty for `empty` / `not_empty` operators. */
  values: string[];
}

/** A named bundle of filters + their fields (see {@link createFilterGroup}). */
export interface FilterGroup {
  fields: FilterFieldConfig[];
  filters: Filter[];
  id: string;
  label?: string;
}

// ---------------------------------------------------------------------------
// i18n
// ---------------------------------------------------------------------------

/** Operator label strings (override individual keys via `i18n.operators`). */
export interface FilterI18nOperators {
  contains: string;
  empty: string;
  endsWith: string;
  excludesAll: string;
  includesAll: string;
  is: string;
  isAnyOf: string;
  isExactly: string;
  isNot: string;
  isNotAnyOf: string;
  notContains: string;
  notEmpty: string;
  startsWith: string;
}

/** All translatable strings used by {@link Filters}. */
export interface FilterI18nConfig {
  addFilter: string;
  back: string;
  helpers: {
    formatOperator: (operator: string) => string;
  };
  noFieldsFound: string;
  noResultsFound: string;
  operators: FilterI18nOperators;
  placeholders: {
    searchField: (fieldName: string) => string;
    enterValue: string;
  };
  searchFields: string;
  select: string;
  selectedCount: string;
  validation: {
    invalid: string;
  };
}

/** Default English strings — spread and override via the `i18n` prop. */
export const DEFAULT_I18N: FilterI18nConfig = {
  addFilter: "Filter",
  searchFields: "Filter...",
  noFieldsFound: "No filters found.",
  noResultsFound: "No results found.",
  select: "Select...",
  selectedCount: "selected",
  back: "Back",
  operators: {
    is: "is",
    isNot: "is not",
    isAnyOf: "is any of",
    isNotAnyOf: "is not any of",
    includesAll: "includes all",
    excludesAll: "excludes all",
    contains: "contains",
    notContains: "does not contain",
    startsWith: "starts with",
    endsWith: "ends with",
    isExactly: "is exactly",
    empty: "is empty",
    notEmpty: "is not empty",
  },
  placeholders: {
    searchField: (fieldName: string) => `Search ${fieldName.toLowerCase()}...`,
    enterValue: "Enter value...",
  },
  helpers: {
    formatOperator: (operator: string) => operator.replace(/_/g, " "),
  },
  validation: {
    invalid: "Invalid input format",
  },
};

// ---------------------------------------------------------------------------
// Operators
// ---------------------------------------------------------------------------

function createOperatorsFromI18n(
  i18n: FilterI18nConfig
): Record<string, FilterOperator[]> {
  return {
    select: [
      { value: "is", label: i18n.operators.is },
      { value: "is_not", label: i18n.operators.isNot },
      { value: "empty", label: i18n.operators.empty },
      { value: "not_empty", label: i18n.operators.notEmpty },
    ],
    multiselect: [
      { value: "is_any_of", label: i18n.operators.isAnyOf },
      { value: "is_not_any_of", label: i18n.operators.isNotAnyOf },
      { value: "includes_all", label: i18n.operators.includesAll },
      { value: "excludes_all", label: i18n.operators.excludesAll },
      { value: "empty", label: i18n.operators.empty },
      { value: "not_empty", label: i18n.operators.notEmpty },
    ],
    text: [
      { value: "contains", label: i18n.operators.contains },
      { value: "not_contains", label: i18n.operators.notContains },
      { value: "starts_with", label: i18n.operators.startsWith },
      { value: "ends_with", label: i18n.operators.endsWith },
      { value: "is", label: i18n.operators.isExactly },
      { value: "empty", label: i18n.operators.empty },
      { value: "not_empty", label: i18n.operators.notEmpty },
    ],
    custom: [
      { value: "is", label: i18n.operators.is },
      { value: "empty", label: i18n.operators.empty },
      { value: "not_empty", label: i18n.operators.notEmpty },
    ],
  };
}

/** Default operator sets keyed by field type. */
export const DEFAULT_OPERATORS: Record<string, FilterOperator[]> =
  createOperatorsFromI18n(DEFAULT_I18N);

function getOperatorsForField(
  field: FilterFieldConfig,
  values: string[],
  i18n: FilterI18nConfig
): FilterOperator[] {
  if (field.operators) {
    return field.operators;
  }

  const operators = createOperatorsFromI18n(i18n);
  let fieldType = field.type ?? "select";
  if (fieldType === "select" && values.length > 1) {
    fieldType = "multiselect";
  }
  if (fieldType === "multiselect") {
    return operators.multiselect ?? [];
  }
  return operators[fieldType] ?? operators.select ?? [];
}

// ---------------------------------------------------------------------------
// Field-config helpers
// ---------------------------------------------------------------------------

function isFieldGroup(
  item: FilterFieldConfig | FilterFieldGroup
): item is FilterFieldGroup {
  return "fields" in item && Array.isArray(item.fields);
}

/** Normalise either input shape into a list of render groups. */
function normalizeGroups(fields: FilterFieldsConfig): FilterFieldGroup[] {
  if (fields.length === 0) {
    return [];
  }
  if (isFieldGroup(fields[0] as FilterFieldConfig | FilterFieldGroup)) {
    return fields as FilterFieldGroup[];
  }
  return [{ fields: fields as FilterFieldConfig[] }];
}

function flattenFields(fields: FilterFieldsConfig): FilterFieldConfig[] {
  return normalizeGroups(fields).flatMap((group) => group.fields);
}

function getFieldsMap(
  fields: FilterFieldsConfig
): Record<string, FilterFieldConfig> {
  const map: Record<string, FilterFieldConfig> = {};
  for (const field of flattenFields(fields)) {
    if (field.key) {
      map[field.key] = field;
    }
  }
  return map;
}

function fieldHasOptions(field: FilterFieldConfig): boolean {
  return (
    (field.type === "select" || field.type === "multiselect") &&
    Boolean(field.options?.length)
  );
}

/** Apply a partial update to a filter, clearing values for empty operators. */
function applyFilterUpdate(
  filters: Filter[],
  id: string,
  updates: Partial<Filter>
): Filter[] {
  return filters.map((filter) => {
    if (filter.id !== id) {
      return filter;
    }
    const updated = { ...filter, ...updates };
    if (updates.operator === "empty" || updates.operator === "not_empty") {
      updated.values = [];
    }
    return updated;
  });
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type FilterSize = "sm" | "default" | "lg";

interface FilterContextValue {
  i18n: FilterI18nConfig;
  radius: "default" | "full";
  size: FilterSize;
  variant: "solid" | "default";
}

const FilterContext = React.createContext<FilterContextValue>({
  variant: "default",
  size: "default",
  radius: "default",
  i18n: DEFAULT_I18N,
});

function useFilterContext() {
  return React.useContext(FilterContext);
}

// ---------------------------------------------------------------------------
// Style helpers
// ---------------------------------------------------------------------------

const filtersContainerVariants = cva("flex flex-wrap items-center", {
  variants: {
    variant: {
      solid: "",
      default: "",
    },
    size: {
      sm: "gap-1.5",
      default: "gap-2.5",
      lg: "gap-3.5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

/** Forced segment height so every part of a chip's button group aligns. */
const filterControlHeight: Record<FilterSize, string> = {
  sm: "h-6!",
  default: "h-7!",
  lg: "h-8!",
};

/** Icon-button size matched to each segment height. */
const filterIconSize = {
  sm: "icon-xs",
  default: "icon-sm",
  lg: "icon",
} as const;

/** Pill rounding applied to a chip's button group when `radius="full"`. */
const filterRadiusClass =
  "rounded-full [&>[data-slot]:first-child]:rounded-l-full! [&>[data-slot]:last-child]:rounded-r-full!";

// ---------------------------------------------------------------------------
// Text value editor
// ---------------------------------------------------------------------------

function FilterInput({
  field,
  autoFocus,
  className,
  onBlur,
  onKeyDown,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & {
  field?: FilterFieldConfig;
}) {
  const { size, i18n } = useFilterContext();
  const [isValid, setIsValid] = React.useState(true);
  const [message, setMessage] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!autoFocus) {
      return;
    }
    // Defer focus until the chip's enter animation settles.
    const timer = window.setTimeout(() => inputRef.current?.focus(), 200);
    return () => window.clearTimeout(timer);
  }, [autoFocus]);

  function validatePattern(value: string, pattern?: string): boolean {
    if (!(pattern && value)) {
      return true;
    }
    return new RegExp(pattern).test(value);
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    const value = event.target.value;
    const pattern = field?.pattern ?? props.pattern;

    if (value && (pattern || field?.validation)) {
      let valid = true;
      let customMessage = "";
      if (field?.validation) {
        const result = field.validation(value);
        if (typeof result === "boolean") {
          valid = result;
        } else {
          valid = result.valid;
          customMessage = result.message ?? "";
        }
      } else if (pattern) {
        valid = validatePattern(value, pattern);
      }
      setIsValid(valid);
      setMessage(valid ? "" : customMessage || i18n.validation.invalid);
    } else {
      setIsValid(true);
      setMessage("");
    }

    onBlur?.(event);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!isValid && event.key.length === 1) {
      setIsValid(true);
      setMessage("");
    }
    onKeyDown?.(event);
  }

  return (
    <InputGroup
      className={cn(
        "w-36 has-[[data-slot=input-group-control]:focus-visible]:border-input has-[[data-slot=input-group-control]:focus-visible]:ring-0",
        filterControlHeight[size],
        className
      )}
    >
      {field?.prefix ? (
        <InputGroupAddon>
          <InputGroupText>{field.prefix}</InputGroupText>
        </InputGroupAddon>
      ) : null}
      <InputGroupInput
        aria-invalid={!isValid}
        className={cn(
          "focus-visible:border-transparent focus-visible:ring-0",
          size === "sm" && "text-xs"
        )}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        {...props}
      />
      {isValid || !message ? null : (
        <InputGroupAddon align="inline-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <InputGroupButton size="icon-xs" type="button">
                    <HugeiconsIcon
                      className="text-destructive"
                      icon={AlertCircleIcon}
                    />
                  </InputGroupButton>
                }
              />
              <TooltipContent>{message}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </InputGroupAddon>
      )}
      {field?.suffix ? (
        <InputGroupAddon align="inline-end">
          <InputGroupText>{field.suffix}</InputGroupText>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  );
}

// ---------------------------------------------------------------------------
// Remove button
// ---------------------------------------------------------------------------

function FilterRemoveButton({ onClick }: { onClick: () => void }) {
  const { size } = useFilterContext();
  return (
    <Button
      aria-label="Remove filter"
      className={filterControlHeight[size]}
      data-slot="filter-remove"
      onClick={onClick}
      size={filterIconSize[size]}
      variant="outline"
    >
      <HugeiconsIcon icon={Cancel01Icon} />
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Operator dropdown
// ---------------------------------------------------------------------------

function FilterOperatorDropdown({
  field,
  operator,
  values,
  onChange,
}: {
  field: FilterFieldConfig;
  operator: string;
  values: string[];
  onChange: (operator: string) => void;
}) {
  const { size, i18n } = useFilterContext();
  const operators = getOperatorsForField(field, values, i18n);
  const operatorLabel =
    operators.find((item) => item.value === operator)?.label ??
    i18n.helpers.formatOperator(operator);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className={cn(
              "text-muted-foreground hover:text-foreground",
              filterControlHeight[size]
            )}
            data-slot="filter-operator"
            size={size}
            variant="outline"
          />
        }
      >
        {operatorLabel}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit min-w-fit">
        {operators.map((item) => (
          <DropdownMenuItem
            className="justify-between gap-4"
            key={item.value}
            onClick={() => onChange(item.value)}
          >
            <span>{item.label}</span>
            <HugeiconsIcon
              className={cn(
                "size-4 text-primary",
                item.value === operator ? "opacity-100" : "opacity-0"
              )}
              icon={Tick02Icon}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---------------------------------------------------------------------------
// Searchable option list (shared by value selector + add-filter submenu)
// ---------------------------------------------------------------------------

function OptionList({
  field,
  selectedValues,
  onToggle,
  emptyLabel,
}: {
  field: FilterFieldConfig;
  selectedValues: string[];
  onToggle: (value: string) => void;
  emptyLabel: string;
}) {
  const { i18n } = useFilterContext();
  const options = field.options ?? [];

  return (
    <Command className="bg-transparent">
      {field.searchable === false ? null : (
        <CommandInput
          placeholder={i18n.placeholders.searchField(field.label ?? "")}
        />
      )}
      <CommandList>
        <CommandEmpty>{emptyLabel}</CommandEmpty>
        <CommandGroup>
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <CommandItem
                className={cn("gap-1.5", option.className)}
                data-checked={isSelected ? "true" : undefined}
                key={option.value}
                onSelect={() => onToggle(option.value)}
                value={option.label}
              >
                {option.icon ? <HugeiconsIcon icon={option.icon} /> : null}
                <span className="truncate">{option.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

// ---------------------------------------------------------------------------
// Select / multiselect value selector
// ---------------------------------------------------------------------------

function SelectOptionsPopover({
  field,
  values,
  onChange,
}: {
  field: FilterFieldConfig;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const { size, i18n } = useFilterContext();
  const [open, setOpen] = React.useState(false);
  const isMultiSelect = field.type === "multiselect" || values.length > 1;
  const options = field.options ?? [];
  const selectedOptions = options.filter((option) =>
    values.includes(option.value)
  );

  function handleToggle(value: string) {
    const isSelected = values.includes(value);
    let next: string[];
    if (isSelected) {
      next = values.filter((item) => item !== value);
    } else if (isMultiSelect) {
      next = [...values, value];
    } else {
      next = [value];
    }
    if (
      !isSelected &&
      isMultiSelect &&
      field.maxSelections &&
      next.length > field.maxSelections
    ) {
      return;
    }
    onChange(next);
    if (!isMultiSelect) {
      setOpen(false);
    }
  }

  let triggerLabel: React.ReactNode = i18n.select;
  if (selectedOptions.length === 1) {
    triggerLabel = selectedOptions[0]?.label;
  } else if (selectedOptions.length > 1) {
    triggerLabel = `${selectedOptions.length} ${i18n.selectedCount}`;
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        render={
          <Button
            className={filterControlHeight[size]}
            data-slot="filter-value"
            size={size}
            variant="outline"
          />
        }
      >
        <span className="flex items-center gap-1.5">
          {selectedOptions
            .slice(0, 3)
            .map((option) =>
              option.icon ? (
                <HugeiconsIcon icon={option.icon} key={option.value} />
              ) : null
            )}
          {triggerLabel}
        </span>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn("w-[12rem] overflow-hidden p-0", field.className)}
      >
        <OptionList
          emptyLabel={i18n.noResultsFound}
          field={field}
          onToggle={handleToggle}
          selectedValues={values}
        />
      </PopoverContent>
    </Popover>
  );
}

// ---------------------------------------------------------------------------
// Value selector (type switch)
// ---------------------------------------------------------------------------

function FilterValueSelector({
  field,
  values,
  onChange,
  operator,
  autoFocus,
}: {
  field: FilterFieldConfig;
  values: string[];
  onChange: (values: string[]) => void;
  operator: string;
  autoFocus?: boolean;
}) {
  const { size, i18n } = useFilterContext();

  if (operator === "empty" || operator === "not_empty") {
    return null;
  }

  if (field.customRenderer) {
    return (
      <ButtonGroupText
        className={cn(
          "bg-background hover:bg-accent dark:bg-input/30",
          filterControlHeight[size]
        )}
      >
        {field.customRenderer({ field, values, onChange, operator })}
      </ButtonGroupText>
    );
  }

  if (field.type === "text") {
    return (
      <FilterInput
        autoFocus={autoFocus}
        className={field.className}
        field={field}
        onChange={(event) => onChange([event.target.value])}
        placeholder={field.placeholder ?? i18n.placeholders.enterValue}
        type="text"
        value={values[0] ?? ""}
      />
    );
  }

  return (
    <SelectOptionsPopover field={field} onChange={onChange} values={values} />
  );
}

// ---------------------------------------------------------------------------
// Chip
// ---------------------------------------------------------------------------

function FilterChip({
  field,
  filter,
  onUpdate,
  onRemove,
  autoFocus,
}: {
  field: FilterFieldConfig;
  filter: Filter;
  onUpdate: (updates: Partial<Filter>) => void;
  onRemove: () => void;
  autoFocus?: boolean;
}) {
  const { size, radius } = useFilterContext();
  return (
    <ButtonGroup
      className={cn(radius === "full" && filterRadiusClass)}
      data-slot="filter-chip"
    >
      <ButtonGroupText
        className={cn(
          "bg-background dark:bg-input/30",
          filterControlHeight[size]
        )}
      >
        {field.icon ? <HugeiconsIcon icon={field.icon} /> : null}
        {field.label}
      </ButtonGroupText>
      <FilterOperatorDropdown
        field={field}
        onChange={(operator) => onUpdate({ operator })}
        operator={filter.operator}
        values={filter.values}
      />
      <FilterValueSelector
        autoFocus={autoFocus}
        field={field}
        onChange={(values) => onUpdate({ values })}
        operator={filter.operator}
        values={filter.values}
      />
      <FilterRemoveButton onClick={onRemove} />
    </ButtonGroup>
  );
}

// ---------------------------------------------------------------------------
// FiltersContent — chips-only renderer (reads context for variant/size)
// ---------------------------------------------------------------------------

/** Props for {@link FiltersContent}. */
export interface FiltersContentProps {
  /** Field definitions (flat list or grouped) used to resolve chip labels. */
  fields: FilterFieldsConfig;
  /** Controlled list of active {@link Filter} chips to render. */
  filters: Filter[];
  /** Called with the updated filter list whenever a chip is changed or removed. */
  onChange: (filters: Filter[]) => void;
}

/**
 * Renders just the active filter chips (no "Add filter" trigger).
 *
 * Use this when you want to place the add-filter control elsewhere, or when
 * rendering a read-back row of filters. Reads `variant` / `size` / `radius`
 * from the nearest {@link Filters} provider, falling back to defaults when
 * used standalone.
 */
export function FiltersContent({
  filters,
  fields,
  onChange,
}: FiltersContentProps) {
  const { variant, size } = useFilterContext();
  const fieldsMap = React.useMemo(() => getFieldsMap(fields), [fields]);

  return (
    <div className={cn(filtersContainerVariants({ variant, size }))}>
      {filters.map((filter) => {
        const field = fieldsMap[filter.field];
        if (!field) {
          return null;
        }
        return (
          <FilterChip
            field={field}
            filter={filter}
            key={filter.id}
            onRemove={() =>
              onChange(filters.filter((item) => item.id !== filter.id))
            }
            onUpdate={(updates) =>
              onChange(applyFilterUpdate(filters, filter.id, updates))
            }
          />
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Add-filter menu (searchable field picker + per-field option submenu)
// ---------------------------------------------------------------------------

function AddFilterMenu({
  fields,
  filters,
  onChange,
  trigger,
  allowMultiple,
  enableShortcut,
  shortcutKey,
  shortcutLabel,
  showSearchInput,
  onAdded,
}: {
  fields: FilterFieldsConfig;
  filters: Filter[];
  onChange: (filters: Filter[]) => void;
  trigger?: React.ReactElement;
  allowMultiple: boolean;
  enableShortcut: boolean;
  shortcutKey: string;
  shortcutLabel: string;
  showSearchInput: boolean;
  onAdded: (id: string) => void;
}) {
  const { size, i18n } = useFilterContext();
  const [open, setOpen] = React.useState(false);
  const [activeFieldKey, setActiveFieldKey] = React.useState<string | null>(
    null
  );
  const [sessionFilterId, setSessionFilterId] = React.useState<string | null>(
    null
  );

  const fieldsMap = React.useMemo(() => getFieldsMap(fields), [fields]);
  const groups = React.useMemo(() => normalizeGroups(fields), [fields]);

  const isFieldSelectable = React.useCallback(
    (field: FilterFieldConfig) => {
      if (!field.key || field.type === "separator") {
        return false;
      }
      if (allowMultiple) {
        return true;
      }
      return !filters.some((filter) => filter.field === field.key);
    },
    [allowMultiple, filters]
  );

  const selectableCount = React.useMemo(
    () => flattenFields(fields).filter(isFieldSelectable).length,
    [fields, isFieldSelectable]
  );

  React.useEffect(() => {
    if (!enableShortcut) {
      return;
    }
    function handleKeyDown(event: KeyboardEvent) {
      const target = document.activeElement;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement;
      if (
        !(open || typing) &&
        event.key.toLowerCase() === shortcutKey.toLowerCase()
      ) {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableShortcut, open, shortcutKey]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setActiveFieldKey(null);
      setSessionFilterId(null);
    }
  }

  function addSimpleFilter(field: FilterFieldConfig) {
    if (!field.key) {
      return;
    }
    const operator =
      field.defaultOperator ??
      (field.type === "multiselect" ? "is_any_of" : "is");
    const values = field.type === "text" ? [""] : [];
    const newFilter = createFilter(field.key, operator, values);
    onChange([...filters, newFilter]);
    onAdded(newFilter.id);
    handleOpenChange(false);
  }

  function pickField(field: FilterFieldConfig) {
    if (fieldHasOptions(field)) {
      setActiveFieldKey(field.key ?? null);
      setSessionFilterId(null);
    } else {
      addSimpleFilter(field);
    }
  }

  const activeField = activeFieldKey ? fieldsMap[activeFieldKey] : undefined;
  const sessionFilter = sessionFilterId
    ? filters.find((filter) => filter.id === sessionFilterId)
    : undefined;
  const sessionValues = sessionFilter?.values ?? [];

  function toggleOption(field: FilterFieldConfig, value: string) {
    if (!field.key) {
      return;
    }
    if (field.type !== "multiselect") {
      const newFilter = createFilter(field.key, field.defaultOperator ?? "is", [
        value,
      ]);
      onChange([...filters, newFilter]);
      onAdded(newFilter.id);
      handleOpenChange(false);
      return;
    }

    const isSelected = sessionValues.includes(value);
    const next = isSelected
      ? sessionValues.filter((item) => item !== value)
      : [...sessionValues, value];
    if (
      !isSelected &&
      field.maxSelections &&
      next.length > field.maxSelections
    ) {
      return;
    }

    if (sessionFilter) {
      if (next.length === 0) {
        onChange(filters.filter((filter) => filter.id !== sessionFilter.id));
        setSessionFilterId(null);
      } else {
        onChange(
          filters.map((filter) =>
            filter.id === sessionFilter.id
              ? { ...filter, values: next }
              : filter
          )
        );
      }
      return;
    }

    const newFilter = createFilter(
      field.key,
      field.defaultOperator ?? "is_any_of",
      next
    );
    onChange([...filters, newFilter]);
    setSessionFilterId(newFilter.id);
  }

  if (selectableCount === 0) {
    return null;
  }

  return (
    <Popover onOpenChange={handleOpenChange} open={open}>
      <PopoverTrigger
        render={
          trigger ?? (
            <Button
              className={filterControlHeight[size]}
              data-slot="filter-add"
              size={size}
              variant="outline"
            />
          )
        }
      >
        {trigger ? undefined : (
          <>
            <HugeiconsIcon icon={PlusSignIcon} />
            {i18n.addFilter}
            {enableShortcut && shortcutLabel ? (
              <Kbd className="ml-1">{shortcutLabel}</Kbd>
            ) : null}
          </>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[13rem] overflow-hidden p-0">
        {activeField ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-1 border-b p-1">
              <Button
                aria-label={i18n.back}
                onClick={() => {
                  setActiveFieldKey(null);
                  setSessionFilterId(null);
                }}
                size="icon-xs"
                variant="ghost"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} />
              </Button>
              <span className="font-medium text-sm">{activeField.label}</span>
            </div>
            <OptionList
              emptyLabel={i18n.noResultsFound}
              field={activeField}
              onToggle={(value) => toggleOption(activeField, value)}
              selectedValues={sessionValues}
            />
          </div>
        ) : (
          <Command className="bg-transparent">
            {showSearchInput && (
              <CommandInput placeholder={i18n.searchFields} />
            )}
            <CommandList>
              <CommandEmpty>{i18n.noFieldsFound}</CommandEmpty>
              {groups.map((group, index) => (
                <CommandGroup
                  heading={group.group}
                  key={group.group ?? `group-${index}`}
                >
                  {group.fields.filter(isFieldSelectable).map((field) => (
                    <CommandItem
                      className="gap-1.5"
                      key={field.key}
                      onSelect={() => pickField(field)}
                      value={field.label}
                    >
                      {field.icon ? <HugeiconsIcon icon={field.icon} /> : null}
                      <span>{field.label}</span>
                      {fieldHasOptions(field) ? (
                        <CommandShortcut>
                          <HugeiconsIcon icon={ArrowRight01Icon} />
                        </CommandShortcut>
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
}

// ---------------------------------------------------------------------------
// Filters (public component)
// ---------------------------------------------------------------------------

/** Props for {@link Filters}. */
export interface FiltersProps {
  /** Allow the same field to be filtered more than once. @default true */
  allowMultiple?: boolean;
  /** Extra classes merged onto the root container `<div>`. */
  className?: string;
  /** Bind a keyboard shortcut that opens the add-filter menu. @default false */
  enableShortcut?: boolean;
  /** Field definitions (flat list or grouped). */
  fields: FilterFieldsConfig;
  /** Controlled list of active filters. */
  filters: Filter[];
  /** Partial i18n overrides merged over {@link DEFAULT_I18N}. */
  i18n?: Partial<
    Omit<
      FilterI18nConfig,
      "operators" | "placeholders" | "helpers" | "validation"
    >
  > & {
    operators?: Partial<FilterI18nOperators>;
    placeholders?: Partial<FilterI18nConfig["placeholders"]>;
    helpers?: Partial<FilterI18nConfig["helpers"]>;
    validation?: Partial<FilterI18nConfig["validation"]>;
  };
  /** Called whenever the filter list changes. */
  onChange: (filters: Filter[]) => void;
  /** Chip corner style. @default "default" */
  radius?: "default" | "full";
  /** Key for the shortcut. @default "f" */
  shortcutKey?: string;
  /** Label shown in the trigger's `Kbd` hint. @default "F" */
  shortcutLabel?: string;
  /** Show the search box at the top of the field picker. @default true */
  showSearchInput?: boolean;
  /** Control density. @default "default" */
  size?: FilterSize;
  /** Replace the default "Add filter" trigger element. */
  trigger?: React.ReactElement;
  /** Reserved spacing style. @default "default" */
  variant?: "solid" | "default";
}

/**
 * A faceted filter builder modelled on corr.sh's Filters.
 *
 * Each active filter renders as a fused {@link ButtonGroup} chip with four
 * segments — field label, an operator dropdown, a value selector, and a
 * remove button. An "Add filter" trigger opens a searchable field picker;
 * `select` / `multiselect` fields drill into a searchable option list so a
 * value can be chosen as the filter is created.
 *
 * @remarks
 * - **Controlled only** — drive it with `filters` + `onChange`. Generate ids
 *   for new filters with {@link createFilter}.
 * - Operators come from {@link DEFAULT_OPERATORS} per field `type`; override
 *   per field via {@link FilterFieldConfig.operators} or globally through the
 *   `i18n.operators` map. The `empty` / `not_empty` operators hide the value
 *   selector and clear stored values.
 * - `text` fields support `pattern` / `validation` with an inline error
 *   tooltip; `select` / `multiselect` fields support searchable options and
 *   `maxSelections`; `custom` fields render via
 *   {@link FilterFieldConfig.customRenderer}.
 * - Built on {@link Popover} + {@link Command} (searchable lists) and
 *   {@link DropdownMenu} (operators) so keyboard navigation is native.
 *
 * @example
 * ```tsx
 * const [filters, setFilters] = React.useState<Filter[]>([]);
 *
 * <Filters
 *   filters={filters}
 *   onChange={setFilters}
 *   fields={[
 *     {
 *       key: "status",
 *       label: "Status",
 *       type: "select",
 *       options: [
 *         { value: "active", label: "Active" },
 *         { value: "archived", label: "Archived" },
 *       ],
 *     },
 *     { key: "name", label: "Name", type: "text" },
 *   ]}
 * />
 * ```
 */
export function Filters({
  filters,
  fields,
  onChange,
  className,
  variant = "default",
  size = "default",
  radius = "default",
  i18n,
  trigger,
  allowMultiple = true,
  enableShortcut = false,
  shortcutKey = "f",
  shortcutLabel = "F",
  showSearchInput = true,
}: FiltersProps) {
  const [lastAddedId, setLastAddedId] = React.useState<string | null>(null);

  const mergedI18n = React.useMemo<FilterI18nConfig>(
    () => ({
      ...DEFAULT_I18N,
      ...i18n,
      operators: { ...DEFAULT_I18N.operators, ...i18n?.operators },
      placeholders: { ...DEFAULT_I18N.placeholders, ...i18n?.placeholders },
      helpers: { ...DEFAULT_I18N.helpers, ...i18n?.helpers },
      validation: { ...DEFAULT_I18N.validation, ...i18n?.validation },
    }),
    [i18n]
  );

  const contextValue = React.useMemo<FilterContextValue>(
    () => ({ variant, size, radius, i18n: mergedI18n }),
    [variant, size, radius, mergedI18n]
  );

  const fieldsMap = React.useMemo(() => getFieldsMap(fields), [fields]);

  React.useEffect(() => {
    if (!lastAddedId) {
      return;
    }
    const timer = window.setTimeout(() => setLastAddedId(null), 1000);
    return () => window.clearTimeout(timer);
  }, [lastAddedId]);

  return (
    <FilterContext.Provider value={contextValue}>
      <div
        className={cn(filtersContainerVariants({ variant, size }), className)}
        data-slot="filter"
      >
        <AddFilterMenu
          allowMultiple={allowMultiple}
          enableShortcut={enableShortcut}
          fields={fields}
          filters={filters}
          onAdded={setLastAddedId}
          onChange={onChange}
          shortcutKey={shortcutKey}
          shortcutLabel={shortcutLabel}
          showSearchInput={showSearchInput}
          trigger={trigger}
        />
        {filters.map((filter) => {
          const field = fieldsMap[filter.field];
          if (!field) {
            return null;
          }
          return (
            <FilterChip
              autoFocus={filter.id === lastAddedId}
              field={field}
              filter={filter}
              key={filter.id}
              onRemove={() =>
                onChange(filters.filter((item) => item.id !== filter.id))
              }
              onUpdate={(updates) =>
                onChange(applyFilterUpdate(filters, filter.id, updates))
              }
            />
          );
        })}
      </div>
    </FilterContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

/** Create a {@link Filter} with a generated id (defaults operator to `"is"`). */
export function createFilter(
  field: string,
  operator?: string,
  values: string[] = []
): Filter {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    field,
    operator: operator ?? "is",
    values,
  };
}

/** Bundle filters + their fields into a named {@link FilterGroup}. */
export function createFilterGroup(
  id: string,
  label: string,
  fields: FilterFieldConfig[],
  initialFilters: Filter[] = []
): FilterGroup {
  return { id, label, filters: initialFilters, fields };
}
