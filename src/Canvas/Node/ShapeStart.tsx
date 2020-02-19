import React, { FunctionComponent } from 'react';
import Icon from '../Icon/Icon';
import { Node } from '../Models/Node';
import styles from './Node.module.scss';
import { OutPort } from './Ports';

export type ShapeProps = {
  node: Node;
  selected: boolean;
  unselected: boolean;
  dragging: boolean;
  onConnectionDrag: () => void;
  onConnectionEnd: () => void;
  connectionCandidate: boolean;
};

export const ShapeStart: FunctionComponent<ShapeProps> = ({
  node,
  unselected,
  onConnectionDrag,
  onConnectionEnd
}) => {
  const className = unselected ? styles.unselectedStart : styles.start;

  return (
    <>
      <g
        id="Hexgons"
        transform={`translate(-${(node.width * node.scale * 0.8) /
          2}, -${(node.height * node.scale * 0.8) / 2}) scale(${node.scale *
          0.8})`}
      >
        <polygon
          className={className}
          points="40 5 70.3108891 22.25 70.3108891 56.75 40 74 9.68911087 56.75 9.68911087 22.25"
        />
      </g>

      <Icon
        icon={node.icon}
        className={styles.specialIcon}
        size={28 * node.scale * 0.9}
      />

      <g id="Ports" transform={`translate(${0},${0})`}>
        <OutPort
          node={node}
          onConnectionDrag={onConnectionDrag}
          onConnectionEnd={onConnectionEnd}
          unselected={unselected}
        />
      </g>
    </>
  );
};
