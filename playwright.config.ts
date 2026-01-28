import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: "http://localhost:3101",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run start:docusaurus -- --port 3101 --no-open",
    url: "http://localhost:3101/javascript-course-docs/",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
