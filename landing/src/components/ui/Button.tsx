import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

/* ═══════════════════════════════════════════════════════════════
   BUTTON — los 8 botones y enlaces-botón del sitio

   Polimórfico: renderiza <button> por defecto y <a> en cuanto recibe
   `href`. Hoy el sitio mezcla ambos sin criterio visible (el mismo
   `.btn-primary` es <a> en Header/About/Portfolio y <button> en
   Hero/CTA); el primitivo no unifica eso —sería un cambio de DOM—,
   solo lo hace explícito con una prop.

   ── MAPA DE VARIANTES → USOS DE HOY ──
   variant='primary'   (6) Hero:42 · Header:175 · Header:236 ·
                           About:142 · Portfolio:418 · CTA:381
   variant='secondary' (2) Hero:49 · CTA:270

   size='sm'    (2) Header:175, Header:236 — `text-sm`
   size='md'    (4) About:142, Portfolio:418, CTA:270, CTA:381 —
                    NINGUNA clase: hereda el 1rem del body. Es el
                    tamaño por defecto y por eso no emite nada.
   size='hero'  (2) Hero:42, Hero:49 — `text-base font-bold`

   fullWidth    (2) Header:236, CTA:381 — `w-full justify-center`

   ── DECISIONES QUE ABSORBE EL PRIMITIVO ──
   1. `About.tsx:142` escribe hoy `btn-primary inline-flex`. Es
      REDUNDANTE: `.btn-primary` ya declara `display: inline-flex` en
      index.css. El primitivo omite el `inline-flex` y no mueve un
      píxel.
   2. `disabled:opacity-60 disabled:cursor-not-allowed` va en la base,
      no en una variante. Hoy solo `CTA:381` las escribe, pero un botón
      deshabilitado sin señal visual es un fallo en cualquiera de los
      ocho. Sobre un <a> estas variantes no aplican nunca (los enlaces
      no tienen estado :disabled): son inertes, no perjudiciales.
   3. `type="button"` por defecto en la rama <button>. Hoy los dos
      botones del Hero no declaran `type`, así que el HTML les asigna
      `submit`; como no viven dentro de ningún <form>, el efecto es
      nulo. CTA:381 pasa `type="submit"` y CTA:270 `type="button"`:
      ambos siguen ganando porque el spread va después del defecto.

   ── LO QUE NO CUBRE ──
   Los enlaces de texto con flecha (`Portfolio:385`, `Footer:74`) NO
   son botones: no llevan `.btn-*`, solo `inline-flex` + color de
   marca + un `hover:gap-3`. Si se quiere un primitivo para ellos,
   que sea otro; meterlos aquí obligaría a una variante `link` que no
   comparte ni relleno ni fondo ni radio con estas dos.
   ═══════════════════════════════════════════════════════════════ */

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'hero';

const VARIANT: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
};

const SIZE: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: '',
  hero: 'text-base font-bold',
};

const BASE = 'disabled:opacity-60 disabled:cursor-not-allowed';

type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** `w-full justify-center` — el botón ocupa el ancho de su contenedor. */
  fullWidth?: boolean;
  /** Layout que no pertenece al botón: `mt-2`, `md:hidden`, `group`… */
  className?: string;
  children?: ReactNode;
};

type ButtonAsAnchor = ButtonOwnProps & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof ButtonOwnProps | 'href'
  >;

type ButtonAsButton = ButtonOwnProps & { href?: never } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    keyof ButtonOwnProps
  >;

export type ButtonProps = ButtonAsAnchor | ButtonAsButton;

function classesFor(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  className: string | undefined,
): string {
  return cx(VARIANT[variant], SIZE[size], fullWidth && 'w-full justify-center', BASE, className);
}

export default function Button(props: ButtonProps) {
  /* Se narra sobre `props` ENTERO antes de desestructurar. Al revés
     (desestructurar y luego mirar `href`) TypeScript pierde el
     discriminante y el resto queda como una unión inservible. */
  if (props.href !== undefined) {
    const { variant = 'primary', size = 'md', fullWidth = false, className, children, ...anchor } =
      props;
    return (
      <a {...anchor} className={classesFor(variant, size, fullWidth, className)}>
        {children}
      </a>
    );
  }

  const { variant = 'primary', size = 'md', fullWidth = false, className, children, ...button } =
    props;

  /* `href` sigue dentro de `button` con el tipo `never` que le da la
     unión: nunca llega con valor, así que React no lo pinta. El cast
     solo le quita esa propiedad fantasma a la firma del <button>. */
  return (
    <button
      type="button"
      {...(button as ButtonHTMLAttributes<HTMLButtonElement>)}
      className={classesFor(variant, size, fullWidth, className)}
    >
      {children}
    </button>
  );
}
