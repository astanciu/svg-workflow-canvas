import React, { useEffect } from "react";
import type { CanvasEventsProps } from "../../types";

/**
 * Manages canvas event handlers
 */
const CanvasEvents: React.FC<CanvasEventsProps> = ({
  eventManager,
  handleTap,
  handleMove,
  handleMoveEnd,
  handlePinch,
  cancelAnimation,
}) => {
  // Set up event handlers
  useEffect(() => {
    if (!eventManager) return;

    eventManager.onTap(handleTap);
    eventManager.onMove(handleMove);
    eventManager.onMoveEnd(handleMoveEnd);
    eventManager.onPinch(handlePinch);

    // Cleanup
    return () => {
      eventManager.offTap(handleTap);
      eventManager.offMove(handleMove);
      eventManager.offMoveEnd(handleMoveEnd);
      eventManager.offPinch(handlePinch);

      cancelAnimation();
    };
  }, [eventManager, handleTap, handleMove, handleMoveEnd, handlePinch, cancelAnimation]);

  return null;
};

export default CanvasEvents;
