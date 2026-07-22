# Stackly — Sistema base (`_base`)

Fundación compartida de todas las plantillas Stackly. **No se entrega a clientes directamente**: es el punto de partida que las plantillas de nicho (`joyeria`, `barberia`, `restaurante`) copian y especializan.

Lo que vive aquí es la infraestructura, no el estilo: motor de animación, sistema de imágenes, accesibilidad, SEO y los bloques de conversión que todo negocio local colombiano necesita. La identidad visual la pone cada nicho.

## Stack

| Pieza | Rol | Costo |
|---|---|---|
| [Astro 7](https://astro.build) | Framework estático, componentes, View Transitions | Gratis (MIT) |
| [Tailwind CSS 4](https://tailwindcss.com) | Estilos + tokens en `@theme` | Gratis (MIT) |
| [GSAP](https://gsap.com) + ScrollTrigger, SplitText, Flip | Animación al scroll | Gratis desde 3.13 |
| [Lenis](https://lenis.darkroom.engineering) | Smooth scroll | Gratis (MIT) |
| `astro:assets` + sharp | Imágenes en AVIF con srcset | Gratis |
| Fontsource | Tipografías variables self-hosted | Gratis |
| [Decap CMS](https://decapcms.org) | Panel de contenido en `/admin` | Gratis (MIT) |
| WhatsApp (`wa.me`) | Conversión: consultas, pedidos, reservas | Gratis |

## Comandos

```bash
pnpm install     # instalar dependencias
pnpm dev         # http://localhost:4321
pnpm build       # build de producción en dist/
pnpm preview     # sirve dist/ como en producción (mide aquí, no en dev)
pnpm check       # tipos y schemas de contenido
pnpm cms         # decap-server para editar contenido en local (junto a pnpm dev)
```

> `astro check` necesita TypeScript 6.x: el compilador nativo de TS 7 todavía no expone la API que usa el checker.

## Cómo re-tematizar para un cliente

1. **Colores** → `src/styles/global.css`, bloque `@theme`. Es el único archivo que hay que tocar para cambiar la piel. **Regla que no conviene romper**: la rampa `brand` está calibrada para que del 500 en adelante todo pase contraste AA sobre `surface`; el texto secundario de todo el sitio usa `brand-500`.
2. **Tipografías** → las tres reglas `@font-face` de arriba del mismo archivo más `--font-display` / `--font-body`. Están self-hosted y con el subconjunto latino a propósito: una petición a Google Fonts bloquea el render, y los subconjuntos que no se usan son kilobytes de CSS regalados.
3. **Datos del negocio** → `src/data/negocio.json` (o desde `/admin`): nombre, WhatsApp, dirección, horarios de cita, año de fundación y medios de pago.
4. **Navegación** → `src/scripts/navegacion.ts`.
5. **Dominio** → `site` en `astro.config.mjs`, para sitemap, canonicals y las URLs dentro de los mensajes de WhatsApp.

## Sistema de animaciones (sin escribir GSAP)

Atributos `data-*` que `src/scripts/animations.ts` detecta solo:

| Atributo | Efecto |
|---|---|
| `data-reveal` | Aparece al entrar en viewport |
| `data-reveal-group` | Los hijos directos aparecen en cascada (un solo trigger por grupo) |
| `data-split` / `data-split="hero"` | Titular que sube línea por línea desde su máscara |
| `data-rule` | Filete que se dibuja de izquierda a derecha |
| `data-reveal-mask` | Imagen que se revela con máscara y zoom lento |
| `data-parallax="0.15"` | Parallax sutil |
| `data-counter="120"` | Contador animado de 0 al valor |
| `data-marquee` | Cinta infinita (el script duplica el contenido: no lo dupliques tú) |
| `data-horizontal` | Recorrido horizontal anclado, solo en escritorio |

Dos garantías que conviene no romper al modificarlo:

- La clase `motion` la pone el propio script **después** de cargar GSAP. El CSS solo esconde contenido si esa clase existe, así que un error de JS nunca deja la página en blanco.
- Con `prefers-reduced-motion` activo no se crea ni una animación y Lenis ni se instancia.

## Reglas del sistema

**Imágenes**: siempre con `<Foto>`, nunca `<img>` suelto para fotografía. Genera AVIF con srcset y medidas explícitas. Marca `prioridad` solo en la imagen LCP, y nunca en una imagen oculta en móvil.

**ClientRouter**: la plantilla usa View Transitions, y eso implica que **los `<script>` de componente no se vuelven a ejecutar al navegar**. Cuelga siempre el montaje de `astro:page-load`, que dispara también en la primera carga. `Header.astro` sirve de ejemplo.

**Accesibilidad**: cada página necesita un `<main id="contenido">` — es a la vez el landmark y el destino del enlace de salto que ya trae el layout.

## Componentes

| Componente | Para qué |
|---|---|
| `Header` | Nav pegajoso + menú móvil a pantalla completa |
| `Hero`, `SectionHeading`, `Testimonios`, `FAQ`, `CTA`, `Footer` | Estructura de página |
| `Contacto` | Datos del negocio + formulario Netlify Forms |
| `CitaEnTienda` | Agendar visita (día, hora, motivo) por WhatsApp. Acepta `titulo` y `motivos` para adaptarlo al nicho |
| `Pagos` | Medios de pago desde `negocio.json`. Addi y Sistecrédito importan en tickets altos |
| `Foto` | Imagen optimizada |
| `Icono` | Iconografía unificada |
| `WhatsAppFlotante` | Botón de conversión persistente |

Todos leen los datos de `negocio.json` vía `src/scripts/site.ts` (`NEGOCIO`, `ANOS_OFICIO`, `waLink()`, `precioCOP()`).

## Decap CMS

- Local: `pnpm cms` en una terminal + `pnpm dev` en otra → `http://localhost:4321/admin`.
- Producción (Netlify): activar **Identity** y **Git Gateway** en el panel y quitar `local_backend: true` de `public/admin/config.yml`.

Si el nicho sube fotos que Astro deba optimizar, apunta `media_folder` a `src/assets/…` con un `public_folder` relativo, como hace la plantilla de joyería.
