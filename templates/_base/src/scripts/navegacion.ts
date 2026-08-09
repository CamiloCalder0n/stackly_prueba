/**
 * Navegación del sitio, en un solo lugar.
 *
 * Todas las páginas importan de aquí para que el menú no se desincronice
 * entre secciones. Al especializar por nicho, esto es de lo primero que
 * hay que reescribir.
 */
export interface Enlace {
  label: string;
  href: string;
}

/** Menú principal del header. Máximo cinco entradas: más no caben cómodas. */
export const NAV: Enlace[] = [
  { label: 'Servicios', href: '/#servicios' },
  { label: 'Testimonios', href: '/#testimonios' },
  { label: 'Preguntas', href: '/#faq' },
  { label: 'Contacto', href: '/#contacto' },
];

/** Pie de página: suma los enlaces de servicio que no caben en el header. */
export const NAV_FOOTER: Enlace[] = [...NAV];
