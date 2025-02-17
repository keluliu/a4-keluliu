import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs-extra";

//fs.copySync("frontend/public/css", "dist/assets");

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 5173,
    strictPort: true,
    cors: {
      origin: "*",
      credentials: true,
    },
  },
  resolve: {
    extensions: [".js", ".jsx"], // ✅ Ensures JSX files work correctly
  },
});