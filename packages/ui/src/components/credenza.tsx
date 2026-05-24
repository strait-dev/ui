"use client";

import { createContext, useContext } from "react";

import { useMediaQuery } from "../hooks/use-media-query";
import { cn } from "../utils/index";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

type BaseProps = {
  children: React.ReactNode;
};

/** Props for {@link Credenza}. */
export type CredenzaProps = BaseProps & {
  /** Controlled open state; pair with {@link CredenzaProps.onOpenChange}. */
  open?: boolean;
  /** Called when the overlay requests an open/close transition. */
  onOpenChange?: (open: boolean) => void;
};

type CredenzaContentProps = Omit<BaseProps, "children"> & {
  children?: React.ReactNode;
  className?: string;
  render?: React.ReactElement;
};

/**
 * Internal context that propagates the current breakpoint decision to all
 * `Credenza*` sub-components so they can swap between their Dialog and
 * Drawer implementations without receiving extra props.
 */
const CredenzaContext = createContext<{ isDesktop: boolean }>({
  isDesktop: false,
});

/**
 * Hook that reads the {@link CredenzaContext} value.
 *
 * Throws if called outside a `Credenza` tree, which catches accidental
 * usage of sub-components without the root.
 */
const useCredenzaContext = () => {
  const context = useContext(CredenzaContext);
  if (!context) {
    throw new Error(
      "Credenza components cannot be rendered outside the Credenza Context"
    );
  }
  return context;
};

/**
 * Responsive overlay that renders as a centred {@link Dialog} on desktop
 * (`>= 768 px`) and as a bottom {@link Drawer} on mobile.
 *
 * The breakpoint is evaluated once at mount via `useMediaQuery` and
 * propagated to all `Credenza*` sub-components through
 * {@link CredenzaContext}, so each part automatically uses the right
 * underlying primitive.
 *
 * Compose the parts as:
 * `Credenza` → `CredenzaTrigger` → `CredenzaContent`, then inside the
 * content: {@link CredenzaHeader} (holding {@link CredenzaTitle} and
 * {@link CredenzaDescription}), {@link CredenzaBody} for scrollable body
 * content, and {@link CredenzaFooter}.
 *
 * @remarks
 * - The `render` prop is forwarded to `DialogTrigger` on desktop (Base UI
 *   style) and used as the `asChild` target on mobile (Vaul style). The
 *   two primitives diverge here so {@link CredenzaTrigger} and
 *   {@link CredenzaClose} handle the branching internally.
 * - On mobile, `autoFocus` is forced on the Drawer root so focus enters
 *   the panel immediately after it slides in.
 * - Always include a {@link CredenzaTitle} for screen-reader accessibility
 *   on both presentations.
 *
 * @example
 * ```tsx
 * <Credenza>
 *   <CredenzaTrigger>Open</CredenzaTrigger>
 *   <CredenzaContent>
 *     <CredenzaHeader>
 *       <CredenzaTitle>Edit profile</CredenzaTitle>
 *       <CredenzaDescription>
 *         Changes are saved automatically.
 *       </CredenzaDescription>
 *     </CredenzaHeader>
 *     <CredenzaBody>…</CredenzaBody>
 *     <CredenzaFooter>
 *       <CredenzaClose>Cancel</CredenzaClose>
 *     </CredenzaFooter>
 *   </CredenzaContent>
 * </Credenza>
 * ```
 */
const Credenza = ({ children, ...props }: CredenzaProps) => {
  // Evaluate breakpoint reactively so server and client stay in sync.
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const Component = isDesktop ? Dialog : Drawer;

  return (
    <div data-slot="credenza">
      <CredenzaContext.Provider value={{ isDesktop }}>
        {/* autoFocus ensures the Drawer receives focus on mobile open */}
        <Component {...props} {...(!isDesktop && { autoFocus: true })}>
          {children}
        </Component>
      </CredenzaContext.Provider>
    </div>
  );
};

/**
 * Trigger that opens the {@link Credenza}.
 *
 * On desktop delegates to {@link DialogTrigger} (Base UI's `render` prop
 * pattern); on mobile delegates to `DrawerTrigger` with `asChild` and
 * uses `render ?? children` as the slotted element.
 */
