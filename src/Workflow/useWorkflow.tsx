import { type Dispatch, useReducer } from "react";
import type { SerializedWorkflow, WorkflowState } from "../types/workflow";
import type { Connection, Node } from "../types";
import { WorkflowData } from "./WorkflowData";

// Alias for backward compatibility
type State = WorkflowState;

type WorkflowAction =
  | { type: "selectNode"; node: Node | null }
  | { type: "updateNode"; node: Node }
  | { type: "insertNode"; node: { name: string; id: string; icon: string } }
  | { type: "removeNode"; node: Node }
  | { type: "selectConnection"; connection: Connection | null | "all-disabled" }
  | { type: "createConnection"; from: Node; to: Node }
  | { type: "removeConnection"; connection: Connection }
  | { type: "reset" };

export const useWorkflow = (
  jsonWorkflow: SerializedWorkflow,
  options: { scale?: number; workflowChanged?: (workflow: SerializedWorkflow) => void },
): [State, Dispatch<WorkflowAction>] => {
  const init = () => WorkflowData.loadState(jsonWorkflow, options);

  const reducer = (state: State, action: WorkflowAction): State => {
    switch (action.type) {
      case "selectNode":
        return WorkflowData.selectNode(state, action.node);
      case "updateNode":
        return WorkflowData.updateNode(state, action.node);
      case "insertNode":
        return WorkflowData.insertNode(state, action.node);
      case "removeNode":
        return WorkflowData.removeNode(state, action.node);
      case "selectConnection":
        return WorkflowData.selectConnection(state, action.connection);
      case "createConnection":
        console.log("createConnection", action.from, action.to);
        return WorkflowData.createConnection(state, action.from, action.to);
      case "removeConnection":
        return WorkflowData.removeConnection(state, action.connection);
      case "reset":
        return init();
      default:
        return state;
    }
  };

  return useReducer(reducer, {}, init);
};
