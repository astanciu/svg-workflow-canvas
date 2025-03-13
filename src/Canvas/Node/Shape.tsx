import React, { type FunctionComponent } from "react";
import Icon from "../Icon/Icon";
import type { Node } from "../../types";
import styles from "./Node.module.scss";
import { InPort, OutPort } from "./Ports";

export type ShapeProps = {
  node: Node;
  selected: boolean;
  unselected: boolean;
  dragging: boolean;
  onConnectionDrag: (node: Node, e: CustomEvent) => void;
  onConnectionEnd: (node: Node) => void;
  connectionCandidate: boolean;
};

export const Shape: FunctionComponent<ShapeProps> = ({
  node,
  selected,
  unselected,
  dragging,
  onConnectionDrag,
  onConnectionEnd,
  connectionCandidate,
}) => {
  let nodeClass = styles.normal;
  let nodeOutline = styles.normalOutline;
  let nodeIconClass = styles.normalIcon;

  if (unselected) {
    nodeClass = styles.unselected;
    nodeOutline = styles.unselectedOutline;
    nodeIconClass = styles.unselectedIcon;
  }

  if (selected) {
    nodeClass = styles.selected;
    nodeOutline = styles.selectedOutline;
    nodeIconClass = styles.selectedIcon;
  }

  // Apply grabbing cursor class if node is actively being dragged
  if (dragging) {
    nodeClass += ` ${styles.dragging}`;
    nodeIconClass += ` ${styles.dragging}`;
  }

  return (
    <>
      <g
        id="Hexagons"
        transform={`translate(-${
          (node.width * node.scale) / 2
        }, -${(node.height * node.scale) / 2}) scale(${node.scale})`}
      >
        {/* {selected && <polygon
          className={nodeOutline}
          strokeWidth="1"
          points="40 0 74.6410162 19.75 74.6410162 59.25 40 79 5.35898385 59.25 5.35898385 19.75"
        />} */}
        <polygon
          className={nodeClass}
          points="40 5 70.3108891 22.25 70.3108891 56.75 40 74 9.68911087 56.75 9.68911087 22.25"
        />
      </g>

      <Icon icon={node.icon} className={nodeIconClass} size={28 * node.scale} />

      <g id="Ports" transform={`translate(${0},${0})`}>
        <OutPort
          node={node}
          onConnectionDrag={onConnectionDrag}
          onConnectionEnd={onConnectionEnd}
          unselected={unselected}
        />
        <InPort node={node} highlight={connectionCandidate} unselected={unselected} />
      </g>
    </>
  );
};
