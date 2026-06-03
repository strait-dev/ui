"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "../utils/index";
import { Button } from "./button";
import { Command, CommandGroup, CommandItem, CommandList } from "./command";

/** Default search debounce delay in milliseconds. */
const DEFAULT_DEBOUNCE_TIME = 500;

// ---------------------------------------------------------------------------
// Size mappings
// ---------------------------------------------------------------------------

/**
 * Size axis for {@link MultipleSelector}.
 *
 * | Value | Control min-height | Chip height | Chip text |
 * |-------|--------------------|-------------|-----------|
 * | `sm` | `min-h-8` | `h-6` | `text-xs` |
 * | `default` | `min-h-8` | `h-8` | `text-sm` |
 */
export type MultipleSelectorSize = "sm" | "default";

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------

// Helper component to render selected option badges
type SelectedBadgeProps = {
  option: Option;
  disabled?: boolean;
  badgeClassName?: string;
  onUnselect: (option: Option) => void;
  size: MultipleSelectorSize;
};

const SelectedBadge: React.FC<SelectedBadgeProps> = ({
  option,
  disabled,
  badgeClassName,
  onUnselect,
  size,
}) => (
  <div
    className={cn(
      "relative inline-flex animate-fadeIn cursor-default items-center rounded-md border bg-background font-medium text-secondary-foreground transition-all hover:bg-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-fixed:pe-3",
      // size variants for the chip
      size === "sm"
        ? "h-6 ps-2 pe-6 pl-2 text-xs"
        : "h-8 ps-3 pe-8 pl-3 text-sm",
      badgeClassName
    )}
    data-disabled={disabled || undefined}
    data-fixed={option.fixed}
    key={option.value}
  >
    {option.label}
    <Button
      aria-label="Remove"
      className="absolute -inset-y-px -end-px rounded-e-md"
      onClick={() => onUnselect(option)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onUnselect(option);
        }
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      size={size === "sm" ? "icon-xs" : "icon"}
      type="button"
      variant="ghost"
    >
      <HugeiconsIcon
        aria-hidden="true"
        className="size-4"
        icon={Cancel01Icon}
      />
    </Button>
  </div>
);

// Helper component to render dropdown option
type DropdownOptionProps = {
  option: Option;
  selected: Option[];
  maxSelected: number;
  onMaxSelected?: (maxLimit: number) => void;
  setInputValue: (value: string) => void;
  setSelected: React.Dispatch<React.SetStateAction<Option[]>>;
  onChange?: (options: Option[]) => void;
};

const DropdownOption: React.FC<DropdownOptionProps> = ({
  option,
  selected,
  maxSelected,
  onMaxSelected,
  setInputValue,
  setSelected,
  onChange,
}) => {
  const handleSelect = useCallback(() => {
    if (selected.length >= maxSelected) {
      onMaxSelected?.(selected.length);
      return;
    }
    setInputValue("");
    const newOptions = [...selected, option];
    setSelected(newOptions);
    onChange?.(newOptions);
  }, [
    selected,
    maxSelected,
    onMaxSelected,
    setInputValue,
    option,
    setSelected,
    onChange,
  ]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <CommandItem
      className={cn(
        "",
        option.disable
          ? "pointer-events-none cursor-not-allowed opacity-50"
          : null
      )}
      disabled={option.disable}
      key={option.value}
      onMouseDown={handleMouseDown}
      onSelect={handleSelect}
      value={option.value}
    >
      {option.label}
    </CommandItem>
  );
};

// Hook to manage click outside behavior
type UseClickOutsideOptions = {
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isOpen: boolean;
  onClose: () => void;
};

function useClickOutside({
  dropdownRef,
  inputRef,
  isOpen,
  onClose,
}: UseClickOutsideOptions) {
  const handleClickOutside = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        onClose();
        inputRef.current.blur();
      }
    },
    [dropdownRef, inputRef, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchend", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);
}

