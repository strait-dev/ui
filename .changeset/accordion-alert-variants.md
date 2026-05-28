---
"@strait/ui": minor
---

feat: add accordion variants and alert invert variant

`Accordion` gains a `variant` prop (`default` | `outline` | `solid`) that flows
to each item through context and can be overridden per `AccordionItem`; the
`accordionItemVariants` recipe is exported. `Alert` gains an `invert` variant for
a high-contrast solid surface. Both additions are backward compatible.
