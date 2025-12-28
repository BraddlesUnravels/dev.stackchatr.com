import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "@qwik-client-manifest": "data:text/javascript,export default {}",
      "qwik-client-manifest": "data:text/javascript,export default {}",
    },
  },
  test: {
    environment: "node",
    globals: true,
    // Avoid conflicts with Vite dev server
    pool: "forks",
    // Exclude SSR-related files from test context
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/entry.*.{ts,tsx}",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
    ],
    // Setup module mocking for Qwik dependencies
    setupFiles: ["./vitest.setup.ts"],
  },
});
