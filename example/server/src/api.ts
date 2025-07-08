import { Hono } from "hono";
import { cors } from "hono/cors";
import { Engine } from "./engine";
import type { Context } from "hono";
import type { Workflow } from "./types";

const app = new Hono();

app.use("/*", cors({
  origin: ["http://localhost:3099", "http://localhost:5173"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

app.get("/", (c: Context) => {
  return c.text("Server is running!");
});

app.post("/run", async (c: Context) => {
  try {
    const workflow = await c.req.json<Workflow>();
    await Engine.run(workflow);
    return c.json({ status: "ok" }, 200);
  } catch (err) {
    console.log(err);
    return c.json({ status: "error", message: (err as Error).message }, 500);
  }
});

export default app;
