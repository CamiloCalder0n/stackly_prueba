import type { ReactNode } from 'react';
import Badge from './Badge';
import { cx } from './cx';

/* ═══════════════════════════════════════════════════════════════
   SECTIONHEADER — badge + h2 (+ bajada) de las 5 cabeceras

   ── MAPA DE ALINEACIONES → USOS DE HOY ──
   align='center' (4) Services:9-20 · Services:55-66 · Process:28-39 ·
                      Portfolio:274-284
                  Envoltorio `text-center mb-16 max-w-3xl mx-auto`,
                  badge centrado con `mb-4`, h2 con `mb-6` y bajada.
   align='start'  (1) About:40-47
                  Envoltorio SIN clases (el hueco lo pone el
                  `space-y-8` del padre), badge con `mb-4`, h2 SIN
                  `mb-6` y SIN bajada. Así está hoy.

   El `mb-6` del h2 se emite cuando la cabecera está centrada o cuando
   hay bajada. Con eso las 5 llamadas actuales salen exactas: las 4
   centradas lo llevan y About, que no tiene bajada, no.

   ── POR QUÉ `md:text-section` SI ES UN NO-OP ──
   Los 5 h2 escriben hoy `text-5xl md:text-5xl`: el `md:` redeclara el
   mismo valor y no hace nada. Se conserva la redundancia como
   `text-section md:text-section` a propósito — mantiene el diff
   literal contra el código actual y deja VISIBLE dónde va el
   breakpoint cuando el rediseño quiera que el titular baje en móvil
   (que es el arreglo real, y hoy cambiaría píxeles).

   ── SUSTITUCIONES DE TOKEN ──
   `text-5xl` → `text-section` (3rem/1) y `text-lg` → `text-body-lg`
   (1.125rem/1.75rem). Los tokens replican literalmente el escalón de
   Tailwind que sustituyen, interlineado incluido: mismo píxel.

   ── LO QUE NO CUBRE ──
   `About:101-104` es otra cabecera centrada ("Nuestros Principios")
   pero es un `<h3>` con `text-3xl`, sin badge y con `mb-2`. No
   comparte ni nivel de encabezado ni escala: forzarla aquí pediría
   una variante que solo se usaría una vez.
   ═══════════════════════════════════════════════════════════════ */

export type SectionHeaderAlign = 'center' | 'start';

export type SectionHeaderProps = {
  /** Texto de la etiqueta. Se renderiza con `<Badge variant='default'>`. */
  badge: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: SectionHeaderAlign;
  className?: string;
};

export default function SectionHeader({
  badge,
  title,
  description,
  align = 'center',
  className,
}: SectionHeaderProps) {
  const centered = align === 'center';
  /* Un solo booleano para las dos decisiones (pintar la bajada y dar
     `mb-6` al h2): si se calcularan por separado, un `description`
     falsy dejaría el margen colgando sin párrafo debajo. */
  const hasDescription = Boolean(description);

  return (
    <div className={cx(centered && 'text-center mb-16 max-w-3xl mx-auto', className)}>
      <Badge align={centered ? 'center' : 'start'} className="mb-4">
        {badge}
      </Badge>
      <h2
        className={cx(
          'section-title text-section md:text-section',
          (centered || hasDescription) && 'mb-6',
        )}
      >
        {title}
      </h2>
      {hasDescription && (
        <p className="text-body-lg text-text-secondary leading-relaxed">{description}</p>
      )}
    </div>
  );
}
