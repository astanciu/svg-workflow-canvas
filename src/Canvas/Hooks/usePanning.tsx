import { useState, useRef, useCallback } from "react";
import type { ViewType } from "../Types";

interface UsePanningProps {
  initialView: ViewType;
}

/**
 * Hook to manage canvas panning
 * Handles moving the canvas and momentum scrolling
 */
const usePanning = ({ initialView }: UsePanningProps) => {
  const [view, setView] = useState<ViewType>(initialView);
  const velocityRef = useRef({ x: 0, y: 0 });
  const frictionRef = useRef(1);
  const animationFrameRef = useRef<number>();

  // Update the view state
  const updateView = useCallback((newViewData: Partial<ViewType>) => {
    setView((prev) => ({ ...prev, ...newViewData }));
  }, []);

  // Handle movement events
  const handleMove = useCallback((e: Event) => {
    const customEvent = e as CustomEvent;

    // Add the delta to the current view position
    setView((prev) => ({
      ...prev,
      x: prev.x + customEvent.detail.delta.x,
      y: prev.y + customEvent.detail.delta.y,
    }));
  }, []);

  // Handle the end of a movement (start glide animation)
  const handleMoveEnd = useCallback((e: Event) => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    const customEvent = e as CustomEvent;
    velocityRef.current = customEvent.detail.delta;
    frictionRef.current = 0.85;

    animationFrameRef.current = requestAnimationFrame(glideCanvas);
  }, []);

  // Physics-based animation for momentum scrolling
  const glideCanvas = useCallback(() => {
    frictionRef.current -= 0.01;
    if (frictionRef.current < 0.01) frictionRef.current = 0.01;

    velocityRef.current = {
      x: velocityRef.current.x * frictionRef.current,
      y: velocityRef.current.y * frictionRef.current,
    };

    // Stop the animation if the velocity is very low
    if (
      velocityRef.current.x < 0.02 &&
      velocityRef.current.x > -0.02 &&
      velocityRef.current.y < 0.02 &&
      velocityRef.current.y > -0.02
    ) {
      frictionRef.current = 1.0;
      return;
    }

    setView((prev) => ({
      ...prev,
      x: prev.x + velocityRef.current.x,
      y: prev.y + velocityRef.current.y,
    }));

    animationFrameRef.current = requestAnimationFrame(glideCanvas);
  }, []);

  // Utility to cancel any running animations
  const cancelAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  return {
    view,
    updateView,
    handleMove,
    handleMoveEnd,
    cancelAnimation,
  };
};

export default usePanning;