// Hook to sync options from props
type UseSyncOptionsParams = {
  arrayOptions: Option[] | undefined;
  groupBy: string | undefined;
  onSearch: ((value: string) => Promise<Option[]>) | undefined;
  currentOptions: GroupOption;
  setOptions: React.Dispatch<React.SetStateAction<GroupOption>>;
};

function useSyncOptions({
  arrayOptions,
  groupBy,
  onSearch,
  currentOptions,
  setOptions,
}: UseSyncOptionsParams) {
  useEffect(() => {
    if (!arrayOptions || onSearch) {
      return;
    }
    const newOption = transToGroupOption(arrayOptions || [], groupBy);
    if (JSON.stringify(newOption) !== JSON.stringify(currentOptions)) {
      setOptions(newOption);
    }
  }, [arrayOptions, groupBy, onSearch, currentOptions, setOptions]);
}

// Hook to handle sync search
type UseSyncSearchParams = {
  onSearchSync?: (value: string) => Option[];
  debouncedSearchTerm: string;
  groupBy?: string;
  isOpen: boolean;
  triggerSearchOnFocus: boolean;
  setOptions: React.Dispatch<React.SetStateAction<GroupOption>>;
};

function useSyncSearch({
  onSearchSync,
  debouncedSearchTerm,
  groupBy,
  isOpen,
  triggerSearchOnFocus,
  setOptions,
}: UseSyncSearchParams) {
  useEffect(() => {
    const doSearchSync = () => {
      const res = onSearchSync?.(debouncedSearchTerm);
      setOptions(transToGroupOption(res || [], groupBy));
    };

    if (!(onSearchSync && isOpen)) {
      return;
    }

    if (triggerSearchOnFocus || debouncedSearchTerm) {
      doSearchSync();
    }
  }, [
    debouncedSearchTerm,
    groupBy,
    isOpen,
    triggerSearchOnFocus,
    onSearchSync,
    setOptions,
  ]);
}

// Hook to handle async search
type UseAsyncSearchParams = {
  onSearch?: (value: string) => Promise<Option[]>;
  debouncedSearchTerm: string;
  groupBy?: string;
  isOpen: boolean;
  triggerSearchOnFocus: boolean;
  setOptions: React.Dispatch<React.SetStateAction<GroupOption>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

function useAsyncSearch({
  onSearch,
  debouncedSearchTerm,
  groupBy,
  isOpen,
  triggerSearchOnFocus,
  setOptions,
  setIsLoading,
}: UseAsyncSearchParams) {
  useEffect(() => {
    const doSearch = async () => {
      setIsLoading(true);
      const res = await onSearch?.(debouncedSearchTerm);
      setOptions(transToGroupOption(res || [], groupBy));
      setIsLoading(false);
    };

    if (!(onSearch && isOpen)) {
      return;
    }

    if (triggerSearchOnFocus || debouncedSearchTerm) {
      doSearch();
    }
  }, [
    debouncedSearchTerm,
    groupBy,
    isOpen,
    triggerSearchOnFocus,
    onSearch,
    setOptions,
    setIsLoading,
  ]);
}

// Hook to sync value from props
function useSyncValue(
  value: Option[] | undefined,
  setSelected: React.Dispatch<React.SetStateAction<Option[]>>
) {
  useEffect(() => {
    if (value) {
      setSelected(value);
    }
  }, [value, setSelected]);
}

// Hook to handle keyboard navigation
type UseKeyDownHandlerParams = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  selected: Option[];
  handleUnselect: (option: Option) => void;
};

function useKeyDownHandler({
  inputRef,
  selected,
  handleUnselect,
}: UseKeyDownHandlerParams) {
  return useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      const isDeleteOrBackspace = e.key === "Delete" || e.key === "Backspace";
      const shouldRemoveLast =
        isDeleteOrBackspace && input.value === "" && selected.length > 0;

      if (shouldRemoveLast) {
        const lastSelectOption = selected.at(-1);
        if (lastSelectOption && !lastSelectOption.fixed) {
          handleUnselect(lastSelectOption);
        }
      }

      if (e.key === "Escape") {
        input.blur();
      }
    },
    [inputRef, handleUnselect, selected]
  );
}

