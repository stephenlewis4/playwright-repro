import { chromium } from "playwright";

const launchTimeout = Number(process.env.PW_LAUNCH_TIMEOUT ?? "15000");

console.log(`Launching Playwright Chromium with timeout ${launchTimeout}ms...`);

const browser = await chromium.launch({
  channel: "chromium",
  timeout: launchTimeout,
});

console.log(`Connected successfully to ${browser.version()}.`);

await browser.close();