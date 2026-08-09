# Stackly

Stackly es una agencia web colombiana. Este repositorio es su monorepo: aquí viven el sitio de la propia agencia, las plantillas con las que se arrancan los proyectos de nicho y los sitios de los clientes reales.

Son tres cosas distintas, con stacks distintos y ciclos de vida distintos. Lo único que comparten es el repositorio:

| Directorio | Qué es | Stack | Gestor | Ticket |
|---|---|---|---|---|
| [`landing/`](landing) | El sitio comercial de Stackly | Vite + React + TypeScript + Tailwind 3 | `npm` | **SCRUM-54** |
| [`templates/`](templates) | Plantillas por nicho, reutilizables | Astro + Tailwind 4 + Decap CMS | `pnpm` | **SCRUM-43** |
| [`clientes/`](clientes) | Sitios de clientes reales, uno por carpeta | El que traiga cada cliente | — | proyecto **CL** |

Si llegas nuevo: `templates/` es el corazón del negocio y donde está casi todo el código; `landing/` es cómo se vende; `clientes/` es lo que ya se entregó. Cada plantilla de nicho nace de una [investigación de mercado](https://app.notion.com/p/3a23a1de538681828ba2e16a8a327e96) (Notion) antes de escribir una línea de código.

## `landing/` — sitio propio de Stackly (SCRUM-54)

La landing comercial de la agencia: propuesta de valor, servicios, portafolio con capturas de los proyectos entregados, proceso y formulario de contacto. El preset original salió de Bolt.new, pero desde entonces se le rehízo el portafolio y se le hizo una pasada completa de contenido, accesibilidad y SEO, así que ya poco queda del generador.

**No comparte stack con `templates/`**: es Vite + React + TypeScript + Tailwind 3, y usa `npm` en lugar de `pnpm`. Se despliega en **Vercel**, no en Netlify.

```bash
cd landing
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
```

Ver [`landing/README.md`](landing/README.md) para el detalle del formulario de contacto (Supabase), las variables de entorno y lo que queda pendiente.

## `templates/` — plantillas de nicho (SCRUM-43)

El producto de la agencia. Cada plantilla es un sitio Astro completo y autocontenido para un tipo de negocio local colombiano: se copia, se re-tematiza con los datos y las fotos del cliente, y se publica. No es un tema ni un paquete que se instale — es un punto de partida que se lleva entero.

`_base` es la fundación: define el motor de animación, el sistema de imágenes, la accesibilidad, el SEO local y los bloques de conversión. Las tres plantillas de nicho copiaron esa base y la especializaron; **no la importan**, así que un arreglo en `_base` no llega solo a las demás y hay que propagarlo a mano.

| Plantilla | Nicho | Núcleo de conversión | Úsala cuando el cliente… |
|---|---|---|---|
| [`templates/joyeria`](templates/joyeria) | Joyerías y accesorios | Catálogo premium → consulta por WhatsApp con referencia, talla y grabado | vende productos de alto valor que se cierran en persona |
| [`templates/barberia`](templates/barberia) | Barberías, salones, estética | Wizard de reserva (servicio + profesional + fecha/hora) → WhatsApp | vive de agendar citas y quiere dejar de pagar SaaS de reservas |
| [`templates/restaurante`](templates/restaurante) | Restaurantes y cafés | Menú HTML + carrito → pedido por WhatsApp | necesita menú digital y canal de pedidos propio sin comisiones |
| [`templates/_base`](templates/_base) | — (interno) | — | ninguno: es la fundación que las demás copian; úsala para crear un nicho nuevo |

**El argumento de venta**: los SaaS del sector cobran de por vida (AgendaPro desde US$19/mes, Booksy ~US$30/mes, Cluvi US$25-50/mes, Shopify US$39/mes + 2%; Rappi retiene 25-30% por pedido). Con estas plantillas el cliente paga $0/mes, sin comisiones, con dominio y datos propios.

### Stack de las plantillas

Común a las cuatro: **Tailwind CSS 4** con tokens re-tematizables en `@theme`, **GSAP** (ScrollTrigger, SplitText, Flip), **Lenis**, **Decap CMS** para que el cliente edite su contenido en `/admin`, y conversión por **WhatsApp** (`wa.me` con mensajes prellenados, sin backend ni base de datos).

Donde no son iguales es en la versión de Astro, y conviene saberlo antes de tocar código:

| | `_base`, `joyeria`, `barberia` | `restaurante` |
|---|---|---|
| Astro | **7** | **5** |
| Imágenes | `astro:assets` con AVIF, vía el componente `Foto.astro`, con `sharp` | `<img>` a pelo, sin `sharp` ni `Foto.astro` |
| Tipografías | self-hosteadas con `@fontsource` | Google Fonts por `<link>` (una petición a un tercero) |
| `pnpm check` | sí (`astro check`) | no existe el script |

No es un descuido pendiente de arreglar: `restaurante` se congeló deliberadamente en su estado entregado y las mejoras se aplicaron a las plantillas que estaban en desarrollo activo. Si te toca trabajar en `restaurante`, cuenta con que no tendrás chequeo de tipos ni optimización de imágenes, y no des por hecho que un patrón de `_base` funciona ahí tal cual.

### Cómo arrancar un proyecto nuevo

```bash
# 1. Clona la plantilla del nicho (sin historial de git)
npx degit <ruta-de-este-repo>/templates/barberia cliente-nuevo
cd cliente-nuevo && pnpm install

# 2. Desarrollo
pnpm dev            # http://localhost:4321
pnpm cms            # (otra terminal) editar contenido en /admin

# 3. Producción
pnpm build          # genera dist/
```

`degit` copia los archivos sin historial, así que el proyecto del cliente nace limpio. Cada plantilla trae su propio `.gitignore` para que ese `pnpm install` no le ensucie el repositorio.

### Checklist de personalización por cliente

1. **Tokens de marca** → `src/styles/global.css` (bloque `@theme`): escalas `brand`/`accent` + fuentes.
2. **Datos del negocio** → `src/data/negocio.json` (o desde `/admin`): nombre, WhatsApp, dirección, horarios, redes.
3. **Contenido del nicho** → colecciones en `src/content/` vía Decap (`/admin`): piezas / servicios y barberos / menú.
4. **Fotos reales del negocio** → exigirlas en el onboarding (10-20 fotos): el stock genérico destruye confianza. Van en `public/images/`.
5. **Dominio** → `site` en `astro.config.mjs`.
6. **Deploy** → Netlify, por lo que se explica abajo.

## `clientes/` — sitios de clientes reales (proyecto CL)

Un directorio por cliente. No son plantillas ni comparten stack con `templates/`: cada uno llega con lo que el cliente ya tenga y se integra tal cual.

| Cliente | Ticket | Estado |
|---|---|---|
| [`cafe-nativo/`](clientes/cafe-nativo) | **CL-11** | Concepto integrado y sano técnicamente, **bloqueado para publicar** hasta recibir datos y fotos del cliente (**CL-12**) |

Cada uno trae su README con lo que falta confirmar. En Café Nativo eso incluye bloqueantes legales: las imágenes del concepto son de banco, una con marca de agua visible y tres con logos de marcas de café ajenas.

## Dos destinos de despliegue

En el repositorio conviven dos hostings, y no es una inconsistencia que haya que resolver: responden a necesidades distintas.

**Las plantillas van a Netlify.** Las cuatro traen `public/admin/config.yml` con el backend de Decap puesto en `git-gateway`, que se apoya en **Netlify Identity + Git Gateway** para que el cliente entre a `/admin`, edite su contenido y eso se convierta en un commit sin darle acceso al repositorio. Esa pareja de servicios solo la ofrece Netlify. El sitio compilado es HTML estático y se puede servir desde cualquier parte, pero si se aloja en otro sitio hay que cambiar el backend de Decap: tal como está, `/admin` no autentica fuera de Netlify.

**La landing va a Vercel.** No usa Decap ni necesita Identity, así que no la ata nada a Netlify. Está enlazada al proyecto `landing` de Vercel y sus variables de entorno (`VITE_SUPABASE_*`) se configuran en el panel de Vercel.

## `pnpm` en las plantillas, `npm` en la landing

Está bien así, aunque despiste. Las plantillas se entregan al cliente con `pnpm` porque cada una se instala por separado y `pnpm` comparte las dependencias entre proyectos en lugar de duplicarlas — con cuatro plantillas Astro en la misma máquina, la diferencia es notable. La landing conserva `npm` porque nació con el `package-lock.json` que generó su andamiaje y no ha habido motivo para migrarla.

La regla práctica: dentro de `templates/*` usa `pnpm`; dentro de `landing/` usa `npm`. No mezcles gestores en un mismo directorio, o acabarás con dos lockfiles peleando.

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
