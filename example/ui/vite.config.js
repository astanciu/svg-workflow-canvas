import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "svg-workflow-canvas": resolve(__dirname, "../src"),
    },
  },
  server: {
    port: 3099,
  },
});
