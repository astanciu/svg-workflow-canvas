import { IconLibrary } from "../Assets/icon-library";
import { generateId } from "../Util/Utils";
import { Point } from "./Point";

export class Node {
  public name: string = "Node";
  public id: string = generateId()
  public icon: string;
  public position: Point = new Point();
  public selected: boolean = false;
  public highlightInPort: boolean = false;
  public scale: number = 1;
  public outPortOffset: Point;
  public inPortOffset: Point;
  public width = 80;
  public height = 79;

  constructor(node: any) {
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

  public clone() {
    return new Node(this);
  }

  toString() {
    return `${this.id}:${this.name}`;
  }

  getRandomIcon() {
    const icons = Object.keys(IconLibrary);
    const iconName = icons[(icons.length * Math.random()) << 0];

    return iconName;
  }
}
