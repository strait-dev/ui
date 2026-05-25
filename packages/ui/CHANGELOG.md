# @strait/ui

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
