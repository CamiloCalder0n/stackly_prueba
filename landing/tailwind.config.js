/** @type {import('tailwindcss').Config} */

/* ═══════════════════════════════════════════════════════════════
   FUENTE ÚNICA DE VERDAD DEL SISTEMA VISUAL

   Ningún hexadecimal, radio, sombra ni escalón tipográfico de marca
   debe escribirse en otro archivo. `src/index.css` consume estos
   tokens con `theme('...')`.

   ── LA REGLA QUE NO CONVIENE ROMPER ──
   Cualquier token usado como TEXTO debe dar ≥ 4.5:1 contra TODAS las
   superficies sobre las que se pinta: blanco (#ffffff), bg-main
   (#f5f7f4) y brand-light (#e7f5e9). Sobre el footer la superficie es
   text-primary (#111827) y ahí manda `brand-on-dark`, no
   `brand-primary`. Cada token lleva su ratio medido. Si tocas un hex,
   recalcula los cuatro números.

   ── POR QUÉ HEX Y NO var() ──
   Once puntos del código usan el modificador alfa de Tailwind sobre
   `brand-primary` (`/10`, `/15`, `/20`, `/30`, `/40`). Ese modificador
   funciona sobre un hex sin ninguna ceremonia; con `var()` habría que
   guardar canales sueltos y reescribir los once. No se introduce
   OKLCH ni custom properties de color.

   ── ESTADO: PREPARACIÓN PARA EL REDISEÑO ──
   Todo lo añadido aquí es ADITIVO. Los valores que el sitio ya
   consumía no han cambiado ni un dígito. Los tokens marcados
   «(sin usar hoy)» existen para que el rediseño futuro tenga dónde
   agarrarse, no para aplicarlos ahora.
   ═══════════════════════════════════════════════════════════════ */

/* Las rampas se declaran como constantes para que los alias históricos de
   más abajo las REFERENCIEN en vez de repetir el hexadecimal. Si se repitieran,
   cambiar `brand[600]` no cambiaría `brand-primary` —que es lo que consumen los
   8 componentes— y el sistema de tokens sería decorativo. Así, retematizar es
   editar un solo sitio. */
const brand = {
  50:  '#e7f5e9', /* = brand-light. Superficie, nunca texto (1.13:1 sobre blanco) */
  100: '#ccebd1', /* (sin usar hoy) superficie alternativa · 1.28:1 blanco */
  200: '#a5dfb0', /* (sin usar hoy) filete sobre blanco · 1.52:1 */
  300: '#71d083', /* (sin usar hoy) filete/divisor · 1.90:1 */
  400: '#3dc256', /* (sin usar hoy) 2.32:1 blanco — nunca texto */
  500: '#2f9e44', /* = brand-on-dark. 5.15:1 sobre text-primary — AA en oscuro.
                     NO usar sobre blanco (3.45:1) */
  600: '#257c35', /* = brand-primary. 5.23:1 blanco · 4.86:1 bg-main ·
                     4.64:1 brand-light — AA en las tres */
  700: '#226533', /* (sin usar hoy) 7.05:1 blanco — texto de énfasis */
  800: '#1f5130', /* = brand-dark. 9.22:1 blanco · 8.56:1 bg-main · 8.18:1 brand-light */
  900: '#163b23', /* (sin usar hoy) 12.47:1 blanco */
  950: '#0e2516', /* (sin usar hoy) 16.22:1 blanco */
};

/* No se llama `neutral` a propósito: ese nombre ya existe en la paleta por
   defecto de Tailwind 3 y `extend` lo fusionaría. */
