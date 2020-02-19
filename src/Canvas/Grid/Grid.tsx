import React from 'react';
import styles from './Grid.module.css';

export default ({ show }) => {
  const SIZE = 100000;
  const SMALL_SPACING = 50;
  const BIG_SPACING = 250;

  const gridPattern = (
    <React.Fragment>
      <pattern
        id="smallGrid"
        width={SMALL_SPACING}
        height={SMALL_SPACING}
        patternUnits="userSpaceOnUse"
      >
        <path
          className={styles.small}
          d={`M ${SMALL_SPACING} 0 L 0 0 0 ${SMALL_SPACING}`}
          fill="none"
          stroke="#eee"
        />
      </pattern>
      <pattern
        id="bigGrid"
        width={BIG_SPACING}
        height={BIG_SPACING}
        patternUnits="userSpaceOnUse"
      >
        <rect width={BIG_SPACING} height={BIG_SPACING} fill="url(#smallGrid)" />
        <path
          className={styles.big}
          d={`M ${BIG_SPACING} 0 L 0 0 0 ${BIG_SPACING}`}
          fill="none"
        />
      </pattern>
    </React.Fragment>
  );

  if (!show) {
    return null;
  }

  return (
    <g id="Grid" className="grid">
      <defs>{gridPattern}</defs>
      <rect
        x={-1 * SIZE}
        y={-1 * SIZE}
        width={SIZE * 2}
        height={SIZE * 2}
        fill={`url(#bigGrid)`}
      />
    </g>
  );
};
