import React from "react";
import { Workflow } from "svg-workflow-canvas";

export default () => {
  const w1 = {
    nodes: [
      { name: 'add-new-item', id: '1', icon: 'plus-circle', position: { x: 3, y: 7 } },
      { name: 'create-user', id: '2', icon: 'user', position: { x: 254, y: 130 } },
      { name: 'upload-stuff', id: '3', icon: 'home', position: { x: -137, y: -32 } },
      { name: 'train-jedi', id: '4', icon: 'jedi', position: { x: 254, y: -105 } }
    ],
    connections: [{ from: '1', to: '2', id: 'h1zt2' }]
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Workflow workflow={w1} scale={1} snapToGrid />
    </div>
  );
};


// export default class App extends Component {
//   render() {
//     const w1 = {
//       nodes: [
//         { name: 'add-new-item', id: '1', icon: 'plus-circle', position: { x: 3, y: 7 } },
//         { name: 'create-user', id: '2', icon: 'user', position: { x: 254, y: 130 } },
//         { name: 'upload-stuff', id: '3', icon: 'home', position: { x: -137, y: -32 } },
//         { name: 'train-jedi', id: '4', icon: 'jedi', position: { x: 254, y: -105 } }
//       ],
//       connections: [{ from: '1', to: '2', id: 'h1zt2' }]
//     };

//     return (
//       <div style={{ width: "100vw", height: "100vh" }}>
//         <Workflow workflow={w1} scale={1} snapToGrid />
//       </div>
//     );
//   }
// }
