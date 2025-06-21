import WorkflowEditor from "./WorkflowEditor";
import { nodeTemplates } from "./Components/NodeLibrary/nodeTemplates";
import { NodeLibrary } from "./Components/NodeLibrary/NodeLibrary";

// Default empty workflow
const newWorkflow = {
  nodes: [
    {
      name: "Start",
      id: "START",
      instanceId: "START",
      icon: "sign-in-alt",
      position: { x: -400, y: 0 },
    },
    {
      name: "End",
      id: "END",
      instanceId: "END",
      icon: "sign-out-alt",
      position: { x: 350, y: 0 },
    },
  ],
  connections: [],
};

const App = () => {
  return (
    <WorkflowEditor
      library={nodeTemplates}
      NodeLibrary={NodeLibrary}
      workflow={newWorkflow}
    />
  );
};

export default App;
