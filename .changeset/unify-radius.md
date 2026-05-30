---
"@strait/ui": minor
---

feat: unify component corner radius to a single `rounded-lg` outer box

Non-circular components now share one outer-box radius (`rounded-lg`, the
existing `--radius` token) so buttons, inputs, and containers read as the same
shape. Notable visual changes:

- **Button** is no longer a full pill — it now uses `rounded-lg` to match inputs.
- **Badge** defaults to `rounded-lg` (the `radius="pill"` option is still
  available for the old pill look).
- **Containers** (Card, Dialog, Command, Empty, Sidebar sheet, native select)
  drop `rounded-xl` to `rounded-lg`.
- Small-size form controls (Select, Toggle, ToggleGroup) no longer use a tighter
  per-size radius cap.

Genuinely circular controls (Switch, Radio, Slider, Progress, status/avatar
dots, etc.) keep `rounded-full`, and inner/nested elements keep their smaller
`rounded-md`/`rounded-sm`. The single `--radius` token still lets you re-theme
the radius globally. The component contract now documents and the convention
linter enforces this radius system.
