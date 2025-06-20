import React from "react";
import Icon from "../../../../src/Canvas/Icon/Icon";
import { nodeTemplates } from "./nodeTemplates";
import styles from "./NodeLibrary.module.scss";
import { SerializedNode } from "../../../../dist/types/workflow";

interface NodeLibraryProps {
  onNodeSelect: (node: SerializedNode) => void;
  onClose: () => void;
}

export const NodeLibrary: React.FC<NodeLibraryProps> = ({
  onNodeSelect,
  onClose,
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
          {nodeTemplates.map((node) => (
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
