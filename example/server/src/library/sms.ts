export const sms = {
  id: "sms",
  async action(instanceId: string, data?: Record<string, any>) {
    console.log(instanceId, data)
  },
};