import React from 'react';

// import styles from './Icon.module.scss';

type Props = {};

const CanvasButton = React.memo((props: Props) => {
  return (
    <g>
      <rect x="70" y="10" height="50" width="50" rx="10" ry="10" />
    </g>
  );
});

export default CanvasButton;
