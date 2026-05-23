"use client";

import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Loading03Icon,
  MultiplicationSignCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { cn } from "../../utils/index";

/**
 * App-level toast host that renders Sonner's built-in toasts, themed with the
 * design-system tokens.
 *
 * Render exactly one `<Toaster />` near the root of your layout. Toasts are
 * then triggered imperatively via the {@link toast} helper (or Sonner's own
 * `toast()` API) anywhere in the app without additional setup.
 *
 * @remarks
 * - **Theme sync** — `useTheme` from `next-themes` reads the active colour
 *   scheme and forwards it to Sonner so toasts match dark/light mode without
 *   manual configuration.
 * - **Custom icons** — each Sonner intent (`success`, `info`, `warning`,
 *   `error`, `loading`) is wired to the matching HugeIcons glyph so the icon
 *   language is consistent with the rest of the design system. The `loading`
 *   icon spins via `animate-spin`.
 * - **CSS variable bridge** — `--normal-bg`, `--normal-text`,
 *   `--normal-border`, and `--border-radius` are mapped to the local design
 *   tokens so Sonner's default toast adopts the popover surface and radius.
 * - All {@link ToasterProps} are forwarded, so you can still override
 *   `position`, `duration`, `richColors`, etc.
 *
 * @example
 * ```tsx
 * // In your root layout:
 * import { Toaster } from "@strait/ui/toast";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <Toaster position="bottom-right" />
 *       </body>
 *     </html>
 *   );
 * }
 *
 * // Then anywhere:
 * import { toast } from "@strait/ui/toast";
 * toast.success("Changes saved");
 * ```
 */
const Toaster = ({ className, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      className={cn("toaster group", className)}
      data-slot="toaster"
      icons={{
        success: (
          <HugeiconsIcon
            className="size-4"
            icon={CheckmarkCircle02Icon}
            strokeWidth={2}
          />
        ),
        info: (
          <HugeiconsIcon
            className="size-4"
            icon={InformationCircleIcon}
            strokeWidth={2}
          />
        ),
        warning: (
          <HugeiconsIcon
            className="size-4"
            icon={Alert02Icon}
            strokeWidth={2}
          />
        ),
        error: (
          <HugeiconsIcon
            className="size-4"
            icon={MultiplicationSignCircleIcon}
            strokeWidth={2}
          />
        ),
        loading: (
          <HugeiconsIcon
            className="size-4 animate-spin"
            icon={Loading03Icon}
            strokeWidth={2}
          />
        ),
      }}
      position="bottom-right"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      theme={theme as ToasterProps["theme"]}
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
