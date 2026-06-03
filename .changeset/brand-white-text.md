---
"@strait/ui": patch
---

fix: use white text on the brand-solid button

The brand-solid Button now renders white text on the `#FF4F00` brand fill instead of black, matching the intended brand look. `--brand-foreground` is now white by default (previously it auto-contrast-flipped to black on this light-ish orange).

Note: white on `#FF4F00` is 3.16:1, below WCAG AA — this is a deliberate brand-identity decision, recorded as a documented exception in the a11y scan (`scripts/a11y-scan.mjs`) and in the `--brand-foreground` token comment. If you rebrand to a lighter colour that needs dark text, override `--brand-foreground`.
