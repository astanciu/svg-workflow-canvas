import { Point } from '../Models';

// Credit for these methods goes to
// https://github.com/flowhub/the-graph/blob/master/the-graph/the-graph-edge.js

const NODE_SIZE = 110;
const CURVE = 90;

export const makeSVGPath = (start: Point, end: Point) => {
  let c1 = new Point();
  let c2 = new Point();

  if (end.x - 5 < start.x) {
    const curveFactor = ((start.x - end.x) * CURVE) / 200;
    if (Math.abs(end.y - start.y) < NODE_SIZE / 2) {
      // Loopback
      c1.x = start.x + curveFactor;
      c1.y = start.y - curveFactor;
      c2.x = end.x - curveFactor;
      c2.y = end.y - curveFactor;
    } else {
      // Stick out some
      c1.x = start.x + curveFactor;
      c1.y = start.y + (end.y > start.y ? curveFactor : -curveFactor);
      c2.x = end.x - curveFactor;
      c2.y = end.y + (end.y > start.y ? -curveFactor : curveFactor);
    }
  } else {
    // Controls halfway between
    c1.x = start.x + (end.x - start.x) / 2;
    c1.y = start.y;
    c2.x = c1.x;
    c2.y = end.y;
  }

  const path = `M ${start.x} ${start.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${end.x} ${end.y}`;

  return { path, c1, c2 };
};

export const findPointOnCurve = function(p: number, start: Point, c1: Point, c2: Point, end: Point): Point {
  // p is percentage from 0 to 1
  const op = 1 - p;
  // 3 green points between 4 points that define curve
  const g1x = start.x * p + c1.x * op;
  const g1y = start.y * p + c1.y * op;
  const g2x = c1.x * p + c2.x * op;
  const g2y = c1.y * p + c2.y * op;
  const g3x = c2.x * p + end.x * op;
  const g3y = c2.y * p + end.y * op;
  // 2 blue points between green points
  const b1x = g1x * p + g2x * op;
  const b1y = g1y * p + g2y * op;
  const b2x = g2x * p + g3x * op;
  const b2y = g2y * p + g3y * op;
  // Point on the curve between blue points
  const x = b1x * p + b2x * op;
  const y = b1y * p + b2y * op;

  return new Point(x, y);
};
