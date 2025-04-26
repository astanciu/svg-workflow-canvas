import React, { type FunctionComponent } from "react";
import type { Node } from "svg-workflow-canvas";
import styles from "./Panel.module.css";

type Props = {
  updateNode: (node) => void;
  removeNode: (node) => void;
  selectedNode: Node;
};

export const Panel: FunctionComponent<Props> = ({ updateNode, selectedNode: node, removeNode }) => {
  if (!node) {
    return null;
  }
  const setName = (e) => {
    node.name = e.target.value;
    updateNode(node);
  };

  return (
    <div className={styles.Panel}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" onChange={setName} value={node.name} />
        <button className="btn-remove" onClick={() => removeNode(node)}>
          Remove
        </button>
      </div>
    </div>
  );
};
