export const last = {
  id: "last",
  async action(instanceId: string, data?: Record<string, any>) {
    console.log(instanceId, data)
  },
};