const CredenzaTrigger = ({
  className,
  children,
  render,
  ...props
}: CredenzaContentProps) => {
  const { isDesktop } = useCredenzaContext();

  // Dialog (Base UI) consumes `render`; Drawer (vaul) consumes `asChild`.
  if (isDesktop) {
    return (
      <DialogTrigger
        className={className}
        data-slot="credenza-trigger"
        render={render}
        {...props}
      >
        {children}
      </DialogTrigger>
    );
  }

  return (
    <DrawerTrigger
      asChild
      className={className}
      data-slot="credenza-trigger"
      {...props}
    >
      {render ?? children}
    </DrawerTrigger>
  );
};

/**
 * Dismissal control for the {@link Credenza}.
 *
 * On desktop delegates to {@link DialogClose}; on mobile delegates to
 * `DrawerClose`. The `render` prop is forwarded on desktop; on mobile
 * `render ?? children` is used as the `asChild` target.
 */
const CredenzaClose = ({
  className,
  children,
  render,
  ...props
}: CredenzaContentProps) => {
  const { isDesktop } = useCredenzaContext();

  // Dialog (Base UI) consumes `render`; Drawer (vaul) consumes `asChild`.
  if (isDesktop) {
    return (
      <DialogClose
        className={className}
        data-slot="credenza-close"
        render={render}
        {...props}
      >
        {children}
      </DialogClose>
    );
  }

  return (
    <DrawerClose
      asChild
      className={className}
      data-slot="credenza-close"
      {...props}
    >
      {render ?? children}
    </DrawerClose>
  );
};

/**
 * The panel body of the {@link Credenza}.
 *
 * Renders {@link DialogContent} on desktop and {@link DrawerContent} on
 * mobile. Both include their own portal and overlay internally.
 */
const CredenzaContent = ({
  className,
  children,
  ...props
}: CredenzaContentProps) => {
  const { isDesktop } = useCredenzaContext();
  const Component = isDesktop ? DialogContent : DrawerContent;

  return (
    <Component className={className} data-slot="credenza-content" {...props}>
      {children}
    </Component>
  );
};

/**
 * Supporting description text inside {@link CredenzaContent}.
 *
 * Delegates to {@link DialogDescription} on desktop and
 * `DrawerDescription` on mobile.
 */
const CredenzaDescription = ({
  className,
  children,
  ...props
}: CredenzaContentProps) => {
  const { isDesktop } = useCredenzaContext();
  const Component = isDesktop ? DialogDescription : DrawerDescription;

  return (
    <Component
      className={className}
      data-slot="credenza-description"
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * Top region of {@link CredenzaContent} for {@link CredenzaTitle} and
 * {@link CredenzaDescription}.
 *
 * Delegates to {@link DialogHeader} on desktop and `DrawerHeader` on
 * mobile.
 */
const CredenzaHeader = ({
  className,
  children,
  ...props
}: CredenzaContentProps) => {
  const { isDesktop } = useCredenzaContext();
  const Component = isDesktop ? DialogHeader : DrawerHeader;

  return (
    <Component className={className} data-slot="credenza-header" {...props}>
      {children}
    </Component>
  );
};

/**
 * Accessible heading for the {@link Credenza}, announced by screen
 * readers when the panel opens. Always include this for a11y.
 *
 * Delegates to {@link DialogTitle} on desktop and `DrawerTitle` on mobile.
 */
const CredenzaTitle = ({
  className,
  children,
  ...props
}: CredenzaContentProps) => {
  const { isDesktop } = useCredenzaContext();
  const Component = isDesktop ? DialogTitle : DrawerTitle;

  return (
    <Component className={className} data-slot="credenza-title" {...props}>
      {children}
    </Component>
  );
};

/**
 * Scrollable body region of {@link CredenzaContent}.
 *
 * Unlike the other sub-parts, `CredenzaBody` is always a plain `<div>`
 * regardless of the current presentation. It adds horizontal padding on
 * mobile (`px-4`) that is removed on desktop (`md:px-0`) to match the
 * visual conventions of each primitive.
 */
const CredenzaBody = ({
  className,
  children,
  ...props
}: CredenzaContentProps) => (
  <div
    className={cn("px-4 md:px-0", className)}
    data-slot="credenza-body"
    {...props}
  >
    {children}
  </div>
);

/**
 * Bottom action bar for {@link CredenzaContent}.
 *
 * Delegates to {@link DialogFooter} on desktop and `DrawerFooter` on
 * mobile.
 */
const CredenzaFooter = ({
  className,
  children,
  ...props
}: CredenzaContentProps) => {
  const { isDesktop } = useCredenzaContext();
  const Component = isDesktop ? DialogFooter : DrawerFooter;

  return (
    <Component className={className} data-slot="credenza-footer" {...props}>
      {children}
    </Component>
  );
};

export {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
};
