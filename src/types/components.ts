import type { Node, Connection } from "./models";
import type { ViewType } from "./base";
import type { EventManagerApi } from "../Canvas/Util/useEventManager";

/**
 * Canvas component props
 */
export interface CanvasProps {
  nodes: Node[];
  connections: Connection[];
  selectedNode: Node | null;
  selectNode: (node: Node | null) => void;
  updateNode: (node: Node) => void;
  selectConnection: (conn: Connection | null) => void;
  selectedConnection: Connection | null | "all-disabled";
  createConnection: (fromNode: Node, toNode: Node) => void;
  removeConnection: (conn: Connection) => void;
  snapToGrid: boolean;
  showGrid: boolean;
}

/**
 * Canvas initialization component props
 */
export interface CanvasInitializationProps {
  updateView: (newViewData: Partial<ViewType>) => void;
  setVisibility: (visibility: string) => void;
}

/**
 * Canvas events component props
 */
export interface CanvasEventsProps {
  eventManager: EventManagerApi; // Type this properly based on your EventManager implementation
  handleTap: (e: CustomEvent) => void;
  handleMove: (e: CustomEvent) => void;
  handleMoveEnd: (e: CustomEvent) => void;
  handlePinch: (e: CustomEvent) => void;
  cancelAnimation: () => void;
}

/**
 * Canvas SVG component props
 */
export interface CanvasSVGProps {
  view: ViewType;
  svgRef: React.RefObject<SVGSVGElement>;
  handleWheel: (e: React.WheelEvent) => void;
  visibility: string;
}

/**
 * Canvas content component props
 */
export interface CanvasContentProps {
  transform: string;
}
