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
