import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import copy from "copy-to-clipboard";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { IdCell } from "./id-cell";
import { toast } from "./toast";

vi.mock("copy-to-clipboard", () => ({ default: vi.fn() }));
vi.mock("./toast", () => ({ toast: { success: vi.fn() } }));

const ID = "abcdef0123456789";

describe("IdCell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the id truncated to six characters", () => {
    render(<IdCell id={ID} />);
    expect(screen.getByText("abcdef...")).toBeInTheDocument();
  });

  it("exposes the id-cell data-slot on its root", () => {
    const { container } = render(<IdCell id={ID} />);
    expect(container.querySelector('[data-slot="id-cell"]')).not.toBeNull();
  });

  it("copies the full id and shows a success toast when the copy button is clicked", async () => {
    render(<IdCell id={ID} />);
    await userEvent.click(screen.getByRole("button", { name: "Copy ID" }));
    expect(copy).toHaveBeenCalledWith(ID);
    expect(toast.success).toHaveBeenCalledWith("ID copied to clipboard");
  });
});

// ---------------------------------------------------------------------------
// length prop
// ---------------------------------------------------------------------------

describe("IdCell length prop", () => {
  it("defaults to 6 characters when length is not supplied", () => {
    render(<IdCell id={ID} />);
    // Default: first 6 chars + "..."
    expect(screen.getByText("abcdef...")).toBeInTheDocument();
  });

  it("shows the first `length` characters when length=4", () => {
    render(<IdCell id={ID} length={4} />);
    expect(screen.getByText("abcd...")).toBeInTheDocument();
  });

  it("shows the first `length` characters when length=10", () => {
    render(<IdCell id={ID} length={10} />);
    expect(screen.getByText("abcdef0123...")).toBeInTheDocument();
  });

  it("does not break when length equals the full id length", () => {
    render(<IdCell id="abc" length={3} />);
    // Slice(0, 3) of "abc" = "abc"; still appends "..."
    expect(screen.getByText("abc...")).toBeInTheDocument();
  });

  it("still copies the full id regardless of the displayed length", async () => {
    render(<IdCell id={ID} length={4} />);
    await userEvent.click(screen.getByRole("button", { name: "Copy ID" }));
    expect(copy).toHaveBeenCalledWith(ID);
  });
});
