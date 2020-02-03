import { Dispatch, useReducer } from 'react';
import { State } from './Types';
import { WorkflowData } from './WorkflowData';

export const useWorkflow = (jsonWorkflow, options): [State, Dispatch<any>] => {
  const init = () => WorkflowData.loadState(jsonWorkflow, options);

  const reducer = (state: State, action) => {
    switch (action.type) {
      case 'selectNode':
        return WorkflowData.selectNode(state, action.node);
      case 'updateNode':
        return WorkflowData.updateNode(state, action.node);
      case 'insertNode':
        return WorkflowData.insertNode(state, action.node);
      case 'removeNode':
        return WorkflowData.removeNode(state, action.node);
      case 'selectConnection':
        return WorkflowData.selectConnection(state, action.connection);
      case 'createConnection':
        return WorkflowData.createConnection(state, action.from, action.to);
      case 'removeConnection':
        return WorkflowData.removeConnection(state, action.connection);

      default:
        return state;
    }
  };

  return useReducer(reducer, {}, init);
};
