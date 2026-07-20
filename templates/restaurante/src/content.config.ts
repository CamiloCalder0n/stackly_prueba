/**
 * Colecciones de contenido (Astro 5 content layer).
 *
 * - categorias → src/content/categorias/*.json  (secciones del menú)
 * - platos     → src/content/platos/*.json      (cada plato de la carta)
 *
 * Ambas se editan sin tocar código desde /admin (Decap CMS).
 * El campo `categoria` de un plato referencia el archivo de la
 * categoría por su slug (nombre de archivo sin extensión).
 */
import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const categorias = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/categorias' }),
  schema: z.object({
    nombre: z.string(),
    /** Posición de la sección en el menú (menor = primero). */
    orden: z.number(),
  }),
});

const platos = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/platos' }),
  schema: z.object({
    nombre: z.string(),
    descripcion: z.string(),
    /** Precio en pesos colombianos, sin puntos: 38000 */
    precio: z.number(),
    /** Foto del plato (URL o imagen subida desde el panel). */
    foto: z.string(),
    categoria: reference('categorias'),
    etiquetas: z.array(z.enum(['vegetariano', 'picante', 'nuevo'])).default([]),
    /** false → el plato se muestra como "Agotado" (no desaparece). */
    disponible: z.boolean().default(true),
    /** true → aparece en "Los favoritos de la casa" en la portada. */
    destacado: z.boolean().default(false),
  }),
});

export const collections = { categorias, platos };
