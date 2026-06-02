---
"@strait/ui": patch
---

fix: close accessibility gaps on icon-only controls and decorative icons

- Mark purely decorative icons `aria-hidden` so screen readers don't double-announce state already conveyed by ARIA: Accordion trigger chevron/plus-minus, Banner status icon, Select scroll up/down arrows, Sidebar drag handle, and the Tag remove-button icon.
- Give built-in icon-only controls an accessible name: Autocomplete clear (`Clear`) and trigger (`Show options`) buttons, and the InputWithInnerTags add-tag button (`Add tag`). All remain overridable via props.
- InputWithLoader now sets `aria-busy` on the input while `loading`, so assistive tech is notified when the spinner swaps in.
