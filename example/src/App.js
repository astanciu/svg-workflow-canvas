import React from 'react';
import Workflow from 'svg-workflow-canvas';
import { Panel } from './Components/Panel/Panel';
import { Sidebar } from './Components/Sidebar/Sidebar';

export default () => {
  const w1 = {
    id: 'jzh31fs',
    name: 'Workflow',
    description: 'Generic workflow',
    nodes: [
      { id: 'START', icon: 'sign-in-alt', position: { x: -400, y: 0 } },
      { id: 'END', icon: 'sign-out-alt', position: { x: 350, y: 0 } },
      { name: 'add-new-item', id: '1', icon: 'plus-circle', position: { x: 0, y: 0 } },
      { name: 'create-user', id: '2', icon: 'user', position: { x: 250, y: 165 } },
      { name: 'upload-stuff', id: '3', icon: 'home', position: { x: -200, y: 0 } },
      { name: 'train-jedi', id: '4', icon: 'jedi', position: { x: 250, y: -165 } }
   ],
    connections: [
      { from: '1', to: '2', id: 'h1zt2' },
      { from: '3', to: '1', id: '0.10135201500322455' },
      { from: '1', to: '4', id: '0.8044895443880992' },
      { from: 'START', to: '3', id: '0.5510817403732952' },
      { from: '1', to: 'END', id: '0.21708917364861713' }
    ]
  };

  const addNode = addNodeWorkflowFn => () => {
    addNodeWorkflowFn({ name: 'Alex' });
  };

  const saveWorkflow = fn => () => {
    const workflow = fn();
    console.log('Store this in DB: ', workflow);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Workflow
        workflow={w1}
        scale={1}
        snapToGrid
        render={(add, save, updateNode, removeNode, selectedNode) => (
          <>
            <Sidebar add={addNode(add)} save={saveWorkflow(save)} />
            <Panel
              updateNode={updateNode}
              removeNode={removeNode}
              selectedNode={selectedNode}
            />
          </>
        )}
      ></Workflow>
    </div>
  );
};