// Helper to create command filter
function createCommandFilter(
  creatable: boolean,
  commandPropsFilter?: (value: string, search: string) => number
) {
  if (commandPropsFilter) {
    return commandPropsFilter;
  }

  if (creatable) {
    return (val: string, search: string) =>
      val.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
  }

  return;
}

// Component for rendering empty state
type EmptyItemRendererProps = {
  emptyIndicator?: React.ReactNode;
  onSearch?: (value: string) => Promise<Option[]>;
  creatable: boolean;
  options: GroupOption;
};

const EmptyItemRenderer: React.FC<EmptyItemRendererProps> = ({
  emptyIndicator,
  onSearch,
  creatable,
  options,
}) => {
  if (!emptyIndicator) {
    return null;
  }

  // For async search that showing emptyIndicator
  if (onSearch && !creatable && Object.keys(options).length === 0) {
    return (
      <CommandItem disabled value="-">
        {emptyIndicator}
      </CommandItem>
    );
  }

  return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
};

// Component for the clear all button
type ClearAllButtonProps = {
  showClearAllButton: boolean;
  disabled?: boolean;
  selected: Option[];
  setSelected: React.Dispatch<React.SetStateAction<Option[]>>;
  onChange?: (options: Option[]) => void;
  size: MultipleSelectorSize;
};

const ClearAllButton: React.FC<ClearAllButtonProps> = ({
  showClearAllButton,
  disabled,
  selected,
  setSelected,
  onChange,
  size,
}) => {
  const shouldHide =
    !showClearAllButton ||
    disabled ||
    selected.length < 1 ||
    selected.filter((s) => s.fixed).length === selected.length;

  const handleClear = useCallback(() => {
    const fixedItems = selected.filter((s) => s.fixed);
    setSelected(fixedItems);
    onChange?.(fixedItems);
  }, [selected, setSelected, onChange]);

  return (
    <Button
      aria-label="Clear all"
      className={cn("absolute end-0 top-0", shouldHide ? "hidden" : null)}
      onClick={handleClear}
      size={size === "sm" ? "icon-sm" : "icon-lg"}
      type="button"
      variant="ghost"
    >
      <HugeiconsIcon
        aria-hidden="true"
        className="size-4"
        icon={Cancel01Icon}
      />
    </Button>
  );
};

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/**
 * A single selectable option used throughout {@link MultipleSelector}.
 *
 * `value` is the internal key; `label` is the display string.
 * Mark `fixed: true` to prevent the option from being removed by the
 * user (it is kept even when "Clear all" is invoked). Any extra key
 * can be used with the `groupBy` prop to bucket options into groups.
 */
export type Option = {
  value: string;
  label: string;
  disable?: boolean;
  /** fixed option that can't be removed. */
  fixed?: boolean;
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined;
};

type GroupOption = {
  [key: string]: Option[];
};

