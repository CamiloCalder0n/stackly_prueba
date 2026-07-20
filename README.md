# Stackly — Plantillas de proyecto por nicho

Repositorio de plantillas reutilizables para arrancar proyectos de clientes sin empezar de cero (ticket **SCRUM-43**). Cada plantilla nace de una [investigación de mercado por nicho](https://app.notion.com/p/3a23a1de538681828ba2e16a8a327e96) (Notion) y comparte un mismo sistema técnico.

## Stack (100% gratuito, sin cuotas mensuales)

Astro 5 · Tailwind CSS 4 (tokens re-tematizables) · GSAP + ScrollTrigger · Lenis · Decap CMS (el cliente edita su contenido en `/admin`) · Conversión por WhatsApp (`wa.me` con mensajes prellenados, sin backend).

**El argumento de venta**: los SaaS del sector cobran de por vida (AgendaPro desde US$19/mes, Booksy ~US$30/mes, Cluvi US$25-50/mes, Shopify US$39/mes + 2%; Rappi retiene 25-30% por pedido). Con estas plantillas el cliente paga $0/mes, sin comisiones, con dominio y datos propios.

## ¿Qué plantilla usar?

| Plantilla | Nicho | Núcleo de conversión | Úsala cuando el cliente… |
|---|---|---|---|
| [`templates/joyeria`](templates/joyeria) | Joyerías y accesorios | Catálogo premium → consulta por WhatsApp con referencia de la pieza | vende productos de alto valor que se cierran en persona |
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
templates/
├── _base/         Sistema compartido: tokens, componentes, animaciones data-*, Decap, SEO local
├── joyeria/       Vitrina + catálogo con filtros + ficha de pieza + consulta WhatsApp
├── barberia/      Landing + wizard de reserva en 3 pasos por WhatsApp
└── restaurante/   Menú digital HTML + carrito + pedido por WhatsApp (domicilio/recogida)
```

Cada plantilla tiene su propio README con instrucciones detalladas de contenido y re-tematización.
