import { first } from "./library/first";
import { last } from "./library/last";
import { greet } from "./library/greet";
import type { Workflow } from "./types";

const actions = [first, last, greet];

export function getExecutionOrder(
  startId: string,
  connections: { from: string; to: string }[]
): string[] {
  const graph = new Map<string, string[]>();

  for (const conn of connections) {
    if (!graph.has(conn.from)) {
      graph.set(conn.from, []);
    }
    graph.get(conn.from)!.push(conn.to);
  }

  const visited = new Set<string>();
  const result: string[] = [];

  function dfs(currentId: string) {
    if (visited.has(currentId)) return;
    visited.add(currentId);

    const nextNodes = graph.get(currentId) || [];
    for (const next of nextNodes) {
      if (next !== "START" && next !== "END") {
        result.push(next);
      }
      dfs(next);
    }
  }

  dfs(startId);
  return result;
}

export class Engine {
  static async run(workflow: Workflow) {
    const order = getExecutionOrder("START", workflow.connections);

    const instanceToNodeType = new Map(
      workflow.nodes.map((n) => [n.instanceId, n.id])
    );

    for (const instanceId of order) {
      const nodeType = instanceToNodeType.get(instanceId);
      const match = actions.find((a) => a.id === nodeType);
      if (match) {
        await match.action();
      } else {
        console.warn(
          `Unknown node type: ${nodeType} (instance: ${instanceId})`
        );
      }
    }
  }
}
