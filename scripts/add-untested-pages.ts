// scripts/add-untested-pages.ts
// Adds any untested blog pages from src/blog to tests/visual-regression.spec.ts without removing any existing entries.


import fs from 'node:fs';
import path from 'node:path';

const BLOG_DIR = path.join(process.cwd(), 'src/blog');
const SPEC_FILE = path.join(process.cwd(), 'tests/visual-regression.spec.ts');

function getBlogMarkdownFiles(dir: string): string[] {
    return fs.readdirSync(dir)
        .filter(f => f.endsWith('.md'))
        .map(f => `/posts/${f.replace(/\.md$/, '')}`.toLowerCase());
}

function getCurrentBlogUrls(specPath: string): string[] {
    const content = fs.readFileSync(specPath, 'utf8');
    const match = content.match(/const blogUrls = \[(.*?)\]/s);
    if (!match) return [];
    return match[1]
        .split(',')
        .map(line => line.trim().replace(/^['"]|['"],?$/g, ''))
        .filter(Boolean);
}

function appendNewUrlsToSpec(specPath: string, newUrls: string[]): boolean {
    let content = fs.readFileSync(specPath, 'utf8');
    // Match blogUrls array, allowing for comments and whitespace
    const match = content.match(/const blogUrls = \[(.*?)\]/s);
    if (!match) {
        // If not found, add a new array at the top of the file
        const insert = newUrls.filter(Boolean).map(url => `    '${url}',`).join('\n');
        const newArray = `const blogUrls = [\n${insert}\n];\n`;
        content = newArray + content;
        fs.writeFileSync(specPath, content, 'utf8');
        return true;
    }
    const existing = getCurrentBlogUrls(specPath);
    // Filter out any empty or falsy URLs
    const toAdd = newUrls
        .map(url => url.toLowerCase())
        .filter(url => url && !existing.map(e => e.toLowerCase()).includes(url));
    if (toAdd.length === 0) return false;
    // Remove any trailing blank/comment lines from the array before appending
    let arrayContent = match[1]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('//'))
        .join('\n');
    const insert = toAdd.map(url => `    '${url}',`).join('\n');
    // Ensure correct formatting for empty arrays
    const updated = content.replace(
        /const blogUrls = \[(.*?)\]/s,
        () => `const blogUrls = [${arrayContent ? '\n' + arrayContent + '\n' : '\n'}${insert}\n]`
    );
    fs.writeFileSync(specPath, updated, 'utf8');
    return true;
}

// Main
(async () => {
    const blogPages = getBlogMarkdownFiles(BLOG_DIR);
    const changed = appendNewUrlsToSpec(SPEC_FILE, blogPages);
    if (changed) {
        console.log('Added new blog pages to visual-regression.spec.ts');
    } else {
        console.log('No new blog pages to add.');
    }
})();
