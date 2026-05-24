import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "./description-list";

describe("DescriptionList", () => {
  it("renders [data-slot='description-list'] as a DL element", () => {
    const { container } = render(
      <DescriptionList>
        <DescriptionTerm>Name</DescriptionTerm>
        <DescriptionDetails>Alice</DescriptionDetails>
      </DescriptionList>
    );
    const el = container.querySelector("[data-slot='description-list']");
    expect(el).toBeInTheDocument();
    expect(el?.tagName).toBe("DL");
  });

  it("renders DescriptionTerm as a DT element with description-term slot", () => {
    const { container } = render(
      <DescriptionList>
        <DescriptionTerm>Role</DescriptionTerm>
        <DescriptionDetails>Engineer</DescriptionDetails>
      </DescriptionList>
    );
    const el = container.querySelector("[data-slot='description-term']");
    expect(el).toBeInTheDocument();
    expect(el?.tagName).toBe("DT");
  });

  it("renders DescriptionDetails as a DD element with description-details slot", () => {
    const { container } = render(
      <DescriptionList>
        <DescriptionTerm>Team</DescriptionTerm>
        <DescriptionDetails>Platform</DescriptionDetails>
      </DescriptionList>
    );
    const el = container.querySelector("[data-slot='description-details']");
    expect(el).toBeInTheDocument();
    expect(el?.tagName).toBe("DD");
  });

  it("applies vertical orientation classes by default", () => {
    const { container } = render(
      <DescriptionList>
        <DescriptionTerm>Plan</DescriptionTerm>
        <DescriptionDetails>Pro</DescriptionDetails>
      </DescriptionList>
    );
    const dl = container.querySelector("[data-slot='description-list']");
    expect(dl?.className).toContain("flex");
    expect(dl?.className).toContain("flex-col");
  });

  it("applies horizontal orientation classes when orientation='horizontal'", () => {
    const { container } = render(
      <DescriptionList orientation="horizontal">
        <DescriptionTerm>Status</DescriptionTerm>
        <DescriptionDetails>Active</DescriptionDetails>
      </DescriptionList>
    );
    const dl = container.querySelector("[data-slot='description-list']");
    expect(dl?.className).toContain("grid");
    expect(dl?.className).toContain("grid-cols-[minmax(0,12rem)_1fr]");
  });

  it("applies sm size classes when size='sm'", () => {
    const { container } = render(
      <DescriptionList size="sm">
        <DescriptionTerm>Key</DescriptionTerm>
        <DescriptionDetails>Value</DescriptionDetails>
      </DescriptionList>
    );
    const dl = container.querySelector("[data-slot='description-list']");
    expect(dl?.className).toContain("gap-y-2");
  });

  it("applies lg size classes when size='lg'", () => {
    const { container } = render(
      <DescriptionList size="lg">
        <DescriptionTerm>Key</DescriptionTerm>
        <DescriptionDetails>Value</DescriptionDetails>
      </DescriptionList>
    );
    const dl = container.querySelector("[data-slot='description-list']");
    expect(dl?.className).toContain("gap-y-4");
    expect(dl?.className).toContain("text-base");
  });

  it("applies divided border classes in horizontal orientation when divided=true", () => {
    const { container } = render(
      <DescriptionList divided orientation="horizontal">
        <DescriptionTerm>Order</DescriptionTerm>
        <DescriptionDetails>#10042</DescriptionDetails>
      </DescriptionList>
    );
    const dl = container.querySelector("[data-slot='description-list']");
    expect(dl?.className).toContain("[&>dt]:border-b");
    expect(dl?.className).toContain("[&>dd]:border-b");
  });

  it("forwards className to each sub-part", () => {
    const { container } = render(
      <DescriptionList className="custom-list">
        <DescriptionTerm className="custom-term">Label</DescriptionTerm>
        <DescriptionDetails className="custom-details">
          Content
        </DescriptionDetails>
      </DescriptionList>
    );
    expect(
      container.querySelector("[data-slot='description-list']")?.className
    ).toContain("custom-list");
    expect(
      container.querySelector("[data-slot='description-term']")?.className
    ).toContain("custom-term");
    expect(
      container.querySelector("[data-slot='description-details']")?.className
    ).toContain("custom-details");
  });

  it("renders multiple term/details pairs correctly", () => {
    const { container } = render(
      <DescriptionList orientation="horizontal">
        <DescriptionTerm>Name</DescriptionTerm>
        <DescriptionDetails>Alice Martin</DescriptionDetails>
        <DescriptionTerm>Role</DescriptionTerm>
        <DescriptionDetails>Senior Engineer</DescriptionDetails>
        <DescriptionTerm>Team</DescriptionTerm>
        <DescriptionDetails>Platform</DescriptionDetails>
      </DescriptionList>
    );
    const terms = container.querySelectorAll("[data-slot='description-term']");
    const details = container.querySelectorAll(
      "[data-slot='description-details']"
    );
    expect(terms).toHaveLength(3);
    expect(details).toHaveLength(3);
  });
});
