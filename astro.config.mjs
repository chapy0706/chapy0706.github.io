// astro.config.mjs
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import remarkAlerts from 'remark-alerts';

// https://astro.build/config
export default defineConfig({
  // 旧URL（テンプレート名残）から現行URLへリダイレクト
  redirects: {
    '/use-cases': '/portfolio',
  },
  integrations: [react()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkAlerts],
    }),
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
