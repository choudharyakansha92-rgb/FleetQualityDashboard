import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  root: process.cwd(),
  resolve: {
    alias: {
      "@": path.join(process.cwd(), "src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: path.join(process.cwd(), "dist"),
    emptyOutDir: true,
    sourcemap: false,
  },
});
