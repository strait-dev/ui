import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library does not auto-unmount between tests in Vitest; clean up the
// DOM after each test so assertions never bleed across cases.
afterEach(() => {
  cleanup();
});
