import { useCallback, useEffect, type RefObject } from "react";
import debounce from "lodash/debounce";
import type { ViewType } from "../../types";

interface UseCanvasSizeProps {
  svgRef: RefObject<SVGSVGElement>;
  onViewChange: (view: Partial<ViewType>) => void;
}

/**
 * Hook to manage canvas sizing
 * Handles resize events and calculates the offset of the canvas
 */
const useCanvasSize = ({ svgRef, onViewChange }: UseCanvasSizeProps) => {
  // Function to update the canvas size
  const setCanvasSize = useCallback(
    debounce(() => {
      if (!svgRef.current) return;

      const parent = svgRef.current.parentElement as HTMLElement;
      const bb = svgRef.current.getBoundingClientRect();

      onViewChange({
        width: parent.offsetWidth,
        height: parent.offsetHeight,
        x: parent.offsetWidth / 2,
        y: parent.offsetHeight / 2,
        offsetTop: bb.top,
        offsetLeft: bb.left,
      });
    }, 50),
    [],
  );

  // Set up event listeners
  useEffect(() => {
    // Initial canvas sizing
    setCanvasSize();

    // Add resize event listeners
    window.addEventListener("resize", setCanvasSize);
    window.addEventListener("orientationchange", () => {
      setTimeout(setCanvasSize, 300);
    });

    // Clean up on unmount
    return () => {
      setCanvasSize.cancel();
      window.removeEventListener("resize", setCanvasSize);
    };
  }, [setCanvasSize]);

  return { setCanvasSize };
};

export default useCanvasSize;
