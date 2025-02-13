import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'src/tests',
  timeout: 65000,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    headless: true, // Run in headful mode (browser UI visible)
    ignoreHTTPSErrors: true,
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        launchOptions: {
          args: ['--start-maximized'], // Start browser maximized
        },
      },
    },
  ],
});
