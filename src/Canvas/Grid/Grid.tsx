import React, { useMemo } from "react";
import styles from "./Grid.module.scss";
import { useCanvas } from "../CanvasContext";

interface GridProps {
  show: boolean;
}

/**
 * Grid component renders the background grid pattern
 * Shows a small grid and a larger grid pattern
 */
const Grid: React.FC<GridProps> = ({ show }) => {
  // Constants for grid dimensions
  const SIZE = 100000;
  const SMALL_SPACING = 50;
  const BIG_SPACING = 250;

  // Creating the grid pattern with SVG patterns
  const gridPattern = useMemo(
    () => (
      <>
        <pattern id="smallGrid" width={SMALL_SPACING} height={SMALL_SPACING} patternUnits="userSpaceOnUse">
          <path className={styles.small} d={`M ${SMALL_SPACING} 0 L 0 0 0 ${SMALL_SPACING}`} fill="none" />
        </pattern>
        <pattern id="bigGrid" width={BIG_SPACING} height={BIG_SPACING} patternUnits="userSpaceOnUse">
          <rect width={BIG_SPACING} height={BIG_SPACING} fill="url(#smallGrid)" />
          <path className={styles.big} d={`M ${BIG_SPACING} 0 L 0 0 0 ${BIG_SPACING}`} fill="none" />
        </pattern>
      </>
    ),
    [],
  );

  // Don't render anything if grid is hidden
  if (!show) {
    return null;
  }

  return (
    <g id="Grid" className="grid" data-testid="canvas-grid">
      <defs>{gridPattern}</defs>
      <rect x={-1 * SIZE} y={-1 * SIZE} width={SIZE * 2} height={SIZE * 2} fill="url(#bigGrid)" />
    </g>
  );
};

// Use memo to prevent unnecessary re-renders
export default React.memo(Grid);
