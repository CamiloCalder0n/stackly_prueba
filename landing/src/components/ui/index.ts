/* ═══════════════════════════════════════════════════════════════
   PRIMITIVOS DE UI — barril

   Los 8 archivos de `src/components/` son secciones de página; hasta
   ahora no había ni un solo primitivo, y por eso el mismo badge está
   copiado 5 veces y la misma caja de icono 6, cada una con sus
   propias medidas.

   ── ESTADO: NADIE LOS IMPORTA TODAVÍA ──
   Estos cinco archivos son preparación para el rediseño. La migración
   de las secciones es un trabajo aparte. Cada primitivo lleva en su
   cabecera el mapa de qué llamada actual corresponde a qué variante.

   ── CONTRATO QUE CUMPLEN LOS CINCO ──
   1. Emiten EXACTAMENTE las clases que el sitio usa hoy, salvo tres
      sustituciones de token —todas de valor idéntico, documentadas en
      la cabecera del primitivo que las hace: `bg-overlay-soft` en
      Badge, `bg-error-surface`/`text-on-error-surface` en IconBox y
      `text-section`/`text-body-lg` en SectionHeader.
   2. Aceptan `className` para lo que NO les pertenece: posición,
      hueco externo, `col-span-full`, `group`, `h-full flex flex-col`.
      Un primitivo no decide dónde se coloca.
   3. No traen estado. El `opacity-0 group-hover:opacity-100` de la
      etiqueta "Ampliar" es del padre que la posiciona, no de ella.
   ═══════════════════════════════════════════════════════════════ */

export { default as Badge } from './Badge';
export type { BadgeProps, BadgeVariant, BadgeAlign } from './Badge';

export { default as Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { default as Card } from './Card';
export type {
  CardProps,
  CardElement,
  CardPadding,
  CardRadius,
  CardTone,
  CardHover,
  CardElevation,
} from './Card';

export { default as IconBox } from './IconBox';
export type { IconBoxProps, IconBoxSize, IconBoxShape, IconBoxTone } from './IconBox';

export { default as SectionHeader } from './SectionHeader';
export type { SectionHeaderProps, SectionHeaderAlign } from './SectionHeader';

export { cx } from './cx';
