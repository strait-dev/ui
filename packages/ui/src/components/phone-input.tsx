"use client";

import {
  ArrowDown01Icon,
  Search01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
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
  CommandItem,
  CommandList,
} from "./command";
import { Input, type InputProps } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

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
            className="flex gap-1 rounded-s-md rounded-e-none border-r-0 px-3 focus:z-10"
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
            "-mr-2 size-4 text-muted-foreground/80",
            disabled ? "hidden" : ""
          )}
          icon={ArrowDown01Icon}
        />
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <div className="flex items-center border-input border-b px-3 py-2">
            <div className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
              <HugeiconsIcon
                className="size-4 text-muted-foreground/80"
                icon={Search01Icon}
              />
            </div>
            <input
              aria-label="Search country"
              className="ml-3 flex h-6 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50"
              cmdk-input=""
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search country..."
              value={searchValue}
            />
          </div>
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
      <span className="text-foreground/50 text-sm">{`+${getCountryCallingCode(country)}`}</span>
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
 * `undefined` for incomplete numbers. `size` controls the height of the
 * underlying text input — `"sm"` | `"default"` | `"lg"`.
 */
type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref" | "size"
> &
  Omit<React.ComponentProps<typeof RPNInput>, "onChange" | "size"> &
  Pick<InputProps, "size"> & {
    onChange?: (value: Value) => void;
    onCountryChange?: (country: Country) => void;
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
 * empty string to keep controlled-input consumers stable.
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
  size = "default",
  ...props
}: PhoneInputProps & {
  ref?: React.Ref<React.ComponentRef<typeof RPNInput>>;
}) => {
  return (
    <div data-slot="phone-input">
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
        /**
         * Handles the onChange event.
         *
         * react-phone-number-input might trigger the onChange event as undefined
         * when a valid phone number is not entered. To prevent this,
         * the value is coerced to an empty string.
         *
         * @param {E164Number | undefined} inputValue - The entered value
         */
        smartCaret={false}
        value={value || undefined}
        {...props}
        // RPNInput spreads unrecognised props onto the inputComponent via
        // FeatureProps<InputComponentProps>; `size` reaches InputComponent here.
        size={size}
      />
    </div>
  );
};

PhoneInput.displayName = "PhoneInput";

/**
 * Thin `Input` wrapper passed as `inputComponent` to {@link PhoneInput};
 * strips the start-side border radius so it joins flush with the country
 * selector button. Accepts `size` from `InputProps` so the height can be
 * controlled from the parent `PhoneInput`.
 */
const InputComponent = ({
  className,
  ref,
  size,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  Pick<InputProps, "size"> & {
    ref?: React.RefObject<HTMLInputElement | null>;
  }) => (
  <Input
    className={cn("rounded-s-none rounded-e-md", className)}
    size={size}
    {...props}
    ref={ref}
  />
);

InputComponent.displayName = "InputComponent";

export { PhoneInput };