/** Props for {@link MultipleSelector}. */
export type MultipleSelectorProps = {
  /** Controlled selection; keep in sync via {@link MultipleSelectorProps.onChange}. */
  value?: Option[];
  /** Initial options shown in the dropdown before any search. */
  defaultOptions?: Option[];
  /** manually controlled options */
  options?: Option[];
  /** Input placeholder text shown when no options are selected. */
  placeholder?: string;
  /** Loading component. */
  loadingIndicator?: React.ReactNode;
  /** Empty component. */
  emptyIndicator?: React.ReactNode;
  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number;
  /**
   * Only work with `onSearch` prop. Trigger search when `onFocus`.
   * For example, when user click on the input, it will trigger the search to get initial options.
   */
  triggerSearchOnFocus?: boolean;
  /** async search */
  onSearch?: (value: string) => Promise<Option[]>;
  /**
   * sync search. This search will not showing loadingIndicator.
   * The rest props are the same as async search.
   * i.e.: creatable, groupBy, delay.
   */
  onSearchSync?: (value: string) => Option[];
  /** Called with the full updated selection whenever options are added or removed. */
  onChange?: (options: Option[]) => void;
  /** Limit the maximum number of selected options. */
  maxSelected?: number;
  /** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
  onMaxSelected?: (maxLimit: number) => void;
  /** Show the placeholder when there are options selected. */
  showPlaceholderWhenSelected?: boolean;
  /** Disables the control; pointer events are blocked and opacity is reduced. */
  disabled?: boolean;
  /** Group the options base on provided key. */
  groupBy?: string;
  /** Extra classes merged onto the outer input wrapper element. */
  className?: string;
  /** Extra classes merged onto each selected-option badge chip. */
  badgeClassName?: string;
  /**
   * First item selected is a default behavior by cmdk. That is why the default is true.
   * This is a workaround solution by add a dummy item.
   *
   * @reference: https://github.com/pacocoursey/cmdk/issues/171
   */
  selectFirstItem?: boolean;
  /** Allow user to create option when there is no option matched. */
  creatable?: boolean;
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
  /** Props of `CommandInput` */
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    "value" | "placeholder" | "disabled"
  >;
  /** show the clear all button. */
  showClearAllButton?: boolean;
  /**
   * Size axis controlling control height and chip size.
   *
   * | Value | Control min-height | Chip height | Chip text |
   * |-------|--------------------|-------------|-----------|
   * | `sm` | `min-h-8` | `h-6` | `text-xs` |
   * | `default` | `min-h-8` | `h-8` | `text-sm` |
   *
   * @default "default"
   */
  size?: MultipleSelectorSize;
};

/**
 * Ref handle exposed by {@link MultipleSelector} for programmatic
 * control — inspect the current selection, focus the input, or reset
 * it from parent code.
 */
export type MultipleSelectorRef = {
  selectedValue: Option[];
  input: HTMLInputElement;
  focus: () => void;
  reset: () => void;
};

// ---------------------------------------------------------------------------
// Utility hooks
// ---------------------------------------------------------------------------

/**
 * Returns a debounced copy of `value` that only updates after
 * `delay` ms of inactivity. Used to throttle async search calls in
 * {@link MultipleSelector}.
 */
export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedValue(value),
      delay || DEFAULT_DEBOUNCE_TIME
    );

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function transToGroupOption(options: Option[], groupBy?: string) {
  if (options.length === 0) {
    return {};
  }
  if (!groupBy) {
    return {
      "": options,
    };
  }

  const groupOption: GroupOption = {};
  for (const option of options) {
    const key = (option[groupBy] as string) || "";
    if (!groupOption[key]) {
      groupOption[key] = [];
    }
    groupOption[key].push(option);
  }
  return groupOption;
}

function removePickedOption(groupOption: GroupOption, picked: Option[]) {
  const cloneOption = JSON.parse(JSON.stringify(groupOption)) as GroupOption;

  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = value.filter(
      (val) => !picked.find((p) => p.value === val.value)
    );
  }
  return cloneOption;
}

function isOptionsExist(groupOption: GroupOption, targetOption: Option[]) {
  for (const [, value] of Object.entries(groupOption)) {
    if (
      value.some((option) => targetOption.find((p) => p.value === option.value))
    ) {
      return true;
    }
  }
  return false;
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  const render = useCommandState((state) => state.filtered.count === 0);

  if (!render) {
    return null;
  }

  return (
    <div
      className={cn("px-2 py-4 text-center text-sm", className)}
      cmdk-empty=""
      data-slot="empty"
      role="presentation"
      {...props}
    />
  );
}

