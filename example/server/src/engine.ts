import { first } from "./library/first";
import { last } from "./library/last";
import { greet } from "./library/greet";

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
  static async run(workflow: {
    nodes: { id: string; instanceId: string }[];
    connections: { from: string; to: string }[];
  }) {
    const order = getExecutionOrder("START", workflow.connections); 

    const instanceToNodeType = new Map(
      workflow.nodes.map((n) => [n.instanceId, n.id])
    );

    for (const instanceId of order){
      const nodeType = instanceToNodeType.get(instanceId);
      const match = actions.find((a) => a.id === nodeType);
      if (match) {
        await match.action();
      } else {
        console.warn(`Unknown node type: ${nodeType} (instance: ${instanceId})`);
      }
    }
  }
}


// run from the ui will click button run in ui, it send the workflow to /run (making a post to it)
// webserver wich listen
// a simple api - hono "/post/run"
// browser in one window and the server in another window (and there will see the console logs)


// where to be my code in the repo that Mihai use for the example
// in example/server - my code 
// owlie branch - we PR to this instead of a normal main, we branch of the owlie that is branch of the main

