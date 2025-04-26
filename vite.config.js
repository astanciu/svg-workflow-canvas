import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "classic",
      include: ["**/*.jsx", "**/*.tsx"],
    }),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "SVGWorkflowCanvas",
      fileName: (format) => `svg-workflow-canvas.${format}.js`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      // Externalize React to avoid bundling it
      external: ["react", "react-dom"],
      output: {
        // Global variables to use in UMD build
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        // Preserve modules for better tree-shaking in consuming projects
        preserveModules: false,
        preserveModulesRoot: "src",
        // Fix the named exports warning
        exports: "named",
      },
    },
    // Properly extract CSS
    cssCodeSplit: true,
    // Avoid minification for better debugging
    minify: false,
    sourcemap: true,
  },
});
