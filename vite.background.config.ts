import { defineConfig } from "vite";
import { resolve } from "path";

// Background Service Worker 빌드 설정 (IIFE)
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/background.ts"),
      name: "CetBackground",
      formats: ["iife"],
      fileName: () => "background.js",
    },
    rollupOptions: {
      output: {
        extend: true,
      },
    },
  },
});
