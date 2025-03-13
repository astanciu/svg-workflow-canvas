/**
 * Base type definitions for the canvas
 */

// Re-export the Point class type from Canvas/Models
export type { Point } from "../Canvas/Models/Point";

/**
 * Canvas view properties
 */
export interface ViewType {
  width: number;
  height: number;
  x: number;
  y: number;
  scale: number;
  offsetTop?: number;
  offsetLeft?: number;
}

/**
 * Scale constraints for the canvas
 */
export interface ScaleConstraints {
  min: number;
  max: number;
}

/**
 * Event detail for tap events
 */
export interface TapEventDetail {
  x: number;
  y: number;
}

/**
 * Event detail for move events
 */
export interface MoveEventDetail {
  x: number;
  y: number;
  delta: {
    x: number;
    y: number;
  };
}

/**
 * Event detail for pinch events
 */
export interface PinchEventDetail {
  x: number;
  y: number;
  scale: number;
  delta: {
    x: number;
    y: number;
  };
}
