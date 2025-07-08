import { first } from "./library/first";
import { last } from "./library/last";
import { greet } from "./library/greet";
import { sms } from "./library/sms";
import type { Workflow } from "./types";

const actions = [first, last, greet, sms];

export class Engine {
  static async run(workflow: Workflow) {
    const { nodes, connections } = workflow;

    const instanceToNode = new Map(
      nodes.map((node) => [node.instanceId, node])
    );

    const adjacency = new Map<string, string[]>();
    for (const conn of connections) {
      if (!adjacency.has(conn.from)) {
        adjacency.set(conn.from, []);
      }
      adjacency.get(conn.from)!.push(conn.to);
    }

    const startNode = nodes.find((n) => n.instanceId === "START");
    if (!startNode) throw new Error("No START node found");

    await Engine.runFromNode(
      "START",
      instanceToNode,
      adjacency,
      new Set(), // visitedEdges
      null // previousNodeId
    );
  }

  private static async runFromNode(
    instanceId: string,
    instanceToNode: Map<string, Workflow["nodes"][number]>,
    adjacency: Map<string, string[]>,
    visitedEdges: Set<string>,
    previousId: string | null
  ): Promise<void> {
    const node = instanceToNode.get(instanceId);
    if (!node) return;

    if (node.id !== "START" && node.id !== "END") {
      const formData = node.data?.formData ?? {};
      const action = actions.find((a) => a.id === node.id);
      if (action) {
        await action.action(instanceId, formData);
      } else {
        console.warn(`Unknown action: ${node.id}`);
      }
    }

    if (node.id === "END") return;

    const next = adjacency.get(instanceId) || [];
    for (const nextId of next) {
      const edge = `${instanceId}→${nextId}`;
      if (visitedEdges.has(edge)) continue;

      const newVisited = new Set(visitedEdges);
      newVisited.add(edge);
      await Engine.runFromNode(nextId, instanceToNode, adjacency, newVisited, instanceId);
    }
  }
}
