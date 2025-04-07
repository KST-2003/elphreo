// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add this
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Add this line
    }
  },
  assetsInclude: ["**/*.PNG"],
  server: {
    host: true, // or '0.0.0.0'
  }
  
});