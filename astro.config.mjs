// astro.config.mjs
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import remarkAlerts from 'remark-alerts';

// https://astro.build/config
export default defineConfig({
  // 旧URL（テンプレート名残）から現行URLへリダイレクト
  redirects: {
    '/use-cases': '/portfolio',
  },
  integrations: [react()],
  markdown: {
    remarkPlugins: [remarkAlerts],
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