// CreatableItem component moved outside to fix nested component definition
function CreatableItem({
  creatable,
  options,
  inputValue,
  selected,
  maxSelected,
  onMaxSelected,
  setInputValue,
  setSelected,
  onChange,
  onSearch,
  debouncedSearchTerm,
  isLoading,
}: {
  creatable: boolean;
  options: GroupOption;
  inputValue: string;
  selected: Option[];
  maxSelected: number;
  onMaxSelected?: (maxLimit: number) => void;
  setInputValue: (value: string) => void;
  setSelected: (options: Option[]) => void;
  onChange?: (options: Option[]) => void;
  onSearch?: (value: string) => Promise<Option[]>;
  debouncedSearchTerm: string;
  isLoading: boolean;
}) {
  if (!creatable) {
    return;
  }

  if (
    isOptionsExist(options, [{ value: inputValue, label: inputValue }]) ||
    selected.find((s) => s.value === inputValue)
  ) {
    return;
  }

  const Item = (
    <CommandItem
      className=""
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onSelect={(value: string) => {
        if (selected.length >= maxSelected) {
          onMaxSelected?.(selected.length);
          return;
        }
        setInputValue("");
        const newOptions = [...selected, { value, label: value }];
        setSelected(newOptions);
        onChange?.(newOptions);
      }}
      value={inputValue}
    >
      {`Create "${inputValue}"`}
    </CommandItem>
  );

  // For normal creatable
  if (!onSearch && inputValue.length > 0) {
    return Item;
  }

  // For async search creatable. avoid showing creatable item before loading at first.
  if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
    return Item;
  }

  return;
}

// ---------------------------------------------------------------------------
// MultipleSelector
// ---------------------------------------------------------------------------

/**
 * A multi-value combobox that lets users select (and optionally
 * create) multiple options from a searchable dropdown list.
 *
 * Built on top of `cmdk`'s `Command` primitive with badge-style
 * chips for each selected value.
 *
 * @remarks
 * **Option sources** — supply options one of three ways:
 * - `options` — a static array kept in sync via `useSyncOptions`.
 * - `defaultOptions` — initial options for uncontrolled usage.
 * - `onSearch` / `onSearchSync` — async or sync search callbacks;
 *   the input is debounced by `delay` (default 500 ms).
 *
 * **Controlled vs. uncontrolled** — pass `value` to control the
 * selection externally; `onChange` fires whenever the selection
 * changes.
 *
 * **Fixed options** — set `option.fixed = true` to prevent removal
 * by the user or the "Clear all" button.
 *
 * **Creatable** — set `creatable={true}` to allow users to add
 * options that don't exist yet; a `Create "…"` item appears when no
 * match is found.
 *
 * **Grouping** — set `groupBy` to a key present on each
 * {@link Option} object to bucket the dropdown items under labeled
 * groups.
 *
 * **Size** — `size="sm"` renders a more compact control height and
 * smaller chip badges. Defaults to `"default"` (unchanged original
 * appearance).
 *
 * Pair with a `<Label>` for accessible forms.
 *
 * @example
 * ```tsx
 * <MultipleSelector
 *   options={[
 *     { value: "react", label: "React" },
 *     { value: "vue", label: "Vue" },
 *   ]}
 *   placeholder="Pick frameworks…"
 *   onChange={(opts) => console.log(opts)}
 * />
 * ```
 *
 * @example Small size
 * ```tsx
 * <MultipleSelector size="sm" options={options} placeholder="Filter…" />
 * ```
 */
