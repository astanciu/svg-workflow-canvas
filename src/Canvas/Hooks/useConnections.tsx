import { useState, useCallback } from "react";
import type { Node, ViewType, ConnectionInProgress } from "../../types";
import { Point } from "../Models";
interface UseConnectionsProps {
  view: ViewType;
  nodes: Node[];
  createConnection: (fromNode: Node, toNode: Node) => void;
}

/**
 * Hook to manage canvas connections
 * Handles finding closest nodes, connection previews, and creating connections
 */
const useConnections = ({ view, nodes, createConnection }: UseConnectionsProps) => {
  const [connectionInProgress, setConnectionInProgress] = useState<ConnectionInProgress | null>(null);
  const [closestNode, setClosestNode] = useState<Node | undefined>(undefined);

  // Convert page coordinates to SVG coordinates
  const convertCoordsToSVG = useCallback(
    (x: number, y: number): Point => {
      return new Point((x - view.x) / view.scale, (y - view.y) / view.scale);
    },
    [view.x, view.y, view.scale],
  );

  // Find the closest node to a given point with an active input port
  const getClosestInPortNode = useCallback(
    (loc: Point): Node | undefined => {
      const minDist: number = 60;
      let closestNode: Node | undefined;
      let closestDist: number = Number.POSITIVE_INFINITY;

      for (const node of nodes) {
        const distToMouse = node.inPortPosition.distanceTo(loc);

        if (distToMouse <= minDist) {
          if (!closestNode) {
            closestNode = node.clone();
            closestDist = distToMouse;
          } else {
            if (distToMouse < closestDist) {
              closestNode = node.clone();
              closestDist = distToMouse;
            }
          }
        }
      }

      return closestNode;
    },
    [nodes],
  );

  // Update the closest node based on mouse position
  const setClosestNodeToMouse = useCallback(
    (mouse: Point, sourceNode: Node): void => {
      const closest = getClosestInPortNode(mouse);
      // Don't allow connecting to self (same node instance)
      if (closest && closest.instanceId === sourceNode.instanceId) {
        setClosestNode(undefined);
      } else {
        setClosestNode(closest);
      }
    },
    [getClosestInPortNode],
  );

  // Handle connection dragging from a node
  const handleConnectionDrag = useCallback(
    (node: Node, e: CustomEvent) => {
      const mousePosition = convertCoordsToSVG(
        e.detail.x - (view?.offsetLeft ?? 0),
        e.detail.y - (view?.offsetTop ?? 0),
      );

      setClosestNodeToMouse(mousePosition, node);

      setConnectionInProgress({
        from: node,
        to: closestNode ? closestNode.inPortPosition : mousePosition,
      });
    },
    [convertCoordsToSVG, view.offsetLeft, view.offsetTop, closestNode, setClosestNodeToMouse],
  );

  // Handle connection creation when dragging ends
  const handleConnectionEnd = useCallback(
    (node: Node) => {
      // Only create connection if we have a valid target node
      // and it's not the same as the source node (prevent self-connections)
      if (closestNode && node.instanceId !== closestNode.instanceId) {
        createConnection(node, closestNode);
      }

      setConnectionInProgress(null);
      setClosestNode(undefined);
    },
    [closestNode, createConnection],
  );

  // Check if a node is a potential connection candidate
  const isConnectionCandidate = useCallback(
    (nodeId: string): boolean => {
      // A node is a connection candidate if it's the closest node
      // AND not the source node of the connection (prevent self-connections)
      return Boolean(
        closestNode && closestNode.instanceId === nodeId && connectionInProgress && connectionInProgress.from.instanceId !== nodeId,
      );
    },
    [closestNode, connectionInProgress],
  );

  return {
    connectionInProgress,
    closestNode,
    handleConnectionDrag,
    handleConnectionEnd,
    isConnectionCandidate,
  };
};

export default useConnections;
