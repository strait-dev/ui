"use client";

import { ArrowDown01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";
import { CircleFlag } from "react-circle-flags";
import RPNInput, {
  type Country,
  getCountryCallingCode,
  type Value,
} from "react-phone-number-input";
import { cn } from "../utils/index";
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

/**
 * Height variant shared by the number input and the country-selector button —
 * `"sm"` | `"default"` | `"lg"`.
 */
type PhoneInputVariant = "sm" | "default" | "lg";

/** Maps each {@link PhoneInputVariant} to a matching height utility class. */
const variantHeights: Record<PhoneInputVariant, string> = {
  sm: "h-7",
  default: "h-8",
  lg: "h-9",
};

/**
 * Internal context threading layout options from {@link PhoneInput} down to the
 * country picker and number input (which `react-phone-number-input` renders for
 * us, so props cannot be passed directly).
 */
type PhoneInputContextValue = {
  variant: PhoneInputVariant;
  popupClassName?: string;
};

const PhoneInputContext = React.createContext<PhoneInputContextValue>({
  variant: "default",
});

/** A single entry in the country selector list. */
type CountryEntry = { label: string; value: Country | undefined };

/** Props injected into {@link CountrySelect} by `react-phone-number-input`. */
type CountrySelectProps = {
  disabled?: boolean;
  value: Country;
  options: CountryEntry[];
  onChange: (country: Country) => void;
};

/**
 * Popover-based country picker used as the `countrySelectComponent` inside
 * {@link PhoneInput}; renders a flag button that opens a searchable list.
 */
const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  const { variant, popupClassName } = React.useContext(PhoneInputContext);
  const [searchValue, setSearchValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover
      modal
      onOpenChange={(open) => {
        setIsOpen(open);
        // Clear stale search text so the full list appears on re-open.
        if (open) {
          setSearchValue("");
        }
      }}
      open={isOpen}
    >
      <PopoverTrigger
        render={
          <Button
            aria-label="Select country"
            className={cn(
              "flex gap-1 rounded-s-md rounded-e-none border-r-0 px-3 focus:z-10",
              variantHeights[variant]
            )}
            disabled={disabled}
            type="button"
            variant="outline"
          />
        }
      >
        <FlagComponent
          country={selectedCountry}
          countryName={selectedCountry}
        />
        <HugeiconsIcon
          className={cn(
            "-mr-2 size-4 text-muted-foreground",
            disabled ? "hidden" : ""
          )}
          icon={ArrowDown01Icon}
        />
      </PopoverTrigger>
      <PopoverContent className={cn("w-[300px] p-0", popupClassName)}>
        <Command>
          <CommandInput
            aria-label="Search country"
            onValueChange={setSearchValue}
            placeholder="Search country..."
            value={searchValue}
          />
          <CommandList className="max-h-72">
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup className="p-1">
              {countryList
                .filter(
                  ({ label }) =>
                    searchValue === "" ||
                    label.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map(({ value, label }) =>
                  value ? (
                    <CountrySelectOption
                      country={value}
                      countryName={label}
                      key={value}
                      onChange={onChange}
                      onSelectComplete={() => setIsOpen(false)}
                      selectedCountry={selectedCountry}
                    />
                  ) : null
                )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

/** Props for a single row inside the {@link CountrySelect} list. */
type CountrySelectOptionProps = {
  country: Country;
  countryName: string;
  selectedCountry: Country;
  onChange: (country: Country) => void;
  onSelectComplete: () => void;
};

/**
 * A single selectable country row inside {@link CountrySelect}; shows a
 * flag, country name, calling code, and a check mark when selected.
 */
const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
  onSelectComplete,
}: CountrySelectOptionProps) => {
  const handleSelect = () => {
    onChange(country);
    onSelectComplete();
  };

  return (
    <CommandItem className="gap-2" onSelect={handleSelect}>
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      <span className="text-muted-foreground text-sm">{`+${getCountryCallingCode(country)}`}</span>
      <HugeiconsIcon
        className={cn(
          "ml-auto size-4",
          country === selectedCountry ? "opacity-100" : "opacity-0"
        )}
        icon={Tick01Icon}
      />
    </CommandItem>
  );
};

/** Props for {@link FlagComponent}. */
type FlagComponentProps = {
  country: Country | undefined;
  countryName: string;
};

/**
 * Circular flag icon for a given country; renders a neutral placeholder
 * when `country` is `undefined` (e.g. while the value is unset).
 */
const FlagComponent = ({ country, countryName }: FlagComponentProps) => {
  if (!country) {
    return (
      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted" />
    );
  }

  return (
    <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full">
      <CircleFlag
        countryCode={country.toLowerCase()}
        height={16}
        title={countryName}
      />
    </span>
  );
};

/**
 * Props for {@link PhoneInput}.
 *
 * @remarks
 * `onChange` is re-typed to always receive a `Value` string (never
 * `undefined`) — an empty string is substituted when the library emits
 * `undefined` for incomplete numbers.
 */
export type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref" | "size"
> &
  Omit<React.ComponentProps<typeof RPNInput>, "onChange" | "size"> & {
    /** Called with the formatted E.164 phone number string as the user types;
     *  receives an empty string instead of `undefined` for partial inputs. */
    onChange?: (value: Value) => void;
    /** Called whenever the user selects a different country in the
     *  {@link CountrySelect} popover. */
    onCountryChange?: (country: Country) => void;
    /** Height of the field and country button — `"sm"` | `"default"` | `"lg"`
     *  (default `"default"`). */
    variant?: PhoneInputVariant;
    /** Extra classes merged onto the country-selector popover content. */
    popupClassName?: string;
  };

/**
 * An international phone number field composed of a flag/country-code
 * selector and a number text input that formats as the user types.
 *
 * @remarks
 * Wraps `react-phone-number-input` (`RPNInput`) with custom sub-components:
 * - {@link CountrySelect} — flag button that opens a searchable popover.
 * - {@link FlagComponent} — circular flag badge.
 * - {@link InputComponent} — styled `Input` primitive with left-side radius
 *   removed to join flush with the country selector.
 *
 * The `onChange` callback always receives an E.164 `Value` string; when
 * `RPNInput` emits `undefined` (partial or empty number) it is coerced to an
 * empty string to keep controlled-input consumers stable. Use `variant` to
 * size the whole field and `popupClassName` to restyle the country popover.
 *
 * `smartCaret` is disabled to prevent caret-jump quirks on mobile browsers.
 *
 * @example
 * ```tsx
 * const [phone, setPhone] = useState<Value>("");
 * <PhoneInput
 *   defaultCountry="US"
 *   placeholder="Enter phone number"
 *   value={phone}
 *   onChange={setPhone}
 * />
 * ```
 */
const PhoneInput = ({
  className,
  onChange,
  onCountryChange,
  value,
  ref,
  variant = "default",
  popupClassName,
  ...props
}: PhoneInputProps & {
  ref?: React.Ref<React.ComponentRef<typeof RPNInput>>;
}) => {
  const contextValue = React.useMemo(
    () => ({ variant, popupClassName }),
    [variant, popupClassName]
  );

  return (
    <PhoneInputContext.Provider value={contextValue}>
      <div
        className="[&:has(input[aria-invalid=true])_button]:border-destructive [&:has(input[aria-invalid=true])_button]:ring-3 [&:has(input[aria-invalid=true])_button]:ring-destructive/20"
        data-slot="phone-input"
      >
        <RPNInput
          className={cn("flex", className)}
          countrySelectComponent={CountrySelect}
          flagComponent={FlagComponent}
          inputComponent={InputComponent}
          onChange={(inputValue: Value | undefined) =>
            onChange?.(inputValue || ("" as Value))
          }
          onCountryChange={onCountryChange}
          ref={ref}
          smartCaret={false}
          value={value || undefined}
          {...props}
        />
      </div>
    </PhoneInputContext.Provider>
  );
};

PhoneInput.displayName = "PhoneInput";

/**
 * Thin `Input` wrapper passed as `inputComponent` to {@link PhoneInput};
 * strips the start-side border radius so it joins flush with the country
 * selector button. Reads the active size {@link PhoneInputVariant} from
 * {@link PhoneInputContext} so its height tracks the parent `PhoneInput`.
 */
const InputComponent = ({
  className,
  ref,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & {
  ref?: React.RefObject<HTMLInputElement | null>;
}) => {
  const { variant } = React.useContext(PhoneInputContext);

  return (
    <Input
      className={cn("rounded-s-none rounded-e-md", className)}
      size={variant}
      {...props}
      ref={ref}
    />
  );
};

InputComponent.displayName = "InputComponent";

export type { PhoneInputVariant };
export { PhoneInput };
