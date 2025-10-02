import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
      "~entities": fileURLToPath(new URL("./src/entities", import.meta.url)),
      "~widgets": fileURLToPath(new URL("./src/widgets", import.meta.url)),
      "~pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
      "~app": fileURLToPath(new URL("./src/app", import.meta.url))
    }
  },
});
