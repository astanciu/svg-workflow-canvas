export interface WorkflowNode {
  name: string;
  id: string;
  icon: string;
  instanceId: string;
  position: { x: number; y: number };
  data?: {
    formData?: Record<string, any>;
  };
}

export interface WorkflowConnection {
  from: string;
  to: string;
  id: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
}
