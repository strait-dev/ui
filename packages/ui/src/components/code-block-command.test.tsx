import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CodeBlockCommand, convertNpmCommand } from "./code-block-command";

// ---------------------------------------------------------------------------
// localStorage mock
//
// jsdom may not expose window.localStorage when running without a real URL
// origin. We install a minimal in-memory mock so all localStorage-dependent
// paths in the component and tests work reliably.
// ---------------------------------------------------------------------------

class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return Object.hasOwn(this.store, key) ? (this.store[key] ?? null) : null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }
}

const localStorageMock = new LocalStorageMock();

// Install the mock before any test in this file runs.
vi.stubGlobal("localStorage", localStorageMock);

// ---------------------------------------------------------------------------
// convertNpmCommand — unit tests
// ---------------------------------------------------------------------------

describe("convertNpmCommand — npm install", () => {
  it("converts 'npm install <pkg>' to the correct equivalents", () => {
    const result = convertNpmCommand("npm install react");
    expect(result.npm).toBe("npm install react");
    expect(result.pnpm).toBe("pnpm add react");
    expect(result.yarn).toBe("yarn add react");
    expect(result.bun).toBe("bun add react");
  });

  it("converts the shorthand 'npm i <pkg>'", () => {
    const result = convertNpmCommand("npm i lodash");
    expect(result.npm).toBe("npm i lodash");
    expect(result.pnpm).toBe("pnpm add lodash");
    expect(result.yarn).toBe("yarn add lodash");
    expect(result.bun).toBe("bun add lodash");
  });

  it("preserves scoped package names", () => {
    const result = convertNpmCommand("npm install @stripe/stripe-js");
    expect(result.pnpm).toBe("pnpm add @stripe/stripe-js");
    expect(result.yarn).toBe("yarn add @stripe/stripe-js");
    expect(result.bun).toBe("bun add @stripe/stripe-js");
  });

  it("handles multiple packages", () => {
    const result = convertNpmCommand("npm install react react-dom");
    expect(result.pnpm).toBe("pnpm add react react-dom");
    expect(result.yarn).toBe("yarn add react react-dom");
    expect(result.bun).toBe("bun add react react-dom");
  });

  it("handles dev flag preserved verbatim", () => {
    const result = convertNpmCommand("npm install --save-dev typescript");
    expect(result.pnpm).toBe("pnpm add --save-dev typescript");
    expect(result.yarn).toBe("yarn add --save-dev typescript");
    expect(result.bun).toBe("bun add --save-dev typescript");
  });
});

describe("convertNpmCommand — global install", () => {
  it("converts 'npm install --global <pkg>'", () => {
    const result = convertNpmCommand("npm install --global rimraf");
    expect(result.npm).toBe("npm install --global rimraf");
    expect(result.pnpm).toBe("pnpm add -g rimraf");
    expect(result.yarn).toBe("yarn global add rimraf");
    expect(result.bun).toBe("bun add -g rimraf");
  });

  it("converts the shorthand 'npm i -g <pkg>'", () => {
    const result = convertNpmCommand("npm i -g serve");
    expect(result.pnpm).toBe("pnpm add -g serve");
    expect(result.yarn).toBe("yarn global add serve");
    expect(result.bun).toBe("bun add -g serve");
  });
});

describe("convertNpmCommand — npm run", () => {
  it("converts 'npm run build' by stripping 'npm run'", () => {
    const result = convertNpmCommand("npm run build");
    expect(result.npm).toBe("npm run build");
    expect(result.pnpm).toBe("pnpm build");
    expect(result.yarn).toBe("yarn build");
    expect(result.bun).toBe("bun build");
  });

  it("converts 'npm run dev'", () => {
    const result = convertNpmCommand("npm run dev");
    expect(result.pnpm).toBe("pnpm dev");
    expect(result.yarn).toBe("yarn dev");
    expect(result.bun).toBe("bun dev");
  });

  it("converts 'npm run test:watch'", () => {
    const result = convertNpmCommand("npm run test:watch");
    expect(result.pnpm).toBe("pnpm test:watch");
    expect(result.yarn).toBe("yarn test:watch");
    expect(result.bun).toBe("bun test:watch");
  });
});

