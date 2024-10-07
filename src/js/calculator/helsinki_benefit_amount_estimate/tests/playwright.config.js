import { devices } from '@playwright/test';

const config = {
  forbidOnly: !!process.env.CI,
  retries: 0,
  maxFailures: process.env.CI ? 1 : undefined,
  workers: 1,
  timeout: 10000,
  use: {
    viewport: { width: 1280, height: 1280 },
    trace: 'on-first-retry',
    video: 'retry-with-video',
  },
  projects: [
    {
      name: 'Firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'http://localhost:3001/src/js/calculator/helsinki_benefit_amount_estimate/helsinki-benefit-test.html',
},
      testMatch: [/tests\/.*spec\.js/],
    },
  ],
};

export default config;