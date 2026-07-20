import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Colecciones de contenido de la plantilla joyería.
 * Los campos coinciden 1:1 con los del panel Decap (public/admin/config.yml):
 * si agregas un campo aquí, agrégalo también allá.
 */

/** Piezas del catálogo: cada archivo .md en src/content/piezas es una joya. */
const piezas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/piezas' }),
  schema: z.object({
    nombre: z.string(),
    /** Referencia interna (va en el mensaje de WhatsApp y en el schema.org). */
    referencia: z.string(),
    /** Slug de la URL: /piezas/<slug> */
    slug: z.string(),
    /** 1 a 6 fotos. La primera es la portada en el catálogo. */
    fotos: z.array(z.string()).min(1).max(6),
    categoria: z.enum(['anillos', 'collares', 'aretes', 'pulseras']),
    material: z.enum(['oro', 'plata', 'oro rosa']),
    piedras: z.string().optional(),
    peso: z.string().optional(),
    tallas: z.string().optional(),
    /** Precio en COP. Déjalo vacío o activa ocultarPrecio para mostrar "Consultar precio". */
    precio: z.number().optional(),
    ocultarPrecio: z.boolean().default(false),
    descripcion: z.string(),
    disponibilidad: z.enum(['disponible', 'por encargo']),
    /** Las destacadas aparecen en la portada del sitio. */
    destacada: z.boolean().default(false),
  }),
});

/** Colecciones/líneas de la marca que se muestran en la portada. */
const colecciones = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/colecciones' }),
  schema: z.object({
    nombre: z.string(),
    descripcion: z.string(),
    portada: z.string(),
    /** Orden de aparición en la portada (menor = primero). */
    orden: z.number().default(0),
  }),
});

export const collections = { piezas, colecciones };
