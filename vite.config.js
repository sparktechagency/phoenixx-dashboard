import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "168.231.64.178",
    port: 4175,
    allowedHosts: [
      "dashboard.mehor.com",
      "www.dashboard.mehor.com",
      "api.mehor.com",
    ],
  },
  preview: {
    host: "168.231.64.178",
    port: 4175,
    allowedHosts: [
      "dashboard.mehor.com",
      "www.dashboard.mehor.com",
      "api.mehor.com",
    ],
  },
});
