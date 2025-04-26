import isEqual from "lodash/isEqual";
import { Connection, Node } from "../Canvas/Models";
import { Point } from "../Canvas/Models/Point";
import { generateId } from "../Canvas/Util/Utils";
import type { WorkflowState, SerializedWorkflow, SerializedNode } from "../types/workflow";

export const WorkflowData = {
  loadState(jsonWorkflow: SerializedWorkflow, options: { scale?: number }): WorkflowState {
    if (!jsonWorkflow) {
      return {
        id: generateId(),
        workflowName: "Workflow",
        workflowDescription: "Generic workflow",
        nodes: [],
        connections: [],
        selectedNode: null,
        selectedConnection: null,
      };
    }

    const state: WorkflowState = {
      id: jsonWorkflow.id || generateId(),
      workflowName: jsonWorkflow.name || "Workflow",
      workflowDescription: jsonWorkflow.description || "Generic workflow",
      nodes: [],
      connections: [],
      selectedNode: null,
      selectedConnection: null,
    };

    state.nodes = jsonWorkflow.nodes.map((n) => {
      const data = { ...n, scale: options.scale || 1 };
      return new Node(data);
    });

    state.connections = jsonWorkflow.connections
      .map((c) => {
        const from = state.nodes.find((n) => n.id === c.from);
        const to = state.nodes.find((n) => n.id === c.to);
        if (!from || !to) return null;
        return new Connection(from, to, c.id);
      })
      .filter((c): c is Connection => c !== null);

    return state;
  },

  selectNode(state: WorkflowState, node: Node | null): WorkflowState {
    return {
      ...state,
      selectedConnection: "all-disabled",
      selectedNode: node,
    };
  },

  selectConnection(state: WorkflowState, conn: Connection | null | "all-disabled"): WorkflowState {
    return { ...state, selectedNode: null, selectedConnection: conn };
  },

  updateNode(state: WorkflowState, node: Node): WorkflowState {
    let posChanged = false;
    const nodes = state.nodes.map((n: Node) => {
      if (n.id === node.id) {
        posChanged = !isEqual(n.position, node.position);
        return node.clone();
      }
      return n;
    });

    const selectedNode = state.selectedNode?.id === node.id ? node : state.selectedNode;

    if (posChanged) {
      const connections = state.connections.map((conn) => {
        if (conn.from.id === node.id || conn.to.id === node.id) {
          const newConn = conn.clone();
          if (conn.from.id === node.id) newConn.from = node;
          if (conn.to.id === node.id) newConn.to = node;
          return newConn;
        }
        return conn;
      });

      return { ...state, nodes, connections, selectedNode };
    }

    return { ...state, nodes, selectedNode };
  },

  removeNode(state: WorkflowState, node: Node): WorkflowState {
    const nodes = state.nodes.filter((n) => n.id !== node.id);
    const connections = state.connections.filter((c) => c.from.id !== node.id && c.to.id !== node.id);
    return { ...state, nodes, connections, selectedNode: null };
  },

  removeConnection(state: WorkflowState, conn: Connection): WorkflowState {
    const connections = state.connections.filter((c) => c.id !== conn.id);
    console.log("connections", connections);
    return { ...state, connections, selectedConnection: null };
  },

  createConnection(state: WorkflowState, from: Node, to: Node): WorkflowState {
    if (state.connections.some((c) => c.from.id === from.id && c.to.id === to.id)) {
      return state;
    }

    const connections = [...state.connections, new Connection(from, to)];
    return { ...state, connections };
  },

  insertNode(state: WorkflowState, data: SerializedNode): WorkflowState {
    const node = new Node(data);
    node.position = WorkflowData.getNewPosition(state);

    const nodes = [...state.nodes, node];
    return { ...state, nodes };
  },

  getNewPosition(state: WorkflowState): Point {
    const minDistance = 85;
    let angle = 0;
    let radius = 100;
    let c = 0;

    const getNextPoint = () => {
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      angle += (Math.PI * 2) / 12;
      if (angle > Math.PI * 2) {
        angle = 0;
        radius += 100;
      }
      return new Point(x, y);
    };

    let possible = new Point(0, 0);

    while (state.nodes.some((node) => node.position.distanceTo(possible) <= minDistance)) {
      possible = getNextPoint();
      c++;
      if (c > 100) break;
    }

    return possible;
  },

  export(state: WorkflowState): SerializedWorkflow {
    return {
      id: state.id,
      name: state.workflowName,
      description: state.workflowDescription,
      nodes: state.nodes.map((n) => ({
        name: n.name,
        id: n.id,
        icon: n.icon,
        position: {
          x: n.position.x,
          y: n.position.y,
        },
      })),
      connections: state.connections.map((c) => ({
        from: c.from.id,
        to: c.to.id,
        id: c.id,
      })),
    };
  },
};
