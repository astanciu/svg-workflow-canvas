export const greet = {
  id: "greet",
  async action(instanceId: string, data?: Record<string, any>) {
    console.log(instanceId, data)
  },
};