import React, { useEffect } from "react";
import type { CanvasInitializationProps } from "../../types";

/**
 * Handles initial canvas setup and visibility
 */
const CanvasInitialization: React.FC<CanvasInitializationProps> = ({ updateView, setVisibility }) => {
  useEffect(() => {
    try {
      // Initialize view for larger screens
      updateView({
        width: window.innerWidth,
        height: window.innerHeight - 56,
        x: window.innerWidth / 2,
        y: (window.innerHeight - 56) / 2,
        scale: 1,
      });

      // Set up visibility with a slight delay
      const visibilityTimeout = setTimeout(() => {
        setVisibility("visible");
      }, 100);

      // Cleanup
      return () => {
        clearTimeout(visibilityTimeout);
      };
    } catch (error) {
      console.error("Error initializing canvas:", error);
    }
    return void 0;
  }, [updateView, setVisibility]);

  return null;
};

export default CanvasInitialization;
