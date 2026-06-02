---
"@strait/ui": patch
---

fix: restore dark-mode legibility for overlays, tinted alerts/banners, and card-checkbox elevation

- Modal backdrops (Dialog, AlertDialog, Drawer, Sheet) now use the semantic `bg-overlay` token instead of `bg-black/10`, which resolved to fully transparent and left no scrim. The overlay now dims correctly (0.1 light, 0.4 dark).
- Alert and Banner intent tints (info/success/warning/destructive) add a `dark:` bump so the soft `/5` fill remains visible against the dark surface.
- CardCheckbox drops its black drop shadow in dark mode (`dark:shadow-none`) where it was invisible and added nothing; the border carries the structure.
