import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the build works both locally and on GitHub Pages
// (project site at /<repo>/) without hardcoding the repo path.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
