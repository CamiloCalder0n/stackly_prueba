import type { LucideIcon } from 'lucide-react';
import { cx } from './cx';

/* ═══════════════════════════════════════════════════════════════
   ICONBOX — la caja cuadrada con un glifo centrado, copiada 6 veces

   Las 6 copias existen con 4 tamaños de caja, 3 tamaños de glifo
   distintos y 2 radios, todas escritas a mano. Aquí la escala queda
   fijada: caja → glifo es una relación, no una decisión por sitio.

   ── MAPA DE PROPS → USOS DE HOY ──
   size='xs'  w-8  h-8  · glifo 16   Hero:90
   size='sm'  w-10 h-10 · glifo 20   Services:92
   size='md'  w-12 h-12 · glifo 24   Services:41 · About:114
   size='lg'  w-14 h-14 · glifo 28   Process:49

   shape='rounded' `rounded-lg`   (0.5rem)  Hero:90 · Services:41 ·
                                            Services:92 · Header:136 ·
                                            Footer:29
   shape='soft'    `rounded-xl`   (0.75rem) About:114 · Process:49
   shape='circle'  `rounded-full`           (sin uso hoy — está para el
                                            rediseño; ver nota final)

   tone='brand'       `bg-brand-light` + glifo `text-brand-primary`
                      Hero:90 · Services:92 · About:114 · Process:49
   tone='brand-solid' `bg-brand-primary` + glifo `text-white`
                      Header:136 · Footer:29 (el logo de la hoja)
   tone='error'       la caja roja de "problema" — Services:41

   zoomOnGroupHover   About:114 · Process:49
                      `group-hover:scale-110 transition-transform
                      duration-300`. Depende de que un ancestro lleve
                      la clase `group`; en ambos casos ya la lleva.

   ── POR QUÉ EXISTE `iconSize` ──
   El logo de Header:136 y Footer:29 pone un glifo de 18 en una caja
   de 32. Ese 18 no está en la escala (a `xs` le tocaría 16) y no es
   un error que convenga corregir aquí: cambiarlo movería píxeles en
   la cabecera y el pie, que salen en todas las capturas de
   referencia. `iconSize` deja pasar el valor sin romper la escala
   para los otros cinco.
       <IconBox icon={Leaf} size="xs" tone="brand-solid" iconSize={18} />

   ── SUSTITUCIÓN DE TOKEN EN `tone='error'` ──
   Hoy la caja escribe `bg-red-100` y el glifo `text-red-600`: dos
   colores de la paleta por defecto de Tailwind, fuera del sistema.
   El primitivo emite `bg-error-surface` y `text-on-error-surface`,
   que el config declara con EXACTAMENTE esos dos hexadecimales
   (#fee2e2 y #dc2626) y con su ratio medido — 4.09:1, suficiente
   para un icono, insuficiente para texto, que es justo lo que hay
   aquí. Mismo píxel, distinto significado.

   ── `aria-hidden` EN EL GLIFO ──
   Se pone siempre. En los 6 usos el icono es decorativo: la caja no
   tiene nombre accesible y al lado siempre hay un título o una
   etiqueta de texto que ya dice lo mismo. Hoy solo el logo de
   Header/Footer lo declara; los otros cuatro exponen un gráfico
   anónimo al lector de pantalla. No tiene efecto visual.

   ── LO QUE NO SE MODELA AQUÍ (candidatos a otro primitivo) ──
   Dos círculos del sitio parecen un IconBox y NO lo son, porque no
   contienen un icono:
   · `About:63` — la viñeta de la lista: círculo `w-5 h-5
     bg-brand-light` con un punto `w-2 h-2 bg-brand-primary` dentro.
   · `Process:52` — el número del paso: círculo `w-6 h-6
     bg-brand-primary` con un `<span>` de texto dentro.
   Comparten "círculo de marca con algo centrado", pero su contenido
   es un punto y un número. El primitivo que los unifique tendría que
   aceptar `children`, no `icon`, y probablemente llamarse `Dot` /
   `StepMarker`. Queda anotado, no resuelto.
   ═══════════════════════════════════════════════════════════════ */

export type IconBoxSize = 'xs' | 'sm' | 'md' | 'lg';
export type IconBoxShape = 'rounded' | 'soft' | 'circle';
export type IconBoxTone = 'brand' | 'brand-solid' | 'error';

const BOX: Record<IconBoxSize, string> = {
  xs: 'w-8 h-8',
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
};

/** Glifo que le corresponde a cada caja. `iconSize` lo sobrescribe. */
const GLYPH: Record<IconBoxSize, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
};

const SHAPE: Record<IconBoxShape, string> = {
  rounded: 'rounded-lg',
  soft: 'rounded-xl',
  circle: 'rounded-full',
};

const TONE: Record<IconBoxTone, { box: string; glyph: string }> = {
  brand: { box: 'bg-brand-light', glyph: 'text-brand-primary' },
  'brand-solid': { box: 'bg-brand-primary', glyph: 'text-white' },
  error: { box: 'bg-error-surface', glyph: 'text-on-error-surface' },
};

const BASE = 'flex items-center justify-center';
const ZOOM = 'group-hover:scale-110 transition-transform duration-300';

export type IconBoxProps = {
  icon: LucideIcon;
  size?: IconBoxSize;
  shape?: IconBoxShape;
  tone?: IconBoxTone;
  /** Rompe la escala a propósito. Único caso hoy: el logo (18 en caja de 32). */
  iconSize?: number;
  /** Requiere un ancestro con la clase `group`. */
  zoomOnGroupHover?: boolean;
  /** Layout ajeno a la caja: `mb-6`, `flex-shrink-0`, `mb-4`… */
  className?: string;
};

export default function IconBox({
  icon: Icon,
  size = 'md',
  shape = 'rounded',
  tone = 'brand',
  iconSize,
  zoomOnGroupHover = false,
  className,
}: IconBoxProps) {
  const { box, glyph } = TONE[tone];

  return (
    <div
      className={cx(BASE, BOX[size], SHAPE[shape], box, zoomOnGroupHover && ZOOM, className)}
    >
      <Icon size={iconSize ?? GLYPH[size]} className={glyph} aria-hidden="true" />
    </div>
  );
}
