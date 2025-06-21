import React from "react";
import Icon from "../../../../src/Canvas/Icon/Icon";
import styles from "./NodeLibrary.module.scss";
import { SerializedNode } from "../../../../dist/types/workflow";
import type { NodeTemplate } from "../../../../src/types/workflow";

interface NodeLibraryProps {
  onNodeSelect: (node: SerializedNode) => void;
  onClose: () => void;
  library: NodeTemplate[];
}

export const NodeLibrary: React.FC<NodeLibraryProps> = ({
  onNodeSelect,
  onClose,
  library,
}) => {
  const handleNodeClick = (node: SerializedNode) => {
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.nodeLibrary}>
        <div className={styles.header}>
          <h3 className={styles.title}>Add node</h3>
          <button className={styles.closeButton} onClick={onClose}>
            x
          </button>
        </div>
        <div className={styles.grid}>
          {library.map((node) => (
            <div
              key={node.instanceId}
              className={styles.nodeItem}
              onClick={() => handleNodeClick(node)}
            >
              <div className={styles.icon}>
                <Icon icon={node.icon} size={24} />
              </div>
              <div className={styles.name}>{node.name}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