function MultipleSelector({
  value,
  onChange,
  placeholder,
  defaultOptions: arrayDefaultOptions = [],
  options: arrayOptions,
  delay,
  onSearch,
  onSearchSync,
  loadingIndicator,
  emptyIndicator,
  maxSelected = Number.MAX_SAFE_INTEGER,
  onMaxSelected,
  showPlaceholderWhenSelected = true,
  disabled,
  groupBy,
  className,
  badgeClassName,
  selectFirstItem = true,
  creatable = false,
  triggerSearchOnFocus = false,
  commandProps,
  inputProps,
  showClearAllButton = true,
  size = "default",
}: MultipleSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [onScrollbar, setOnScrollbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Added this

  const [selected, setSelected] = useState<Option[]>(value || []);
  const [options, setOptions] = useState<GroupOption>(
    transToGroupOption(arrayDefaultOptions, groupBy)
  );
  const [inputValue, setInputValue] = useState("");
  const debouncedSearchTerm = useDebounce(
    inputValue,
    delay || DEFAULT_DEBOUNCE_TIME
  );

  // Use extracted hook for click outside behavior
  const handleClose = useCallback(() => setOpen(false), []);
  useClickOutside({
    dropdownRef,
    inputRef,
    isOpen: open,
    onClose: handleClose,
  });

  // Use extracted hook for syncing options from props
  useSyncOptions({
    arrayOptions,
    groupBy,
    onSearch,
    currentOptions: options,
    setOptions,
  });

  // Use extracted hooks for search functionality
  useSyncSearch({
    onSearchSync,
    debouncedSearchTerm,
    groupBy,
    isOpen: open,
    triggerSearchOnFocus,
    setOptions,
  });
  useAsyncSearch({
    onSearch,
    debouncedSearchTerm,
    groupBy,
    isOpen: open,
    triggerSearchOnFocus,
    setOptions,
    setIsLoading,
  });

  // Sync value from props
  useSyncValue(value, setSelected);

  const handleUnselect = useCallback(
    (option: Option) => {
      const newOptions = selected.filter((s) => s.value !== option.value);
      setSelected(newOptions);
      onChange?.(newOptions);
    },
    [onChange, selected]
  );

  const handleKeyDown = useKeyDownHandler({
    inputRef,
    selected,
    handleUnselect,
  });

  // Derive the displayable options by subtracting already-selected
  // values so they don't appear as duplicate choices.
  const selectables = useMemo<GroupOption>(
    () => removePickedOption(options, selected),
    [options, selected]
  );

  // Build the cmdk filter function once; changes only when creatable
  // mode or a custom filter is toggled.
  const commandFilter = useMemo(
    () => createCommandFilter(creatable, commandProps?.filter),
    [creatable, commandProps?.filter]
  );

  const handleTriggerClick = useCallback(() => {
    if (!disabled) {
      inputRef?.current?.focus();
    }
  }, [disabled]);

  const handleInputBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      // Keep the dropdown open while the user is scrolling the list
      // (onScrollbar is true), so clicking a scrollbar doesn't close
      // the popup before the selection registers.
      if (!onScrollbar) {
        setOpen(false);
      }
      inputProps?.onBlur?.(event);
    },
    [onScrollbar, inputProps]
  );

  const handleInputFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      setOpen(true);
      if (triggerSearchOnFocus) {
        onSearch?.(debouncedSearchTerm);
      }
      inputProps?.onFocus?.(event);
    },
    [triggerSearchOnFocus, onSearch, debouncedSearchTerm, inputProps]
  );

  const handleInputValueChange = useCallback(
    (val: string) => {
      setInputValue(val);
      inputProps?.onValueChange?.(val);
    },
    [inputProps]
  );

  const handleCommandKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      handleKeyDown(e);
      commandProps?.onKeyDown?.(e);
    },
    [handleKeyDown, commandProps]
  );

  // When async search is active cmdk must NOT filter internally —
  // the server/callback already returns the relevant subset.
  const shouldFilterValue =
    commandProps?.shouldFilter === undefined
      ? !onSearch
      : commandProps.shouldFilter;

  // Derive size-dependent classes. The control grows with selected chips, so
  // this only sets the empty-state baseline — sm matches Input's h-7.
  const controlMinH = size === "sm" ? "min-h-7" : "min-h-8";

  return (
    <Command
      ref={dropdownRef}
      {...commandProps}
      className={cn(
        "h-auto overflow-visible bg-transparent",
        commandProps?.className
      )}
      filter={commandFilter}
      onKeyDown={handleCommandKeyDown}
      shouldFilter={shouldFilterValue}
    >
      {/** biome-ignore lint/a11y/noStaticElementInteractions: wrapper only focuses the inner input on click. */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: the inner combobox input is itself fully keyboard accessible. */}
      {/** biome-ignore lint/a11y/noNoninteractiveElementInteractions: wrapper only focuses the inner input; the inner combobox input is itself fully keyboard accessible. */}
      <div
        className={cn(
          "relative rounded-lg border border-input text-sm outline-none transition-[color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-aria-invalid:border-destructive has-disabled:opacity-50 has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40",
          controlMinH,
          {
            "p-1": selected.length !== 0,
            "cursor-text": !disabled && selected.length !== 0,
          },
          showClearAllButton && "pe-9",
          className
        )}
        onClick={handleTriggerClick}
      >
        <div className="flex flex-wrap gap-1">
          {selected.map((option) => (
            <SelectedBadge
              badgeClassName={badgeClassName}
              disabled={disabled}
              key={option.value}
              onUnselect={handleUnselect}
              option={option}
              size={size}
            />
          ))}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            {...inputProps}
            className={cn(
              "flex-1 bg-transparent outline-hidden placeholder:text-muted-foreground/70 disabled:cursor-not-allowed",
              {
                "w-full": !showPlaceholderWhenSelected,
                "px-3 py-2": selected.length === 0,
                "ml-1": selected.length !== 0,
              },
              inputProps?.className
            )}
            disabled={disabled}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            onValueChange={handleInputValueChange}
            placeholder={
              !showPlaceholderWhenSelected && selected.length !== 0
                ? ""
                : (placeholder ?? "")
            }
            ref={inputRef}
            value={inputValue}
          />
          <ClearAllButton
            disabled={disabled}
            onChange={onChange}
            selected={selected}
            setSelected={setSelected}
            showClearAllButton={showClearAllButton}
            size={size}
          />
        </div>
      </div>
      <div className="relative">
        <div
          className={cn(
            "absolute top-2 z-10 w-full overflow-hidden rounded-md border border-input",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=open]:animate-in",
            !open && "hidden"
          )}
          data-state={open ? "open" : "closed"}
        >
          <CommandList
            className="bg-popover text-popover-foreground shadow-md outline-hidden ring-1 ring-foreground/10"
            onMouseEnter={() => {
              setOnScrollbar(true);
            }}
            onMouseLeave={() => {
              setOnScrollbar(false);
            }}
            onMouseUp={() => {
              inputRef?.current?.focus();
            }}
          >
            {isLoading ? (
              loadingIndicator
            ) : (
              <>
                <EmptyItemRenderer
                  creatable={creatable}
                  emptyIndicator={emptyIndicator}
                  onSearch={onSearch}
                  options={options}
                />
                {CreatableItem({
                  creatable,
                  options,
                  inputValue,
                  selected,
                  maxSelected,
                  onMaxSelected,
                  setInputValue,
                  setSelected,
                  onChange,
                  onSearch,
                  debouncedSearchTerm,
                  isLoading,
                })}
                {selectFirstItem ? null : (
                  <CommandItem className="hidden" value="-" />
                )}
                {Object.entries(selectables).map(([key, dropdowns]) => (
                  <CommandGroup
                    className="h-full overflow-auto"
                    heading={key}
                    key={key}
                  >
                    {dropdowns.map((option) => (
                      <DropdownOption
                        key={option.value}
                        maxSelected={maxSelected}
                        onChange={onChange}
                        onMaxSelected={onMaxSelected}
                        option={option}
                        selected={selected}
                        setInputValue={setInputValue}
                        setSelected={setSelected}
                      />
                    ))}
                  </CommandGroup>
                ))}
              </>
            )}
          </CommandList>
        </div>
      </div>
    </Command>
  );
}

MultipleSelector.displayName = "MultipleSelector";
export default MultipleSelector;
