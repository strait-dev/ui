import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

/**
 * Shared options for Fumadocs layouts (home + docs). Keeps the nav title and
 * links defined in one place.
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Strait UI",
    },
    links: [
      {
        text: "Components",
        url: "/docs/components",
        active: "nested-url",
      },
      {
        text: "Theming",
        url: "/docs/theming",
      },
    ],
  };
}