const ink = {
  50:  '#f6f7f9', /* (sin usar hoy) */
  100: '#eaecf0', /* (sin usar hoy) */
  200: '#d5d9e1', /* (sin usar hoy) filete · 1.41:1 */
  300: '#b3bac7', /* (sin usar hoy) 1.95:1 — nunca texto */
  400: '#8993a4', /* (sin usar hoy) 3.10:1 blanco — solo texto GRANDE (WCAG pide 3:1) */
  500: '#646d7c', /* = text-muted. 5.22:1 blanco · 4.85:1 bg-main · 4.64:1 brand-light */
  600: '#55637a', /* = text-secondary. 6.08:1 blanco · 5.65:1 bg-main · 5.40:1 brand-light */
  700: '#434f65', /* (sin usar hoy) 8.25:1 blanco */
  800: '#2e384d', /* (sin usar hoy) 11.74:1 blanco */
  900: '#1d263a', /* (sin usar hoy) 15.10:1 blanco */
  950: '#111827', /* = text-primary. 17.74:1 blanco · 16.47:1 bg-main */
};

/* El velo del lightbox. NO SIGUE EL TEMA: tiene que seguir siendo oscuro
   aunque el rediseño aclare toda la paleta. Coincide con ink[950] hoy por
   coincidencia, no por dependencia — por eso es su propia constante. */
