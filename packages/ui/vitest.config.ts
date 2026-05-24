import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Unit tests run in jsdom with Testing Library. Stories and the compiled build
// are out of scope here: interaction tests live in apps/storybook (Vitest addon)
// and bunchee owns the dist build.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
  },
});
