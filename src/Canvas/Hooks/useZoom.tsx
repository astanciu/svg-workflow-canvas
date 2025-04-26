import { useCallback, useRef } from "react";
import type { ViewType, ScaleConstraints } from "../Types";

interface UseZoomProps {
  constraints: ScaleConstraints;
  onViewChange: (view: Partial<ViewType>) => void;
  view: ViewType;
}

/**
 * Hook to manage canvas zooming
 * Handles wheel zoom, pinch zoom, and zoom animations
 */
const useZoom = ({ constraints, onViewChange, view }: UseZoomProps) => {
  const animationFrameRef = useRef<number>();

  // Set scale while maintaining position relative to a specific point
  const setScaleWithLocation = useCallback(
    (scale: number, location: { x: number; y: number }) => {
      let newScale = scale;

      // Apply constraints
      if (newScale < constraints.min) {
        newScale = constraints.min;
      } else if (newScale > constraints.max) {
        newScale = constraints.max;
      }

      const xFactor = newScale / view.scale - 1;
      const posDelta = {
        x: location.x - view.x,
        y: location.y - view.y,
      };

      onViewChange({
        scale: newScale,
        x: view.x + -1 * posDelta.x * xFactor,
        y: view.y + -1 * posDelta.y * xFactor,
      });
    },
    [constraints, view.scale, view.x, view.y, onViewChange],
  );

  // Handle mouse wheel events for zooming
  const handleWheel = useCallback(
    (event: React.WheelEvent) => {
      const size = event.deltaY;
      if (Number.isNaN(size) || !size) return;

      const scale = view.scale + (-1 * size) / 200;
      const center = {
        x: event.clientX,
        y: event.clientY,
      };

      setScaleWithLocation(scale, center);
    },
    [view.scale, setScaleWithLocation],
  );

  // Handle pinch events for zooming (from touch gestures)
  const handlePinch = useCallback(
    (e: Event) => {
      const customEvent = e as CustomEvent;
      const center = { x: customEvent.detail.x, y: customEvent.detail.y };
      setScaleWithLocation(customEvent.detail.scale, center);
    },
    [setScaleWithLocation],
  );

  // Animated zoom-to-fit function
  const zoomToFit = useCallback(() => {
    const ease = (t: number) => t * (2 - t);
    const start = 2;
    const end = 1;
    const duration = 15; // animation frames
    const t = animationFrameRef.current || 1;

    if (view.scale <= end) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const delta = (end - start) * ease(t / duration);

    onViewChange({
      scale: start + delta,
    });

    animationFrameRef.current = requestAnimationFrame(zoomToFit);
  }, [view.scale, onViewChange]);

  return {
    handleWheel,
    handlePinch,
    zoomToFit,
  };
};

export default useZoom;
