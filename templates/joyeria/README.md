# Stackly — Plantilla Joyería (`joyeria`)

Vitrina premium para joyerías que convierte la investigación online en **consultas por WhatsApp**. No es un e-commerce con pasarela: 4 de cada 5 compradores de joyas cierran la compra en persona, así que la plantilla apuesta por catálogo + conversación. Los precios y materiales van en HTML visible, sin fricción, y cada ficha genera un mensaje de WhatsApp prellenado con la pieza, su referencia y su URL.

Demo: **Aurea Joyería** (Bucaramanga) — negocio, datos y fotos ficticias.

## Qué incluye

| Página | Ruta | Qué hace |
|---|---|---|
| Portada | `/` | Hero, colecciones destacadas, piezas destacadas, historia/taller con contadores, testimonios, guía educativa (cuidado, tallas, materiales), FAQ (garantía, envíos, encargos), contacto y CTA |
| Catálogo | `/catalogo` | Grid de piezas con **filtros client-side** por categoría (anillos, collares, aretes, pulseras), material (oro, plata, oro rosa) y rango de precio. Vanilla TS sobre `data-attributes`, sin frameworks. Acepta preselección por URL: `/catalogo?categoria=anillos&material=oro` |
| Ficha de pieza | `/piezas/<slug>` | Galería con lightbox (flechas y teclado), especificaciones, precio con `precioCOP()` o "Consultar precio", badge disponible/por encargo, piezas relacionadas y CTA de WhatsApp con mensaje prellenado (nombre + referencia + URL) |
| Panel de contenido | `/admin` | Decap CMS: piezas, colecciones y datos del negocio |

**SEO**: `schema.org/JewelryStore` en todas las páginas (BaseLayout) y `schema.org/Product` (con `Offer` si el precio es público) en cada ficha. Sitemap y canonicals heredados del sistema base.

**Componentes nuevos sobre `_base`**: `PiezaCard.astro` (card reutilizada en portada, catálogo y relacionadas). El resto (Header, Hero, FAQ, Testimonios, Contacto, CTA, Footer, WhatsAppFlotante) viene del sistema base sin modificar.

## Comandos

```bash
pnpm install     # instalar dependencias
pnpm dev         # http://localhost:4321
pnpm build       # build de producción en dist/
pnpm cms         # decap-server para editar contenido en local (junto a pnpm dev)
```

## Cómo cargar piezas (Decap CMS)

1. En una terminal `pnpm cms`, en otra `pnpm dev`, y abre `http://localhost:4321/admin` (en producción: activar Identity + Git Gateway en Netlify y quitar `local_backend: true` de `public/admin/config.yml`).
2. Entra a **Piezas → Nueva Pieza** y llena los campos:
   - **Referencia**: código corto único (ej. `AUR-AN-004`). Va en el mensaje de WhatsApp y en el schema.org.
   - **Slug**: define la URL (`/piezas/<slug>`), en minúsculas y con guiones.
   - **Fotos**: de 1 a 6; la primera es la portada en el catálogo.
   - **Precio**: en COP sin puntos. Si la pieza se cotiza según diseño, déjalo vacío o activa **Ocultar precio** → la ficha muestra "Consultar precio".
   - **Disponibilidad**: `disponible` o `por encargo` (cambia el badge y el texto de la ficha).
   - **Destacada**: la muestra en la portada (se listan las 4 primeras).
3. **Colecciones** funciona igual: nombre, descripción corta, imagen de portada y orden de aparición.

> Los campos del panel coinciden 1:1 con el schema de `src/content.config.ts`. Si agregas un campo nuevo, hazlo en ambos lados.

## Cómo re-tematizar para un cliente real

1. **Colores** → `src/styles/global.css`, bloque `@theme`: escala `brand` (grafito cálido casi negro) y `accent` (dorado champán). Cambia los hex y todo el sitio se actualiza.
2. **Tipografías** → el `<link>` de Google Fonts en `src/layouts/BaseLayout.astro` (hoy: Cormorant Garamond + Jost) y las variables `--font-display` / `--font-body` en `global.css`.
3. **Datos del negocio** → `src/data/negocio.json` o desde `/admin` (nombre, WhatsApp, dirección, horario, redes). El número de WhatsApp es el destino de todos los CTA.
4. **Dominio** → `site` en `astro.config.mjs` (sitemap, canonicals y las URLs que van dentro de los mensajes de WhatsApp).
5. **Contenido demo** → reemplaza los `.md` de `src/content/piezas` y `src/content/colecciones`, y las fotos de Unsplash por fotos reales (idealmente subidas desde el panel; quedan en `public/images`).

## Animaciones

Heredadas del sistema base vía atributos `data-*` (`data-hero-title`, `data-reveal`, `data-reveal-group`, `data-parallax`, `data-counter`) que `src/scripts/animations.ts` detecta solo — no escribas GSAP por página. Respetan `prefers-reduced-motion` y el contenido queda visible sin JS.
