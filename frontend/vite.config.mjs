import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  // Build output directory (matches nginx root)
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
  },

  plugins: [
    tsconfigPaths(),
    react(),
    tagger()
  ],

  // Dev server only (NOT used in production)
  server: {
    port: 3000,
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: "all"
  }
});

