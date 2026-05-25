---
"@strait/ui": patch
---

fix: give the QRCode SVG an accessible name

`QRCode` rendered an `<svg role="img">` with no accessible name, so screen
readers announced nothing. It now forwards a `title` prop (defaulting to
`QR code for <value>`) to the underlying SVG.
