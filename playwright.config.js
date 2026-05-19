import { defineConfig, devices } from "@playwright/test";

const launchTimeout = Number(process.env.PW_LAUNCH_TIMEOUT ?? "15000");

export default defineConfig({
  testDir: "tests",
  timeout: launchTimeout + 5000,
  reporter: [["list"]],
  use: {
    trace: "retain-on-failure",
    launchOptions: {
      timeout: launchTimeout,
    },
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chromium",
      },
    },
  ],
});