const night = '#111827';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  /* El extractor de Tailwind lee candidatos de cualquier cadena del código, sin
     saber si es una clase. El literal `'rounded'` del tipo `IconBoxShape` en
     `src/components/ui/IconBox.tsx` le hace emitir una regla `.rounded` que no
     casa con ningún elemento. No mueve un píxel, pero ensucia el bundle. */
  blocklist: ['rounded'],

  theme: {
    extend: {
      colors: {
        /* ─────────────────────────────────────────────────────────
           RAMPA DE MARCA — verde, H≈131 · S≈54%
           Cuatro pasos son los verdes que el sitio YA usaba; el resto
           son interpolaciones nuevas que hoy nadie consume.
           Dirección: 50 = superficie, 950 = tinta.

           Antes de esta rampa, cuando un componente necesitaba un
           tono intermedio se lo inventaba con alfa
           (`brand-primary/20`), cuyo resultado depende del fondo que
           tenga debajo. Los pasos sólidos de aquí son el reemplazo
           recomendado para el rediseño — ver la nota de cada uno.
           ───────────────────────────────────────────────────────── */
        brand,

        /* ─────────────────────────────────────────────────────────
           RAMPA NEUTRA — azul-gris, H≈220
           Declarada arriba como constante. Tres de sus pasos son los
           grises que el sitio YA usaba.
           ───────────────────────────────────────────────────────── */
        ink,

        /* ── ALIAS HISTÓRICOS ──
           Los cuatro verdes y los tres grises con el nombre que el
           código usa HOY, apuntando al paso de rampa que les
           corresponde. Nada cambia de aspecto: es el mismo valor.
           Lo que cambia es que ahora hay UN solo sitio que editar —
           si estos alias repitieran el hexadecimal, retematizar la
           rampa no afectaría a los 8 componentes, que consumen estos
           nombres y no los pasos numerados. */
        'brand-primary': brand[600],
        'brand-on-dark': brand[500],
        'brand-dark':    brand[800],
        'brand-light':   brand[50],

        'text-primary':   ink[950],
        'text-secondary': ink[600],
        'text-muted':     ink[500],

        /* ── SUPERFICIES ──
           Ojo: `bg-main` y `border-color` NO pertenecen a la rampa
           `ink`. Son neutros con un punto de verde (H≈100–120, S<5%),
           mientras `ink` es azul-gris (H≈220). Se dejan tal cual
           porque cambiarlos movería píxeles; queda anotado como
           incoherencia a resolver en el rediseño. */
        'bg-main':      '#f5f7f4', /* superficie base del body · 1.08:1 sobre blanco */
        'border-color': '#dfe7df', /* solo filetes decorativos, no bordes con información */

        surface:          '#ffffff',  /* la superficie por defecto — los 8 `bg-white` */
        'surface-muted':  '#f5f7f4',  /* ≡ bg-main */
        'surface-brand':  brand[50],
        'surface-invert': ink[950],   /* fondo del footer (hoy escrito `bg-text-primary`) */

        'on-surface':         ink[950], /* 17.74:1 sobre surface */
        'on-surface-muted':   ink[600], /* 6.08:1 sobre surface */
        'on-surface-subtle':  ink[500], /* 5.22:1 sobre surface */

        /* Texto sobre el verde de marca. Blanco sobre brand-600 da
           5.23:1 y sobre el degradado brand-600→brand-800 nunca baja
           de ahí: el degradado solo se oscurece. */
        'on-brand': '#ffffff', /* 5.23:1 sobre brand-primary · 9.22:1 sobre brand-dark */

        /* Texto sobre superficie invertida (footer, lightbox).
           ⚠ Los tres con alfa SOLO son legibles sobre #111827 o más
           oscuro. `on-invert-subtle` da 8.0:1 ahí y cae por debajo de
           AA sobre cualquier fondo más claro sin que nada avise: es la
           razón de que ahora tenga nombre. */
        'on-invert':        '#ffffff',                 /* 17.74:1 sobre surface-invert */
        'on-invert-strong': 'rgb(255 255 255 / 0.9)',  /* CTA.tsx:235 */
        'on-invert-muted':  'rgb(255 255 255 / 0.8)',  /* CTA.tsx:239 · Portfolio.tsx:485 */
        'on-invert-soft':   'rgb(255 255 255 / 0.6)',  /* Footer.tsx:34,50,69 */
        'on-invert-subtle': 'rgb(255 255 255 / 0.5)',  /* Footer.tsx:88 · ~8:1 sobre #111827 */

        /* ── ERROR ──
           #dc2626 es exactamente `red-600` de Tailwind, que es lo que
           el formulario usa hoy. Se le pone nombre y se le mide el
           ratio, que hasta ahora nadie había verificado.
           ⚠ Los 4 mensajes de error se pintan sobre la tarjeta BLANCA
           del formulario, donde da 4.83:1 y pasa AA. Si el rediseño
           los mueve a `bg-main` cae a 4.48:1 y REPRUEBA.
           Recomendación para entonces: #b42318 (6.57:1 blanco ·
           6.10:1 bg-main). No se cambia hoy: movería píxeles. */
        error:              '#dc2626', /* ≡ red-600 · 4.83:1 blanco · 4.48:1 bg-main (falla) */
        'error-surface':    '#fee2e2', /* ≡ red-100 · superficie del IconBox de "problema" */
        'on-error-surface': '#dc2626', /* 4.09:1 sobre error-surface — icono, no texto */

        /* ── VELO ──
           Hoy el lightbox usa `bg-text-primary/95`, o sea el COLOR DEL
           TEXTO: si alguien aclarara `text-primary`, el velo
           desaparecería y las capturas quedarían flotando sobre un
           fondo lavado. Mismo criterio que `--color-noche` en
           templates/joyeria: este token NO sigue el tema. */
        night,
        overlay:        'rgb(17 24 39 / 0.95)', /* velo del lightbox · Portfolio.tsx:439 */
        'overlay-soft': 'rgb(17 24 39 / 0.8)',  /* etiqueta "Ampliar" · Portfolio.tsx:314 */
      },

      /* ─────────────────────────────────────────────────────────────
         ESCALA TIPOGRÁFICA SEMÁNTICA

         DECISIÓN DELIBERADA: valores FIJOS, no `clamp()`.
         Los cinco `<h2>` de sección llevan hoy `text-5xl md:text-5xl`
         —el `md:` redeclara el mismo valor, es un no-op— así que el
         título mide 48px CONSTANTES en todo el rango. Un `clamp()` que
         valiera 48px tanto a 390px como a 1440px solo puede ser la
         constante `3rem`. Cualquier clamp real difiere en al menos uno
         de los dos anchos de comparación. Igual con el `<h1>`: hoy
         salta de 60px a 72px en el breakpoint md, y un clamp
         interpolaría suave por todo el tramo 768–1440.

         Por eso cada token replica LITERALMENTE el escalón de Tailwind
         que sustituye —tamaño Y interlineado; omitir el interlineado
         haría crecer la caja de línea de cada h2— y lleva anotado el
         `clamp()` recomendado para cuando llegue el rediseño.
         ───────────────────────────────────────────────────────────── */
      fontSize: {
        /* h1 del hero. Hoy: `text-6xl md:text-7xl lg:text-7xl`.
           Fluido recomendado: clamp(3.75rem, 5vw + 1rem, 4.5rem) */
        hero:      ['3.75rem', { lineHeight: '1' }],        /* ≡ text-6xl */
        'hero-lg': ['4.5rem',  { lineHeight: '1' }],        /* ≡ text-7xl */

        /* h2 de sección. Hoy: `text-5xl md:text-5xl` (no-op).
           Fluido recomendado: clamp(2.25rem, 4vw + 0.5rem, 3rem) —
           esto sí reduciría el titular en móvil, que es el arreglo
           real, pero cambia píxeles: queda para el rediseño. */
        section:      ['3rem',    { lineHeight: '1' }],     /* ≡ text-5xl */
        'section-sm': ['2.25rem', { lineHeight: '2.5rem' }],/* ≡ text-4xl · h2 del CTA en móvil */

        title:    ['1.875rem', { lineHeight: '2.25rem' }],  /* ≡ text-3xl */
        subtitle: ['1.5rem',   { lineHeight: '2rem' }],     /* ≡ text-2xl */
        heading:  ['1.25rem',  { lineHeight: '1.75rem' }],  /* ≡ text-xl  */

        'body-lg': ['1.125rem', { lineHeight: '1.75rem' }], /* ≡ text-lg  · bajadas de sección */
        body:      ['1rem',     { lineHeight: '1.5rem' }],  /* ≡ text-base */
        'body-sm': ['0.875rem', { lineHeight: '1.25rem' }], /* ≡ text-sm  · el más usado (29) */
        caption:   ['0.75rem',  { lineHeight: '1rem' }],    /* ≡ text-xs  · 16 usos */
      },

      /* Ritmo vertical del sitio, hoy escrito `py-20 md:py-32` a mano
         seis veces. `section` = 5rem (=20), `section-lg` = 8rem (=32).
         Para una migración de una sola clase existe además
         `.section-y` en index.css. */
      spacing: {
        section:      '5rem',
        'section-lg': '8rem',
      },

      /* Los 5 radios que el sitio usa de verdad, con nombre por rol.
         `btn` (0.625rem) es el único que NO existe en la escala de
         Tailwind: hoy está escrito a mano en `.btn-primary`. */
      borderRadius: {
        chip:    '0.375rem', /* ≡ rounded-md  · 1 uso  (Hero.tsx:73) */
        control: '0.5rem',   /* ≡ rounded-lg  · 13 usos (inputs, .badge, IconBox) */
        btn:     '0.625rem', /* ⚠ sin equivalente en Tailwind · .btn-primary/.btn-secondary */
        media:   '0.75rem',  /* ≡ rounded-xl  · 6 usos  (imágenes, miniaturas) */
        card:    '1rem',     /* ≡ rounded-2xl · 9 usos + el radio propio de `.card` */
        pill:    '9999px',   /* ≡ rounded-full · 13 usos */
      },

      /* `card` y `btn-hover` son los dos box-shadow escritos a mano en
         index.css. `flat`/`lift`/`float` copian VERBATIM los valores
         de `shadow-sm`/`shadow-md`/`shadow-lg` de Tailwind, para poder
         nombrarlos sin mover un píxel. */
      boxShadow: {
        card:        '0 1px 3px rgba(0, 0, 0, 0.04)',
        'btn-hover': '0 4px 12px rgba(37, 124, 53, 0.15)', /* brand-primary al 15% */
        flat:  '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        lift:  '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        float: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },

      transitionDuration: {
        fast: '200ms', /* ≡ duration-200 · botones */
        base: '300ms', /* ≡ duration-300 · 9 usos, el ritmo por defecto del sitio */
        slow: '500ms', /* ≡ duration-500 · zoom de la imagen del portafolio */
      },

      /* ⚠ (sin usar hoy) `ease-silk` es la curva del sistema de
         plantillas (`templates/_base`). Hoy TODAS las transiciones de
         la landing usan la curva por defecto de Tailwind,
         cubic-bezier(0.4, 0, 0.2, 1). Aplicar `ease-silk` cambiaría el
         movimiento: se deja declarada para el rediseño y NO se aplica
         a nada todavía. */
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },

      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
