import isEqual from 'lodash/isEqual';
import { Connection, Node } from '../Canvas/Models';
import { State } from './Types';

export class WorkflowData {
  static loadState(jsonWorkflow, options) {
    const state: State = {
      nodes: [],
      connections: [],
      selectedNode: null,
      selectedConnection: null
    };

    if (!jsonWorkflow) return state;

    state.nodes = jsonWorkflow.nodes.map(n => {
      if (options.scale) {
        n.scale = options.scale;
      }
      return new Node(n);
    });
    state.connections = jsonWorkflow.connections.map(c => {
      const from = state.nodes.find(n => n.id === c.from);
      if (!from) return null;
      const to = state.nodes.find(n => n.id === c.to);
      if (!to) return null;
      const id = c.id;
      return new Connection(from, to, id);
    });

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
        return node;
      } else {
        return n;
      }
    });

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
}
