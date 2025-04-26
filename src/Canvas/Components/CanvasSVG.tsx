import React from "react";
import styles from "../Canvas.module.scss";
import type { CanvasSVGProps } from "../../types";
import { CanvasBackground, CanvasContent } from ".";

/**
 * Main SVG container component for the canvas
 */
const CanvasSVG: React.FC<CanvasSVGProps & { children?: React.ReactNode }> = ({
  view,
  svgRef,
  handleWheel,
  visibility,
  children,
}) => {
  // Calculate the transform value based on current view
  const transformValue = `matrix(${view.scale},0,0,${view.scale},${view.x},${view.y})`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={view.width}
      height={view.height}
      onWheel={handleWheel}
      className={styles.Canvas}
      id="svgCanvas"
      ref={svgRef}
      style={{ visibility: visibility as "visible" | "hidden" }}
      aria-label="Interactive workflow canvas"
      role="application"
    >
      <CanvasBackground />
      <CanvasContent transform={transformValue} />
      {children}
    </svg>
  );
};

export default CanvasSVG;
