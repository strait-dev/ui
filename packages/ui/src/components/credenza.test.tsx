import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "./credenza";

beforeAll(() => {
  window.matchMedia ||= (q: string) => ({
    matches: false,
    media: q,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  });
});

function CredenzaFixture({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Credenza onOpenChange={onOpenChange} open={open}>
      <CredenzaTrigger render={<button type="button">Open Dialog</button>} />
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Test Title</CredenzaTitle>
          <CredenzaDescription>Test Description</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>Body content</CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose render={<button type="button">Close</button>} />
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}

describe("Credenza", () => {
  it("renders the root with data-slot='credenza'", () => {
    const { container } = render(<CredenzaFixture />);
    expect(
      container.querySelector("[data-slot='credenza']")
    ).toBeInTheDocument();
  });

  it("renders the trigger button", () => {
    render(<CredenzaFixture />);
    expect(screen.getByText("Open Dialog")).toBeInTheDocument();
  });

  it("does not show content before trigger is clicked", () => {
    render(<CredenzaFixture />);
    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
  });

  it("shows content when trigger is clicked", async () => {
    render(<CredenzaFixture />);
    await userEvent.click(screen.getByText("Open Dialog"));
    expect(await screen.findByText("Test Title")).toBeInTheDocument();
  });

  it("shows description when open", async () => {
    render(<CredenzaFixture />);
    await userEvent.click(screen.getByText("Open Dialog"));
    expect(await screen.findByText("Test Description")).toBeInTheDocument();
  });

  it("shows body content when open", async () => {
    render(<CredenzaFixture />);
    await userEvent.click(screen.getByText("Open Dialog"));
    expect(await screen.findByText("Body content")).toBeInTheDocument();
  });

  it("renders open when open prop is true", async () => {
    render(<CredenzaFixture open={true} />);
    expect(await screen.findByText("Test Title")).toBeInTheDocument();
  });

  it("renders CredenzaBody with data-slot='credenza-body'", async () => {
    render(<CredenzaFixture open={true} />);
    // CredenzaContent renders into a portal; query from document
    await screen.findByText("Body content");
    const body = document.querySelector("[data-slot='credenza-body']");
    expect(body).toBeInTheDocument();
  });
});
