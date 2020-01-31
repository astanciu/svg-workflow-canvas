import React from 'react';
import styles from './NodeTitle.module.css';

type TitleProps = {
  name: string;
};

export const NodeTitle = ({ node, unselected }) => {
  const className = unselected ? styles.UnselectedTitle : styles.Title;

  const x = 0;
  const y = 58 * node.scale;
  const fontSize = 12 * node.scale;
  return (
    <text x={x} y={y} className={className} fontSize={`${fontSize}`} textAnchor="middle">
      {node.name}
    </text>
  );
};
