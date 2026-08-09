import type { ReactNode } from 'react';
import { cx } from './cx';

/* ═══════════════════════════════════════════════════════════════
   CARD — las 13 superficies que hoy escriben `.card` / `.card-hover`

   La clase base (`.card` o `.card-hover`) sigue viviendo en
   index.css: aporta fondo, filete, radio de 1rem y la sombra `card`.
   Este primitivo solo pone nombre a los ejes que hoy se repiten a
   mano encima de ella.

   ── MAPA DE PROPS → USOS DE HOY ──
   padding='none'  Portfolio:294
           'xs'    Hero:66            p-3
           'sm'    Hero:88            p-4
           'md'    Services:91        p-6
           'lg'    (5) Services:40 · About:76 · About:86 · About:112 ·
                       Process:46    p-8
           'xl'    Process:75         p-10 md:p-12
           '2xl'   CTA:225            p-10 md:p-16
           'menu'  Header:205         py-4   (panel del menú móvil)

   radius='card'   (por defecto) — NO emite clase. El 1rem ya lo pone
                   `.card`. Los 9 sitios que escriben `card rounded-2xl`
                   son REDUNDANTES: `rounded-2xl` también vale 1rem.
           'media' Hero:88 — `rounded-xl` (0.75rem). Es el ÚNICO lugar
                   del sitio donde la utilidad de radio sí sobrescribe
                   algo, y la única razón de que esta prop exista.

   tone='surface'  (por defecto) — el blanco de `.card`
       ='brand'    About:86 · Process:75 — `bg-brand-light
                   border-brand-primary/20` (pisa fondo y color de
                   filete; el grosor de 1px lo sigue poniendo `.card`)
       ='gradient' CTA:225 — `bg-gradient-to-br from-brand-primary
                   to-brand-dark`

   hover='none'         Hero:66 · Hero:88 · Services:40 · Header:205 · Process:75
        ='border'       About:76
        ='border-strong'About:86 · Portfolio:294
        ='border-lift'  About:112 · Process:46
        ='raise'        Services:91 — usa `.card-hover`, que ya trae
                        translate, sombra y transición desde index.css

   elevation='card'  (por defecto) — la sombra propia de `.card`
            ='float' Hero:66 — `shadow-lg`

   clip  Portfolio:294 · CTA:225 — `overflow-hidden`

   ── LO QUE NO ES UNA CARD ──
   · `Portfolio:404` (`mt-16 p-12 rounded-2xl bg-brand-light`) y
     `CTA:255` (`bg-white rounded-xl p-6 md:p-8`) NO llevan `.card`:
     no tienen filete ni sombra. Modelarlos aquí les añadiría ambos.
   · `Portfolio:298` (`bg-bg-main p-5 md:p-6`) es media columna de una
     Card, no una Card.

   ── ORDEN DE CLASES ──
   `.card` vive en la capa `components` y todo lo que emite este
   primitivo son utilidades, que van en una capa posterior: ganan
   siempre, independientemente del orden dentro del atributo.
   ═══════════════════════════════════════════════════════════════ */

export type CardElement = 'div' | 'figure' | 'article' | 'section';
export type CardPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'menu';
export type CardRadius = 'card' | 'media';
export type CardTone = 'surface' | 'brand' | 'gradient';
export type CardHover = 'none' | 'border' | 'border-strong' | 'border-lift' | 'raise';
export type CardElevation = 'card' | 'float';

const PADDING: Record<CardPadding, string> = {
  none: '',
  xs: 'p-3',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10 md:p-12',
  '2xl': 'p-10 md:p-16',
  menu: 'py-4',
};

const RADIUS: Record<CardRadius, string> = {
  card: '',
  media: 'rounded-xl',
};

const TONE: Record<CardTone, string> = {
  surface: '',
  brand: 'bg-brand-light border-brand-primary/20',
  gradient: 'bg-gradient-to-br from-brand-primary to-brand-dark',
};

const HOVER: Record<CardHover, string> = {
  none: '',
  border: 'hover:border-brand-primary/20 transition-all duration-300',
  'border-strong': 'hover:border-brand-primary/40 transition-all duration-300',
  'border-lift': 'hover:border-brand-primary/20 hover:shadow-lg transition-all duration-300',
  raise: '',
};

const ELEVATION: Record<CardElevation, string> = {
  card: '',
  float: 'shadow-lg',
};

export type CardProps = {
  as?: CardElement;
  padding?: CardPadding;
  radius?: CardRadius;
  tone?: CardTone;
  hover?: CardHover;
  elevation?: CardElevation;
  clip?: boolean;
  /** Layout ajeno a la card: `col-span-full`, `h-full flex flex-col`, `group`, `text-center`… */
  className?: string;
  children?: ReactNode;
};

export default function Card({
  as: Element = 'div',
  padding = 'none',
  radius = 'card',
  tone = 'surface',
  hover = 'none',
  elevation = 'card',
  clip = false,
  className,
  children,
}: CardProps) {
  return (
    <Element
      className={cx(
        hover === 'raise' ? 'card-hover' : 'card',
        PADDING[padding],
        RADIUS[radius],
        TONE[tone],
        HOVER[hover],
        ELEVATION[elevation],
        clip && 'overflow-hidden',
        className,
      )}
    >
      {children}
    </Element>
  );
}
