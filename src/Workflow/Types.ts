import { Connection, Node } from '../Canvas/Models';

export type State = {
  id: string;
  workflowName: string;
  workflowDescription: string;
  nodes: Node[];
  connections: Connection[];
  selectedNode: Node | null;
  selectedConnection: Connection | null;
};

export type WorkflowProps = {
  workflow: any;
  workflowChanged?: (workflow) => any;
  scale?: number;
  snapToGrid?: boolean;
  showGrid?: boolean;
  render?: (add, save, updateNode, removeNode, selectedNode:Node|null) => void;
};

export type SerializedPoint = {
  x: number;
  y: number;
};
export type SerializedNode = {
  name: string;
  id: string;
  icon: string;
  position: SerializedPoint;
};
export type SerializedConnection = {
  from: string;
  to: string;
  id: string;
};
export type SerializedWorkflow = {
  id: string;
  name: string;
  description: string;
  nodes: SerializedNode[];
  connections: SerializedConnection[];
};
