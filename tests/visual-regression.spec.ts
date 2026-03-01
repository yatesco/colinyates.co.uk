import { test, expect } from '@playwright/test';

// List of blog URLs to check (add more as needed)
const blogUrls = [
    '/posts/2015-08-26-blogging-software',
    '/posts/2015-09-05-bye-bye-ovh-hello-github-pages',
    '/posts/2015-09-05-org-mode-jekyll-and-image-links',
    '/posts/2015-09-06-printer-cartridges-wow',
    '/posts/2016-09-25-hello-again',
];

for (const url of blogUrls) {
    for (const browser of ['chromium', 'webkit']) {
        test.describe(`${browser} visual regression for ${url}`, () => {
            test(`${browser} - ${url} should match screenshot`, async ({ page, browserName }) => {
                test.skip(browserName !== browser, `Only run on ${browser}`);
                await page.goto(`http://localhost:3000${url}`);
                await expect(page).toHaveScreenshot(`${browser}-${url.replace(/\//g, '_')}.png`, { fullPage: true });
            });
        });
    }
}
