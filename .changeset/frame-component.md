---
"@strait/ui": minor
---

feat(ui): add Frame component for grouping stacked or separated panels

`Frame` is a bordered surface that hosts one or more `FramePanel` children,
useful for settings groups, summary blocks, or any layout where related
panels share a common outer container.

Parts: `Frame`, `FramePanel`, `FrameHeader`, `FrameTitle`,
`FrameDescription`, `FrameFooter`.

Props on `Frame`:

- `variant: "default" | "ghost"` — outer border vs. transparent shell.
- `spacing: "sm" | "default" | "lg"` — gap between non-stacked panels.
- `stacked` — join panels edge-to-edge with shared borders.
- `dense` — drop inner panel padding (delegate it to the child).

Retheme corners by overriding `--frame-radius` on the root.
