---
"@strait/ui": patch
---

feat!: rework FileUpload on a headless useFileUpload hook

`FileUpload` is re-implemented on top of a new headless `useFileUpload` hook
(native File / drag-and-drop APIs) instead of React Aria's `DropZone`. The hook
is exported for building bespoke layouts, alongside new presentational parts
(`FileUploadDropzone`, `FileUploadList`, `FileUploadItem`) and the `formatBytes`
helper.

**Breaking:** `FileUpload` is now uncontrolled — the `value` prop is removed in
favour of `defaultFiles` + `onValueChange` (now called with `FileWithPreview[]`).
`accept` is now a comma-separated string (e.g. `"image/*,.pdf"`) rather than a
string array, matching the underlying input.
