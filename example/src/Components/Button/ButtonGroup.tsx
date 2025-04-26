import React, { type FunctionComponent } from "react";
import styles from "./Buttons.module.scss";

type Props = {};

const fn: FunctionComponent<Props> = ({ children }) => {
  return <div className={styles.Group}>{children}</div>;
};

export const ButtonGroup = React.memo(fn);
