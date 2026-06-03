import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createMDX } from "fumadocs-mdx/next";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // @strait/ui ships ESM source consumed directly from the workspace; let Next
  // transpile it so its "use client" directives and subpath exports resolve.
  transpilePackages: ["@strait/ui"],
  // Pin the workspace root so Turbopack doesn't guess from a stray lockfile.
  turbopack: {
    root: repoRoot,
  },
};

const withMDX = createMDX();

export default withMDX(config);
