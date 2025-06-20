import type { Node, Connection } from "./models";
import type { Point } from "./base";

/**
 * Workflow state
 */
export interface WorkflowState {
  id: string;
  workflowName: string;
  workflowDescription: string;
  nodes: Node[];
  connections: Connection[];
  selectedNode: Node | null;
  selectedConnection: Connection | null | "all-disabled";
}

/**
 * Workflow component props
 */
export interface WorkflowProps {
  workflow: SerializedWorkflow;
  workflowChanged?: (workflow: SerializedWorkflow) => void;
  scale?: number;
  snapToGrid?: boolean;
  showGrid?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  render?: (add: any, save: any, updateNode: any, removeNode: any, selectedNode: Node | null) => React.ReactNode;
}

/**
 * Serialized point for storage/transfer
 */
export interface SerializedPoint {
  x: number;
  y: number;
}

/**
 * Serialized node for storage/transfer
 */
export interface SerializedNode {
  name: string;
  id: string;
  icon: string;
  instanceId?: string;
  position?: SerializedPoint;
  scale?: number;
  data?: NodeData;
}

export type InputControl = "input" | "textarea" | "select" | "checkbox" | "number";

export interface NodeInput {
  name: string;
  type: "string" | "number" | "boolean" | "select";
  label: string;
  control: InputControl;
  required?: boolean;
  defaultValue?: any;
  options?: string[]; // For select controls
  placeholder?: string;
}

/**
 * Node data structure
 */
export interface NodeData {
  formDef: NodeInput[];
  formData?: Record<string, any>;
}

/**
 * Serialized connection for storage/transfer
 */
export interface SerializedConnection {
  from: string;
  to: string;
  id: string;
}

/**
 * Serialized workflow for storage/transfer
 */
export interface SerializedWorkflow {
  id: string;
  name: string;
  description: string;
  nodes: SerializedNode[];
  connections: SerializedConnection[];
}
