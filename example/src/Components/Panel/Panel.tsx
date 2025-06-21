import React, { type FunctionComponent } from "react";
import { Node } from "svg-workflow-canvas";
import styles from "./Panel.module.css";
import type { NodeTemplate } from "../../../../src/types/workflow";

type Props = {
  updateNode: (node) => void;
  removeNode: (node) => void;
  selectedNode: Node;
  library: NodeTemplate[];
};

export const Panel: FunctionComponent<Props> = ({
  updateNode,
  selectedNode: node,
  removeNode,
  library,
}) => {
  if (!node || node.name === "Start" || node.name === "End") {
    return null;
  }

  const updateNodeProperty = (property: string, value: any) => {
    const updatedNode = new Node(node);

    if (property === "name") {
      updatedNode.name = value;
    } else {
      if (updatedNode.data) {
        updatedNode.data.formData = {
          ...updatedNode.data.formData,
          [property]: value,
        };
      }
    }

    updateNode(updatedNode);
  };

  const renderInput = (input) => {
    const value = node.data?.formData?.[input.name] || "";

    switch (input.control) {
      case "textarea":
        return (
          <textarea
            id={input.name}
            value={value}
            placeholder={input.placeholder}
            onChange={(e) => updateNodeProperty(input.name, e.target.value)}
          />
        );

      case "select":
        return (
          <select
            id={input.name}
            value={value}
            onChange={(e) => updateNodeProperty(input.name, e.target.value)}
          >
            <option value="">Select an option</option>
            {input.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <input
            type="checkbox"
            id={input.name}
            checked={value}
            onChange={(e) => updateNodeProperty(input.name, e.target.checked)}
          />
        );

      case "number":
        return (
          <input
            type="number"
            id={input.name}
            value={value}
            placeholder={input.placeholder}
            onChange={(e) =>
              updateNodeProperty(input.name, parseFloat(e.target.value) || 0)
            }
          />
        );

      default: // "input"
        return (
          <input
            type="text"
            id={input.name}
            value={value}
            placeholder={input.placeholder}
            onChange={(e) => updateNodeProperty(input.name, e.target.value)}
          />
        );
    }
  };

  return (
    <div className={styles.Panel}>
      <div>
        <div className={styles.inputGroup}>
          <label htmlFor="name">Node name</label>
          <input
            id="name"
            onChange={(e) => updateNodeProperty("name", e.target.value)}
            value={node.name}
          />
        </div>
        {(
          library.find((template) => template.id === (node as any).id)?.data
            ?.formDef || []
        ).map((input) => (
          <div key={input.name} className={styles.inputGroup}>
            <label htmlFor={input.name}>{input.label}</label>
            {renderInput(input)}
          </div>
        ))}
        <button className="btn-remove" onClick={() => removeNode(node)}>
          Remove
        </button>
      </div>
    </div>
  );
};
