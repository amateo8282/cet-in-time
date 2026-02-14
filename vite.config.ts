import { defineConfig } from "vite";
import { resolve } from "path";

// 팝업 페이지 빌드 설정
export default defineConfig({
  root: resolve(__dirname, "src/presentation/popup"),
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/presentation/popup/index.html"),
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
});