describe("convertNpmCommand — npx", () => {
  it("converts 'npx <pkg>'", () => {
    const result = convertNpmCommand("npx create-next-app@latest");
    expect(result.npm).toBe("npx create-next-app@latest");
    expect(result.pnpm).toBe("pnpm dlx create-next-app@latest");
    expect(result.yarn).toBe("yarn dlx create-next-app@latest");
    expect(result.bun).toBe("bunx create-next-app@latest");
  });

  it("converts 'npx' with flags", () => {
    const result = convertNpmCommand("npx --yes some-cli");
    expect(result.pnpm).toBe("pnpm dlx --yes some-cli");
    expect(result.yarn).toBe("yarn dlx --yes some-cli");
    expect(result.bun).toBe("bunx --yes some-cli");
  });
});

describe("convertNpmCommand — npm create", () => {
  it("converts 'npm create <x>'", () => {
    const result = convertNpmCommand("npm create vite@latest my-app");
    expect(result.npm).toBe("npm create vite@latest my-app");
    expect(result.pnpm).toBe("pnpm create vite@latest my-app");
    expect(result.yarn).toBe("yarn create vite@latest my-app");
    expect(result.bun).toBe("bun create vite@latest my-app");
  });
});

describe("convertNpmCommand — npm uninstall", () => {
  it("converts 'npm uninstall <pkg>'", () => {
    const result = convertNpmCommand("npm uninstall lodash");
    expect(result.npm).toBe("npm uninstall lodash");
    expect(result.pnpm).toBe("pnpm remove lodash");
    expect(result.yarn).toBe("yarn remove lodash");
    expect(result.bun).toBe("bun remove lodash");
  });

  it("converts the shorthand 'npm un <pkg>'", () => {
    const result = convertNpmCommand("npm un react");
    expect(result.pnpm).toBe("pnpm remove react");
    expect(result.yarn).toBe("yarn remove react");
    expect(result.bun).toBe("bun remove react");
  });
});

describe("convertNpmCommand — no matching rule", () => {
  it("returns the original string for all managers when no rule matches", () => {
    const cmd = "npm publish";
    const result = convertNpmCommand(cmd);
    expect(result.npm).toBe(cmd);
    expect(result.pnpm).toBe(cmd);
    expect(result.yarn).toBe(cmd);
    expect(result.bun).toBe(cmd);
  });
});

// ---------------------------------------------------------------------------
// CodeBlockCommand — component tests
// ---------------------------------------------------------------------------

// Clear the localStorage mock between tests so state doesn't bleed across cases.
beforeEach(() => {
  localStorageMock.clear();
});

afterEach(() => {
  localStorageMock.clear();
});

describe("CodeBlockCommand — tab rendering", () => {
  it("renders one tab per available manager when all four are supplied", () => {
    render(
      <CodeBlockCommand
        bun="bun add zod"
        npm="npm install zod"
        pnpm="pnpm add zod"
        yarn="yarn add zod"
      />
    );
    expect(screen.getByRole("tab", { name: "npm" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "pnpm" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "yarn" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "bun" })).toBeInTheDocument();
  });

  it("only renders tabs for managers that have a command", () => {
    render(<CodeBlockCommand npm="npm install react" pnpm="pnpm add react" />);
    expect(screen.getByRole("tab", { name: "npm" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "pnpm" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "yarn" })).not.toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "bun" })).not.toBeInTheDocument();
  });

  it("derives all four tabs when only npm is supplied", () => {
    render(<CodeBlockCommand npm="npm install @strait/ui" />);
    expect(screen.getByRole("tab", { name: "npm" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "pnpm" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "yarn" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "bun" })).toBeInTheDocument();
  });

  it("derives correct commands when only npm is provided", () => {
    render(<CodeBlockCommand npm="npm install @strait/ui" />);
    // npm tab is active by default — its command is shown
    expect(screen.getByText("npm install @strait/ui")).toBeInTheDocument();
  });
});

