# Stackly — Plantilla BARBERÍA (`barberia`)

One-page de reservas para barberías, construida sobre el sistema base de Stackly (Astro 5 + Tailwind 4 + GSAP/Lenis + Decap CMS). Demo: **Barbería El Patrón**, Bucaramanga.

**Posicionamiento**: la página es una máquina de reservas. Todo empuja al wizard de 3 pasos (`#reservar`) que arma la cita con **servicio + barbero + fecha + hora** y la envía por WhatsApp — la reserva estructurada baja el no-show de 15-22% a ~8-9%. Sin backend, sin cuota mensual (AgendaPro cobra US$19/mes, Booksy ~US$30/mes; esto es tuyo de por vida). Precios **siempre visibles**.

## Comandos

```bash
pnpm install     # instalar dependencias
pnpm dev         # http://localhost:4321
pnpm build       # build de producción en dist/
pnpm cms         # decap-server para editar contenido en local (junto a pnpm dev)
```

## Qué incluye (orden de la página)

| Sección | Archivo | Notas |
|---|---|---|
| Hero con foto del local | `src/components/Hero.astro` | CTA primario "Reserva tu cita" → `#reservar` (prop `ctaHref`) |
| Servicios y precios | `src/components/Servicios.astro` | Cards con duración y precio visible; "Reservar" preselecciona el servicio en el wizard |
| Equipo | `src/components/Equipo.astro` | Card por barbero: foto, especialidad, Instagram |
| Galería de cortes | `src/components/Galeria.astro` | Grid tipo Instagram con `loading="lazy"` |
| Testimonios | `src/components/Testimonios.astro` | Del sistema base |
| **Wizard de reserva** | `src/components/ReservaWizard.astro` + `src/scripts/reserva.ts` | 3 pasos → WhatsApp (ver abajo) |
| Ubicación + horarios + mapa | `src/components/Contacto.astro` | Horario por día (resalta "hoy") + mapa embebido de Google |
| FAQ | `src/components/FAQ.astro` | Con schema.org FAQPage en `index.astro` |
| CTA final + Footer | base | — |
| Botón sticky móvil | `src/components/StickyReserva.astro` | "Reserva tu cita" fijo abajo; se oculta cuando el wizard está en pantalla |

SEO: schema.org **BarberShop** (con `openingHoursSpecification` generado desde `horarios.json`) en `BaseLayout.astro` + **FAQPage** en `index.astro`.

## El wizard de reserva (sin backend)

`src/scripts/reserva.ts` — vanilla TS con estado simple y transiciones GSAP entre pasos:

1. **Servicio** — de la colección `servicios` (la duración define las franjas).
2. **Barbero** — de la colección `barberos` (solo `activo: true`) o "Cualquiera".
3. **Fecha y hora** — próximos **14 días** excluyendo días cerrados según `src/data/horarios.json`; franjas cada 30 min entre apertura y cierre, descartando las que no alcanzan a terminar antes del cierre (`inicio + duración ≤ cierre`). Para "hoy" solo ofrece franjas con al menos 30 min de margen, y si ya no queda ninguna, el día desaparece.

El botón final abre WhatsApp con el mensaje estructurado:

> Hola, quiero reservar: Corte + barba (75 min, $ 55.000), con Camilo Rojas, el sábado 25 de julio a las 10:30 AM. Mi nombre es Andrés Pérez.

Los botones "Reservar" de las cards de servicios llevan `data-reserva-servicio="<id>"`: preseleccionan el servicio y saltan al paso 2. Puedes poner ese atributo en cualquier elemento de la página.

## Cómo edita el cliente su contenido (Decap CMS, `/admin`)

Local: `pnpm cms` en una terminal + `pnpm dev` en otra → `http://localhost:4321/admin`. En producción (Netlify): activa Identity + Git Gateway y quita `local_backend: true` de `public/admin/config.yml`.

- **Servicios y precios** → colección `Servicios` (`src/content/servicios/*.json`): nombre, descripción, duración en minutos, precio COP, orden. Crear/borrar servicios actualiza la sección de precios **y** el paso 1 del wizard.
- **Barberos** → colección `Barberos` (`src/content/barberos/*.json`): nombre, foto, especialidad, Instagram, activo. Desactivar un barbero lo quita del equipo y del wizard sin borrarlo.
- **Horarios de apertura** → `Configuración → Horarios` (`src/data/horarios.json`): por día, abierto sí/no + apertura + cierre en formato 24h (`HH:MM`). Controla el selector de fechas/franjas del wizard, la tabla de horarios de Contacto y el schema.org.
- **Datos del negocio** → `Configuración → Datos del negocio` (`src/data/negocio.json`): nombre, WhatsApp, dirección, redes, etc.

Los schemas viven en `src/content.config.ts` (content layer de Astro 5, loader `glob`); los campos del CMS en `public/admin/config.yml` son 1:1 con esos schemas.

## Cómo re-tematizar para otro cliente (5 minutos)

1. **Colores** → `src/styles/global.css`, bloque `@theme`. `brand` es la escala carbón/negro; `accent` la escala ámbar/cobre. Para un rojo barbero clásico cambia solo la escala `accent`.
2. **Tipografías** → el `<link>` de Google Fonts en `src/layouts/BaseLayout.astro` (hoy: Oswald + Inter) y `--font-display`/`--font-body` en `@theme`. Alternativa con la misma actitud: 'Bebas Neue'.
3. **Datos, servicios, barberos y horarios** → desde `/admin` (o editando los JSON a mano).
4. **Fotos** → hero y galería usan Unsplash de demo (`?w=1200&q=80`); reemplázalas por fotos reales del local — es lo que más convierte.
5. **Dominio** → `site` en `astro.config.mjs`.

## Animaciones

Heredadas del sistema base vía atributos `data-*` (`data-reveal`, `data-reveal-group`, `data-parallax`, `data-hero-title`) — ver `src/scripts/animations.ts`. No escribas GSAP por página; la única excepción del patrón es `reserva.ts`, que importa GSAP para las transiciones entre pasos del wizard. Todo respeta `prefers-reduced-motion`.
