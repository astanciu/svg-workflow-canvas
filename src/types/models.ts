// Re-export the Point class type from Canvas/Models
export type { Point } from "../Canvas/Models/Point";

// Re-export the Node class type from Canvas/Models
// This creates a single source of truth while avoiding duplication
export type { Node } from "../Canvas/Models/Node";

// Re-export the Connection class type from Canvas/Models
// This creates a single source of truth while avoiding duplication
export type { Connection } from "../Canvas/Models/Connection";

// Import the types we need for ConnectionInProgress
import type { Node } from "../Canvas/Models/Node";
import type { Point } from "../Canvas/Models/Point";

/**
 * In-progress connection state
 */
export interface ConnectionInProgress {
  from: Node;
  to: Point;
}
