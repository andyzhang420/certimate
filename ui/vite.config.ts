import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, Plugin } from "vite";

import fs from "fs-extra";

const preserveFilesPlugin = (filesToPreserve: string[]): Plugin => {
  return {
    name: "preserve-files",
    apply: "build",
    buildStart() {
      // 在构建开始时将要保留的文件或目录移动到临时位置
      filesToPreserve.forEach((file) => {
        const srcPath = path.resolve(__dirname, file);
        const tempPath = path.resolve(__dirname, `temp_${file}`);
        if (fs.existsSync(srcPath)) {
          fs.moveSync(srcPath, tempPath, { overwrite: true });
        }
      });
    },
    closeBundle() {
      // 在构建完成后将临时位置的文件或目录移回原来的位置
      filesToPreserve.forEach((file) => {
        const srcPath = path.resolve(__dirname, file);
        const tempPath = path.resolve(__dirname, `temp_${file}`);
        if (fs.existsSync(tempPath)) {
          fs.moveSync(tempPath, srcPath, { overwrite: true });
        }
      });
    },
  };
};

export default defineConfig({
  plugins: [react(), preserveFilesPlugin(["dist/.gitkeep"])],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8090",
    },
  },
});
