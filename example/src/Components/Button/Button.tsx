import React from "react";
import { Icon } from "svg-workflow-canvas";
import styles from "./Buttons.module.scss";

type Props = {
  icon: string;
  tooltip: string;
  enabled: boolean;
  onClick: () => void;
};

export const Button = React.memo(({ icon, tooltip, onClick }: Props) => {
  return (
    <div className={styles.Button} onClick={onClick}>
      <Icon icon={icon} size={20} className={styles.Icon} />
    </div>
  );
});
