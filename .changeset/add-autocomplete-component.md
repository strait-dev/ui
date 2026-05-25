---
"@strait/ui": major
---

feat!: add Autocomplete component, remove Combobox

`Autocomplete` is a free-text input with a filtered suggestion list, built on
Base UI's `Autocomplete` primitive and restyled to Strait tokens. It ships with
`AutocompleteInput` (with `size` and inline `showTrigger` / `showClear`
buttons), `AutocompleteContent`, `AutocompleteList`, `AutocompleteItem`,
`AutocompleteGroup` / `AutocompleteGroupLabel`, `AutocompleteEmpty`,
`AutocompleteStatus`, and the remaining popup parts.

**Breaking:** the `Combobox` component (`@strait/ui/components/combobox`) is
removed. Use `Autocomplete` for suggestion inputs.
