import type { NodeTemplate } from "../../../../src/types/workflow";

export const nodeTemplates: NodeTemplate[] = [
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
          ]
        }
    }
]
