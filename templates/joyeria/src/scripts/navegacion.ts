/**
 * Navegación del sitio, en un solo lugar.
 *
 * Todas las páginas importan de aquí para que el menú no se desincronice
 * entre la portada, el catálogo y las fichas.
 */
export interface Enlace {
  label: string;
  href: string;
}

/** Menú principal del header. */
export const NAV: Enlace[] = [
  { label: 'Catálogo', href: '/catalogo' },
  { label: 'Colecciones', href: '/#colecciones' },
  { label: 'El taller', href: '/#taller' },
  { label: 'Guía de tallas', href: '/guia-de-tallas' },
  { label: 'Encargos', href: '/encargos' },
];

/** Pie de página: suma los enlaces de servicio que no caben en el header. */
export const NAV_FOOTER: Enlace[] = [
  ...NAV,
  { label: 'Preguntas frecuentes', href: '/#faq' },
  { label: 'Visítanos', href: '/#contacto' },
];
