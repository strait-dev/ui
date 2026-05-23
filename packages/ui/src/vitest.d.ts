// Brings the jest-dom matcher types (toBeInTheDocument, toHaveAttribute, ...)
// into Vitest's `expect` for every *.test.tsx file. Lives in src so the
// typecheck program (tsconfig include: ["src"]) picks up the augmentation.
import "@testing-library/jest-dom/vitest";
