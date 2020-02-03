import React, { useEffect, useState } from 'react';
import styles from './NodeTitle.module.css';

type TitleProps = {
  name: string;
};

export const NodeTitle = ({ node, unselected }) => {

  const [className, setClass] = useState(unselected ? styles.UnselectedTitle : styles.Title)
  // Ugh, this is so dumb, but there's a rendering bug with Safari
  // where the 'paint-order' isn't being respected on first render. This trick causes
  // it to re-draw which causes the text outline to show up properly.
  useEffect(() => {
    const timer = setTimeout(() => {
      setClass(className + ' ' + styles.TitleHack)
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const x = 0;
  let y = 58 * node.scale;
  const fontSize = 12 * node.scale;
  if (node.id === 'START') {
    node.name = 'start'
    y = 48 * node.scale
  }
  if (node.id === 'END') {
    node.name = 'end'
    y = 48 * node.scale
  }

  return (
    <text x={x} y={y} className={className} fontSize={`${fontSize}`} textAnchor="middle">
      {node.name}
    </text>
  );
};
