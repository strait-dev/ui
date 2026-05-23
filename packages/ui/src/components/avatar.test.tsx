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
});
