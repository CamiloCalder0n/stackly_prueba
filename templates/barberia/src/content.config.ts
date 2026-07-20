/**
 * Colecciones de contenido editables desde Decap CMS (/admin).
 *
 * - servicios → alimenta la sección "Servicios y precios" Y el paso 1 del
 *   wizard de reserva (la duración define las franjas horarias).
 * - barberos  → alimenta la sección "Equipo" Y el paso 2 del wizard
 *   (solo los marcados como activos).
 *
 * Los horarios de apertura viven en src/data/horarios.json (paso 3 del wizard).
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const servicios = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/servicios' }),
  schema: z.object({
    nombre: z.string(),
    descripcion: z.string(),
    /** Duración en minutos: define las franjas del wizard. */
    duracion: z.number().int().positive(),
    /** Precio en pesos colombianos, sin puntos. */
    precio: z.number().int().nonnegative(),
    /** Menor número aparece primero. */
    orden: z.number().int(),
  }),
});

const barberos = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/barberos' }),
  schema: z.object({
    nombre: z.string(),
    /** URL de la foto (Unsplash en el demo) o imagen subida al CMS. */
    foto: z.string(),
    especialidad: z.string(),
    instagram: z.string().optional(),
    /** Si está inactivo no aparece ni en el equipo ni en el wizard. */
    activo: z.boolean().default(true),
  }),
});

export const collections = { servicios, barberos };
