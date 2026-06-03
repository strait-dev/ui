---
"@strait/ui": patch
---

fix: bring all solid intent variants to WCAG AA

Solid intent fills (Button/Badge/Toggle) now clear AA contrast with their text in both themes:

- `--success` (light) deepened `0.58 → 0.535` so white solid text reaches 4.64:1 (was 3.85).
- `--destructive-foreground` and `--info-foreground` (dark) switched to dark ink, matching the existing dark success/warning treatment, so the vivid dark-mode fills pass with dark text (6.5:1 / 5.1:1) — the soft/outline tints keep their vibrancy.

Soft, outline, and accent treatments are unchanged. The only sub-AA solid that remains is the brand-solid button (white on `#FF4F00`), which is the deliberate, documented brand exception.
