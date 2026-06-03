# @strait/ui

## 0.1.5

### Patch Changes

- [#14](https://github.com/strait-dev/ui/pull/14) [`440980c`](https://github.com/strait-dev/ui/commit/440980c30bf0c12a2b6a7e4e164d1e42f4308fde) Thanks [@leonardomso](https://github.com/leonardomso)! - fix: close accessibility gaps on icon-only controls and decorative icons
  - Mark purely decorative icons `aria-hidden` so screen readers don't double-announce state already conveyed by ARIA: Accordion trigger chevron/plus-minus, Banner status icon, Select scroll up/down arrows, Sidebar drag handle, and the Tag remove-button icon.
  - Give built-in icon-only controls an accessible name: Autocomplete clear (`Clear`) and trigger (`Show options`) buttons, and the InputWithInnerTags add-tag button (`Add tag`). All remain overridable via props.
  - InputWithLoader now sets `aria-busy` on the input while `loading`, so assistive tech is notified when the spinner swaps in.

- [#14](https://github.com/strait-dev/ui/pull/14) [`79856eb`](https://github.com/strait-dev/ui/commit/79856eb28f0adcf61f65ee6ee49a4fb29c8205ce) Thanks [@leonardomso](https://github.com/leonardomso)! - fix: use white text on the brand-solid button

  The brand-solid Button now renders white text on the `#FF4F00` brand fill instead of black, matching the intended brand look. `--brand-foreground` is now white by default (previously it auto-contrast-flipped to black on this light-ish orange).

  Note: white on `#FF4F00` is 3.16:1, below WCAG AA — this is a deliberate brand-identity decision, recorded as a documented exception in the a11y scan (`scripts/a11y-scan.mjs`) and in the `--brand-foreground` token comment. If you rebrand to a lighter colour that needs dark text, override `--brand-foreground`.

- [#14](https://github.com/strait-dev/ui/pull/14) [`5a3d34a`](https://github.com/strait-dev/ui/commit/5a3d34ae929f9e4119e01a31c8633eca37566ff0) Thanks [@leonardomso](https://github.com/leonardomso)! - fix: honor the compact size on MultipleSelector and align Menubar indicators
  - `MultipleSelector` with `size="sm"` now renders the documented compact control (`min-h-7`, matching Input's small height). Previously both size branches resolved to the same `min-h-8`, so `sm` had no effect.
  - Menubar checkbox/radio indicator slots drop a redundant explicit `size-4` on the wrapper span, matching the DropdownMenu/ContextMenu markup; icon sizing is unchanged (handled by the item-level rule).

- [#14](https://github.com/strait-dev/ui/pull/14) [`0c3bf4d`](https://github.com/strait-dev/ui/commit/0c3bf4dafdf25de98c8cde8c933ff3b1aed13412) Thanks [@leonardomso](https://github.com/leonardomso)! - fix: restore dark-mode legibility for overlays, tinted alerts/banners, and card-checkbox elevation
  - Modal backdrops (Dialog, AlertDialog, Drawer, Sheet) now use the semantic `bg-overlay` token instead of `bg-black/10`, which resolved to fully transparent and left no scrim. The overlay now dims correctly (0.1 light, 0.4 dark).
  - Alert and Banner intent tints (info/success/warning/destructive) add a `dark:` bump so the soft `/5` fill remains visible against the dark surface.
  - CardCheckbox drops its black drop shadow in dark mode (`dark:shadow-none`) where it was invisible and added nothing; the border carries the structure.

- [#14](https://github.com/strait-dev/ui/pull/14) [`daedb0e`](https://github.com/strait-dev/ui/commit/daedb0e67a4bc46b610f641d30df3a4eb00a3226) Thanks [@leonardomso](https://github.com/leonardomso)! - fix: bring all solid intent variants to WCAG AA

  Solid intent fills (Button/Badge/Toggle) now clear AA contrast with their text in both themes:
  - `--success` (light) deepened `0.58 → 0.535` so white solid text reaches 4.64:1 (was 3.85).
  - `--destructive-foreground` and `--info-foreground` (dark) switched to dark ink, matching the existing dark success/warning treatment, so the vivid dark-mode fills pass with dark text (6.5:1 / 5.1:1) — the soft/outline tints keep their vibrancy.

  Soft, outline, and accent treatments are unchanged. The only sub-AA solid that remains is the brand-solid button (white on `#FF4F00`), which is the deliberate, documented brand exception.

## 0.1.4

### Patch Changes

- [#11](https://github.com/strait-dev/ui/pull/11) [`24672df`](https://github.com/strait-dev/ui/commit/24672dfaad3c883dff99cb722f0dbec16aa9195d) Thanks [@leonardomso](https://github.com/leonardomso)! - feat!: normalize boolean prop names (unprefixed + positive polarity)

  Public boolean props are renamed to drop `is*`/`has*` prefixes and to use
  positive `show*` polarity instead of `hide*`, completing the API-consistency
  audit and satisfying contract §12. This is a **breaking change** for the
  affected components.

  Renames:
  - `isRequired` → `required` (DatePicker)
  - `isLoading` → `loading` (DataGrid, SelectWithSearch)
  - `isActive` → `active` (NavigationRail, Pagination, Sidebar menu buttons)
  - `isDragging` → `dragging` (FileUpload dropzone)
  - `hasMore` → `moreAvailable`, `isFetchingMore` → `fetchingMore` (DataGrid)
  - `isFetchingNextPage` → `fetchingNextPage` (SelectWithSearch)
  - `hasSubMenu` → `subMenu` (Sidebar)
  - render-callback args: `isChecked` → `checked` (CheckboxTree `renderNode`),
    `isSelected` → `selected` (SelectWithSearch `renderOption`)

  Inverted `hide*` → `show*` (default flips to `true`; behavior preserved):
  - Chart: `hideGridLines`/`hideXAxis`/`hideYAxis`/`hideLabel`/`hideIndicator`/
    `hideIcon` → `showGridLines`/`showXAxis`/`showYAxis`/`showLabel`/
    `showIndicator`/`showIcon`
  - Multiselect: `hideClearAllButton` → `showClearAllButton`,
    `hidePlaceholderWhenSelected` → `showPlaceholderWhenSelected`
  - Sidebar: `hideOnCollapse` → `showOnCollapse`

  Migration: rename the prop at call sites. For the inverted `hide*` → `show*`
  props, omit the prop to keep the previous default, or pass `show…={false}` to
  reproduce the old hidden state.

- [#11](https://github.com/strait-dev/ui/pull/11) [`24672df`](https://github.com/strait-dev/ui/commit/24672dfaad3c883dff99cb722f0dbec16aa9195d) Thanks [@leonardomso](https://github.com/leonardomso)! - fix: resolve design-system consistency issues across components

  Audit-driven consistency pass:
  - **Focus rings** now follow the contract everywhere — `resizable`, `tree`,
    `input-with-inner-tags`, and the date-range pickers had divergent
    `ring-1`/`ring-2`/`ring-offset` focus treatments; all normalized to the
    standard `ring-3` ring. The convention linter was broadened to catch these.
  - **Warning intent** opacity on `Button` now matches the other intents (it had
    heavier soft/outline/focus tints).
  - **Form-control heights**: `Select`/`NativeSelect` `lg` size is `h-9` (was
    `h-10`); `Multiselect` default min-height is `h-8` (was `h-10`) — all aligned
    to the form-control baseline.
  - **Radius**: floating surfaces that were still `rounded-md` (`preview-card`,
    range-calendar-with-presets, the date-range-picker popovers, the sidebar
    flyout, `input-with-inline-button`) now use the unified `rounded-lg`.
  - **Typography**: near-12px arbitrary font sizes in `Button`/`Toggle`/`Tooltip`/
    `Calendar` map to the `text-xs` scale step.
  - Smaller fixes: `Badge` outline `dark:bg-input/30` (was `/32`), `Multiselect`
    dropdown gains the standard surface ring, `Banner` title weight and `Popover`
    title size align with sibling components.

- [#11](https://github.com/strait-dev/ui/pull/11) [`24672df`](https://github.com/strait-dev/ui/commit/24672dfaad3c883dff99cb722f0dbec16aa9195d) Thanks [@leonardomso](https://github.com/leonardomso)! - feat!: rename Timeline `intent` to `variant` (and line-style `variant` to `line`)

  Completes the `intent` → `variant` convergence (Timeline was the last straggler).
  Timeline already had a `variant` prop for the connector line style, so that axis
  is renamed to `line` to free `variant` for the semantic colour axis:
  - `intent` → `variant` (`primary | success | info | warning | destructive`);
    the `TimelineIntent` type is now `TimelineVariant`, and the `data-intent`
    attribute is now `data-variant`.
  - the former line-style `variant` (`solid | dotted`) → `line`; `data-variant`
    for the line style is now `data-line`.

  Migration: `<Timeline intent="success" variant="dotted">` →
  `<Timeline variant="success" line="dotted">`.

- [#11](https://github.com/strait-dev/ui/pull/11) [`24672df`](https://github.com/strait-dev/ui/commit/24672dfaad3c883dff99cb722f0dbec16aa9195d) Thanks [@leonardomso](https://github.com/leonardomso)! - feat: unify component corner radius to a single `rounded-lg` outer box

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

## 0.1.3

### Patch Changes

- [#9](https://github.com/strait-dev/ui/pull/9) [`cec71b3`](https://github.com/strait-dev/ui/commit/cec71b32348b9bbab5880eb1ff1dd8fa4971769f) Thanks [@leonardomso](https://github.com/leonardomso)! - feat: derive the brand palette from a single `--brand` token

  Rebranding now takes one line — set `--brand` to any colour (hex, `rgb()`, or
  `oklch()`) and the rest follows. `--brand-foreground` contrast-flips to
  near-black/white by lightness, the new `--brand-accent` keeps soft and outline
  brand buttons AA-legible in light and dark, and `--chart-1`,
  `--sidebar-active-rail`, and the active-row tint now track `--brand`
  automatically instead of duplicating its literal.

  Docs updated to match: the Theming guide and Colors story document the
  single-token rebrand, and the generated `llms.txt` / `llms-full.txt` artifacts
  now carry a Theming section so LLM consumers can discover it.

- [#9](https://github.com/strait-dev/ui/pull/9) [`f63f5df`](https://github.com/strait-dev/ui/commit/f63f5df3ca7ed55a7fae0d5a74bc2f86e85f3005) Thanks [@leonardomso](https://github.com/leonardomso)! - feat!: rename the semantic colour axis from `intent` to `variant`

  **BREAKING CHANGE** (shipped in the `0.1.3` patch by maintainer decision): even
  though the version bump is a patch, this renames public props. Update call sites
  when upgrading — see the migration notes below.

  The colour axis is now consistently named `variant` across the library, matching
  Button, Badge, Alert, and the rest. Six components had used `intent` (or, for
  Avatar, a misnamed presence axis); they have been migrated:
  - **Checkbox**, **Progress**, **Slider** — `intent` → `variant`.
  - **Avatar** (`AvatarBadge`) — `intent` → `status` (its `online | busy | away |
offline` values are presence state, not a colour intent).
  - **Empty** (`EmptyMedia`) — the former `variant` (`default | icon`) is now
    `media`; the colour axis is now `variant`.
  - **Toggle** / **ToggleGroup** — the former `variant` (`default | outline`) is
    now `emphasis`; the colour axis is now `variant`.

  Migration: rename the prop at call sites accordingly, e.g.
  `<Checkbox intent="destructive">` → `<Checkbox variant="destructive">`,
  `<AvatarBadge intent="online">` → `<AvatarBadge status="online">`,
  `<EmptyMedia variant="icon">` → `<EmptyMedia media="icon">`,
  `<Toggle variant="outline" intent="success">` →
  `<Toggle emphasis="outline" variant="success">`.

## 0.1.2

### Patch Changes

- [#7](https://github.com/strait-dev/ui/pull/7) [`26e0e7f`](https://github.com/strait-dev/ui/commit/26e0e7fdda0ad86f8e3823d5e221152f0aeb70ff) Thanks [@leonardomso](https://github.com/leonardomso)! - feat: add accordion variants and alert invert variant

  `Accordion` gains a `variant` prop (`default` | `outline` | `solid`) that flows
  to each item through context and can be overridden per `AccordionItem`; the
  `accordionItemVariants` recipe is exported. `Alert` gains an `invert` variant for
  a high-contrast solid surface. Both additions are backward compatible.

- [#7](https://github.com/strait-dev/ui/pull/7) [`89998da`](https://github.com/strait-dev/ui/commit/89998dafab4fb6027ae9ed384bd9265e688a17a0) Thanks [@leonardomso](https://github.com/leonardomso)! - feat(ui): add `indicator` prop on `AccordionTrigger` and broaden showcase stories

  `AccordionTrigger` now accepts `indicator: "chevron" | "plus-minus" | "none"`
  (default `"chevron"`) to switch between the built-in chevron, a plus/minus
  glyph that flips on expand, or no built-in icon at all (BYO via
  `data-slot="accordion-trigger-icon"`).

  Storybook gains seven new examples covering the new prop and richer
  composition patterns: `PlusMinusIndicator`, `CustomIndicator`, `InCard`,
  `InFrame`, `NestedAccordion`, `UserList` (with avatars), `OnboardingSteps`
  (with badges), and `SettingsSections` (with icons).

- [#7](https://github.com/strait-dev/ui/pull/7) [`9167bd4`](https://github.com/strait-dev/ui/commit/9167bd48d10d6ae856bbbddb12ed5a0f587f716e) Thanks [@leonardomso](https://github.com/leonardomso)! - feat!: add Autocomplete component, remove Combobox

  `Autocomplete` is a free-text input with a filtered suggestion list, built on
  Base UI's `Autocomplete` primitive and restyled to Strait tokens. It ships with
  `AutocompleteInput` (with `size` and inline `showTrigger` / `showClear`
  buttons), `AutocompleteContent`, `AutocompleteList`, `AutocompleteItem`,
  `AutocompleteGroup` / `AutocompleteGroupLabel`, `AutocompleteEmpty`,
  `AutocompleteStatus`, and the remaining popup parts.

  **Breaking:** the `Combobox` component (`@strait/ui/components/combobox`) is
  removed. Use `Autocomplete` for suggestion inputs.

- [#7](https://github.com/strait-dev/ui/pull/7) [`3e127af`](https://github.com/strait-dev/ui/commit/3e127af43ebb2327d7330440166cef93a8103225) Thanks [@leonardomso](https://github.com/leonardomso)! - feat: add DateSelector date-filter component

  A compact date filter that selects by day, month, quarter, half-year, or
  year, with `is` / `before` / `after` / `between` operators. The day view reuses
  `Calendar`; coarser periods render their own grids. Locks the operator with
  `presetMode`, restricts granularities with `periodTypes`, and localises every
  label through a partial `i18n` override.

- [#7](https://github.com/strait-dev/ui/pull/7) [`48eabcb`](https://github.com/strait-dev/ui/commit/48eabcb2b02e201d203045b1d4a7d2af03ea5e39) Thanks [@leonardomso](https://github.com/leonardomso)! - feat: add Scrollspy section-tracking component

  Adds `Scrollspy`, which highlights the navigation anchor for the section
  currently in view and smooth-scrolls to a section when its anchor is clicked.
  Anchors opt in with `data-scrollspy-anchor`, the active link receives
  `data-active="true"`, and an optional `targetRef` spies inside a scroll
  container (or a `data-slot="scroll-area-viewport"` it wraps).

- [#7](https://github.com/strait-dev/ui/pull/7) [`d305dad`](https://github.com/strait-dev/ui/commit/d305dad1fe147111546a4c904852de5ff7e2ddef) Thanks [@leonardomso](https://github.com/leonardomso)! - feat: add Sortable drag-to-reorder component

  Adds `Sortable`, `SortableItem`, and `SortableItemHandle`, built on dnd-kit, for
  reorderable vertical lists, horizontal rows, and grids. The list is controlled
  via `value` / `getItemValue` / `onValueChange`, drags start from a handle, and a
  floating overlay mirrors the active item. Restyled to Strait design tokens.

- [#7](https://github.com/strait-dev/ui/pull/7) [`93818f1`](https://github.com/strait-dev/ui/commit/93818f1c4ac366eb883f8b079e31c513a7513afa) Thanks [@leonardomso](https://github.com/leonardomso)! - docs(ui): expand Alert showcase stories with real-world patterns

  Add nine new Storybook stories that demonstrate compound `Alert` usage:
  `WithCloseButton`, `WithMultipleActions`, `UrgentBilling`, `ServiceStatus`
  (neutral surface with a live status badge), `FeatureDiscovery` (invert
  surface), `OnboardingNudge`, `ExtendedMessage` (multi-paragraph), `UserMessage`
  (avatar in the icon slot), and `AccountVerified`. No API changes.

- [#7](https://github.com/strait-dev/ui/pull/7) [`f7ab1df`](https://github.com/strait-dev/ui/commit/f7ab1df8ebd332a4519a7a0ca1ce20bf65ed2903) Thanks [@leonardomso](https://github.com/leonardomso)! - feat(ui): add `radius` axis on Badge and showcase stories

  `Badge` now accepts `radius: "pill" | "md" | "sm"` (default `"pill"`).
  Use `"md"` for tag-style chips inside data tables, where the full-pill
  shape feels out of place against squared cells.

  Storybook gains seven new stories: `Radius` (the new axis), `AvatarChip`,
  `WithFlag`, `AsLink` (badge as `<a>` via `render`), `NotificationOverlay`
  (absolute-positioned count over an icon button), `RatingChip`, and
  `PlanTier`.

- [#7](https://github.com/strait-dev/ui/pull/7) [`a310bca`](https://github.com/strait-dev/ui/commit/a310bca41268d0f3bb5c11425f700437e8633c08) Thanks [@leonardomso](https://github.com/leonardomso)! - docs(ui): expand Breadcrumb showcase stories with composition patterns

  Nine new Storybook stories demonstrate how to compose `Breadcrumb` with
  other parts of the system: `WithDropdown` (sibling page menu),
  `EllipsisDropdown` (collapsed-trail reveal), `IconsPerItem`,
  `DoubleChevronSeparator`, `PillStyle` (muted top-bar shell), `WithAvatar`
  (workspace ownership), `WithBadge` (counts and environment tags),
  `HomeIcon` (dedicated root link), and `DocumentContext` (folder → file). No
  API change.

- [#7](https://github.com/strait-dev/ui/pull/7) [`bd7d269`](https://github.com/strait-dev/ui/commit/bd7d2696f95221b1da1348cf7f6ac564e2aa70a2) Thanks [@leonardomso](https://github.com/leonardomso)! - docs(ui): expand Button showcase stories with interaction patterns

  Twelve new Storybook stories demonstrate compound `Button` usage:
  `CopyWithFeedback`, `AsyncAction`, `LikeWithCount`, `StarWithCount`,
  `WithNotificationBadge`, `WithStatusDot`, `GoBackLink`, `SlidingIconHover`,
  `ThemeToggle`, `SocialLogin`, `SocialIconOnly`, and `ConfirmFeedback`. No
  API change.

- [#7](https://github.com/strait-dev/ui/pull/7) [`9d25bc6`](https://github.com/strait-dev/ui/commit/9d25bc61b1ff44c352d7affa584f65a75fb571af) Thanks [@leonardomso](https://github.com/leonardomso)! - feat(ui): add DataGridTableRowActions and DataGridSelectionBar

  Two additive helpers for `DataGrid`:
  - `DataGridTableRowActions<TData>` — drop-in cell helper that renders an
    ellipsis trigger and a `DropdownMenu` shell; consumers supply
    `DropdownMenuItem` children (Edit / Delete / …) for per-row commands.
  - `DataGridSelectionBar` — selection-aware floating toolbar that reads the
    selected row count from `DataGrid` context and renders a fixed-position
    `BulkActionBar` whenever one or more rows are selected. The clear (×)
    button calls `table.resetRowSelection()` automatically.

  Both compose cleanly with the existing parts and require no new runtime
  dependencies.

- [#7](https://github.com/strait-dev/ui/pull/7) [`d71bfda`](https://github.com/strait-dev/ui/commit/d71bfda41d4337acdaf6c25bd917624f5d9618a2) Thanks [@leonardomso](https://github.com/leonardomso)! - feat(ui): add Frame component for grouping stacked or separated panels

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

- [#7](https://github.com/strait-dev/ui/pull/7) [`a02aa0d`](https://github.com/strait-dev/ui/commit/a02aa0d538ca6e04959dcaa606dbb7f4ae9d97a8) Thanks [@leonardomso](https://github.com/leonardomso)! - feat!: align PhoneInput API with ReUI (`size` → `variant`)

  `PhoneInput`'s height prop is renamed from `size` to `variant`
  (`"sm" | "default" | "lg"`) to match the ReUI API, and now sizes the country
  selector button alongside the input. A new `popupClassName` prop restyles the
  country popover, and an `aria-invalid` field now tints the country button with
  the destructive ring. **Breaking:** replace `size` with `variant`.

- [#7](https://github.com/strait-dev/ui/pull/7) [`729c38f`](https://github.com/strait-dev/ui/commit/729c38f2136424729d77cf28ffbb1600a6266a00) Thanks [@leonardomso](https://github.com/leonardomso)! - feat!: rename Filter to Filters, align with ReUI

  The `Filter` component is renamed to `Filters` and moves from
  `@strait/ui/components/filter` to `@strait/ui/components/filters`. The public
  API is aligned with ReUI: `Filters` now accepts `showSearchInput` (default
  `true`) to toggle the search box at the top of the field picker.

  **Breaking:** update imports from `@strait/ui/components/filter` to
  `@strait/ui/components/filters`.

- [#7](https://github.com/strait-dev/ui/pull/7) [`af21279`](https://github.com/strait-dev/ui/commit/af212798e993b10577ff1c3dfa95733b379ddacb) Thanks [@leonardomso](https://github.com/leonardomso)! - feat!: replace DataTable with DataGrid (TanStack + virtual + DnD)

  `DataTable` is removed and replaced by `DataGrid`, a richer ReUI-aligned API
  built on TanStack Table v8, `@tanstack/react-virtual`, and `@dnd-kit/*`. The
  new component exposes a context root (`DataGrid`), composable parts
  (`DataGridContainer`, `DataGridTable`, `DataGridPagination`,
  `DataGridColumnHeader`, `DataGridColumnFilter`, `DataGridColumnVisibility`,
  `DataGridScrollArea`), virtualised + infinite-scroll variants
  (`DataGridTableVirtual`), and drag-and-drop variants for columns
  (`DataGridTableDnd`) and rows (`DataGridTableDndRows`,
  `DataGridTableDndRowHandle`), plus row selection, row pinning, column
  pinning/resizing, footer aggregates, and skeleton/spinner loading states.

  **Breaking:** the `./components/data-table` subpath export is removed in
  favour of `./components/data-grid`. Consumers must migrate to the new API
  (see Storybook for a per-variant reference).

- [#7](https://github.com/strait-dev/ui/pull/7) [`01d943f`](https://github.com/strait-dev/ui/commit/01d943f118b4fa1f7ea447607af754b9b81f1b8e) Thanks [@leonardomso](https://github.com/leonardomso)! - feat!: rework FileUpload on a headless useFileUpload hook

  `FileUpload` is re-implemented on top of a new headless `useFileUpload` hook
  (native File / drag-and-drop APIs) instead of React Aria's `DropZone`. The hook
  is exported for building bespoke layouts, alongside new presentational parts
  (`FileUploadDropzone`, `FileUploadList`, `FileUploadItem`) and the `formatBytes`
  helper.

  **Breaking:** `FileUpload` is now uncontrolled — the `value` prop is removed in
  favour of `defaultFiles` + `onValueChange` (now called with `FileWithPreview[]`).
  `accept` is now a comma-separated string (e.g. `"image/*,.pdf"`) rather than a
  string array, matching the underlying input.

- [#7](https://github.com/strait-dev/ui/pull/7) [`616277c`](https://github.com/strait-dev/ui/commit/616277c5ad7ba40eb044fa66c90f99e60c4119a1) Thanks [@leonardomso](https://github.com/leonardomso)! - feat(ui)!: rework Sidebar into a full app-shell primitive

  `Sidebar` is reshaped to power any modern app shell. The active row now
  owns its own visual (2 px left accent rail + soft `--sidebar-active*`
  fill + `aria-current="page"`), sub-menus animate open and closed via
  Base UI `Collapsible`, hover-popovers (Base UI `Menu`) mirror the
  sub-menu when the sidebar is collapsed to icon width, and polished
  compound parts ship for the most common app-shell needs:
  `SidebarUserButton`, `SidebarSwitcher` / `SidebarSwitcherItem`,
  `SidebarCard` (+ `Header` / `Title` / `Description` / `Content` /
  `Footer`), and `SidebarSearchButton` with a built-in ⌘K shortcut.

  A new `collapsible="rail"` mode renders a narrow icon column
  (`SidebarRail` + `SidebarRailButton`) alongside a wider secondary
  `SidebarPanel`, animated by `activeRailItem` on the provider. Menus
  opt into drag-to-reorder by passing `reorderable` + `items` +
  `onReorder`; pair each item with `SidebarMenuDragHandle`.

  The collapse animation moves from `ease-linear` to `ease-out` (with
  `motion-reduce:transition-none`), `SidebarInput` becomes transparent
  so it sits cleanly on the sidebar surface, and truncated labels now
  surface their full text via the existing tooltip path. The provider
  context gains `openSubmenus` / `toggleSubmenu` / `setSubmenuOpen` /
  `isSubmenuOpen` plus `activeRailItem` / `setActiveRailItem`.

  Storybook ships 22 showcase stories, including `Collapse_Rail`,
  `DisclosureSubMenu`, `SubMenuFlyout`, `Reorderable`, `WithSwitcher`,
  `WithUserButton`, `WithCard`, the flagship `RealWorldDashboard` (now
  wired to a real `CommandMenu` via the search button), and a sibling
  `RealWorldWithSupport` mirroring shadcn's `sidebar-08` support + feedback
  footer pattern.

  **Breaking changes**
  - `SidebarMenuSub` now requires a `value: string` prop; pair it with
    its parent `SidebarMenuItem`'s `value`.
  - The old `SidebarRail` (drag handle) has been renamed
    `SidebarToggleRail`. `SidebarRail` now refers to the always-visible
    icon column used by `collapsible="rail"`.
  - `Sidebar.collapsible` gains a new value: `"rail"`.

  **Migration**

  ```diff
  - <SidebarMenuItem>
  + <SidebarMenuItem value="settings">
      <SidebarMenuButton>Settings</SidebarMenuButton>
  -   <SidebarMenuSub>…</SidebarMenuSub>
  +   <SidebarMenuSub value="settings">…</SidebarMenuSub>
    </SidebarMenuItem>

  - <SidebarRail />
  + <SidebarToggleRail />
  ```

## 0.1.1

### Patch Changes

- [#2](https://github.com/strait-dev/ui/pull/2) [`005b468`](https://github.com/strait-dev/ui/commit/005b46853aec06103d8ce3c47a8d37af5cb1bf6a) Thanks [@leonardomso](https://github.com/leonardomso)! - fix: render DropdownMenu and ContextMenu labels outside a group without crashing

  Base UI's `MenuGroupLabel` throws when it is not wrapped in a `Menu.Group`.
  `DropdownMenuLabel` and `ContextMenuLabel` now detect whether they are inside
  a group and self-wrap in one when used standalone.

- [#2](https://github.com/strait-dev/ui/pull/2) [`005b468`](https://github.com/strait-dev/ui/commit/005b46853aec06103d8ce3c47a8d37af5cb1bf6a) Thanks [@leonardomso](https://github.com/leonardomso)! - fix: give the QRCode SVG an accessible name

  `QRCode` rendered an `<svg role="img">` with no accessible name, so screen
  readers announced nothing. It now forwards a `title` prop (defaulting to
  `QR code for <value>`) to the underlying SVG.
