// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const normalizeTags = z
  .array(z.string())
  .default([])
  .transform((tags) =>
    tags
      .map((t) => t.trim())
      .filter(Boolean)
  );

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
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

// books（蔵書一覧）の表示仕様は廃止。コレクション定義とページを削除した。
// データ自体は src/content/books/library.json に残置。

export const collections = { posts };
