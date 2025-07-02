import type { NodeTemplate } from "../../../../../src/types/workflow";

export const nodeTemplates: NodeTemplate[] = [
    {
        name: "Get first",
        id: "first",
        instanceId: "first",
        icon: "user-circle",
        data: {
          formDef: [
            {
              name: "First name",
              type: "string",
              label: "First name",
              control: "input",
              placeholder: "Enter first name"
            }
          ]
        }
    },
    {
        name: "Get last",
        id: "last",
        instanceId: "last",
        icon: "user",
        data: {
          formDef: [
            {
              name: "Last name",
              type: "string",
              label: "Last name",
              control: "input",
              placeholder: "Enter last name"
            }
          ]
        }

    },
    {
      name: "Greet",
      id: "greet",
      instanceId: "greet",
      icon: "smile",
      data: {
        formDef: [
          {
            name: "Greet word",
            type: "string",
            label: "Gretting",
            control: "input",
            placeholder: "Enter greet"
          }
        ]
      }
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
