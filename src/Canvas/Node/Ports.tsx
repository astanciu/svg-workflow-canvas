import React, { useEffect, useRef } from "react";
import type { Node } from "../Models";
import useEventManager from "../Util/useEventManager";
import styles from "./Port.module.scss";

type InPortProps = {
  node: Node;
  unselected: boolean;
  highlight: boolean;
};

export const InPort = React.memo(({ node, unselected, highlight }: InPortProps) => {
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
});

type OutPortProps = {
  node: Node;
  unselected: boolean;
  onConnectionDrag: (node: Node, e: CustomEvent) => void;
  onConnectionEnd: (node: Node) => void;
};

export const OutPort = React.memo(({ node, unselected, onConnectionDrag, onConnectionEnd }: OutPortProps) => {
  const nodeDomRef = useRef(null);
  const nodeRef = useRef(node);

  // Use the new hook instead of creating a new EventManager instance directly
  const eventManager = useEventManager(nodeDomRef, false);

  useEffect(() => {
    // Register event handlers
    const handleMove = (e: CustomEvent) => {
      e.stopPropagation();
      onConnectionDrag(nodeRef.current, e);
    };

    const handleMoveEnd = () => {
      onConnectionEnd(nodeRef.current);
    };

    eventManager.onMove(handleMove);
    eventManager.onMoveEnd(handleMoveEnd);

    // Cleanup function to unregister the events
    return () => {
      eventManager.offMove(handleMove);
      eventManager.offMoveEnd(handleMoveEnd);
    };
  }, [eventManager, onConnectionDrag, onConnectionEnd]);

  useEffect(() => {
    nodeRef.current = node;
  });

  return (
    <g ref={nodeDomRef}>
      <circle className={styles.PortHitBox} cx={node.outPortOffset.x} cy={node.outPortOffset.y} r={20 * node.scale} />
      <circle
        className={unselected ? styles.PortUnselected : styles.Port}
        cx={node.outPortOffset.x}
        cy={node.outPortOffset.y}
        r={4 * node.scale}
      />
    </g>
  );
});
