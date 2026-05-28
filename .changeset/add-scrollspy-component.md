---
"@strait/ui": patch
---

feat: add Scrollspy section-tracking component

Adds `Scrollspy`, which highlights the navigation anchor for the section
currently in view and smooth-scrolls to a section when its anchor is clicked.
Anchors opt in with `data-scrollspy-anchor`, the active link receives
`data-active="true"`, and an optional `targetRef` spies inside a scroll
container (or a `data-slot="scroll-area-viewport"` it wraps).
