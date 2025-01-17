// 1. Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";
// seems we can use this instead of defining a schema manually?
// https://docs.astro.build/en/recipes/rss/#using-content-collections
// import { rssSchema } from '@astrojs/rss';

// 2. Import loader(s)
import { glob } from "astro/loaders";

// 3. Define your collection(s)
const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/blog" }),
  schema: z.object({
    isDraft: z.boolean().default(false),
    title: z.string(),
    author: z.string().default("Colin Yates"),
    language: z.enum(["en", "es"]).default("en"),
    tags: z.array(z.string()).default([]),
    pubDate: z.date(), // e.g. 2024-09-17
  }),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { blog };
