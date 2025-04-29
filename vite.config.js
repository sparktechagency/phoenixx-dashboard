import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    // host: "168.231.64.178",
    host: "10.0.60.210",
    port: 4173,
  },
});
