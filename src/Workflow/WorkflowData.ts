import isEqual from 'lodash/isEqual';
import { Connection, Node } from '../Canvas/Models';
import { Point } from '../Canvas/Models/Point';
import { generateId } from '../Canvas/Util/Utils';
import { SerializedWorkflow } from '../Workflow/Types';
import { State } from './Types';

export class WorkflowData {
  static loadState(jsonWorkflow: SerializedWorkflow, options) {
    const state: State = {
      id: jsonWorkflow.id || generateId(),
      workflowName: jsonWorkflow.name || 'Workflow',
      workflowDescription: jsonWorkflow.description || 'Generic workflow',
      nodes: [],
      connections: [],
      selectedNode: null,
      selectedConnection: null
    };

    if (!jsonWorkflow) return state;

    state.nodes = jsonWorkflow.nodes.map(n => {
      const data = { ...n, scale: 1 };
      if (options.scale) {
        data.scale = options.scale;
      }
      return new Node(n);
    });
    state.connections = jsonWorkflow.connections
      .map(c => {
        const from = state.nodes.find(n => n.id === c.from);
        if (!from) return null;
        const to = state.nodes.find(n => n.id === c.to);
        if (!to) return null;
        const id = c.id;
        return new Connection(from, to, id);
      })
      .filter(c => c !== null) as Connection[];

    return state;
  }

  static selectNode(state: State, node: Node | null) {
    return {
      ...state,
      selectedConnection: node ? { id: -1 } : null,
      selectedNode: node
    };
  }

  static selectConnection(state, conn: Connection | null) {
    return { ...state, selectedNode: null, selectedConnection: conn };
  }

  static updateNode = (state: State, node: Node) => {
    let posChanged = false;
    const nodes = state.nodes.map((n: Node) => {
      if (n.id === node.id) {
        posChanged = !isEqual(n.position, node.position);
        return node.clone();
      } else {
        return n;
      }
    });

    if (state.selectedNode?.id == node.id) {
      state.selectedNode = node;
    }

    if (posChanged) {
      const connections = state.connections.map(conn => {
        if (conn.from.id === node.id) {
          const newConn = conn.clone();
          newConn.from = node;
          return newConn;
        }
        if (conn.to.id === node.id) {
          const newConn = conn.clone();
          newConn.to = node;
          return newConn;
        }
        return conn;
      });

      return { ...state, nodes, connections };
    } else {
      return { ...state, nodes };
    }
  };

  static removeNode(state: State, node: Node) {
    const nodes = state.nodes.filter(n => n.id !== node.id);
    const connections = state.connections.filter(c => {
      if (c.from.id === node.id) return false;
      if (c.to.id === node.id) return false;
      return true;
    });
    return { ...state, nodes, connections, selectedNode: null };
  }

  static removeConnection(state: State, conn: Connection) {
    const connections = state.connections.filter(c => c.id !== conn.id);
    return { ...state, connections, selectedConnection: null };
  }

  static createConnection(state: State, from: Node, to: Node) {
    const exists = state.connections.find(
      c => c.from.id === from.id && c.to.id === to.id
    );
    if (exists) return state;

    const connections = [...state.connections, new Connection(from, to)];

    return { ...state, connections };
  }

  static insertNode(
    state: State,
    data: { name: string; id: string; icon: string }
  ) {
    const node = new Node(data);
    node.position = WorkflowData.getNewPosition(state);

    const nodes = [...state.nodes, node];
    return { ...state, nodes };
  }

  static getNewPosition(state: State): Point {
    const minDistance = 85;
    let angle = 0;
    let radius = 100;
    let c = 0;

    const getNextPoint = () => {
      let x = Math.cos(angle) * radius;
      let y = Math.sin(angle) * radius;
      angle += (Math.PI * 2) / 12;
      if (angle > Math.PI * 2) {
        angle = 0;
        radius += 100;
      }
      return new Point(x, y);
    };

    let possible = new Point(0, 0);

    let tooClose;
    do {
      tooClose = state.nodes.find(
        node => node.position.distanceTo(possible) <= minDistance
      );

      if (tooClose) {
        possible = getNextPoint();
      }

      c++;
      if (c > 100) return possible;
    } while (tooClose);

    return possible;
  }

  static export(state: State): SerializedWorkflow {
    const workflow: SerializedWorkflow = {
      id: state.id,
      name: state.workflowName,
      description: state.workflowDescription,
      nodes: state.nodes.map(n => ({
        name: n.name,
        id: n.id,
        icon: n.icon,
        position: {
          x: n.position.x,
          y: n.position.y
        }
      })),
      connections: state.connections.map(c => ({
        from: c.from.id,
        to: c.to.id,
        id: c.id
      }))
    };

    return workflow;
  }
}
