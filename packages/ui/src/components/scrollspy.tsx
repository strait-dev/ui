"use client";

import {
  type ComponentProps,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";

import { cn } from "../utils/index";

/** Props for {@link Scrollspy}. */
export interface ScrollspyProps
  extends Omit<ComponentProps<"div">, "children"> {
  /** The navigation links to track; anchors carry `data-{dataAttribute}-anchor`. */
  children: ReactNode;
  /**
   * The data-attribute namespace used to find anchors and apply offsets, e.g.
   * `"scrollspy"` looks for `data-scrollspy-anchor`. Defaults to `"scrollspy"`.
   */
  dataAttribute?: string;
  /** When `true` (default), the active section id is synced to the URL hash. */
  history?: boolean;
  /**
   * Pixels subtracted from each section's offset before comparing against the
   * scroll position. Override per anchor with `data-{dataAttribute}-offset`.
   */
  offset?: number;
  /** Called with the active section id whenever the active anchor changes. */
  onUpdate?: (id: string) => void;
  /** When `true` (default), click-to-scroll uses smooth scrolling. */
  smooth?: boolean;
  /**
   * The scroll container to observe. Defaults to the document/window when
   * omitted. Pass a ref to a scrollable element (or one wrapping a
   * `data-slot="scroll-area-viewport"`) to spy inside it.
   */
  targetRef?: RefObject<HTMLElement | Document | null | undefined>;
}

const VIEWPORT_SELECTOR = '[data-slot="scroll-area-viewport"]';

/** Returns the inner scroll-area viewport when present, else the element itself. */
function resolveViewport(element: HTMLElement): HTMLElement {
  const viewport = element.querySelector(VIEWPORT_SELECTOR);
  return viewport instanceof HTMLElement ? viewport : element;
}

/** Reads an anchor's per-anchor offset override, falling back to `fallback`. */
function resolveOffset(
  anchor: Element,
  dataAttribute: string,
  fallback: number
): number {
  const dataOffset = anchor.getAttribute(`data-${dataAttribute}-offset`);
  return dataOffset ? Number.parseInt(dataOffset, 10) : fallback;
}

/**
 * Tracks the section currently in view and marks its corresponding navigation
 * anchor with `data-active="true"`. Anchors opt in via
 * `data-{dataAttribute}-anchor="<section-id>"`; clicking one smooth-scrolls to
 * its section and (optionally) updates the URL hash.
 *
 * @example
 * ```tsx
 * <Scrollspy>
 *   <a data-scrollspy-anchor="intro" href="#intro">Intro</a>
 *   <a data-scrollspy-anchor="usage" href="#usage">Usage</a>
 * </Scrollspy>
 * ```
 */
export function Scrollspy({
  children,
  targetRef,
  onUpdate,
  className,
  offset = 0,
  smooth = true,
  dataAttribute = "scrollspy",
  history = true,
  ...props
}: ScrollspyProps) {
  const selfRef = useRef<HTMLDivElement | null>(null);
  const anchorElementsRef = useRef<Element[] | null>(null);
  const prevIdTracker = useRef<string | null>(null);

  // Marks the active anchor, syncs the hash, and notifies onUpdate.
  const setActiveSection = useCallback(
    (sectionId: string | null, force = false) => {
      if (!sectionId) {
        return;
      }
      for (const item of anchorElementsRef.current ?? []) {
        const id = item.getAttribute(`data-${dataAttribute}-anchor`);
        if (id === sectionId) {
          item.setAttribute("data-active", "true");
        } else {
          item.removeAttribute("data-active");
        }
      }
      onUpdate?.(sectionId);
      if (history && (force || prevIdTracker.current !== sectionId)) {
        window.history.replaceState({}, "", `#${sectionId}`);
      }
      prevIdTracker.current = sectionId;
    },
    [dataAttribute, history, onUpdate]
  );

  const handleScroll = useCallback(() => {
    if (!anchorElementsRef.current || anchorElementsRef.current.length === 0) {
      return;
    }

    let scrollElement =
      targetRef?.current === document
        ? document.documentElement
        : (targetRef?.current as HTMLElement | null);

    // Default to the document scroller when no target ref is supplied.
    scrollElement ??= document.documentElement;

    // Spy inside a scroll-area viewport when the target wraps one.
    scrollElement = resolveViewport(scrollElement);

    const scrollTop =
      scrollElement === document.documentElement
        ? window.scrollY || document.documentElement.scrollTop
        : scrollElement.scrollTop;

    // Pick the anchor whose section starts closest to, but not past, the top.
    let activeIdx = 0;
    let minDelta = Number.POSITIVE_INFINITY;

    anchorElementsRef.current.forEach((anchor, idx) => {
      const sectionId = anchor.getAttribute(`data-${dataAttribute}-anchor`);
      if (!sectionId) {
        return;
      }
      const sectionElement = document.getElementById(sectionId);
      if (!sectionElement) {
        return;
      }

      const customOffset = resolveOffset(anchor, dataAttribute, offset);

      const delta = Math.abs(
        sectionElement.offsetTop - customOffset - scrollTop
      );

      if (
        sectionElement.offsetTop - customOffset <= scrollTop &&
        delta < minDelta
      ) {
        minDelta = delta;
        activeIdx = idx;
      }
    });

    // Force the last anchor when scrolled to the bottom.
    const { scrollHeight, clientHeight } = scrollElement;
    if (scrollTop + clientHeight >= scrollHeight - 2) {
      activeIdx = anchorElementsRef.current.length - 1;
    }

    const activeAnchor = anchorElementsRef.current[activeIdx];
    const sectionId =
      activeAnchor?.getAttribute(`data-${dataAttribute}-anchor`) || null;

    setActiveSection(sectionId);
  }, [targetRef, dataAttribute, offset, setActiveSection]);

  const scrollTo = useCallback(
    (anchorElement: HTMLElement) => (event?: Event) => {
      event?.preventDefault();
      const sectionId =
        anchorElement
          .getAttribute(`data-${dataAttribute}-anchor`)
          ?.replace("#", "") || null;
      if (!sectionId) {
        return;
      }
      const sectionElement = document.getElementById(sectionId);
      if (!sectionElement) {
        return;
      }

      const target =
        targetRef?.current === document
          ? window
          : (targetRef?.current as HTMLElement | null);
      const scrollToElement =
        target instanceof HTMLElement ? resolveViewport(target) : target;

      const customOffset = resolveOffset(anchorElement, dataAttribute, offset);
      const scrollTop = sectionElement.offsetTop - customOffset;

      scrollToElement?.scrollTo({
        top: scrollTop,
        left: 0,
        behavior: smooth ? "smooth" : "auto",
      });
      setActiveSection(sectionId, true);
    },
    [dataAttribute, offset, smooth, targetRef, setActiveSection]
  );

  // Jump to the section referenced by the URL hash, if any.
  const scrollToHashSection = useCallback(() => {
    const hash = CSS.escape(window.location.hash.replace("#", ""));
    if (!hash) {
      return;
    }
    const targetElement = document.querySelector(
      `[data-${dataAttribute}-anchor="${hash}"]`
    );
    if (targetElement instanceof HTMLElement) {
      scrollTo(targetElement)();
    }
  }, [dataAttribute, scrollTo]);

  useEffect(() => {
    // Cache the anchors so scroll handling avoids re-querying the DOM.
    if (selfRef.current) {
      anchorElementsRef.current = Array.from(
        selfRef.current.querySelectorAll(`[data-${dataAttribute}-anchor]`)
      );
    }

    const currentAnchors = anchorElementsRef.current;
    const clickHandlers = new Map<Element, (event: Event) => void>();
    for (const item of currentAnchors ?? []) {
      const handler = scrollTo(item as HTMLElement);
      clickHandlers.set(item, handler);
      item.addEventListener("click", handler);
    }

    const onScroll = (event: Event) => {
      const scrollElement =
        targetRef?.current === document
          ? window
          : (targetRef?.current as HTMLElement | null);

      if (
        !scrollElement ||
        scrollElement === window ||
        (scrollElement instanceof HTMLElement &&
          scrollElement.contains(event.target as Node))
      ) {
        handleScroll();
      }
    };

    // Capture-phase window listener catches scrolls from a later-set targetRef.
    window.addEventListener("scroll", onScroll, true);

    // Honour an initial URL hash once the layout has settled.
    const initialTimeout = setTimeout(() => {
      scrollToHashSection();
      handleScroll();
    }, 100);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      for (const [item, handler] of clickHandlers) {
        item.removeEventListener("click", handler);
      }
      clearTimeout(initialTimeout);
    };
  }, [targetRef, handleScroll, dataAttribute, scrollTo, scrollToHashSection]);

  return (
    <div
      className={cn(className)}
      data-slot="scrollspy"
      ref={selfRef}
      {...props}
    >
      {children}
    </div>
  );
}
