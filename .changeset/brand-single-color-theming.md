---
"@strait/ui": patch
---

feat: derive the brand palette from a single `--brand` token

Rebranding now takes one line — set `--brand` to any colour (hex, `rgb()`, or
`oklch()`) and the rest follows. `--brand-foreground` contrast-flips to
near-black/white by lightness, the new `--brand-accent` keeps soft and outline
brand buttons AA-legible in light and dark, and `--chart-1`,
`--sidebar-active-rail`, and the active-row tint now track `--brand`
automatically instead of duplicating its literal.

Docs updated to match: the Theming guide and Colors story document the
single-token rebrand, and the generated `llms.txt` / `llms-full.txt` artifacts
now carry a Theming section so LLM consumers can discover it.
