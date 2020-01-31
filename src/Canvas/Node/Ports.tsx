import React, { useEffect, useRef } from 'react';
import { Node } from '../Models';
import EventManager from '../Util/EventManager';
import styles from './Port.module.css';

type InPortProps = {
  node: Node;
  unselected: boolean;
  highlight: boolean;
};

export const InPort = React.memo(
  ({ node, unselected, highlight }: InPortProps) => {
    let className = styles.Port;
    if (unselected) {
      className = styles.PortUnselected;
    }
    if (highlight) {
      className = styles.PortHighlight;
    }

    return (
      <circle
        className={className}
        cx={node.inPortOffset.x}
        cy={node.inPortOffset.y}
        r={highlight ? 6 * node.scale : 4 * node.scale}
      />
    );
  }
);

type OutPortProps = {
  node: Node;
  unselected: boolean;
  onConnectionDrag: (node: Node, e: Event) => void;
  onConnectionEnd: (node: Node, e: Event) => void;
};

export const OutPort = React.memo(
  ({ node, unselected, onConnectionDrag, onConnectionEnd }: OutPortProps) => {
    let nodeDomRef = useRef(null);
    let nodeRef = useRef(node);

    useEffect(() => {
      const em = new EventManager(nodeDomRef.current, nodeRef.current);
      em.onMove(e => {
        e.stopPropagation();
        onConnectionDrag(nodeRef.current, e);
      });
      em.onMoveEnd(e => {
        e.stopPropagation();
        onConnectionEnd(nodeRef.current, e);
      });

      return () => {
        em.setdown();
      };
    }, [onConnectionDrag, onConnectionEnd]);

    useEffect(() => {
      nodeRef.current = node;
    });

    return (
      <g ref={nodeDomRef}>
        <circle
          className={styles.PortHitBox}
          cx={node.outPortOffset.x}
          cy={node.outPortOffset.y}
          r={20 * node.scale}
        />
        <circle
          className={unselected ? styles.PortUnselected : styles.Port}
          cx={node.outPortOffset.x}
          cy={node.outPortOffset.y}
          r={4 * node.scale}
        />
      </g>
    );
  }
);
