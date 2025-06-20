import React, { useState } from "react";
import Workflow from "svg-workflow-canvas";
import { Button } from "./Components/Button/Button";
import { ButtonToggle } from "./Components/Button/ButtonToggle";
import { ButtonGroup } from "./Components/Button/ButtonGroup";
import { Panel } from "./Components/Panel/Panel";
import { useLocalStorage } from "./Components/useLocalStorage";
import { NodeLibrary } from "./Components/NodeLibrary/NodeLibrary";

const WorkflowEditor = (work) => {
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

  const saveWorkflow = (fn) => () => {
    const workflow = fn();
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
      //workflow={w1} keep the default workflow here!
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
              //libraryNode={library[selectedNode.id]}
            />
            <ButtonGroup>
              <Button
                icon="plus-circle"
                tooltip="This is the cog"
                onClick={toggleNodeLibrary}
              />
              <Button
                icon="save"
                tooltip="This is the cog"
                onClick={saveWorkflow(save)}
              />
              <ButtonToggle
                icon="th"
                tooltip="This is the cog"
                enabled={showGrid}
                onClick={toggleGrid}
              />
            </ButtonGroup>
            {showNodeLibrary && (
              <NodeLibrary
                onNodeSelect={addNode(add)}
                onClose={toggleNodeLibrary}
              />
            )}
          </>
        )}
      />
    </div>
  );
};

export default WorkflowEditor;
