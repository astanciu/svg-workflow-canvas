import React from 'react';
import Canvas from '../Canvas/Canvas';
import { WorkflowProps } from './Types';
import { useWorkflow } from './useWorkflow';
import styles from './Workflow.module.css';

export const WorkflowContext = React.createContext(null);

export const Workflow = ({ workflow = null, scale = 1, snapToGrid = false }: WorkflowProps) => {
  const [state, dispatch] = useWorkflow(workflow, { scale });

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

  const props = {
    dispatch,
    nodes: state.nodes,
    updateNode,
    selectNode,
    selectedNode: state.selectedNode,
    connections: state.connections,
    selectedConnection: state.selectedConnection,
    selectConnection,
    createConnection,
    removeConnection,
    snapToGrid
  };

  return (
    <div id="workflow-container" className={styles.CanvasContainer}>
        <Canvas {...props} />
    </div>
  );
};
