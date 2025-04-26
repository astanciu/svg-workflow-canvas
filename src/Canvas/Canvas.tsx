import React, { useState, useRef, useCallback } from "react";
import type { CanvasProps, ScaleConstraints } from "../types";
import { useCanvasSize, usePanning, useZoom, useConnections } from "./Hooks";
import useEventManager from "./Util/useEventManager";
import { CanvasInitialization, CanvasEvents, CanvasSVG } from "./Components";
import { CanvasProvider } from "./CanvasContext";

/**
 * Canvas Component - SVG-based interactive workflow canvas
 *
 * Handles rendering and interaction for a zoomable, pannable canvas
 * with nodes and connections.
 */
const Canvas: React.FC<CanvasProps> = ({
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
}) => {
  // Scale constraints
  const scaleConstraints: ScaleConstraints = {
    min: 0.25,
    max: 3,
  };

  // Initialize refs and state
  const svgRef = useRef<SVGSVGElement>(null);
  const [visibility, setVisibility] = useState<string>("hidden");

  // Use panning hook for view state management
  const { view, updateView, handleMove, handleMoveEnd, cancelAnimation } = usePanning({
    initialView: {
      width: 600,
      height: 400,
      x: 300,
      y: 200 / 2,
      scale: 1,
    },
  });

  // Use zoom hook for handling zoom interactions
  const { handleWheel, handlePinch, zoomToFit } = useZoom({
    constraints: scaleConstraints,
    onViewChange: updateView,
    view,
  });

  // Use canvas size hook for handling resize
  const { setCanvasSize } = useCanvasSize({
    svgRef,
    onViewChange: updateView,
  });

  // Use connections hook for handling node connections
  const { connectionInProgress, closestNode, handleConnectionDrag, handleConnectionEnd, isConnectionCandidate } =
    useConnections({
      view,
      nodes,
      createConnection,
    });

  // Set up event manager
  const eventManager = useEventManager(svgRef);

  // Handle tap events (selection)
  const handleTap = useCallback(() => {
    selectNode(null);
    selectConnection(null);
  }, [selectNode, selectConnection]);

  return (
    <CanvasProvider
      nodes={nodes}
      connections={connections}
      selectedNode={selectedNode}
      selectNode={selectNode}
      updateNode={updateNode}
      selectConnection={selectConnection}
      selectedConnection={selectedConnection}
      createConnection={createConnection}
      removeConnection={removeConnection}
      snapToGrid={snapToGrid}
      showGrid={showGrid}
      view={view}
      updateView={updateView}
      connectionInProgress={connectionInProgress}
      closestNode={closestNode}
      handleConnectionDrag={handleConnectionDrag}
      handleConnectionEnd={handleConnectionEnd}
      isConnectionCandidate={isConnectionCandidate}
    >
      {/* Handle canvas initialization */}
      <CanvasInitialization updateView={updateView} setVisibility={setVisibility} />

      {/* Handle canvas events */}
      <CanvasEvents
        eventManager={eventManager}
        handleTap={handleTap}
        handleMove={handleMove}
        handleMoveEnd={handleMoveEnd}
        handlePinch={handlePinch}
        cancelAnimation={cancelAnimation}
      />

      {/* Render the SVG canvas */}
      <CanvasSVG view={view} svgRef={svgRef} handleWheel={handleWheel} visibility={visibility} />
    </CanvasProvider>
  );
};

export default Canvas;
