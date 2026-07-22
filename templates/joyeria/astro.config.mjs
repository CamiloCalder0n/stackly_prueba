// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Cambia `site` por el dominio real del cliente antes de desplegar.
export default defineConfig({
  site: 'https://aurea.stackly.co',
  integrations: [
    // El panel de contenido no debe indexarse ni aparecer en el sitemap.
    sitemap({ filter: (pagina) => !pagina.includes('/admin') }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
