import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/bohr-blackbody-solar/",
  resolve: {
    alias: {
      "plotly.js/dist/plotly": path.resolve(
        __dirname,
        "node_modules/plotly.js-dist-min/plotly.min.js"
      ),
    },
  },
  plugins: [react()],
});
