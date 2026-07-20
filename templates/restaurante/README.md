# Stackly — Sistema base (`_base`)

Fundación compartida de todas las plantillas Stackly. **No se entrega a clientes directamente**: es el punto de partida que las plantillas de nicho (`joyeria`, `barberia`, `restaurante`) copian y especializan.

## Stack

| Pieza | Rol | Costo |
|---|---|---|
| [Astro 5](https://astro.build) | Framework estático, componentes | Gratis (MIT) |
| [Tailwind CSS 4](https://tailwindcss.com) | Estilos + tokens en `@theme` | Gratis (MIT) |
| [GSAP + ScrollTrigger](https://gsap.com) | Animaciones al scroll | Gratis |
| [Lenis](https://lenis.darkroom.engineering) | Smooth scroll | Gratis (MIT) |
| [Decap CMS](https://decapcms.org) | Panel de contenido en `/admin` | Gratis (MIT) |
| WhatsApp (`wa.me`) | Conversión: consultas/pedidos/reservas | Gratis |

## Comandos

```bash
pnpm install     # instalar dependencias
pnpm dev         # http://localhost:4321
pnpm build       # build de producción en dist/
pnpm cms         # decap-server para editar contenido en local (junto a pnpm dev)
```

## Cómo re-tematizar para un cliente (5 minutos)

1. **Colores y fuentes** → `src/styles/global.css` (bloque `@theme`). Cambia las escalas `brand` y `accent`.
2. **Datos del negocio** → `src/data/negocio.json` (o desde `/admin`): nombre, WhatsApp, dirección, horario, redes.
3. **Tipografías** → el `<link>` de Google Fonts en `src/layouts/BaseLayout.astro` + `--font-display`/`--font-body` en los tokens.
4. **Dominio** → `site` en `astro.config.mjs` (para sitemap y canonicals).

## Sistema de animaciones (sin escribir GSAP)

Atributos `data-*` que `src/scripts/animations.ts` detecta automáticamente:

| Atributo | Efecto |
|---|---|
| `data-hero-title` | Entrada del hero al cargar |
| `data-reveal` | Aparece al entrar en viewport |
| `data-reveal-group` | Hijos directos aparecen en cascada |
| `data-parallax="0.2"` | Parallax sutil (imágenes de fondo) |
| `data-counter="120"` | Contador animado de 0 al valor |

Respeta `prefers-reduced-motion` y funciona sin JS (el contenido queda visible).

## Componentes

`Header` (nav + menú móvil), `Hero`, `SectionHeading`, `Testimonios`, `FAQ` (accordion nativo), `Contacto` (datos + formulario Netlify Forms), `CTA`, `Footer`, `WhatsAppFlotante`. Todos usan los datos de `negocio.json` vía `src/scripts/site.ts` (`NEGOCIO`, `waLink()`, `precioCOP()`).

## Decap CMS

- Local: `pnpm cms` en una terminal + `pnpm dev` en otra → `http://localhost:4321/admin`.
- Producción (Netlify): activar **Identity** y **Git Gateway** en el panel de Netlify y quitar `local_backend: true` de `public/admin/config.yml`.
