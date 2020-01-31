import { Point } from './Point';

export class Node {
  public name: string = 'Node';
  public id: string = '0';
  public icon: string = 'gear';
  public position: Point = new Point();
  public selected: boolean = false;
  public highlightInPort: boolean = false;
  public scale: number = 1;
  public outPortOffset: Point;
  public inPortOffset: Point;

  constructor(node: any) {
    Object.assign(this, node);
    this.position = new Point(node.position.x, node.position.y);
    this.outPortOffset = new Point(45 * this.scale, 0);
    this.inPortOffset = new Point(-45 * this.scale, 0);
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
}
