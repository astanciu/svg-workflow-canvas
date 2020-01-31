import { Connection, Node } from '../Canvas/Models';

export type State = {
  nodes: Node[];
  connections: Connection[];
  selectedNode: Node | null;
  selectedConnection: Connection | null;
};

export type WorkflowProps = {
  workflow: any;
  scale?: number;
  snapToGrid?: boolean;
};
