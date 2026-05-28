---
"@strait/ui": minor
---

feat(ui): add `indicator` prop on `AccordionTrigger` and broaden showcase stories

`AccordionTrigger` now accepts `indicator: "chevron" | "plus-minus" | "none"`
(default `"chevron"`) to switch between the built-in chevron, a plus/minus
glyph that flips on expand, or no built-in icon at all (BYO via
`data-slot="accordion-trigger-icon"`).

Storybook gains seven new examples covering the new prop and richer
composition patterns: `PlusMinusIndicator`, `CustomIndicator`, `InCard`,
`InFrame`, `NestedAccordion`, `UserList` (with avatars), `OnboardingSteps`
(with badges), and `SettingsSections` (with icons).
