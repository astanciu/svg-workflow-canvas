import React, { FunctionComponent, useEffect } from 'react';
import Canvas from '../Canvas/Canvas';
import { WorkflowProps } from './Types';
import { useWorkflow } from './useWorkflow';
import styles from './Workflow.module.scss';
import { WorkflowData } from './WorkflowData';
export const WorkflowContext = React.createContext(null);

export const Workflow: FunctionComponent<WorkflowProps> = ({
  workflow = null,
  workflowChanged = () => {},
  scale = 1,
  snapToGrid = false,
  showGrid = true,
  render
}) => {
  const [state, dispatch] = useWorkflow(workflow, { scale, workflowChanged });

  // Reset the reducer if we receive a new workflow json in props
  useEffect(() => {
    dispatch({ type: 'reset' });
  }, [workflow]);


  // We need to use callbacks on all these otherwise it
  // forces all similar components to re-render, when just one
  // item (node, connection) is actually changed. Alternative
  // would be to pass dispatch as a prop.
  const selectNode = React.useCallback(
    node => dispatch({ type: 'selectNode', node }),
    []
  );
  const updateNode = React.useCallback(
    node => dispatch({ type: 'updateNode', node }),
    []
  );
  const removeNode = React.useCallback(
    node => dispatch({ type: 'removeNode', node }),
    []
  );
  const removeConnection = React.useCallback(
    connection => dispatch({ type: 'removeConnection', connection }),
    []
  );
  const createConnection = React.useCallback(
    (from, to) => dispatch({ type: 'createConnection', from, to }),
    []
  );
  const selectConnection = React.useCallback(
    conn => dispatch({ type: 'selectConnection', connection: conn }),
    []
  );
  const insertNode = node => {
    dispatch({ type: 'insertNode', node });
  };

  const addNode = node => {
    insertNode(node.name);
  };
  const saveWorkflow = () => {
    return WorkflowData.export(state);
  };

  return (
    <div id="workflow-container" className={styles.CanvasContainer}>
      {render && render(addNode, saveWorkflow, updateNode, removeNode, state.selectedNode)}
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
      >

        </Canvas>
    </div>
  );
};
