import { useRef, useEffect, useCallback } from "react";
import type { SerializedPoint } from "../../Workflow/Types";

// Event Types
export type EventHandler = (e: Event) => void;
export type EventType = "tap" | "move" | "moveEnd" | "pinch";

// Custom Event Detail Types
export interface TapEventDetail {
  x: number;
  y: number;
}

export interface MoveEventDetail {
  x: number;
  y: number;
  delta: SerializedPoint;
}

export interface PinchEventDetail {
  x: number;
  y: number;
  scale: number;
  delta: SerializedPoint;
}

type TinyTouch = {
  identifier: number;
  pageX: number;
  pageY: number;
};

interface EventManagerState {
  currentTouches: TinyTouch[];
  startDistance: number;
  scale: number;
  previousScale: number;
  isClick: boolean;
  isDragging: boolean;
  isMouseDown: boolean;
  dragTravelDistance: number;
  previousCenter: SerializedPoint | null;
  touchIdentifier: number | null;
  previousLocation: SerializedPoint | null;
  delta: SerializedPoint | null;
  previousDelta: SerializedPoint | null;
  handlers: Record<EventType, EventHandler[]>;
}

export interface EventManagerApi {
  onTap: (handler: EventHandler) => void;
  offTap: (handler: EventHandler) => void;
  onMove: (handler: EventHandler) => void;
  offMove: (handler: EventHandler) => void;
  onMoveEnd: (handler: EventHandler) => void;
  offMoveEnd: (handler: EventHandler) => void;
  onPinch: (handler: EventHandler) => void;
  offPinch: (handler: EventHandler) => void;
}

/**
 * React hook for managing interactive events on elements (tap, move, pinch)
 * @param elementRef - React ref to the DOM element to attach events to
 * @param debug - Whether to log debug information
 * @returns Object with methods to attach event handlers
 */
