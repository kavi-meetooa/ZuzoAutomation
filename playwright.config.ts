import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '../tests', // Directory containing test files
  timeout: 30000, // Test timeout
  retries: 1, // Retry failed tests once
  reporter: [['list'], ['html', { open: 'never' }]], // CLI and HTML report
  use: {
    headless: false, // Run in headed mode by default
    viewport: { width: 1280, height: 720 }, // Default viewport size
    ignoreHTTPSErrors: true, // Ignore HTTPS errors
    screenshot: 'on', // Capture screenshot on failure
    video: 'retain-on-failure', // Retain video for failed tests
    trace: 'on-first-retry', // Collect trace on first retry
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }, // Test only in Chromium
    },
  ],
});
