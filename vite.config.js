import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
  css: {
    postcss: "./postcss.config.js", // Ensure postcss is loaded properly
  },
  build: {
    outDir: "dist", // ✅ Ensure correct build output for serving in Express
  },
});