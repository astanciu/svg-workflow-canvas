import React from "react";
import { IconLibrary } from "../Assets/icon-library";
import styles from "./Icon.module.scss";

interface IconProps {
  icon: string;
  className?: string;
  size: number;
}

const Icon: React.FC<IconProps> = React.memo(({ icon, className, size }) => {
  const offsetX = -(size / 2);
  const offsetY = -(size / 2);
  const iconData = IconLibrary[icon] || IconLibrary.cog;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className || styles.Icon}
      x={offsetX}
      y={offsetY}
      width={size}
      height={size}
      viewBox={iconData.viewbox}
      aria-label={`${icon} icon`}
      role="img"
    >
      <path d={iconData.path} />
    </svg>
  );
});

Icon.displayName = "Icon";

export default Icon;
