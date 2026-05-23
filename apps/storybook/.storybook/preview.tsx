import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";

// Fonts referenced by the Tailwind theme (GitBook-inspired: Inter + JetBrains Mono).
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
// The library's global stylesheet (Tailwind v4 + design tokens + keyframes).
import "@strait/ui/css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
  },
  decorators: [
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
    (Story) => (
      <div
        style={{
          minHeight: "100vh",
          padding: "2rem",
          background: "var(--background)",
          color: "var(--foreground)",
          fontFamily: "'Inter Variable', system-ui, sans-serif",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
