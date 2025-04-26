import React from "react";
import { Icon } from "svg-workflow-canvas";
import styles from "./Buttons.module.scss";

type Props = {
  icon: string;
  tooltip: string;
  enabled: boolean;
  onClick: () => void;
};

export const ButtonToggle = React.memo(({ icon, tooltip, enabled, onClick }: Props) => {
  const buttonClass = enabled ? styles.ToggleButtonOn : styles.ToggleButtonOff;
  const iconClass = enabled ? styles.IconOn : styles.IconOff;
  return (
    <div className={buttonClass} onClick={onClick}>
      <Icon icon={icon} size={20} className={iconClass} />
    </div>
  );
});
