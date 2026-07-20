# Stackly — Plantilla RESTAURANTE

Plantilla de sitio para restaurantes construida sobre el sistema base de Stackly.
Demo: **La Terraza Cocina Local** (Bucaramanga).

**Posicionamiento**: menú digital en HTML (indexable, nunca PDF) + canal de pedidos
propio por WhatsApp. Recupera el 25-30% de margen que se llevan las apps de
domicilio, y aprovecha que el 85% de los clientes mira el menú online antes de
visitar.

## Qué incluye

| Pieza | Dónde |
|---|---|
| **Home** con hero + badge dinámico "Abierto ahora / Cerrado", plato del día, destacados, historia, galería, testimonios, reservas, ubicación/horarios/mapa y FAQ | `src/pages/index.astro` |
| **Menú digital HTML** por categorías con navegación sticky por anclas (scrollspy), etiquetas (🌱 vegetariano, 🌶 picante, ✨ nuevo) y estado "Agotado" | `src/pages/menu.astro` — sirve también como **carta QR en mesa** |
| **Carrito + checkout por WhatsApp** sin backend: cantidades, notas por ítem, Domicilio/Recoger, costo y pedido mínimo por zona, pedido numerado línea por línea. Persiste en `localStorage` | `src/scripts/carrito.ts` (nanostores) + `src/components/CarritoDrawer.astro` |
| **Reservas de mesa** (personas + fecha + hora → WhatsApp) | `src/components/Reservas.astro` |
| Badge abierto/cerrado client-side | `src/components/EstadoAbierto.astro` + `src/scripts/horario.ts` |
| Tarjeta de plato con botón "Agregar" | `src/components/PlatoCard.astro` |
| Horarios + mapa embebido | `src/components/Ubicacion.astro` |
| **SEO**: schema.org `Restaurant` (con horarios), `Menu`/`MenuSection`/`MenuItem` en `/menu` y `FAQPage` en la home | `BaseLayout.astro` + páginas |
| Panel de contenido Decap CMS | `/admin` (`public/admin/config.yml`) |

Del sistema base heredamos: Astro 5 + Tailwind 4 (tokens `@theme`), animaciones
por atributos `data-*` (GSAP + ScrollTrigger + Lenis), componentes
Header/SectionHeading/Testimonios/FAQ/CTA/Footer/WhatsAppFlotante y helpers
`NEGOCIO` / `waLink()` / `precioCOP()`.

## Comandos

```bash
pnpm install     # instalar dependencias
pnpm dev         # http://localhost:4321
pnpm build       # build de producción en dist/
pnpm cms         # decap-server para editar contenido en local (junto a pnpm dev)
```

## Cómo edita el cliente su contenido (Decap, `/admin`)

En local: `pnpm cms` en una terminal + `pnpm dev` en otra → `http://localhost:4321/admin`.
En producción (Netlify): activar **Identity** + **Git Gateway** y quitar `local_backend: true` del `config.yml`.

- **Platos** → colección *Platos*: nombre, descripción, precio (COP sin puntos),
  foto, categoría, etiquetas, **¿Disponible hoy?** (apagado = se muestra
  "Agotado", no desaparece) y **¿Destacado?** (aparece en la portada).
  Archivos en `src/content/platos/*.json`.
- **Categorías del menú** → colección *Categorías*: nombre y orden.
  Archivos en `src/content/categorias/*.json`.
- **Horarios** → *Configuración → Horarios por día*: por cada día `abierto`,
  `apertura` y `cierre` en formato 24h (`"21:00"`). Alimentan el badge
  Abierto/Cerrado, la tabla de horarios y el schema.org.
  Archivo: `src/data/horarios.json`.
- **Domicilios** → *Configuración → Zonas de domicilio*: barrio/zona, costo,
  pedido mínimo y si está activa. Alimentan el selector del checkout.
  Archivo: `src/data/domicilios.json`.
- **Promo / plato del día** → *Configuración → Banner promo*: se muestra/oculta
  con un switch. Archivo: `src/data/promo.json`.
- **Datos del negocio** (nombre, WhatsApp, dirección, redes) →
  *Configuración → Información general* (`src/data/negocio.json`).
  El número de WhatsApp de este archivo es el que recibe pedidos y reservas.

## Cómo re-tematizar para otro restaurante (10 minutos)

1. **Colores** → `src/styles/global.css`, bloque `@theme`: escalas `brand`
   (verde oliva profundo) y `accent` (terracota). Cambia los hex y todo el
   sitio se actualiza.
2. **Tipografías** → `<link>` de Google Fonts en `src/layouts/BaseLayout.astro`
   (hoy: Fraunces + Inter) y `--font-display` / `--font-body` en `global.css`.
3. **Datos** → `src/data/negocio.json` (o desde `/admin`).
4. **Menú** → reemplaza los JSON de `src/content/platos/` y
   `src/content/categorias/` (o desde `/admin`).
5. **Fotos** → URLs de Unsplash con `?w=1200&q=80` o imágenes subidas desde el
   panel (van a `public/images/`).
6. **Dominio** → `site` en `astro.config.mjs`.

## Carta QR en mesa

Imprime un QR que apunte a `https://tudominio.co/menu`. La página es liviana,
funciona en cualquier celular y permite pedir desde la mesa: el pedido llega
por WhatsApp con notas y total.

## Notas técnicas

- El carrito vive en `localStorage` (`stackly-restaurante-carrito`): sobrevive
  recargas y navegación entre páginas.
- El pedido mínimo se valida por zona antes de habilitar el botón de envío.
- Los platos con `disponible: false` se renderizan en gris con botón
  deshabilitado — así el cliente ve que existe y vuelve por él.
- El badge Abierto/Cerrado soporta días cerrados y cierres pasada la medianoche.
