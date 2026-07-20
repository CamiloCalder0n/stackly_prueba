/**
 * Sistema de animaciones del template (GSAP + ScrollTrigger + Lenis).
 *
 * Se controla 100% con atributos data-* en el HTML — no escribas GSAP por página:
 *   data-reveal              → el elemento aparece al entrar en viewport
 *   data-reveal-group        → los HIJOS directos aparecen escalonados (stagger)
 *   data-parallax="0.2"      → parallax sutil (factor de desplazamiento)
 *   data-counter="120"       → cuenta de 0 al número al entrar en viewport
 *   data-hero-title          → animación de entrada del hero (sin scroll)
 *
 * Respeta prefers-reduced-motion: si está activo, no se anima nada.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initAnimations(): void {
  document.documentElement.classList.add('js');
  if (reduceMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  // ── Smooth scroll (Lenis) sincronizado con ScrollTrigger ──
  const lenis = new Lenis({ lerp: 0.12 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ── Entrada del hero ──
  document.querySelectorAll('[data-hero-title]').forEach((el) => {
    gsap.fromTo(
      el.children.length ? el.children : el,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.1 },
    );
  });

  // ── Reveals al scroll ──
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      },
    );
  });

  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    gsap.fromTo(
      group.children,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: { trigger: group, start: 'top 85%' },
      },
    );
  });

  // ── Parallax sutil ──
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || '0.2');
    gsap.to(el, {
      yPercent: speed * -100,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement, scrub: true, start: 'top bottom', end: 'bottom top' },
    });
  });

  // ── Contadores ──
  document.querySelectorAll<HTMLElement>('[data-counter]').forEach((el) => {
    const target = parseInt(el.dataset.counter || '0', 10);
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.6,
      ease: 'power1.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
      onUpdate: () => {
        el.textContent = Math.round(obj.val).toLocaleString('es-CO');
      },
    });
  });
}

initAnimations();
