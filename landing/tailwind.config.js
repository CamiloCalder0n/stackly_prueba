/** @type {import('tailwindcss').Config} */

/* ═══════════════════════════════════════════════════════════════
   FUENTE ÚNICA DE VERDAD DE LA PALETA

   Ningún hexadecimal de marca debe escribirse en otro archivo.
   `src/index.css` consume estos tokens con `theme('colors.<token>')`,
   así que cambiar el verde aquí lo cambia en todo el sitio.

   Cada token lleva anotado su ratio de contraste WCAG medido. La regla
   que no conviene romper: cualquier token usado como TEXTO debe dar
   ≥ 4.5:1 contra todas las superficies sobre las que se pinta
   (blanco, bg-main y brand-light). Si tocas un hex, recalcula.
   ═══════════════════════════════════════════════════════════════ */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Verde de marca para SUPERFICIES CLARAS: fondo de los CTA y
           color de texto/iconos sobre blanco, bg-main o brand-light.
           Es el verde histórico (#2f9e44) un paso más oscuro — mismo
           tono (H 131) y misma saturación (S 54%), solo L 40% → 31.5%.
           El #2f9e44 daba 3.45:1 sobre blanco y reprobaba AA. */
        'brand-primary': '#257c35', /* 5.23:1 blanco · 4.86:1 bg-main · 4.64:1 brand-light — AA en las tres */

        /* El mismo verde de siempre, reservado para SUPERFICIES OSCURAS
           (footer sobre text-primary). Ahí el brand-primary oscuro se
           hunde (3.39:1) y este brilla: la identidad se conserva justo
           donde sí pasaba el contraste. */
        'brand-on-dark': '#2f9e44', /* 5.15:1 sobre text-primary — AA. NO usar sobre blanco (3.45:1) */

        'brand-dark': '#1f5130', /* 9.22:1 blanco · 8.18:1 brand-light — hover de los CTA y texto de badge */
        'brand-light': '#e7f5e9', /* superficie, nunca texto */

        'bg-main': '#f5f7f4', /* superficie base del body */
        'border-color': '#dfe7df', /* solo filetes decorativos, no bordes portadores de información */

        'text-primary': '#111827', /* 17.74:1 blanco · 16.47:1 bg-main */

        /* Texto secundario y terciario. Los valores previos reprobaban:
           #64748b daba 4.42:1 sobre bg-main y #9ca3af solo 2.54:1 sobre
           blanco. Se conservó tono y saturación de cada uno, bajando L. */
        'text-secondary': '#55637a', /* 6.08:1 blanco · 5.65:1 bg-main · 5.40:1 brand-light */
        'text-muted': '#646d7c', /* 5.22:1 blanco · 4.85:1 bg-main · 4.64:1 brand-light */
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
