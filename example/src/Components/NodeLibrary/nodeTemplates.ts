import type { SerializedNode } from "../../../../src/types/workflow";

export const nodeTemplates: SerializedNode[] = [
    {
        name: "Get first",
        id: "first",
        instanceId: "first",
        icon: "user-circle",
    },
    {
        name: "Get last",
        id: "last",
        instanceId: "last",
        icon: "user",

    },
    {
      name: "Greet",
      id: "greet",
      instanceId: "greet",
      icon: "smile",
  },
    {
        name: "Message",
        id: "sms",
        instanceId: "sms",
        icon: "envelope",
        data: {
          formDef: [
            {
              name: "phone",
              type: "string",
              label: "Phone number",
              control: "input",
              placeholder: "Enter phone number"
            },
            {
              name: "message",
              type: "string",
              label: "Text message",
              control: "textarea",
              placeholder: "Enter text message"
            }
          ],
          formData: {
            phone: "",
            message: ""
          }
        }
    }
]

// formDef saved in the library
// Get formDef from library not the node
// rename App to WorkflowEditor - 2 props workflow and library
// make API call - React Query