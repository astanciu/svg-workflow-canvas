import React, { useState } from "react";
import Workflow from "svg-workflow-canvas";
import { Button } from "./Components/Button/Button";
import { ButtonToggle } from "./Components/Button/ButtonToggle";
import { ButtonGroup } from "./Components/Button/ButtonGroup";
import { Panel } from "./Components/Panel/Panel";
import { useLocalStorage } from "./Components/useLocalStorage";

const WorkflowEditor = ({library, NodeLibrary, workflow}) => {
  const [showGrid, setShowGrid] = useLocalStorage("settings.showGrid", true);
  const [showNodeLibrary, setShowNodeLibrary] = useState(false);
  const [nodeCounters, setNodeCounters] = useState({});

  const addNode = (addNodeWorkflowFn) => (template) => {
    const templateId = template.id;
    const currentCount = nodeCounters[templateId] || 0;
    const newCount = currentCount + 1;
    
    const uniqueNodeInstance = {
      ...template,
      instanceId: `${templateId}-${newCount}`
    };
    
    setNodeCounters(prev => ({
      ...prev,
      [templateId]: newCount
    }));
    
    addNodeWorkflowFn(uniqueNodeInstance);
  };

  const saveWorkflow = (save) => () => {
    const workflow = save();
    console.log("Store this in DB: ", workflow);
    alert("In this demo, data was dumped to console");
  };

  const toggleNodeLibrary = () => {
    setShowNodeLibrary(!showNodeLibrary);
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Workflow
        workflow={workflow}
        scale={1}
        snapToGrid
        showGrid={showGrid}
        render={(add, save, updateNode, removeNode, selectedNode) => (
          <>
            {/* <Sidebar add={addNode(add)} save={saveWorkflow(save)} /> */}
            <Panel
              updateNode={updateNode}
              removeNode={removeNode}
              selectedNode={selectedNode}
              library={library}
            />
            <ButtonGroup>
              <Button
                icon="plus-circle"
                tooltip="Add node"
                onClick={toggleNodeLibrary}
              />
              <Button
                icon="save"
                tooltip="Save workflow"
                onClick={saveWorkflow(save)}
              />
              <ButtonToggle
                icon="th"
                tooltip="Toggle grid"
                enabled={showGrid}
                onClick={toggleGrid}
              />
            </ButtonGroup>
            {showNodeLibrary && (
              <NodeLibrary
                onNodeSelect={addNode(add)}
                onClose={toggleNodeLibrary}
                library={library}
              />
            )}
          </>
        )}
      />
    </div>
  );
};

export default WorkflowEditor;
