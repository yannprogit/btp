import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    exclude: ["msw"],
  },
  build: {
    rollupOptions: {
      external: ["msw"],
    },
  },
});