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
import { defineCollection } from 'astro:content';
import { z } from 'zod';
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
  /** `image()` exige que la foto viva en src/assets (no en public/ ni en una
      URL externa): así Astro la procesa en el build y la sirve en AVIF con
      srcset, igual que cualquier otra foto de la plantilla. */
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      foto: image(),
      especialidad: z.string(),
      /** Años de oficio del barbero. Es la señal de confianza #1 que el
          benchmark de barberías colombianas no resuelve: solo 1 de 13
          competidores deja elegir barbero con una ficha real, y ninguno
          publica su experiencia. */
      aniosOficio: z.number().int().positive(),
      instagram: z.string().optional(),
      /** Si está inactivo no aparece ni en el equipo ni en el wizard. */
      activo: z.boolean().default(true),
    }),
});

export const collections = { servicios, barberos };
