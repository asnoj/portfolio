import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base relative : le dossier dist/ fonctionne servi à la racine comme dans un sous-dossier
export default defineConfig({
  base: "./",
  plugins: [react()],
});
