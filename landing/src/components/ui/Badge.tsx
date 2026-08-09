import type { ReactNode } from 'react';
import { cx } from './cx';

/* ═══════════════════════════════════════════════════════════════
   BADGE — la etiqueta de sección y las tres píldoras sueltas

   ── LO IMPORTANTE: DE DÓNDE SALE EL TAMAÑO REAL ──
   `.badge` declara en index.css `font-size: 0.875rem; font-weight: 600`.
   Ese NO es el tamaño que se ve. Las 5 llamadas envuelven el texto en
   un `<span className="text-xs uppercase font-bold tracking-wide">`, y
   como las utilidades viven en una capa posterior a `components`,
   ganan siempre: lo que se pinta es 0.75rem y peso 700, más
   mayúsculas y tracking.
   El primitivo RENDERIZA ESE SPAN por dentro. Quien migre no tiene
   que acordarse de la regla ni arrastrar el envoltorio a mano; y si
   el rediseño quiere cambiar el tamaño, ya sabe que el sitio a tocar
   es este archivo (o el JSX), no la clase CSS.

   ── MAPA DE VARIANTES → USOS DE HOY ──
   variant='default'      (5) `.badge` + el span interno
        align='center' (4) Services:10 · Services:56 · Process:29 ·
                           Portfolio:275  → `justify-center`
        align='start'  (1) About:41       → sin clase de alineación

   Las TRES píldoras siguientes NO usan `.badge` hoy; son cajas
   escritas a mano que hacen el mismo trabajo:

   variant='pill-brand'   Portfolio:352 — el sector del caso
                          (`text-xs font-bold text-brand-primary
                          bg-brand-light px-3 py-1 rounded-full`)
   variant='pill-invert'  CTA:228 — "Próximo Paso" sobre el degradado
                          verde (`bg-white/20`, texto blanco). Su
                          "icono" no es un glifo sino un punto:
                          <div className="w-2 h-2 rounded-full bg-white" />,
                          que se pasa por la prop `icon` tal cual —
                          por eso `icon` es ReactNode y no LucideIcon.
   variant='pill-overlay' Portfolio:314 — la etiqueta "Ampliar" sobre
                          las capturas.

   ── `pill-overlay` NO LLEVA SU POSICIONAMIENTO ──
   `pointer-events-none absolute bottom-3 right-3 opacity-0
   transition-opacity duration-300 group-hover:opacity-100
   group-focus-visible:opacity-100` describe el ESTADO DEL PADRE (el
   botón `group` que envuelve la captura), no la píldora. Va por
   `className` desde quien la coloca. Si viviera aquí, la píldora
   sería inservible en cualquier otro sitio.

   ── ÚNICA SUSTITUCIÓN DE TOKEN ──
   `pill-overlay` emite `bg-overlay-soft` donde hoy pone
   `bg-text-primary/80`. Mismo color computado —`overlay-soft` es
   `rgb(17 24 39 / 0.8)` y `text-primary` es `#111827` = rgb(17,24,39)—,
   así que no mueve un píxel. El cambio es de significado: hoy el velo
   de una imagen depende del COLOR DEL TEXTO, y si el rediseño aclara
   `text-primary` la etiqueta se vuelve ilegible sin que nada avise.
   `overlay-soft` está declarado en el config precisamente para no
   seguir al tema.

   ── ELEMENTO ──
   Siempre `<span>`. Hoy `pill-brand` y `pill-overlay` ya lo son;
   `default` y `pill-invert` son `<div>` pero ambos computan
   `display: inline-flex`, así que el render es idéntico y el DOM
   queda consistente.
   ═══════════════════════════════════════════════════════════════ */

export type BadgeVariant = 'default' | 'pill-brand' | 'pill-invert' | 'pill-overlay';
export type BadgeAlign = 'start' | 'center';

const VARIANT: Record<BadgeVariant, string> = {
  default: 'badge',
  'pill-brand': 'text-xs font-bold text-brand-primary bg-brand-light px-3 py-1 rounded-full',
  'pill-invert':
    'inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold text-white',
  'pill-overlay':
    'inline-flex items-center gap-1.5 rounded-full bg-overlay-soft px-3 py-1.5 text-xs font-bold text-white',
};

/** El envoltorio tipográfico que hoy escriben a mano las 5 llamadas de `.badge`. */
const DEFAULT_TEXT = 'text-xs uppercase font-bold tracking-wide';

export type BadgeProps = {
  variant?: BadgeVariant;
  align?: BadgeAlign;
  /** Glifo o punto decorativo a la izquierda del texto. */
  icon?: ReactNode;
  /** Posicionamiento y estado del padre: `mb-4`, `absolute bottom-3 right-3`, `opacity-0`… */
  className?: string;
  children?: ReactNode;
};

export default function Badge({
  variant = 'default',
  align = 'start',
  icon,
  className,
  children,
}: BadgeProps) {
  return (
    <span className={cx(VARIANT[variant], align === 'center' && 'justify-center', className)}>
      {icon}
      {variant === 'default' ? <span className={DEFAULT_TEXT}>{children}</span> : children}
    </span>
  );
}
