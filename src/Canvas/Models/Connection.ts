import type { Node } from "./Node";
import { generateId } from "../Util/Utils";

/**
 * Connection class that represents a connection between two nodes
 * This class is used as both the implementation and the type
 */
export class Connection {
  public id = "0";
  public from: Node;
  public to: Node;
  public selected = false;

  constructor(from: Node, to: Node, id: string = generateId()) {
    this.from = from;
    this.to = to;
    this.id = id;
  }

  clone(): Connection {
    const conn = new Connection(this.from, this.to, this.id);
    conn.selected = this.selected;
    return conn;
  }
}
