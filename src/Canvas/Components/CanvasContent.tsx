import React, { useMemo } from "react";
import Grid from "../Grid/Grid";
import ConnectionComponent from "../Connections/ConnectionComponent";
import ConnectionPreview from "../Connections/ConnectionPreview";
import NodeComponent from "../Node/Node";
import { useCanvas } from "../CanvasContext";

interface CanvasContentProps {
  transform: string;
}

/**
 * Component for rendering the main canvas content
 * Uses Context API to access canvas state
 */
const CanvasContent: React.FC<CanvasContentProps> = ({ transform }) => {
  const {
    nodes,
    connections,
    connectionInProgress,
    showGrid,
    snapToGrid,
    selectedNode,
    selectedConnection,
    selectNode,
    selectConnection,
    updateNode,
    removeConnection,
    handleConnectionDrag,
    handleConnectionEnd,
    isConnectionCandidate,
    view,
  } = useCanvas();

  // Memoize the node components to prevent unnecessary re-renders
  const nodeComponents = useMemo(() => {
    return nodes.map((node) => (
      <NodeComponent
        key={node.id}
        node={node}
        updateNode={updateNode}
        canvasView={view}
        onConnectionDrag={handleConnectionDrag}
        onConnectionEnd={handleConnectionEnd}
        connectionCandidate={isConnectionCandidate(node.id)}
        selectNode={selectNode}
        selectedNode={selectedNode}
        snapToGrid={snapToGrid}
      />
    ));
  }, [
    nodes,
    updateNode,
    view,
    handleConnectionDrag,
    handleConnectionEnd,
    isConnectionCandidate,
    selectNode,
    selectedNode,
    snapToGrid,
  ]);

  // Memoize the connection components to prevent unnecessary re-renders
  const connectionComponents = useMemo(() => {
    return connections.map((conn) => <ConnectionComponent key={conn.id} connection={conn} />);
  }, [connections]);

  return (
    <g id="Canvas" transform={transform} data-testid="canvas-content">
      <Grid show={showGrid} />

      {/* Render connections */}
      {connectionComponents}

      {/* Render connection preview during drag */}
      {connectionInProgress && (
        <ConnectionPreview startNode={connectionInProgress.from} mouse={connectionInProgress.to} />
      )}

      {/* Render nodes */}
      {nodeComponents}
    </g>
  );
};

export default React.memo(CanvasContent);
