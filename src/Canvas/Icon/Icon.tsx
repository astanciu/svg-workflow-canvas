import React from 'react';
import { IconLibrary } from '../Assets/icon-library';
import styles from './Icon.module.scss';

type IconProps = {
  icon: string;
  className?: string;
  size: number;
};

const Icon = React.memo((props: IconProps) => {
  const size = props.size;
  const offsetX = -(size / 2);
  const offsetY = -(size / 2);
  const iconData = IconLibrary[props.icon] || IconLibrary.cog;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={props.className || styles.Icon}
      x={offsetX}
      y={offsetY}
      width={`${size}`}
      height={`${size}`}
      viewBox={`${iconData.viewbox}`}
    >
      <path d={`${iconData.path}`}></path>
    </svg>
  );
});

export default Icon;
