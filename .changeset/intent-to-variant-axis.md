---
"@strait/ui": patch
---

feat!: rename the semantic colour axis from `intent` to `variant`

**BREAKING CHANGE** (shipped in the `0.1.3` patch by maintainer decision): even
though the version bump is a patch, this renames public props. Update call sites
when upgrading — see the migration notes below.

The colour axis is now consistently named `variant` across the library, matching
Button, Badge, Alert, and the rest. Six components had used `intent` (or, for
Avatar, a misnamed presence axis); they have been migrated:

- **Checkbox**, **Progress**, **Slider** — `intent` → `variant`.
- **Avatar** (`AvatarBadge`) — `intent` → `status` (its `online | busy | away |
  offline` values are presence state, not a colour intent).
- **Empty** (`EmptyMedia`) — the former `variant` (`default | icon`) is now
  `media`; the colour axis is now `variant`.
- **Toggle** / **ToggleGroup** — the former `variant` (`default | outline`) is
  now `emphasis`; the colour axis is now `variant`.

Migration: rename the prop at call sites accordingly, e.g.
`<Checkbox intent="destructive">` → `<Checkbox variant="destructive">`,
`<AvatarBadge intent="online">` → `<AvatarBadge status="online">`,
`<EmptyMedia variant="icon">` → `<EmptyMedia media="icon">`,
`<Toggle variant="outline" intent="success">` →
`<Toggle emphasis="outline" variant="success">`.
