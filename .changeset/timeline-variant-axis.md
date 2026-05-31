---
"@strait/ui": minor
---

feat!: rename Timeline `intent` to `variant` (and line-style `variant` to `line`)

Completes the `intent` → `variant` convergence (Timeline was the last straggler).
Timeline already had a `variant` prop for the connector line style, so that axis
is renamed to `line` to free `variant` for the semantic colour axis:

- `intent` → `variant` (`primary | success | info | warning | destructive`);
  the `TimelineIntent` type is now `TimelineVariant`, and the `data-intent`
  attribute is now `data-variant`.
- the former line-style `variant` (`solid | dotted`) → `line`; `data-variant`
  for the line style is now `data-line`.

Migration: `<Timeline intent="success" variant="dotted">` →
`<Timeline variant="success" line="dotted">`.
