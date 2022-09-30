import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  root: process.cwd(),
  base: "/",
  plugins: [react()],
  server: {
    host: "192.168.10.79",
    port: 3000,
  },
});
