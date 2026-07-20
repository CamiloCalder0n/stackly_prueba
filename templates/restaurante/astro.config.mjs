// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Cambia `site` por el dominio real del cliente antes de desplegar.
export default defineConfig({
  site: 'https://laterraza.stackly.co',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
