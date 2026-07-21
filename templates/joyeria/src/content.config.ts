import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Colecciones de contenido de la plantilla joyería.
 *
 * Los campos coinciden 1:1 con los del panel Decap (public/admin/config.yml):
 * si agregas un campo aquí, agrégalo también allá o el cliente no podrá editarlo.
 *
 * Las fotos usan el helper `image()`: Astro las procesa en el build y sirve
 * AVIF/WebP con srcset y medidas explícitas. Por eso viven en `src/assets/fotos`
 * y se referencian con ruta relativa (`../../assets/fotos/…`), que es
 * exactamente lo que escribe Decap con el `public_folder` configurado.
 */

/** Ocasiones de compra: alimentan el filtro de regalos del catálogo. */
const OCASIONES = ['compromiso', 'matrimonio', 'aniversario', 'cumpleaños', 'uso diario'] as const;

/** Piezas del catálogo: cada archivo .md en src/content/piezas es una joya. */
const piezas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/piezas' }),
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      /** Referencia interna (va en el mensaje de WhatsApp y en el schema.org). */
      referencia: z.string(),
      /** Slug de la URL: /piezas/<slug> */
      slug: z.string(),
      /** 1 a 6 fotos. La primera es la portada en el catálogo. */
      fotos: z.array(image()).min(1).max(6),
      categoria: z.enum(['anillos', 'collares', 'aretes', 'pulseras']),
      material: z.enum(['oro', 'plata', 'oro rosa']),
      /** Ley del metal. Es obligatoria: en Colombia el contraste es requisito
          legal y es el primer dato de confianza que busca el comprador.
          Se normaliza a texto a propósito: YAML lee `950` como número y el
          panel de Decap puede guardarlo sin comillas. */
      ley: z.preprocess((v) => String(v), z.enum(['18k', '14k', '950', '925'])),
      piedras: z.string().optional(),
      /** Certificación de la piedra (GIA, IGI…), si la tiene. */
      certificacion: z.string().optional(),
      peso: z.string().optional(),
      /** Medidas en mm: largo de cadena, ancho de banda, diámetro de argolla. */
      medidas: z.string().optional(),
      acabado: z.string().optional(),
      tallas: z.string().optional(),
      /** Precio en COP. Déjalo vacío o activa ocultarPrecio para "Consultar precio". */
      precio: z.number().optional(),
      ocultarPrecio: z.boolean().default(false),
      descripcion: z.string(),
      disponibilidad: z.enum(['disponible', 'por encargo']),
      /** Unidades en vitrina. Con 1 se muestra "Pieza única". */
      unidades: z.number().optional(),
      /** Días hábiles de fabricación cuando la pieza es por encargo. */
      diasEncargo: z.number().optional(),
      ocasion: z.array(z.enum(OCASIONES)).default([]),
      /** Admite grabado personalizado (se ofrece en la ficha). */
      grabable: z.boolean().default(false),
      nuevo: z.boolean().default(false),
      /** Las destacadas aparecen en la portada del sitio. */
      destacada: z.boolean().default(false),
    }),
});

/** Colecciones/líneas de la marca que se muestran en la portada. */
const colecciones = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/colecciones' }),
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      descripcion: z.string(),
      portada: image(),
      /** Orden de aparición en la portada (menor = primero). */
      orden: z.number().default(0),
    }),
});

export const collections = { piezas, colecciones };
