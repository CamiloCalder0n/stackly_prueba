# Stackly — Plantilla Joyería (`joyeria`)

Vitrina premium para joyerías que convierte la investigación online en **consultas por WhatsApp**. No es un e-commerce con pasarela: en Colombia la joya de ticket alto se cierra conversando, así que la plantilla apuesta por catálogo + conversación. Los precios y la ficha técnica van en HTML visible, sin fricción, y cada botón genera un mensaje de WhatsApp ya armado con la pieza, su referencia, la talla y el grabado.

Demo: **Aurea Joyería** (Bucaramanga) — negocio, datos y fotos ficticias.

## En qué se apoyan las decisiones

El diseño sale de auditar 13 joyerías colombianas reales (Kevin's, Bauer, Diamanti, Bracarli, Vera, El Señor de los Anillos, Élite, Liévano, Caribe, El Diamante…). El mercado está partido en dos: marcas con historia real y sitio pobre —sin precios, sin ficha técnica, sin prueba social— y sitios modernos pero de e-commerce genérico que no resuelven confianza y WhatsApp a la vez. Esta plantilla ataca ese hueco:

| Lo que exige el comprador | Dónde está resuelto |
|---|---|
| Ley del metal visible (18k/750) — en Colombia el contraste es requisito legal | Badge en portada, catálogo y ficha |
| Peso en gramos y medidas en mm, que sustituyen al "probárselo" | Ficha técnica de cada pieza |
| Garantía, ajuste de talla y certificado como argumento de venta | Bloque de confianza **bajo el precio**, no en el FAQ |
| Trayectoria en vez de certificaciones formales | Años de oficio y piezas entregadas en el hero |
| Addi y Sistecrédito, que destraban las piezas de más de $1.000.000 | Bloque de medios de pago junto al precio |
| Saber la talla antes de comprar | `/guia-de-tallas`, que casi nadie resuelve bien |

## Qué incluye

| Página | Ruta | Qué hace |
|---|---|---|
| Portada | `/` | Hero, franja de confianza, colecciones, piezas destacadas, el taller paso a paso, historia con contadores, testimonios con ciudad, cómo se compra + medios de pago, guía rápida, FAQ, contacto con agendador y CTA |
| Catálogo | `/catalogo` | Filtros por pieza, material, **ley**, ocasión y precio, más buscador, orden y atajos de regalo. La grilla se recompone con GSAP Flip. El estado se sincroniza con la URL en ambos sentidos, así que un enlace filtrado se comparte por WhatsApp: `/catalogo?categoria=anillos&ley=18k&orden=precio-asc` |
| Ficha de pieza | `/piezas/<slug>` | Galería con lupa y lightbox accesible, precio, disponibilidad honesta, bloque de confianza, medios de pago, ficha técnica, selector de talla y grabado — ambos se inyectan en el mensaje de WhatsApp |
| Guía de tallas | `/guia-de-tallas` | Método del hilo, conversor de circunferencia a talla y medidor imprimible a escala real con calibración por tarjeta bancaria |
| Encargos | `/encargos` | Cotizador de seis pasos con borrador guardado, que termina en un mensaje estructurado |
| Panel de contenido | `/admin` | Decap CMS: piezas, colecciones y datos del negocio |

**SEO**: `schema.org/JewelryStore` en todas las páginas, `Product` con `Offer` en cada ficha, `BreadcrumbList` y `FAQPage`. Sitemap y canonicals automáticos; `/admin` queda fuera del sitemap y del indexado.

**Rendimiento medido** sobre el build de producción (Lighthouse móvil): 95-98 en rendimiento, 97-100 en accesibilidad, 100 en buenas prácticas y SEO. LCP entre 2,0 y 2,6 s, CLS por debajo de 0,005.

## Comandos

```bash
pnpm install     # instalar dependencias
pnpm dev         # http://localhost:4321
pnpm build       # build de producción en dist/
pnpm preview     # sirve dist/ tal como quedará en producción
pnpm check       # tipos y schemas de contenido
pnpm cms         # decap-server para editar contenido en local (junto a pnpm dev)
```

## Cómo cargar piezas (Decap CMS)

1. En una terminal `pnpm cms`, en otra `pnpm dev`, y abre `http://localhost:4321/admin`. En producción: activa Identity + Git Gateway en Netlify y quita `local_backend: true` de `public/admin/config.yml`.
2. Entra a **Piezas → Nueva Pieza**. Los campos que más pesan en la venta:
   - **Referencia**: código corto único (ej. `AUR-AN-004`). Va en el mensaje de WhatsApp y en el schema.org.
   - **Slug**: define la URL (`/piezas/<slug>`), en minúsculas y con guiones.
   - **Fotos**: de 1 a 6, la primera es la portada. Súbelas a 1600px o más; la plantilla las comprime sola.
   - **Ley del metal**: obligatoria. Es el primer dato de confianza que busca el comprador.
   - **Peso y medidas**: son los que reemplazan el poder tocar la pieza. Llénalos siempre.
   - **Precio**: en COP sin puntos. Si la pieza se cotiza según diseño, déjalo vacío o activa **Ocultar precio**.
   - **Unidades**: con `1` la ficha dice "pieza única". No lo uses para inventar escasez.
   - **Días de fabricación**: solo si es por encargo; se muestra como plazo real.
   - **Grabado**: si lo activas, la ficha ofrece el campo y lo manda en el WhatsApp.
3. **Colecciones** funciona igual: nombre, descripción, portada y orden.

> Los campos del panel coinciden 1:1 con el schema de `src/content.config.ts`. Si agregas uno, hazlo en ambos lados o el cliente no podrá editarlo.

## Cómo re-tematizar para un cliente real

1. **Colores** → `src/styles/global.css`, bloque `@theme`. Es el único archivo que hay que tocar. Ojo con una regla: la escala `brand` está calibrada para que del 500 en adelante todo pase el contraste AA sobre los fondos claros. Si la cambias, verifica ese punto.
2. **Tipografías** → `--font-display` y `--font-body` en el mismo archivo, más las tres reglas `@font-face` de arriba. Están self-hosted a propósito: una petición a Google Fonts bloquea el render.
3. **Datos del negocio** → `src/data/negocio.json` o desde `/admin`: nombre, WhatsApp, dirección, horarios de cita, año de fundación, medios de pago y reseñas de Google. El número de WhatsApp es el destino de todos los CTA.
4. **Dominio** → `site` en `astro.config.mjs` (sitemap, canonicals y las URLs dentro de los mensajes de WhatsApp) y la línea `Sitemap:` de `public/robots.txt`.
5. **Fotos** → las de demo están en `src/assets/fotos`. Exígele al cliente entre 10 y 20 fotos reales en el onboarding: el stock genérico destruye la confianza, que es justo lo que esta plantilla viene a construir.

## Animaciones

Todo se controla con atributos `data-*` que lee `src/scripts/animations.ts` — no escribas GSAP por página:

`data-reveal` · `data-reveal-group` · `data-split` (titular por líneas) · `data-rule` · `data-reveal-mask` · `data-parallax` · `data-counter` · `data-marquee` · `data-horizontal` (recorrido horizontal anclado, solo en escritorio)

Dos cosas que conviene no romper:

- La clase `motion` la pone el propio script **después** de que GSAP carga. El CSS solo esconde contenido si esa clase existe, así que un error de JS nunca deja la página en blanco.
- Con `prefers-reduced-motion` activo no se crea ni una animación y Lenis ni se instancia.

La plantilla usa el `ClientRouter` de Astro, y eso tiene una consecuencia: **los `<script>` de componente no se vuelven a ejecutar al navegar**. Cuelga siempre el montaje de `astro:page-load`, que dispara también en la primera carga. `Header.astro` sirve de ejemplo.
