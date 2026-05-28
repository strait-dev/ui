---
"@strait/ui": patch
---

feat!: align PhoneInput API with ReUI (`size` → `variant`)

`PhoneInput`'s height prop is renamed from `size` to `variant`
(`"sm" | "default" | "lg"`) to match the ReUI API, and now sizes the country
selector button alongside the input. A new `popupClassName` prop restyles the
country popover, and an `aria-invalid` field now tints the country button with
the destructive ring. **Breaking:** replace `size` with `variant`.
