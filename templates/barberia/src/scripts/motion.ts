/**
 * Núcleo de movimiento compartido.
 *
 * Aquí solo vive el arranque de GSAP y las utilidades que otras páginas
 * necesitan importar. El comportamiento declarativo con atributos `data-*`
 * está en animations.ts.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

export { gsap, ScrollTrigger, SplitText, Flip };

/** Curva de movimiento de la marca: lenta, sin rebotes. */
export const SILK = 'expo.out';

/** `true` si el sistema pide menos movimiento. Se consulta en caliente. */
export function menosMovimiento(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Recompone una grilla animando el cambio de posición de sus hijos.
 * Útil si en el futuro el wizard o la galería filtran contenido en vivo:
 * en vez de un parpadeo, los elementos se deslizan hasta su nueva posición.
 *
 * @param contenedor  la grilla
 * @param cambiar     función que aplica el cambio de DOM (ocultar/mostrar/reordenar)
 */
export function recomponerGrilla(contenedor: HTMLElement, cambiar: () => void): void {
  if (menosMovimiento()) {
    cambiar();
    return;
  }

  const hijos = contenedor.children;
  const estado = Flip.getState(hijos);
  cambiar();

  Flip.from(estado, {
    duration: 0.62,
    ease: 'power2.inOut',
    absolute: true,
    scale: false,
    // Los elementos que entran no tienen estado previo: aparecen desde abajo.
    onEnter: (elementos) =>
      gsap.fromTo(
        elementos,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, ease: SILK, stagger: 0.03 },
      ),
    onLeave: (elementos) => gsap.to(elementos, { opacity: 0, duration: 0.25, ease: 'power3.in' }),
  });
}
