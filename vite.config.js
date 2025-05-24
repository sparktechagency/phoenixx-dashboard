import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // host: "168.231.64.178",
    host: "10.0.60.210",
    port: 4174,
  },
  preview: {
    // host: "168.231.64.178", // or "0.0.0.0" if preferred
    host: "0.0.0.0",
    port: 4174,
    allowedHosts: ["*"],
  },
});
