import isEqual from "lodash/isEqual";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Node, Point } from "../Models";
import useEventManager from "../Util/useEventManager";
import { NodeTitle } from "./NodeTitle";
import { Shape } from "./Shape";
import { ShapeEnd } from "./ShapeEnd";
import { ShapeStart } from "./ShapeStart";

interface NodeProps {
  node: Node;
  updateNode: (node: Node) => void;
  selectedNode: Node | null;
  selectNode: (node: Node | null) => void;
  canvasView: {
    scale: number;
  };
  onConnectionDrag: (node: Node, e: CustomEvent) => void;
  onConnectionEnd: (node: Node) => void;
  snapToGrid: boolean;
  connectionCandidate: boolean;
}

const NodeComponent: React.FC<NodeProps> = React.memo(
  ({
    node,
    updateNode,
    selectedNode,
    selectNode,
    canvasView,
    onConnectionDrag,
    onConnectionEnd,
    snapToGrid = true,
    connectionCandidate,
  }) => {
    const [, forceUpdate] = useState<number>(0);
    const nodeRef = useRef<SVGGElement>(null);
    const draggingRef = useRef<boolean>(false);

    const eventManager = useEventManager(nodeRef, false);

    const snapNodeToGrid = useCallback(() => {
      if (!snapToGrid) {
        // If not snapping to grid, still force a re-render to update UI
        forceUpdate(Math.random());
        return;
      }

      const updatedNode = new Node(node);
      const hgrid = 100 * 0.5;
      const vgrid = 110 * 0.75;
      const target = {
        x: Math.round(updatedNode.position.x / hgrid) * hgrid,
        y: Math.round(updatedNode.position.y / vgrid) * vgrid,
      };

      updatedNode.position = new Point(target.x, target.y);
      updateNode(updatedNode);

      // // Only update if the position would actually change
      // if (updatedNode.position.x !== target.x || updatedNode.position.y !== target.y) {
      //   updatedNode.position = new Point(target.x, target.y);
      //   updateNode(updatedNode);
      // } else {
      //   // Still force a re-render to update UI state (cursor, etc.)
      //   forceUpdate(Math.random());
      // }
    }, [node, snapToGrid, updateNode]);

    const handleTap = useCallback(
      (e: Event) => {
        e.stopPropagation();
        snapNodeToGrid();

        // Always select the node on tap, the dragging state is reset in handleMoveEnd
        const clonedNode = new Node(node);
        selectNode(clonedNode);
      },
      [node, selectNode, snapNodeToGrid],
    );

    const handleMove = useCallback(
      (e: Event) => {
        e.stopPropagation();
        draggingRef.current = true;

        const clonedNode = node.clone();
        const scaleFactor = canvasView?.scale || 1;
        const customEvent = e as CustomEvent;

        clonedNode.position = new Point(
          clonedNode.position.x + (customEvent.detail.delta.x * 1) / scaleFactor,
          clonedNode.position.y + (customEvent.detail.delta.y * 1) / scaleFactor,
        );

        updateNode(clonedNode);
      },
      [node, canvasView, updateNode],
    );

    const handleMoveEnd = useCallback(() => {
      // Reset dragging state
      draggingRef.current = false;
      // Apply grid snapping
      snapNodeToGrid();

      // Use setTimeout to ensure the dragging state is fully reset
      // This allows the component to receive tap events after dragging
      setTimeout(() => {
        forceUpdate(Math.random());
      }, 0);
    }, [snapNodeToGrid]);

    useEffect(() => {
      eventManager.onTap(handleTap);
      eventManager.onMove(handleMove);
      eventManager.onMoveEnd(handleMoveEnd);

      // Cleanup function to unregister the events
      return () => {
        eventManager.offTap(handleTap);
        eventManager.offMove(handleMove);
        eventManager.offMoveEnd(handleMoveEnd);
      };
    }, [eventManager, handleTap, handleMove, handleMoveEnd]);

    // Only run snapToGrid on first mount or when relevant props change
    // biome-ignore lint/correctness/useExhaustiveDependencies:
    useEffect(() => {
      if (snapToGrid) {
        // Check if position is already aligned to grid to avoid loops
        const hgrid = 100 * 0.5;
        const vgrid = 110 * 0.75;

        const currentX = node.position.x;
        const currentY = node.position.y;

        const gridX = Math.round(currentX / hgrid) * hgrid;
        const gridY = Math.round(currentY / vgrid) * vgrid;

        // Only update if not already aligned to grid
        if (currentX !== gridX || currentY !== gridY) {
          const updatedNode = node.clone();
          updatedNode.position = new Point(gridX, gridY);
          updateNode(updatedNode);
        }
      }
    }, [node.instanceId]); // Only run on node instanceId change, not on position changes

    const getTransform = () => {
      return `translate(${node.position.x},${node.position.y})`;
    };

    const selected = selectedNode ? selectedNode.instanceId === node.instanceId : false;
    const unselected = selectedNode ? selectedNode.instanceId !== node.instanceId : false;

    // Set cursor style based on drag state
    // We use a ref value to determine the current drag state
    const dragStyle = {
      cursor: "grab", // Default cursor shows grab (can drag)
    };

    let ShapeComponent = Shape;
    if (node.id === "START") {
      ShapeComponent = ShapeStart;
    }
    if (node.id === "END") {
      ShapeComponent = ShapeEnd;
    }

    return (
      <g id="Node" transform={getTransform()} style={dragStyle} ref={nodeRef}>
        <ShapeComponent
          node={node}
          selected={selected}
          unselected={unselected}
          dragging={draggingRef.current}
          onConnectionDrag={(node, e) => onConnectionDrag(node, e)}
          onConnectionEnd={(node) => onConnectionEnd(node)}
          connectionCandidate={connectionCandidate}
        />
        {canvasView.scale > 0.7 && <NodeTitle node={node} unselected={unselected} />}
      </g>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison logic
    return isEqual(prevProps, nextProps);
  },
);

NodeComponent.displayName = "NodeComponent";

export default NodeComponent;
