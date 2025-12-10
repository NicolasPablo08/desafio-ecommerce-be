import { defineConfig } from "vitest/config";
import path from "path";

import "dotenv/config";

export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"), // Asegúrate de que esto coincida con tu estructura de carpetas
    },
  },
  test: {
    environment: "node",
  },
});
