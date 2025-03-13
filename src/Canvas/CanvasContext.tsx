import React, { createContext, useContext, useMemo } from "react";
import type { Node, Connection, Point, ViewType } from "../types";

/**
 * Canvas context type definition
 */
interface CanvasContextType {
  // State
  nodes: Node[];
  connections: Connection[];
  selectedNode: Node | null;
  selectedConnection: Connection | null | "all-disabled";
  view: ViewType;
  connectionInProgress: { from: Node; to: Point } | null;
  closestNode: Node | undefined;

  // Actions
  selectNode: (node: Node | null) => void;
  updateNode: (node: Node) => void;
  selectConnection: (conn: Connection | null) => void;
  createConnection: (fromNode: Node, toNode: Node) => void;
  removeConnection: (conn: Connection) => void;
  updateView: (newViewData: Partial<ViewType>) => void;
  handleConnectionDrag: (node: Node, e: CustomEvent) => void;
  handleConnectionEnd: (node: Node) => void;
  isConnectionCandidate: (nodeId: string) => boolean;

  // Settings
  snapToGrid: boolean;
  showGrid: boolean;
}

/**
 * Canvas provider props
 */
interface CanvasProviderProps {
  children: React.ReactNode;
  nodes: Node[];
  connections: Connection[];
  selectedNode: Node | null;
  selectNode: (node: Node | null) => void;
  updateNode: (node: Node) => void;
  selectConnection: (conn: Connection | null) => void;
  selectedConnection: Connection | null | "all-disabled";
  createConnection: (fromNode: Node, toNode: Node) => void;
  removeConnection: (conn: Connection) => void;
  snapToGrid: boolean;
  showGrid: boolean;
  view: ViewType;
  updateView: (newViewData: Partial<ViewType>) => void;
  connectionInProgress: { from: Node; to: Point } | null;
  closestNode: Node | undefined;
  handleConnectionDrag: (node: Node, e: CustomEvent) => void;
  handleConnectionEnd: (node: Node) => void;
  isConnectionCandidate: (nodeId: string) => boolean;
}

// Create the context with a default undefined value
const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

/**
 * Canvas Provider component
 * Manages canvas state and provides it to all child components
 */
export const CanvasProvider: React.FC<CanvasProviderProps> = ({
  children,
  nodes,
  connections,
  selectedNode,
  selectNode,
  updateNode,
  selectConnection,
  selectedConnection,
  createConnection,
  removeConnection,
  snapToGrid,
  showGrid,
  view,
  updateView,
  connectionInProgress,
  closestNode,
  handleConnectionDrag,
  handleConnectionEnd,
  isConnectionCandidate,
}) => {
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      // State
      nodes,
      connections,
      selectedNode,
      selectedConnection,
      view,
      connectionInProgress,
      closestNode,

      // Actions
      selectNode,
      updateNode,
      selectConnection,
      createConnection,
      removeConnection,
      updateView,
      handleConnectionDrag,
      handleConnectionEnd,
      isConnectionCandidate,

      // Settings
      snapToGrid,
      showGrid,
    }),
    [
      nodes,
      connections,
      selectedNode,
      selectedConnection,
      view,
      connectionInProgress,
      closestNode,
      selectNode,
      updateNode,
      selectConnection,
      createConnection,
      removeConnection,
      updateView,
      handleConnectionDrag,
      handleConnectionEnd,
      isConnectionCandidate,
      snapToGrid,
      showGrid,
    ],
  );

  return <CanvasContext.Provider value={contextValue}>{children}</CanvasContext.Provider>;
};

/**
 * Custom hook to use the canvas context
 * Ensures the context is used within a CanvasProvider
 */
export const useCanvas = (): CanvasContextType => {
  const context = useContext(CanvasContext);

  if (context === undefined) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }

  return context;
};
