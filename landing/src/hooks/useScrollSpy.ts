import { useState, useEffect } from 'react';

// La implementación vive en `lib/scroll.ts` — no es un hook, así que no tiene
// por qué estar aquí. Se reexporta para no romper los imports existentes.
export {
  getHeaderOffset,
  prefersReducedMotion,
  scrollToSection,
} from '../lib/scroll';

import { getHeaderOffset } from '../lib/scroll';

/** Mantiene sincronizado el alto del header cuando se cruza el breakpoint `lg`. */
export function useHeaderOffset(): number {
  const [offset, setOffset] = useState(getHeaderOffset);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setOffset(getHeaderOffset());
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return offset;
}

/**
 * Marca la sección visible dominante: la que ocupa más píxeles de la franja
 * activa (desde debajo del header hasta el 60% del viewport). Se calcula por
 * posición en cada scroll —no por el orden en que dispara IntersectionObserver—
 * para que al subir gane la sección de arriba y no la última del documento.
 * Devuelve `null` cuando ninguna sección ocupa la franja (p. ej. sobre el footer).
 */
export function useScrollSpy(sectionIds: string[], offset?: number): string | null {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const headerOffset = useHeaderOffset();
  const bandTop = offset ?? headerOffset;
  // Clave estable: permite pasar un array literal sin re-suscribirse en cada render.
  const idsKey = sectionIds.join('|');

  useEffect(() => {
    const ids = idsKey.split('|').filter(Boolean);
    let frame = 0;

    const compute = () => {
      frame = 0;
      const bandBottom = window.innerHeight * 0.6;

      let best: string | null = null;
      let bestVisible = 0;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const visible = Math.min(rect.bottom, bandBottom) - Math.max(rect.top, bandTop);
        if (visible > bestVisible) {
          bestVisible = visible;
          best = id;
        }
      }

      // Al final de la página la última sección puede quedar fuera de la franja:
      // sin esto el nav se apagaría justo cuando el usuario está en "Contacto".
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        for (let i = ids.length - 1; i >= 0; i--) {
          if (document.getElementById(ids[i])) {
            best = ids[i];
            break;
          }
        }
      }

      setActiveSection((prev) => (prev === best ? prev : best));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [idsKey, bandTop]);

  return activeSection;
}
