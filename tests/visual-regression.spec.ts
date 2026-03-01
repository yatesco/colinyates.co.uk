import { test, expect } from '@playwright/test';

// List of blog URLs to check (add more as needed)
const blogUrls = [
    '/posts/2015-08-26-blogging-software',
    '/posts/2015-09-05-bye-bye-ovh-hello-github-pages',
    '/posts/2015-09-05-org-mode-jekyll-and-image-links',
    '/posts/2015-09-06-printer-cartridges-wow',
    '/posts/2016-09-25-hello-again',
    '/posts/2016-09-26-lessons-learned-with-clojures-stacktraces',
    '/posts/2016-09-27-git-tagging-your-builds-automatically',
    '/posts/2016-09-28-git-tagging-project',
    '/posts/2016-09-28-keeping-project-buffers-tidy-with-projectile',
    '/posts/2016-09-29-circle-ci-and-phantomjs',
    '/posts/2016-09-29-circleci-phantomjs',
    '/posts/2016-09-29-prismatic-schema',
    '/posts/2016-09-29-pydio-seafile',
    '/posts/2016-10-01-moving-to-seafile-from-pydio',
    '/posts/2016-10-06-just-checking-in',
    '/posts/2016-10-06-quick-update-on-seafile-and-plex',
    '/posts/2016-10-07-lost',
    '/posts/2016-10-16-cancelling-an-online-dot-net-server',
    '/posts/2016-11-08-abstractions',
    '/posts/2016-11-10-helm-ag-ignore-files',
    '/posts/2016-11-11-speeding-up-clojurescript',
    '/posts/2016-11-17-a-moan-about-apple',
    '/posts/2016-12-02-managing-dependant-projects-with-leiningen',
    '/posts/2016-12-08-ssh-keys-and-unraid',
    '/posts/2017-02-14-osx-and-cpan',
    '/posts/2017-10-11-an-experiment-in-blogging',
    '/posts/2017-10-15-modules-within-emacs',
    '/posts/2024-12-26-emailing-a-contact-us-form',
];

for (const url of blogUrls) {
    for (const browser of ['chromium', 'webkit']) {
        test.describe(`${browser} visual regression for ${url}`, () => {
            test(`${browser} - ${url} should match screenshot`, async ({ page, browserName }) => {
                test.skip(browserName !== browser, `Only run on ${browser}`);
                await page.goto(`http://localhost:3000${url}`);
                await expect(page).toHaveScreenshot(`${browser}-${url.replace(/\//g, '_').toLowerCase()}.png`, { fullPage: true });
            });
        });
    }
}
