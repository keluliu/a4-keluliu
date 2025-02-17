import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs-extra";

fs.copySync("frontend/public/css", "dist/assets");

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    cors: {
      origin: process.env.VITE_API_URL || "http://localhost:3000",
      credentials: true,
    },
  },
  resolve: {
    extensions: [".js", ".jsx"], // ✅ Ensures JSX files work correctly
  },
  build: {
    outDir: "dist", // ✅ Ensure correct build output for serving in Express
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.some(n => n.endsWith(".css"))) {
            return "assets/[name].css"; // ✅ Uses "names" instead of deprecated "name"
          }
          return "assets/[name]-[hash].[ext]";
        }
      },
    },
  },
});