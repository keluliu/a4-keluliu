import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    cors: {
      origin: "http://localhost:3000" || process.env.VITE_API_URL,
      credentials: true,
    },
  },
  resolve: {
    extensions: [".js", ".jsx"], // ✅ Ensures JSX files work correctly
  },
  build: {
    outDir: "dist", // ✅ Ensure correct build output for serving in Express
  },
});