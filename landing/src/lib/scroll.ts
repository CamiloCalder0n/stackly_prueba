/**
 * Desplazamiento a una sección de la página — implementación única.
 *
 * La función estaba copiada en Header, Hero, Footer y dos veces inline en
 * el JSX de Portfolio y About. Varias de esas copias llamaban a
 * `scrollIntoView({ behavior: 'smooth' })` a secas: no compensaban el
 * header fijo (el título quedaba tapado) ni respetaban
 * `prefers-reduced-motion`.
 *
 * Vive en `lib/` y no en `hooks/` porque no es un hook: no usa estado ni
 * efectos y se llama desde manejadores de evento. `hooks/useScrollSpy.ts`
 * puede reexportarla para no romper los imports que ya existen.
 */

/** Alto del header fijo: `h-16` (64px) en móvil, `h-20` (80px) desde `lg`. */
const HEADER_HEIGHT_MOBILE = 64;
const HEADER_HEIGHT_DESKTOP = 80;

/** Punto de corte `lg` de Tailwind, donde el header pasa a 80px. */
const LG_BREAKPOINT = '(min-width: 1024px)';

export function getHeaderOffset(): number {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return HEADER_HEIGHT_MOBILE;
  }
  return window.matchMedia(LG_BREAKPOINT).matches
    ? HEADER_HEIGHT_DESKTOP
    : HEADER_HEIGHT_MOBILE;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface ScrollToSectionOptions {
  /** Píxeles extra de aire por encima de la sección, además del header. @default 0 */
  extraOffset?: number;
  /**
   * Mueve el foco al destino para que la navegación por teclado continúe
   * desde ahí y no desde el enlace que se acaba de pulsar.
   * @default true
   */
  focusTarget?: boolean;
}

/**
 * Lleva el scroll hasta la sección indicada, dejándola justo debajo del
 * header fijo. Usa desplazamiento suave salvo que el sistema pida
 * movimiento reducido, en cuyo caso salta de golpe.
 *
 * @param target  Identificador de la sección, con o sin `#`
 *                (`'contacto'` y `'#contacto'` son equivalentes).
 * @returns       `false` si el ancla no existe — así el llamador puede no
 *                tragarse el clic en silencio.
 *
 * @example
 * import { scrollToSection } from '../lib/scroll';
 *
 * <button onClick={() => scrollToSection('#contacto')}>Hablemos</button>
 */
export function scrollToSection(
  target: string,
  options: ScrollToSectionOptions = {}
): boolean {
  if (typeof document === 'undefined') return false;

  const el = document.getElementById(target.replace(/^#/, ''));
  if (!el) return false;

  const top =
    el.getBoundingClientRect().top +
    window.scrollY -
    getHeaderOffset() -
    (options.extraOffset ?? 0);

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  });

  if (options.focusTarget !== false) {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }

  return true;
}
