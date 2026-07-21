/**
 * Sistema de animaciones del template (GSAP + ScrollTrigger + Lenis).
 *
 * Se controla 100% con atributos data-* en el HTML — no escribas GSAP por página:
 *   data-reveal                → el elemento aparece al entrar en viewport
 *   data-reveal-group          → los HIJOS directos aparecen escalonados
 *   data-split                 → titular que sube línea por línea desde su máscara
 *   data-split="hero"          → igual, pero al cargar la página (sin esperar scroll)
 *   data-rule                  → filete que se dibuja de izquierda a derecha
 *   data-reveal-mask           → imagen que se revela con máscara + zoom-out lento
 *   data-parallax="0.14"       → parallax sutil (factor de desplazamiento)
 *   data-counter="4800"        → cuenta de 0 al número al entrar en viewport
 *   data-marquee               → cinta infinita (duplica su contenido en el DOM)
 *   data-horizontal            → sección que avanza en horizontal mientras se ancla
 *                                (solo ≥1024px; en móvil queda como pila vertical)
 *
 * Reglas de la casa:
 * · La clase `motion` se añade al <html> SOLO si GSAP cargó bien. Si este
 *   script falla, el CSS nunca esconde nada y la página se ve completa.
 * · Todo se monta dentro de gsap.matchMedia(), así que con "reducir
 *   movimiento" activo no se crea ni una animación y Lenis ni se instancia.
 * · Se re-inicializa en cada navegación del ClientRouter de Astro.
 */
import Lenis from 'lenis';
import { gsap, ScrollTrigger, SplitText, SILK } from './motion';

/* El CSS solo esconde elementos si esta clase existe. Llegar hasta aquí
   significa que GSAP se cargó y que sabemos revelarlos. */
document.documentElement.classList.add('motion');

let lenis: Lenis | null = null;
let contexto: gsap.Context | null = null;

/** Scroll suave. Se crea una sola vez y sobrevive a las navegaciones. */
function iniciarLenis(): void {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  lenis = new Lenis({ lerp: 0.12 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((tiempo) => lenis?.raf(tiempo * 1000));
  gsap.ticker.lagSmoothing(0);

  // Los enlaces de ancla deben pasar por Lenis o el salto se ve seco.
  document.addEventListener('click', (e) => {
    const enlace = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
    if (!enlace) return;
    const id = enlace.getAttribute('href')!.slice(1);
    const destino = id && document.getElementById(id);
    if (!destino) return;
    e.preventDefault();
    lenis?.scrollTo(destino, { offset: -80 });
  });
}

function montarAnimaciones(): void {
  contexto = gsap.context(() => {
    const mm = gsap.matchMedia();

    /* ═══ Con movimiento reducido no se monta nada: el CSS ya deja
       todo visible y el usuario ve la página estática. ═══ */
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // ── Titulares partidos por líneas ──
      // El plugin crea la máscara de cada línea (mask: 'lines') y vuelve a
      // partir el texto si cambia el ancho o termina de cargar la tipografía.
      document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
        const esHero = el.dataset.split === 'hero';
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) => {
            gsap.set(el, { opacity: 1 });
            return gsap.from(self.lines, {
              yPercent: 115,
              duration: esHero ? 1.1 : 0.9,
              ease: SILK,
              stagger: 0.09,
              delay: esHero ? 0.15 : 0,
              scrollTrigger: esHero ? undefined : { trigger: el, start: 'top 88%' },
            });
          },
        });
      });

      // ── Apariciones sueltas ──
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: SILK,
            scrollTrigger: { trigger: el, start: 'top 88%' },
          },
        );
      });

      // ── Grupos escalonados ──
      // batch crea UN trigger por grilla en vez de uno por tarjeta.
      document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((grupo) => {
        const hijos = Array.from(grupo.children) as HTMLElement[];
        gsap.set(hijos, { opacity: 0, y: 26 });
        ScrollTrigger.batch(hijos, {
          start: 'top 90%',
          onEnter: (lote) =>
            gsap.to(lote, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: SILK,
              stagger: 0.09,
              overwrite: true,
            }),
        });
      });

      // ── Filetes que se dibujan ──
      document.querySelectorAll<HTMLElement>('[data-rule]').forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.3,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 94%' },
          },
        );
      });

      // ── Imágenes con máscara editorial ──
      document.querySelectorAll<HTMLElement>('[data-reveal-mask]').forEach((el) => {
        const img = el.querySelector('img');
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 90%' } });
        tl.fromTo(
          el,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.25, ease: SILK },
        );
        if (img) tl.fromTo(img, { scale: 1.14 }, { scale: 1, duration: 1.7, ease: SILK }, 0);
      });

      // ── Parallax sutil (máximo dos capas por composición) ──
      document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const factor = parseFloat(el.dataset.parallax || '0.15');
        gsap.to(el, {
          yPercent: factor * -100,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement,
            scrub: true,
            start: 'top bottom',
            end: 'bottom top',
          },
        });
      });

      // ── Cintas infinitas ──
      document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((cinta) => {
        // Se duplica el contenido para que el bucle no muestre huecos.
        cinta.innerHTML += cinta.innerHTML;
        gsap.to(cinta, {
          xPercent: -50,
          ease: 'none',
          duration: parseFloat(cinta.dataset.marqueeDuracion || '38'),
          repeat: -1,
        });
      });

      // ── Contadores ──
      document.querySelectorAll<HTMLElement>('[data-counter]').forEach((el) => {
        const objetivo = parseInt(el.dataset.counter || '0', 10);
        const obj = { valor: 0 };
        gsap.to(obj, {
          valor: objetivo,
          duration: 1.7,
          ease: 'power1.out',
          scrollTrigger: { trigger: el, start: 'top 92%' },
          onUpdate: () => {
            el.textContent = Math.round(obj.valor).toLocaleString('es-CO');
          },
        });
      });
    });

    /* ── Recorrido horizontal anclado: SOLO en escritorio ──
       En móvil el `pin` es la causa principal de scroll a tirones, así que
       ahí la sección se queda como una pila vertical normal. */
    mm.add(
      '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
      () => {
        document.querySelectorAll<HTMLElement>('[data-horizontal]').forEach((seccion) => {
          const pista = seccion.querySelector<HTMLElement>('[data-horizontal-pista]');
          if (!pista) return;
          const recorrido = () => pista.scrollWidth - seccion.clientWidth;
          if (recorrido() <= 0) return;

          gsap.to(pista, {
            x: () => -recorrido(),
            ease: 'none',
            scrollTrigger: {
              trigger: seccion,
              pin: true,
              scrub: 1,
              start: 'top top',
              end: () => `+=${recorrido()}`,
              invalidateOnRefresh: true,
            },
          });
        });
      },
    );
  });
}

function iniciar(): void {
  iniciarLenis();
  // Partir titulares antes de que la tipografía cargue produce saltos de
  // línea equivocados, así que esperamos a las fuentes.
  document.fonts.ready.then(() => {
    montarAnimaciones();
    ScrollTrigger.refresh();
  });
}

function limpiar(): void {
  contexto?.revert();
  contexto = null;
}

iniciar();

// Navegación con el ClientRouter de Astro: se desmonta lo de la página que
// sale y se vuelve a montar sobre el DOM que entra. Lenis no se toca.
document.addEventListener('astro:before-swap', limpiar);
document.addEventListener('astro:after-swap', iniciar);
