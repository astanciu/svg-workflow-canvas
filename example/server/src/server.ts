import { serve } from "@hono/node-server";
import app from "./api";

serve({ fetch: app.fetch, port: 3100 }, () => {
  console.log("Server running on http://localhost:3100");
});
