/**
 * Point class for representing 2D coordinates
 * This class is used as both the implementation and the type
 */
export class Point {
  public x: number;
  public y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(point: Point): Point {
    return new Point(this.x + point.x, this.y + point.y);
  }

  distanceTo(point: Point): number {
    const a = this.x - point.x;
    const b = this.y - point.y;

    return Math.sqrt(a * a + b * b);
  }
}
