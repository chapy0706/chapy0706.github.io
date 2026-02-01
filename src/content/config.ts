// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
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
