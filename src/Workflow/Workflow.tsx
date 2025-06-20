import React, { createContext, useCallback, useEffect } from "react";
import Canvas from "../Canvas/Canvas";
import type { SerializedNode, SerializedWorkflow, WorkflowProps } from "../types/workflow";
import { useWorkflow } from "./useWorkflow";
import styles from "./Workflow.module.scss";
import { WorkflowData } from "./WorkflowData";

export const WorkflowContext = createContext(null);

const emptyWorkflow: SerializedWorkflow = {
  id: "new-workflow",
  name: "New Workflow",
  description: "New Workflow",
  nodes: [
    {
      name: "Start",
      id: "START",
      instanceId: "START",
      icon: "sign-in-alt",
      position: { x: -400, y: 0 },
    },
    {
      name: "End",
      id: "END",
      instanceId: "END",
      icon: "sign-out-alt",
      position: { x: 350, y: 0 },
    },
  ],
  connections: [],
};

export const Workflow = ({
  workflow = emptyWorkflow,
  workflowChanged = () => {},
  scale = 1,
  snapToGrid = false,
  showGrid = true,
  render,
}: WorkflowProps) => {
  const [state, dispatch] = useWorkflow(workflow, { scale, workflowChanged });

  // Reset the reducer if we receive a new workflow json in props
  useEffect(() => {
    dispatch({ type: "reset" });
  }, [dispatch]);

  // We need to use callbacks on all these otherwise it
  // forces all similar components to re-render, when just one
  // item (node, connection) is actually changed. Alternative
  // would be to pass dispatch as a prop.
  const selectNode = useCallback(
    (node) => dispatch({ type: "selectNode", node }),
    [dispatch]
  );
  const updateNode = useCallback(
    (node) => dispatch({ type: "updateNode", node }),
    [dispatch]
  );
  const removeNode = useCallback(
    (node) => dispatch({ type: "removeNode", node }),
    [dispatch]
  );
  const removeConnection = useCallback(
    (connection) => dispatch({ type: "removeConnection", connection }),
    [dispatch]
  );
  const createConnection = useCallback(
    (from, to) => {
      // console.log("callback createConnection", from, to);
      dispatch({ type: "createConnection", from, to });
    },
    [dispatch]
  );
  const selectConnection = useCallback(
    (conn) => dispatch({ type: "selectConnection", connection: conn }),
    [dispatch]
  );
  const insertNode = useCallback(
    (node) => dispatch({ type: "insertNode", node }),
    [dispatch]
  );

  const addNode = (node) => {
    insertNode(node);
  };
  const saveWorkflow = () => {
    return WorkflowData.export(state);
  };

  return (
    <div id="workflow-container" className={styles.CanvasContainer}>
      {render?.(
        addNode,
        saveWorkflow,
        updateNode,
        removeNode,
        state.selectedNode
      )}
      <Canvas
        nodes={state.nodes}
        updateNode={updateNode}
        selectNode={selectNode}
        selectedNode={state.selectedNode}
        connections={state.connections}
        selectedConnection={state.selectedConnection}
        selectConnection={selectConnection}
        createConnection={createConnection}
        removeConnection={removeConnection}
        snapToGrid={snapToGrid}
        showGrid={showGrid}
      />
    </div>
  );
};
