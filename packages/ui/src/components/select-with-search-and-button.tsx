"use client";

import {
  Add01Icon,
  ArrowDown01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

import { cn } from "../utils/index";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./command";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

/**
 * A single option entry used by {@link SelectWithSearchAndButton}.
 */
export type SelectOptionWithSearchAndButton = {
  value: string;
  label: string;
};

/** Props for {@link SelectWithSearchAndButton}. */
export type SelectWithSearchAndButtonProps = {
  /** List of options to display in the searchable dropdown. */
  options: SelectOptionWithSearchAndButton[];
  /** Currently selected value; drives controlled mode. */
  value?: string;
  /** Called with the new value when the user selects or deselects an option. */
  onValueChange?: (value: string) => void;
  /** Text shown in the trigger button when no option is selected. */
  placeholder?: string;
  /** Accessible label rendered above the trigger via {@link Label}. */
  label?: string;
  /** Placeholder inside the search {@link CommandInput}. */
  searchPlaceholder?: string;
  /** Message shown by {@link CommandEmpty} when no options match the search. */
  noResultsText?: string;
  /** Additional classes merged onto the outermost wrapper `div`. */
  className?: string;
  /** When `true`, the trigger button is disabled and non-interactive. */
  disabled?: boolean;
  /** When `true`, renders the trigger border in `destructive` color. */
  error?: boolean;
  /** When `true`, appends a red asterisk to the label. */
  required?: boolean;
  /** `name` / `id` forwarded to the trigger button element. */
  name?: string;
  /** Label text rendered inside the action button below the option list. */
  buttonText?: string;
  /** Called when the user clicks the action button; also closes the dropdown. */
  onButtonClick?: () => void;
  /** Icon node rendered to the left of `buttonText` inside the action button. */
  buttonIcon?: React.ReactNode;
};

/**
 * A searchable single-select dropdown with a persistent action
 * button pinned below the option list, typically used for inline
 * "Add new …" creation flows.
 *
 * @remarks
 * Composes `Popover`, `Command` (cmdk), `Label`, and `Button` from
 * the design system. Unlike {@link SelectWithSearch} the option list
 * is not virtualized; filtering is handled client-side by the
 * underlying `Command` primitive.
 *
 * Selecting an already-selected option toggles it back to empty
 * (the value is cleared), giving users a way to deselect.
 *
 * When `onButtonClick` is provided, a `CommandSeparator` and a
 * ghost `Button` are appended after the options. Clicking the
 * button invokes `onButtonClick` and immediately closes the
 * dropdown.
 *
 * @example
 * ```tsx
 * <SelectWithSearchAndButton
 *   label="Team"
 *   options={teams}
 *   value={teamId}
 *   onValueChange={setTeamId}
 *   buttonText="Create team"
 *   onButtonClick={openCreateTeamDialog}
 * />
 * ```
 */
export function SelectWithSearchAndButton({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  label,
  searchPlaceholder = "Search...",
  noResultsText = "No results found.",
  className,
  disabled = false,
  error = false,
  required = false,
  name,
  buttonText = "Add new",
  onButtonClick,
  buttonIcon = (
    <HugeiconsIcon
      aria-hidden="true"
      className="-ms-2 me-2 size-4 opacity-60"
      icon={Add01Icon}
    />
  ),
}: SelectWithSearchAndButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value || "");

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      const newValue = currentValue === selectedValue ? "" : currentValue;
      setSelectedValue(newValue);
      onValueChange?.(newValue);
      setOpen(false);
    },
    [selectedValue, onValueChange]
  );

  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      data-slot="select-with-search-and-button"
    >
      {label ? (
        <Label className={cn(error ? "text-destructive" : null)} htmlFor={name}>
          {label}
          {required ? <span className="ml-1 text-destructive">*</span> : null}
        </Label>
      ) : null}
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger
          render={
            <Button
              aria-expanded={open}
              className={cn(
                "w-full justify-between bg-background px-3 font-normal hover:bg-background focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                !selectedValue && "text-muted-foreground",
                error ? "border-destructive" : null,
                disabled ? "cursor-not-allowed opacity-50" : null
              )}
              disabled={disabled}
              id={name}
              variant="outline"
            />
          }
        >
          <span className="truncate">
            {selectedValue
              ? (options.find((option) => option.value === selectedValue)
                  ?.label ?? "")
              : (placeholder ?? "")}
          </span>
          <HugeiconsIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground/80"
            icon={ArrowDown01Icon}
          />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{noResultsText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={handleSelect}
                    value={option.value}
                  >
                    {option.label}
                    {selectedValue === option.value ? (
                      <HugeiconsIcon
                        className="ml-auto size-4"
                        icon={Tick01Icon}
                      />
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
              {onButtonClick ? (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <Button
                      className="w-full justify-start font-normal"
                      onClick={() => {
                        onButtonClick();
                        setOpen(false);
                      }}
                      variant="ghost"
                    >
                      {buttonIcon}
                      {buttonText}
                    </Button>
                  </CommandGroup>
                </>
              ) : null}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
