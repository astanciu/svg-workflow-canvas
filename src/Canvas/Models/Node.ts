import type { SerializedNode } from "../../types/workflow";
import { IconLibrary } from "../Assets/icon-library";
import { generateId } from "../Util/Utils";
import { Point } from "./Point";

/**
 * Node class representing a workflow node
 * This class is used as both the implementation and the type
 */
export class Node {
  public name = "Node";
  public id: string = generateId();
  public icon: string;
  public position: Point = new Point();
  public selected = false;
  public highlightInPort = false;
  public scale = 1;
  public outPortOffset: Point;
  public inPortOffset: Point;
  public width = 80;
  public height = 79;

  constructor(node: SerializedNode) {
    Object.assign(this, node);
    this.position = new Point(node.position?.x || 0, node.position?.y || 0);
    this.outPortOffset = new Point(45 * this.scale, 0);
    this.inPortOffset = new Point(-45 * this.scale, 0);
    if (!this.icon) {
      this.icon = this.getRandomIcon();
    }
  }

  get outPortPosition(): Point {
    if (!this.position) return new Point();
    return this.position.add(this.outPortOffset);
  }

  get inPortPosition(): Point {
    if (!this.position) return new Point();
    return this.position.add(this.inPortOffset);
  }

  public clone(): Node {
    return new Node(this);
  }

  toString(): string {
    return `${this.id}:${this.name}`;
  }

  getRandomIcon(): string {
    const icons = Object.keys(IconLibrary);
    const iconName = icons[(icons.length * Math.random()) << 0];

    return iconName;
  }
}
