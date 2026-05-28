---
"@strait/ui": patch
---

feat(ui): add `radius` axis on Badge and showcase stories

`Badge` now accepts `radius: "pill" | "md" | "sm"` (default `"pill"`).
Use `"md"` for tag-style chips inside data tables, where the full-pill
shape feels out of place against squared cells.

Storybook gains seven new stories: `Radius` (the new axis), `AvatarChip`,
`WithFlag`, `AsLink` (badge as `<a>` via `render`), `NotificationOverlay`
(absolute-positioned count over an icon button), `RatingChip`, and
`PlanTier`.
