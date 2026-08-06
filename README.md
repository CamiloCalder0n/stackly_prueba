# Stackly

Repositorio de Stackly, con tres cosas distintas dentro: la [landing propia](landing) (ticket **SCRUM-54**), las plantillas reutilizables para arrancar proyectos sin empezar de cero (ticket **SCRUM-43**), y los sitios de [clientes reales](clientes) (proyecto **CL** en Jira). Cada plantilla de nicho nace de una [investigación de mercado](https://app.notion.com/p/3a23a1de538681828ba2e16a8a327e96) (Notion) y comparte un mismo sistema técnico; la landing y los sitios de cliente son proyectos aparte, cada uno con su stack.

## `landing/` — sitio propio de Stackly (SCRUM-54)

Landing page principal de Stackly: propuesta de valor, servicios, portafolio, proceso, testimonios y CTA de contacto. Construida en Bolt.new y traída tal cual al repo — **no** comparte stack con `templates/` (es Vite + React + TypeScript + Tailwind 3, no Astro).

```bash
cd landing
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
```

## `clientes/` — sitios de clientes reales (proyecto CL)

Un directorio por cliente. No son plantillas ni comparten stack con `templates/`: cada uno llega con lo que el cliente ya tenga y se integra tal cual.

| Cliente | Ticket | Estado |
|---|---|---|
| [`cafe-nativo/`](clientes/cafe-nativo) | **CL-11** | Concepto integrado y sano técnicamente, **bloqueado para publicar** hasta recibir datos y fotos del cliente (**CL-12**) |

Cada uno trae su README con lo que falta confirmar. En Café Nativo eso incluye bloqueantes legales: las imágenes del concepto son de banco, una con marca de agua visible y tres con logos de marcas de café ajenas.

## Plantillas de nicho (`templates/`)

## Stack (100% gratuito, sin cuotas mensuales)

Astro 7 · Tailwind CSS 4 (tokens re-tematizables) · GSAP (ScrollTrigger, SplitText, Flip) · Lenis · `astro:assets` con AVIF · tipografías variables self-hosted · Decap CMS (el cliente edita su contenido en `/admin`) · Conversión por WhatsApp (`wa.me` con mensajes prellenados, sin backend).

**El argumento de venta**: los SaaS del sector cobran de por vida (AgendaPro desde US$19/mes, Booksy ~US$30/mes, Cluvi US$25-50/mes, Shopify US$39/mes + 2%; Rappi retiene 25-30% por pedido). Con estas plantillas el cliente paga $0/mes, sin comisiones, con dominio y datos propios.

## ¿Qué plantilla usar?

| Plantilla | Nicho | Núcleo de conversión | Úsala cuando el cliente… |
|---|---|---|---|
| [`templates/joyeria`](templates/joyeria) | Joyerías y accesorios | Catálogo premium → consulta por WhatsApp con referencia, talla y grabado | vende productos de alto valor que se cierran en persona |
| [`templates/barberia`](templates/barberia) | Barberías, salones, estética | Wizard de reserva (servicio + profesional + fecha/hora) → WhatsApp | vive de agendar citas y quiere dejar de pagar SaaS de reservas |
| [`templates/restaurante`](templates/restaurante) | Restaurantes y cafés | Menú HTML + carrito → pedido por WhatsApp | necesita menú digital y canal de pedidos propio sin comisiones |
| [`templates/_base`](templates/_base) | — (interno) | — | ninguno: es la fundación que las demás copian; úsala para crear un nicho nuevo |

## Cómo arrancar un proyecto nuevo

```bash
# 1. Clona la plantilla del nicho (sin historial de git)
npx degit <ruta-de-este-repo>/templates/barberia cliente-nuevo
cd cliente-nuevo && pnpm install

# 2. Desarrollo
pnpm dev            # http://localhost:4321
pnpm cms            # (otra terminal) editar contenido en /admin

# 3. Producción
pnpm build          # genera dist/ listo para Netlify / Cloudflare Pages
```

## Checklist de personalización por cliente

1. **Tokens de marca** → `src/styles/global.css` (bloque `@theme`): escalas `brand`/`accent` + fuentes.
2. **Datos del negocio** → `src/data/negocio.json` (o desde `/admin`): nombre, WhatsApp, dirección, horarios, redes.
3. **Contenido del nicho** → colecciones en `src/content/` vía Decap (`/admin`): piezas / servicios y barberos / menú.
4. **Fotos reales del negocio** → exigirlas en el onboarding (10-20 fotos): el stock genérico destruye confianza. Van en `public/images/`.
5. **Dominio** → `site` en `astro.config.mjs`.
6. **Deploy** → Netlify (activa Identity + Git Gateway para que el cliente use `/admin` en producción; el formulario de contacto funciona solo) o Cloudflare Pages.

## Estructura

```
landing/          Sitio propio de Stackly (SCRUM-54) — Vite + React + TS, stack aparte
clientes/
└── cafe-nativo/   Cliente CL-11 — HTML estático autocontenido, sin build
templates/
├── _base/         Sistema compartido: tokens, componentes, animaciones data-*, Decap, SEO local
├── joyeria/       Vitrina + catálogo con filtros + ficha + guía de tallas + encargos
├── barberia/      Landing + wizard de reserva en 3 pasos por WhatsApp
└── restaurante/   Menú digital HTML + carrito + pedido por WhatsApp (domicilio/recogida)
```

Cada plantilla tiene su propio README con instrucciones detalladas de contenido y re-tematización.
