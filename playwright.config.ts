import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'src/tests',
  timeout: 65000,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    headless: false, // Run all tests in headless mode by default
    viewport: { width: 1920, height: 1080 }, // Prevent mobile layout
    launchOptions: {
      args: ['--window-size=1920,1080'], // Ensures proper viewport size in headless mode
    },
    ignoreHTTPSErrors: true,
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chromium'],
        viewport: null, // Let the browser decide the size
        launchOptions: {
          args: ['--start-maximized'], // Maximized window in non-headless mode
        },
      },
    },
  ],
});
