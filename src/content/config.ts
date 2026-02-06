// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const normalizeTags = z
  .array(z.string())
  .default([])
  .transform((tags) =>
    tags
      .map((t) => t.trim())
      .filter(Boolean)
  );

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    draft: z.boolean().optional(),
    // tags は「無い記事」も想定して default([]) に寄せる
    tags: normalizeTags,
  }),
});

const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  authors: z.array(z.string()).default([]),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  year: z.number().int().optional(),
  isbn: z.string().optional(),
  url: z.string().url().optional(),
  notes: z.string().optional(),
});

// library.json が Book[] なので、ここは配列スキーマにする
const books = defineCollection({
  type: 'data',
  schema: z.array(bookSchema),
});

export const collections = { posts, books };
