import React, { useEffect, useRef, useState } from "react";
import type { Connection } from "../../types";
import useEventManager from "../Util/useEventManager";
import styles from "./Connections.module.scss";
import { findPointOnCurve, makeSVGPath } from "./util";
import { useCanvas } from "../CanvasContext";

type Props = {
  connection: Connection;
};

/**
 * ConnectionComponent renders a bezier curve connection between two nodes
 * Includes selection and removal functionality
 */
const ConnectionComponent: React.FC<Props> = ({ connection }) => {
  const { selectedConnection, selectConnection, removeConnection } = useCanvas();

  const connectionDom = useRef<SVGGElement>(null);
  const closeDom = useRef<SVGGElement>(null);
  const connectionRef = useRef(connection);
  const [error, setError] = useState<string | null>(null);

  // Use the event manager hooks
  const connectionEventManager = useEventManager(connectionDom);
  const closeButtonEventManager = useEventManager(closeDom);

  // Set up event handlers
  useEffect(() => {
    try {
      // Main connection tap handler
      const connectionHandler = (e: CustomEvent) => {
        e.stopPropagation();
        selectConnection(connectionRef.current);
      };

      // Close button tap handler
      const closeHandler = (e: CustomEvent) => {
        e.stopPropagation();
        removeConnection(connectionRef.current);
      };

      if (connectionEventManager) {
        connectionEventManager.onTap(connectionHandler);
      }

      if (closeButtonEventManager) {
        closeButtonEventManager.onTap(closeHandler);
      }

      // Cleanup function to unregister handlers
      return () => {
        if (connectionEventManager) {
          connectionEventManager.offTap(connectionHandler);
        }
        if (closeButtonEventManager) {
          closeButtonEventManager.offTap(closeHandler);
        }
      };
    } catch (err) {
      console.error("Error setting up connection event handlers:", err);
      setError("Failed to set up event handlers");
    }
    return void 0;
  }, [connectionEventManager, closeButtonEventManager, selectConnection, removeConnection]);

  // Keep connectionRef.current updated for event handlers
  useEffect(() => {
    connectionRef.current = connection;
  }, [connection]);

  // If there was an error setting up event handlers, render a simplified version
  if (error) {
    console.warn(`Connection rendering with reduced functionality: ${error}`);
  }

  // Get path data
  const start = connection.from.outPortPosition;
  const end = connection.to.inPortPosition;

  const { path, c1, c2 } = makeSVGPath(start, end);
  const center = findPointOnCurve(0.5, start, c1, c2, end);

  // Determine CSS classes based on selection state
  let selected = false;
  let unselected = false;
  if (selectedConnection === "all-disabled") {
    selected = false;
    unselected = true;
  } else {
    selected = Boolean(selectedConnection && selectedConnection.id === connection.id);
    unselected = Boolean(selectedConnection && selectedConnection.id !== connection.id);
  }

  let className = styles.Connection;
  if (selected) {
    className = styles.ConnectionSelected;
  }
  if (unselected) {
    className = styles.ConnectionUnselected;
  }

  const scale = connection.from.scale;

  return (
    <g ref={connectionDom} data-connection-id={connection.id} aria-selected={selected ? "true" : "false"}>
      {/* Touch-friendly hit area */}
      <path d={path} className={styles.ConnectionHitBox} />

      {/* Visible path */}
      <path
        d={path}
        className={className}
        strokeWidth={`${3 * scale}px`}
        aria-label={`Connection from ${connection.from.name} to ${connection.to.name}`}
      />

      {/* Close/delete button */}
      <g ref={closeDom} display={selected ? "" : "none"} aria-label="Remove connection">
        <circle className={styles.CloseHitbox} cx={center.x} cy={center.y} r={12} />
        <circle className={styles.CloseOutline} cx={center.x} cy={center.y} r={12} />
        <circle className={styles.Close} cx={center.x} cy={center.y} r={10} />
        <svg
          viewBox="0 0 352 512"
          className={styles.CloseX}
          width="14px"
          height="14px"
          x={center.x - 7}
          y={center.y - 7}
          role="img"
          aria-label="Remove connection button"
        >
          <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
        </svg>
      </g>
    </g>
  );
};

export default React.memo(ConnectionComponent);