describe("CodeBlockCommand — tab switching shows correct command", () => {
  it("shows the npm command initially", () => {
    render(<CodeBlockCommand npm="npm install react" />);
    expect(screen.getByText("npm install react")).toBeInTheDocument();
  });

  it("shows the pnpm command after clicking the pnpm tab", async () => {
    const user = userEvent.setup();
    render(<CodeBlockCommand npm="npm install react" />);
    await user.click(screen.getByRole("tab", { name: "pnpm" }));
    expect(screen.getByText("pnpm add react")).toBeInTheDocument();
  });

  it("shows the yarn command after clicking the yarn tab", async () => {
    const user = userEvent.setup();
    render(<CodeBlockCommand npm="npm install react" />);
    await user.click(screen.getByRole("tab", { name: "yarn" }));
    expect(screen.getByText("yarn add react")).toBeInTheDocument();
  });

  it("shows the bun command after clicking the bun tab", async () => {
    const user = userEvent.setup();
    render(<CodeBlockCommand npm="npm install react" />);
    await user.click(screen.getByRole("tab", { name: "bun" }));
    expect(screen.getByText("bun add react")).toBeInTheDocument();
  });
});

describe("CodeBlockCommand — localStorage persistence", () => {
  it("persists the selected manager to localStorage on tab change", async () => {
    const user = userEvent.setup();
    render(<CodeBlockCommand npm="npm install react" storageKey="pm-test" />);
    await user.click(screen.getByRole("tab", { name: "pnpm" }));
    expect(localStorageMock.getItem("pm-test")).toBe("pnpm");
  });

  it("restores the persisted manager on mount", () => {
    localStorageMock.setItem("pm-test", "bun");
    render(<CodeBlockCommand npm="npm install react" storageKey="pm-test" />);
    // The bun tab should be selected (aria-selected or data-active)
    const bunTab = screen.getByRole("tab", { name: "bun" });
    expect(bunTab).toHaveAttribute("aria-selected", "true");
  });

  it("falls back to the first available manager when stored value is not in the list", () => {
    localStorageMock.setItem("pm-test", "yarn");
    // Only npm and pnpm available — yarn is not
    render(
      <CodeBlockCommand
        npm="npm install react"
        pnpm="pnpm add react"
        storageKey="pm-test"
      />
    );
    const npmTab = screen.getByRole("tab", { name: "npm" });
    expect(npmTab).toHaveAttribute("aria-selected", "true");
  });

  it("uses the default storageKey 'package-manager' when none is supplied", async () => {
    const user = userEvent.setup();
    render(<CodeBlockCommand npm="npm install react" />);
    await user.click(screen.getByRole("tab", { name: "yarn" }));
    expect(localStorageMock.getItem("package-manager")).toBe("yarn");
  });
});

describe("CodeBlockCommand — copy button", () => {
  it("renders a copy button", () => {
    render(<CodeBlockCommand npm="npm install react" />);
    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
  });

  it("calls onCopySuccess when copy button is clicked", async () => {
    const user = userEvent.setup();
    const onCopySuccess = vi.fn();
    render(
      <CodeBlockCommand npm="npm install react" onCopySuccess={onCopySuccess} />
    );
    await user.click(screen.getByRole("button", { name: /copy/i }));
    expect(onCopySuccess).toHaveBeenCalledOnce();
  });
});

describe("CodeBlockCommand — AI prompt tab", () => {
  it("renders an AI tab when prompt is provided", () => {
    render(
      <CodeBlockCommand
        npm="npm install react"
        prompt="Install React and set it up."
      />
    );
    expect(screen.getByRole("tab", { name: "AI" })).toBeInTheDocument();
  });

  it("does not render an AI tab when prompt is not provided", () => {
    render(<CodeBlockCommand npm="npm install react" />);
    expect(screen.queryByRole("tab", { name: "AI" })).not.toBeInTheDocument();
  });

  it("shows the prompt text when the AI tab is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CodeBlockCommand
        npm="npm install react"
        prompt="Install React and set it up."
      />
    );
    await user.click(screen.getByRole("tab", { name: "AI" }));
    expect(
      screen.getByText("Install React and set it up.")
    ).toBeInTheDocument();
  });

  it("has five tabs total when all four managers and prompt are provided", () => {
    render(
      <CodeBlockCommand npm="npm install react" prompt="Install React." />
    );
    const tabs = screen.getAllByRole("tab");
    // npm, pnpm, yarn, bun, AI = 5
    expect(tabs).toHaveLength(5);
  });
});

describe("CodeBlockCommand — data-slot attribute", () => {
  it("sets data-slot='code-block-command' on the root element", () => {
    const { container } = render(<CodeBlockCommand npm="npm install react" />);
    expect(
      container.querySelector("[data-slot='code-block-command']")
    ).toBeInTheDocument();
  });
});
