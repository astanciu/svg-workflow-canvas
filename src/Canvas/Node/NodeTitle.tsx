import React, { useEffect, useState } from "react";
import styles from "./NodeTitle.module.scss";

type TitleProps = {
  name: string;
};

export const NodeTitle = ({ node, unselected }) => {
  const [className, setClass] = useState(unselected ? styles.UnselectedTitle : styles.Title);
  const [labelClass, setLabel] = useState(unselected ? styles.unselectedLabel : styles.label);
  // // Ugh, this is so dumb, but there's a rendering bug with Safari
  // // where the 'paint-order' isn't being respected on first render. This trick causes
  // // it to re-draw which causes the text outline to show up properly.
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setClass(className + ' ' + styles.TitleHack);
  //   }, 100);
  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    setClass(unselected ? styles.UnselectedTitle : styles.Title);
    setLabel(unselected ? styles.unselectedLabel : styles.label);
  }, [unselected]);

  const x = 0;
  const y = 58 * node.scale;
  const fontSize = 12 * node.scale;

  // if (["START", "END"].includes(node.id)) {
  //   node.name = node.id.toLowerCase();
  // }

  const labelHeight = 18;
  const labelWidth = node.name.length * 7 + 30;
  const labelX = x - labelWidth / 2;
  const labelY = y - 12;
  const radius = 10;

  return (
    <g>
      <rect
        x={labelX}
        y={labelY}
        rx={radius}
        ry={radius}
        width={labelWidth}
        height={labelHeight}
        className={labelClass}
      />
      <text x={x} y={y} className={className} fontSize={`${fontSize}`} textAnchor="middle">
        {node.name}
      </text>
    </g>
  );
};
