import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "./avatar";

describe("Avatar", () => {
  it("renders with data-slot avatar and default size", () => {
    render(
      <Avatar>
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>
    );
    const root = screen.getByText("AC").closest("[data-slot=avatar]");
    expect(root).toHaveAttribute("data-slot", "avatar");
    expect(root).toHaveAttribute("data-size", "default");
  });

  it("forwards size prop to data-size", () => {
    render(
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    );
    const root = screen.getByText("LG").closest("[data-slot=avatar]");
    expect(root).toHaveAttribute("data-size", "lg");
  });

  it("renders AvatarFallback with data-slot", () => {
    render(
      <Avatar>
        <AvatarFallback>FB</AvatarFallback>
      </Avatar>
    );
    const fallback = screen.getByText("FB");
    expect(fallback).toHaveAttribute("data-slot", "avatar-fallback");
  });

  it("renders AvatarFallback when no valid image src is provided", () => {
    render(
      <Avatar>
        <AvatarImage alt="No image" src="" />
        <AvatarFallback>NI</AvatarFallback>
      </Avatar>
    );
    // In jsdom image loads do not fire, so the fallback is rendered
    const fallback = document.querySelector("[data-slot=avatar-fallback]");
    expect(fallback).toBeInTheDocument();
  });

  it("renders AvatarBadge with data-slot", () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
        <AvatarBadge />
      </Avatar>
    );
    const badge = document.querySelector("[data-slot=avatar-badge]");
    expect(badge).toHaveAttribute("data-slot", "avatar-badge");
  });

  it("renders AvatarGroup and AvatarGroupCount with data-slots", () => {
    render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    );
    const group = document.querySelector("[data-slot=avatar-group]");
    expect(group).toHaveAttribute("data-slot", "avatar-group");
    const count = screen.getByText("+3");
    expect(count).toHaveAttribute("data-slot", "avatar-group-count");
  });

  it("size xs applies size-5 via data-size attribute", () => {
    render(
      <Avatar size="xs">
        <AvatarFallback>XS</AvatarFallback>
      </Avatar>
    );
    const root = screen.getByText("XS").closest("[data-slot=avatar]");
    expect(root).toHaveAttribute("data-size", "xs");
    expect(root?.className).toContain("data-[size=xs]:size-5");
  });

  it("size xl applies size-12 via data-size attribute", () => {
    render(
      <Avatar size="xl">
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    );
    const root = screen.getByText("XL").closest("[data-slot=avatar]");
    expect(root).toHaveAttribute("data-size", "xl");
    expect(root?.className).toContain("data-[size=xl]:size-12");
  });

  it("AvatarBadge status online applies bg-success", () => {
    render(
      <Avatar>
        <AvatarFallback>ON</AvatarFallback>
        <AvatarBadge status="online" />
      </Avatar>
    );
    const badge = document.querySelector("[data-slot=avatar-badge]");
    expect(badge?.className).toContain("bg-success");
  });

  it("AvatarBadge status busy applies bg-destructive", () => {
    render(
      <Avatar>
        <AvatarFallback>BS</AvatarFallback>
        <AvatarBadge status="busy" />
      </Avatar>
    );
    const badge = document.querySelector("[data-slot=avatar-badge]");
    expect(badge?.className).toContain("bg-destructive");
  });

  it("AvatarBadge status away applies bg-warning", () => {
    render(
      <Avatar>
        <AvatarFallback>AW</AvatarFallback>
        <AvatarBadge status="away" />
      </Avatar>
    );
    const badge = document.querySelector("[data-slot=avatar-badge]");
    expect(badge?.className).toContain("bg-warning");
  });

  it("AvatarBadge status offline applies bg-muted-foreground", () => {
    render(
      <Avatar>
        <AvatarFallback>OF</AvatarFallback>
        <AvatarBadge status="offline" />
      </Avatar>
    );
    const badge = document.querySelector("[data-slot=avatar-badge]");
    expect(badge?.className).toContain("bg-muted-foreground");
  });

  it("AvatarBadge without status keeps bg-primary (backwards compat)", () => {
    render(
      <Avatar>
        <AvatarFallback>NO</AvatarFallback>
        <AvatarBadge />
      </Avatar>
    );
    const badge = document.querySelector("[data-slot=avatar-badge]");
    expect(badge?.className).toContain("bg-primary");
  });
});
