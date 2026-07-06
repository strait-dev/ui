"use client";

import {
  DndContext,
  type DragEndEvent,
  type DraggableSyntheticListeners,
  DragOverlay,
  type DragStartEvent,
  type DropAnimation,
  defaultDropAnimationSideEffects,
  KeyboardSensor,
  MeasuringStrategy,
  type Modifiers,
  MouseSensor,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  type AnimateLayoutChanges,
  arrayMove,
  defaultAnimateLayoutChanges,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Children,
  type ComponentProps,
  type CSSProperties,
  cloneElement,
  createContext,
  isValidElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "../utils/index";

/** Layout strategy that controls how dragged items are measured and reflowed. */
type SortableStrategy = "horizontal" | "vertical" | "grid";

/* ------------------------------------------------------------------ */
/* Internal contexts                                                  */
/* ------------------------------------------------------------------ */

const SortableItemContext = createContext<{
  listeners: DraggableSyntheticListeners | undefined;
  isDragging: boolean;
  disabled: boolean;
}>({
  listeners: undefined,
  isDragging: false,
  disabled: false,
});

/** True while a node renders inside the drag overlay (its lifted clone). */
const IsOverlayContext = createContext(false);

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: "0.4" } },
  }),
};

/* ------------------------------------------------------------------ */
/* Sortable (root)                                                    */
/* ------------------------------------------------------------------ */

/** Props for {@link Sortable}. */
export interface SortableProps<T>
  extends Omit<ComponentProps<"div">, "onDragStart" | "onDragEnd"> {
  /**
   * Derives the stable string id for an item. Must match the `value` passed
   * to the corresponding {@link SortableItem}.
   */
  getItemValue: (item: T) => string;
  /** dnd-kit modifiers applied to both the drag and the overlay. */
  modifiers?: Modifiers;
  /** Forwarded to dnd-kit's `DndContext` `onDragEnd` (fires before reorder). */
  onDragEnd?: (event: DragEndEvent) => void;
  /** Forwarded to dnd-kit's `DndContext` `onDragStart`. */
  onDragStart?: (event: DragStartEvent) => void;
  /**
   * Escape hatch invoked instead of the built-in `arrayMove`. Receives the
   * raw drag event plus the resolved source/target indices, letting you run
   * a custom reorder (e.g. server-synced). When provided, `onValueChange`
   * is **not** called automatically.
   */
  onMove?: (event: {
    event: DragEndEvent;
    activeIndex: number;
    overIndex: number;
  }) => void;
  /** Called with the reordered list after a successful drag. */
  onValueChange: (value: T[]) => void;
  /**
   * Layout strategy used for measuring/reflowing during a drag.
   * `"vertical"` (default) for stacked lists, `"horizontal"` for rows, and
   * `"grid"` for wrapped two-dimensional grids.
   */
  strategy?: SortableStrategy;
  /** The ordered list of items rendered as {@link SortableItem}s. */
  value: T[];
}

/**
 * Drag-to-reorder container built on dnd-kit. Wraps its children in a
 * `DndContext` + `SortableContext` and renders a floating overlay that mirrors
 * the actively dragged {@link SortableItem}.
 *
 * Reordering is controlled: supply `value`, `getItemValue`, and
 * `onValueChange`. Each child must be a {@link SortableItem} whose `value`
 * matches `getItemValue(item)`. Pointer dragging is initiated from a
 * {@link SortableItemHandle}; keyboard reordering works from the item itself.
 *
 * @example
 * ```tsx
 * <Sortable value={items} getItemValue={(i) => i.id} onValueChange={setItems}>
 *   {items.map((item) => (
 *     <SortableItem key={item.id} value={item.id}>
 *       <SortableItemHandle>⠿</SortableItemHandle>
 *       {item.label}
 *     </SortableItem>
 *   ))}
 * </Sortable>
 * ```
 */