function useEventManager(elementRef: React.RefObject<Element>, debug = false): EventManagerApi {
  // Use a ref to hold mutable state that persists between renders
  // but doesn't cause re-renders when it changes
  const stateRef = useRef<EventManagerState>({
    currentTouches: [],
    startDistance: 0,
    scale: 1,
    previousScale: 1,
    isClick: false,
    isDragging: false,
    isMouseDown: false,
    previousCenter: null,
    touchIdentifier: null,
    previousLocation: null,
    delta: null,
    previousDelta: null,
    dragTravelDistance: 0,
    handlers: {
      tap: [],
      move: [],
      moveEnd: [],
      pinch: [],
    },
  });

  /**
   * Helper to log debug information
   */
  const debugEvent = useCallback(
    (e: TouchEvent | MouseEvent) => {
      if (debug && elementRef.current) {
        const elementName = elementRef.current.id || elementRef.current.tagName;
        console.log(`${elementName} event:`, e);
      }
    },
    [debug, elementRef],
  );

  /**
   * Registers an event handler for a specific event type
   */
  const addHandler = useCallback((eventType: EventType, fn: EventHandler) => {
    stateRef.current.handlers[eventType].push(fn);
  }, []);

  /**
   * Removes an event handler from a specific event type
   */
  const removeHandler = useCallback((eventType: EventType, fn: EventHandler) => {
    const handlers = stateRef.current.handlers[eventType];
    const index = handlers.indexOf(fn);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
  }, []);

  /**
   * Triggers all handlers for a specific event type
   */
  const callHandler = useCallback((eventType: EventType, event: CustomEvent) => {
    if (stateRef.current.handlers[eventType].length) {
      for (const fn of stateRef.current.handlers[eventType]) {
        fn(event);
      }
    }
  }, []);

  /**
   * Calculates distance between two touch points
   */
  const calculateDistance = useCallback((touch1: Touch | TinyTouch, touch2: Touch | TinyTouch) => {
    const first = { x: touch1.pageX, y: touch1.pageY };
    const second = { x: touch2.pageX, y: touch2.pageY };
    const a = Math.abs(first.x - second.x);
    const b = Math.abs(first.y - second.y);
    return Math.sqrt(a ** 2 + b ** 2);
  }, []);

  /**
   * Sets the starting distance for pinch calculations
   */
  const setStartDistance = useCallback(() => {
    const { currentTouches } = stateRef.current;
    if (currentTouches.length >= 2) {
      const [first, second] = currentTouches;
      stateRef.current.startDistance = calculateDistance(first, second);
    }
  }, [calculateDistance]);

  /**
   * Extract relevant touch/mouse event details
   */
  const getEvent = useCallback((e: TouchEvent | MouseEvent): Touch | MouseEvent | null => {
    const { touchIdentifier } = stateRef.current;

    if (window.TouchEvent && e instanceof TouchEvent) {
      if (touchIdentifier === null) return null;

      let event = Array.from(e.touches).find((t: Touch) => t.identifier === touchIdentifier);

      if (!event) {
        event = Array.from(e.changedTouches).find((t: Touch) => t.identifier === touchIdentifier);
      }

      return event || null;
    }
    return e as MouseEvent;
  }, []);

  /**
   * Handle pinch start event
   */
  const handlePinchStart = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      const touches = e.changedTouches;

      for (const touch of Array.from(touches)) {
        const { identifier, pageX, pageY } = touch;
        stateRef.current.currentTouches.push({ identifier, pageX, pageY });
      }

      setStartDistance();
    },
    [setStartDistance],
  );

  /**
   * Handle pinch end event
   */
  const handlePinchEnd = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();

      for (const finishedTouch of Array.from(e.changedTouches)) {
        const idx = stateRef.current.currentTouches.findIndex(
          (t: TinyTouch) => t.identifier === finishedTouch.identifier,
        );

        if (idx !== -1) {
          stateRef.current.currentTouches.splice(idx, 1);
        }
      }

      setStartDistance();

      if (stateRef.current.currentTouches.length < 2) {
        stateRef.current.previousScale = stateRef.current.scale;
      }

      stateRef.current.previousCenter = null;
    },
    [setStartDistance],
  );

  /**
   * Handle pinch cancel event
   */
  const handlePinchCancel = useCallback((e: TouchEvent) => {
    e.preventDefault();
    // Reset state similar to pinch end
    stateRef.current.currentTouches = [];
    stateRef.current.previousCenter = null;
  }, []);

  /**
   * Handle pinch move event
   */
  const handlePinchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      if (e.changedTouches.length < 2) return;

      const { currentTouches, previousScale, previousCenter } = stateRef.current;
      const touches: Touch[] = Array.from(e.touches);

      // Find the first two touch points based on our stored identifiers
      if (currentTouches.length < 2) return;

      const first = touches.find((t: Touch) => t.identifier === currentTouches[0].identifier);

      const second = touches.find((t: Touch) => t.identifier === currentTouches[1].identifier);

      if (!first || !second) return;

      const newDistance = calculateDistance(first, second);
      const newScale = (previousScale * newDistance) / stateRef.current.startDistance;
      stateRef.current.scale = newScale;

      const center: SerializedPoint = {
        x: (first.pageX + second.pageX) / 2,
        y: (first.pageY + second.pageY) / 2,
      };

      if (!previousCenter) {
        stateRef.current.previousCenter = center;
        return;
      }

      const customEvent = new CustomEvent("pinch", {
        detail: {
          x: center.x,
          y: center.y,
          scale: newScale,
          delta: {
            x: center.x - previousCenter.x,
            y: center.y - previousCenter.y,
          },
        },
      });

      callHandler("pinch", customEvent);
      stateRef.current.previousCenter = center;
    },
    [calculateDistance, callHandler],
  );

  /**
   * Handle mousedown/touchstart event
   */
  const handleMouseDown = useCallback(
    (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      debugEvent(e);

      // Ignore multiple touches
      if (window.TouchEvent && e instanceof TouchEvent && e.touches.length > 1) return;

      // Setup global event listeners
      if ("ontouchstart" in window) {
        window.addEventListener("touchmove", handleMouseMove);
        window.addEventListener("touchend", handleMouseUp);
      } else {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      }

      stateRef.current.isMouseDown = true;
      stateRef.current.isClick = true;
      stateRef.current.dragTravelDistance = 0;
      if (window.TouchEvent && e instanceof TouchEvent && e.changedTouches?.[0]) {
        stateRef.current.touchIdentifier = e.changedTouches[0].identifier;
      }
    },
    [debugEvent],
  );

  /**
   * Handle mousemove/touchmove event
   */
  const handleMouseMove = useCallback(
    (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (window.TouchEvent && e instanceof TouchEvent && e.touches.length > 1) return;
      if (!stateRef.current.isMouseDown) return;

      debugEvent(e);

      const touchOrClick = getEvent(e);
      if (!touchOrClick) return;

      const { previousLocation } = stateRef.current;

      if (!previousLocation) {
        stateRef.current.previousLocation = {
          x: touchOrClick.pageX,
          y: touchOrClick.pageY,
        };
        return;
      }

      const delta = {
        x: touchOrClick.pageX - previousLocation.x,
        y: touchOrClick.pageY - previousLocation.y,
      };

      stateRef.current.delta = delta;
      stateRef.current.dragTravelDistance += Math.abs(Math.sqrt(delta.x ** 2 + delta.y ** 2));

      // if (Math.abs(delta.x) <= 2 && Math.abs(delta.y) <= 2) {
      //   stateRef.current.isClick = true;

      //   return;
      // }

      stateRef.current.isDragging = true;
      stateRef.current.isClick = false;

      const customEvent = new CustomEvent("move", {
        detail: {
          x: touchOrClick.pageX,
          y: touchOrClick.pageY,
          delta,
        },
      });

      stateRef.current.previousLocation = {
        x: touchOrClick.pageX,
        y: touchOrClick.pageY,
      };

      callHandler("move", customEvent);
    },
    [debugEvent, getEvent, callHandler],
  );

  /**
   * Handle mouseup/touchend event
   */
  const handleMouseUp = useCallback(
    (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Remove global event listeners
      if ("ontouchstart" in window) {
        window.removeEventListener("touchmove", handleMouseMove);
        window.removeEventListener("touchend", handleMouseUp);
      } else {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      }

      // Ignore 2nd, 3rd, etc. fingers' 'touchend'
      if (window.TouchEvent && e instanceof TouchEvent && e.touches.length > 1) return;
      if (!stateRef.current.isMouseDown) return;

      debugEvent(e);

      // Reset tracking state
      stateRef.current.isMouseDown = false;
      stateRef.current.previousLocation = null;

      const event = getEvent(e);
      if (!event) return;

      const { isDragging, delta, dragTravelDistance } = stateRef.current;
      const isClick = dragTravelDistance <= 10;

      // Handle tap event
      if (isClick) {
        const customEvent = new CustomEvent("tap", {
          detail: {
            x: event.pageX,
            y: event.pageY,
          },
        });
        callHandler("tap", customEvent);
      }

      // Handle moveEnd event
      if (isDragging && !isClick && delta) {
        const customEvent = new CustomEvent("moveEnd", {
          detail: {
            x: event.pageX,
            y: event.pageY,
            delta,
          },
        });
        callHandler("moveEnd", customEvent);
      }

      // Reset dragging state
      stateRef.current.delta = stateRef.current.previousDelta = { x: 0, y: 0 };
      stateRef.current.isClick = false;
      stateRef.current.isDragging = false;
    },
    [debugEvent, getEvent, callHandler, handleMouseMove],
  );

  /**
   * Setup event listeners when component mounts
   * and remove them when component unmounts
   */
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Setup basic mouse/touch events
    const setupBasicEvents = () => {
      if ("ontouchstart" in window) {
        element.addEventListener("touchstart", handleMouseDown);
      } else {
        element.addEventListener("mousedown", handleMouseDown);
      }
    };

    // Setup pinch events
    const setupPinchEvents = () => {
      if ("ontouchstart" in window) {
        element.addEventListener("touchstart", handlePinchStart);
        element.addEventListener("touchend", handlePinchEnd);
        element.addEventListener("touchcancel", handlePinchCancel);
        element.addEventListener("touchmove", handlePinchMove);
      }
    };

    // Setup initial events
    setupBasicEvents();

    // Set up debug name
    if (debug) {
    }

    // Cleanup function
    return () => {
      // Remove all event listeners
      if ("ontouchstart" in window) {
        element.removeEventListener("touchstart", handleMouseDown);
        element.removeEventListener("touchstart", handlePinchStart);
        element.removeEventListener("touchend", handlePinchEnd);
        element.removeEventListener("touchcancel", handlePinchCancel);
        element.removeEventListener("touchmove", handlePinchMove);
        window.removeEventListener("touchmove", handleMouseMove);
        window.removeEventListener("touchend", handleMouseUp);
      } else {
        element.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [
    elementRef,
    debug,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handlePinchStart,
    handlePinchEnd,
    handlePinchCancel,
    handlePinchMove,
  ]);

  // API for registering event handlers
  const onTap = useCallback(
    (fn: EventHandler) => {
      addHandler("tap", fn);
    },
    [addHandler],
  );

  const offTap = useCallback(
    (fn: EventHandler) => {
      removeHandler("tap", fn);
    },
    [removeHandler],
  );

  const onMove = useCallback(
    (fn: EventHandler) => {
      addHandler("move", fn);
    },
    [addHandler],
  );

  const offMove = useCallback(
    (fn: EventHandler) => {
      removeHandler("move", fn);
    },
    [removeHandler],
  );

  const onMoveEnd = useCallback(
    (fn: EventHandler) => {
      addHandler("moveEnd", fn);
    },
    [addHandler],
  );

  const offMoveEnd = useCallback(
    (fn: EventHandler) => {
      removeHandler("moveEnd", fn);
    },
    [removeHandler],
  );

  const onPinch = useCallback(
    (fn: EventHandler) => {
      // Setup pinch events if not already set up
      if (elementRef.current && "ontouchstart" in window) {
        elementRef.current.addEventListener("touchstart", handlePinchStart);
        elementRef.current.addEventListener("touchend", handlePinchEnd);
        elementRef.current.addEventListener("touchcancel", handlePinchCancel);
        elementRef.current.addEventListener("touchmove", handlePinchMove);
      }
      addHandler("pinch", fn);
    },
    [elementRef, addHandler, handlePinchStart, handlePinchEnd, handlePinchCancel, handlePinchMove],
  );

  const offPinch = useCallback(
    (fn: EventHandler) => {
      removeHandler("pinch", fn);
    },
    [removeHandler],
  );

  return {
    onTap,
    offTap,
    onMove,
    offMove,
    onMoveEnd,
    offMoveEnd,
    onPinch,
    offPinch,
  };
}

export default useEventManager;
