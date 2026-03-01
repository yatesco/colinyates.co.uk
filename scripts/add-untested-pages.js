// scripts/add-untested-pages.js
// Adds any untested blog pages from src/blog to tests/visual-regression.spec.ts without removing any existing entries.


import { getCollection } from 'astro:content';
import fs from 'fs';
import path from 'path';

const SPEC_FILE = path.join(process.cwd(), 'tests/visual-regression.spec.ts');

async function getBlogUrls() {
    // getCollection returns all entries in the 'blog' collection
    const entries = await getCollection('blog');
    // Determine URLs for each entry (adjust if your routing differs)
    return entries.map(entry => `/posts/${entry.slug || entry.id}`);
}

function getCurrentBlogUrls(specPath) {
    const content = fs.readFileSync(specPath, 'utf8');
    const match = content.match(/const blogUrls = \[(.*?)\]/s);
    if (!match) return [];
    return match[1]
        .split(',')
        .map(line => line.trim().replace(/^['"]|['"],?$/g, ''))
        .filter(Boolean);
}

function appendNewUrlsToSpec(specPath, newUrls) {
    let content = fs.readFileSync(specPath, 'utf8');
    const match = content.match(/const blogUrls = \[(.*?)\]/s);
    if (!match) throw new Error('blogUrls array not found');
    const existing = getCurrentBlogUrls(specPath);
    const toAdd = newUrls.filter(url => !existing.includes(url));
    if (toAdd.length === 0) return false;
    const insert = toAdd.map(url => `    '${url}',`).join('\n');
    const updated = content.replace(
        /const blogUrls = \[(.*?)\]/s,
        (m, g1) => `const blogUrls = [${g1}\n${insert}\n]`
    );
    fs.writeFileSync(specPath, updated, 'utf8');
    return true;
}

// Main
getBlogUrls().then(blogPages => {
    const changed = appendNewUrlsToSpec(SPEC_FILE, blogPages);
    if (changed) {
        console.log('Added new blog pages to visual-regression.spec.ts');
    } else {
        console.log('No new blog pages to add.');
    }
});