function Sortable<T>({
  value,
  onValueChange,
  getItemValue,
  className,
  strategy = "vertical",
  onMove,
  onDragStart,
  onDragEnd,
  modifiers,
  children,
  ...props
}: SortableProps<T>) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveId(event.active.id);
      onDragStart?.(event);
    },
    [onDragStart]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      onDragEnd?.(event);

      if (!over) {
        return;
      }

      const activeIndex = value.findIndex(
        (item) => getItemValue(item) === active.id
      );
      const overIndex = value.findIndex(
        (item) => getItemValue(item) === over.id
      );

      if (activeIndex === overIndex) {
        return;
      }

      if (onMove) {
        onMove({ event, activeIndex, overIndex });
      } else {
        onValueChange(arrayMove(value, activeIndex, overIndex));
      }
    },
    [value, getItemValue, onValueChange, onMove, onDragEnd]
  );

  const handleDragCancel = useCallback(() => setActiveId(null), []);

  const sortingStrategy =
    strategy === "vertical" ? verticalListSortingStrategy : rectSortingStrategy;

  const itemIds = useMemo(() => value.map(getItemValue), [value, getItemValue]);

  // The lifted clone shown in the overlay: the active child with z-(--z-popover) layered on.
  const overlayContent = useMemo(() => {
    if (activeId == null) {
      return null;
    }
    let result: ReactNode = null;
    Children.forEach(children, (child) => {
      if (
        isValidElement<{ value?: string; className?: string }>(child) &&
        child.props.value === activeId
      ) {
        result = cloneElement(child, {
          className: cn(child.props.className, "z-(--z-popover)"),
        });
      }
    });
    return result;
  }, [activeId, children]);

  return (
    <DndContext
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      modifiers={modifiers}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <SortableContext items={itemIds} strategy={sortingStrategy}>
        <div
          className={cn(activeId !== null && "cursor-grabbing!", className)}
          data-dragging={activeId !== null}
          data-slot="sortable"
          {...props}
        >
          {children}
        </div>
      </SortableContext>
      {mounted &&
        createPortal(
          <DragOverlay
            className={cn("z-(--z-popover)", activeId && "cursor-grabbing")}
            dropAnimation={dropAnimationConfig}
            modifiers={modifiers}
          >
            <IsOverlayContext.Provider value={true}>
              {overlayContent}
            </IsOverlayContext.Provider>
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}

/* ------------------------------------------------------------------ */
/* SortableItem                                                       */
/* ------------------------------------------------------------------ */

/** Props for {@link SortableItem}. */
export interface SortableItemProps extends ComponentProps<"div"> {
  /** When `true`, the item cannot be dragged and is dimmed. */
  disabled?: boolean;
  /**
   * Stable id for this item; must equal `getItemValue(item)` on the parent
   * {@link Sortable}.
   */
  value: string;
}

/**
 * A single draggable row/cell inside a {@link Sortable}. Registers itself with
 * dnd-kit and exposes drag listeners to a nested {@link SortableItemHandle} via
 * context. Renders a non-interactive clone when shown inside the drag overlay.
 */
function SortableItem({
  value,
  className,
  disabled = false,
  children,
  ...props
}: SortableItemProps) {
  const isOverlay = useContext(IsOverlayContext);

  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id: value,
    disabled: disabled || isOverlay,
    animateLayoutChanges,
  });

  // Inside the overlay we render a static clone — no ref, listeners, or layout.
  if (isOverlay) {
    return (
      <SortableItemContext.Provider
        value={{ listeners: undefined, isDragging: true, disabled: false }}
      >
        <div
          className={cn(className)}
          data-dragging={true}
          data-slot="sortable-item"
          data-value={value}
          {...props}
        >
          {children}
        </div>
      </SortableItemContext.Provider>
    );
  }

  const style: CSSProperties = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <SortableItemContext.Provider value={{ listeners, isDragging, disabled }}>
      <div
        className={cn(
          "outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          isDragging && "z-(--z-popover) opacity-50",
          disabled && "opacity-50",
          className
        )}
        data-disabled={disabled || undefined}
        data-dragging={isDragging}
        data-slot="sortable-item"
        data-value={value}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...props}
      >
        {children}
      </div>
    </SortableItemContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* SortableItemHandle                                                 */
/* ------------------------------------------------------------------ */

/** Props for {@link SortableItemHandle}. */
export interface SortableItemHandleProps extends ComponentProps<"div"> {
  /**
   * When `true` (default), applies `cursor-grab` / `cursor-grabbing` to signal
   * draggability. Set `false` to manage the cursor yourself.
   */
  cursor?: boolean;
}

/**
 * The grab target that initiates a pointer drag for its enclosing
 * {@link SortableItem}. Wrap a grip icon for a dedicated handle, or wrap the
 * whole row to make the entire item draggable.
 */
function SortableItemHandle({
  className,
  cursor = true,
  children,
  ...props
}: SortableItemHandleProps) {
  const { listeners, isDragging, disabled } = useContext(SortableItemContext);

  return (
    <div
      className={cn(
        cursor && (isDragging ? "cursor-grabbing!" : "cursor-grab!"),
        disabled && "cursor-not-allowed!",
        className
      )}
      data-disabled={disabled || undefined}
      data-dragging={isDragging}
      data-slot="sortable-item-handle"
      {...listeners}
      {...props}
    >
      {children}
    </div>
  );
}

export { Sortable, SortableItem, SortableItemHandle };
