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
  { label: 'Inicio', href: '/' },
  { label: 'Catálogo', href: '/catalogo' },
  { label: 'Guía de tallas', href: '/guia-de-tallas' },
  { label: 'Encargos', href: '/encargos' },
];
