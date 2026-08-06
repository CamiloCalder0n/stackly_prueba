# Café Nativo — sitio del cliente

Tostaduría y barra de café de especialidad. Sitio de una sola página, HTML
estático, sin build ni dependencias: se sirve tal cual está.

- **Épica Jira:** CL-11 — Web · Cliente Café Nativo (tareas CL-12 a CL-16)
- **Sistema de diseño:** Broadsheet (tokens y componentes en `assets/ds/`)
- **Estado:** integrado y listo técnicamente. **Bloqueado para publicar**
  hasta cerrar CL-12 — ver [Datos pendientes](#datos-pendientes-cl-12).

> [!WARNING]
> **No publicar todavía.** El sitio funciona, pero el contenido es de relleno:
> la dirección dice literalmente "Calle por confirmar", no hay teléfono, los
> precios están en euros y las 14 fotos son de stock — dos de ellas con marca
> de agua visible y tres mostrando **sacos de café de otras empresas**.
> El detalle completo está más abajo.

---

## Cómo previsualizarlo

No hay que instalar nada. Desde este directorio:

```bash
python3 -m http.server 8000
```

y abrir <http://localhost:8000>.

Tiene que ser por HTTP, no abriendo `index.html` con doble clic: con el
protocolo `file://` el navegador bloquea las tipografías por CORS y la página
se ve con la serif del sistema en vez de con la suya.

Para publicarlo sirve cualquier hosting estático (Netlify, Cloudflare Pages):
se sube el directorio entero y ya está.

---

## Estructura

```
cafe-nativo/
├── index.html                  Todo el sitio: markup + estilos de página + JS
├── README.md                   Este archivo
└── assets/
    ├── favicon.svg             Icono de pestaña (tokens --paper / --ink / --spot)
    ├── ds/
    │   ├── broadsheet.css      Tokens y componentes del sistema de diseño
    │   └── broadsheet.readme.md  Documentación del sistema (no se sirve)
    ├── fonts/                  Source Serif 4 self-hosteada, subconjunto latino
    │   ├── source-serif-4-latin-400-normal.woff2
    │   ├── source-serif-4-latin-400-italic.woff2
    │   ├── source-serif-4-latin-600-normal.woff2
    │   └── LICENSE-source-serif-4.txt   SIL OFL 1.1
    └── img/                    Las 12 imágenes que el sitio usa de verdad
```

Los estilos están en dos capas y conviene no mezclarlas:

- `assets/ds/broadsheet.css` es **del sistema**, compartido. Si se retoca,
  se retoca para todos los sitios que usen Broadsheet.
- El `<style>` dentro de `index.html` es **de esta página**: la maqueta, el
  papel de lino tostado, la marquesina, el menú móvil. Aquí es donde se toca
  cualquier cosa específica de Café Nativo.

---

## Qué se cambió respecto al concepto entregado

El diseño **no se tocó**: el sitio se ve idéntico al concepto original, pixel
a pixel (ver [Verificación](#verificación)). Lo que se arregló es lo que
impedía ponerlo en producción.

### 1. Se descartó la v1 y se conservó la v2

El concepto venía en dos versiones. **Se conservó `index-v2.html`** (ahora
`index.html`) y se descartó `index.html` (v1).

La v1 usaba **9 elementos `<image-slot>` vacíos** — huecos del editor donde se
diseñó el concepto. Fuera de ese editor no son fotos: son recuadros en blanco.
La v2 usa `<img>` de verdad.

### 2. Tipografía self-hosteada

`broadsheet.css` cargaba **Source Serif 4 desde Google Fonts** con un `@import`.
Dos problemas: sin red la página caía a `system-ui, sans-serif` y perdía por
completo la identidad serif editorial —que es todo el concepto—, y el `@import`
bloquea el render en serie (el navegador no descubre la petición a Google hasta
que ya ha bajado el CSS).

Ahora las tres caras van en `assets/fonts/` con `@font-face` propios,
`font-display: swap` y `<link rel="preload">` en el `<head>`.

Se traen **solo las tres caras que el sitio usa** y **solo el subconjunto
latino**, siguiendo lo que ya se documentó en
`templates/joyeria/src/styles/global.css`: los paquetes completos arrastran
seis subconjuntos (cirílico, griego, vietnamita, matemáticas, símbolos…) que
este sitio no usa jamás. Se nota en el número de caras que el navegador tiene
que registrar: **18 antes, 3 ahora**.

| Cara | Dónde se usa |
|---|---|
| 400 normal | Cuerpo de texto |
| 600 normal | Todos los titulares (`--font-heading-weight`) |
| 400 itálica | Los `<em>` del hero y de los titulares, las notas de cata, la cita |

No se trae la 600 itálica: no hay ni un solo titular en cursiva con peso —
todos los `<em>` bajan a 400 explícitamente.

### 3. El CSS se enlaza, ya no se inyecta con JavaScript

`sitio/ds-base.js` creaba el `<link>` del sistema de diseño en runtime. Con
JavaScript desactivado la página se quedaba **literalmente sin una sola regla
de estilo**: fondo blanco y texto por defecto. Ahora es un
`<link rel="stylesheet">` normal en el `<head>` y `ds-base.js` se borró.

De paso apareció un segundo problema del mismo tipo: los elementos `.rise`
arrancan en `opacity: 0` y solo se encienden cuando un `IntersectionObserver`
les pone la clase `.in`. Sin JavaScript ese observador no corre nunca, así que
**todo el texto del sitio quedaba invisible** — titular, párrafos, menú y
horarios. Se resolvió marcando el documento con una clase `js` desde el
`<head>`: con JavaScript activo no cambia absolutamente nada, y sin él el
contenido sale ya visible.

### 4. Andamiaje del editor eliminado

| Archivo | Peso | Por qué se borró |
|---|---|---|
| `sitio/image-slot.js` | 63 kB | La v2 no tiene ni un solo `<image-slot>` en el markup. Se cargaba por inercia. |
| `support.js` | 66 kB | Solo lo usaba el visor de wireframes. |
| `Wireframes.dc.html` | 15 kB | Material de proceso, no forma parte del sitio. |
| `_ds/…/_ds_bundle.js` | 14 kB | **Verificado antes de borrar** (ver abajo). |
| `sitio/ds-base.js` | 0,8 kB | Sustituido por el `<link>` del punto 3. |

Sobre el bundle: inyecta los filtros SVG de separación CMYK (`#sep-c`, `#sep-m`,
`#sep-y`, `#sep-k`, `#sep-all`) que necesita la clase `.cmyk` del sistema. La
v1 la usaba; **la v2 usa `.halftone`, que es CSS puro** — un
`radial-gradient` en un `::after`, sin filtros ni SVG. Comprobado con `grep`:
la v2 no contiene `cmyk`, `sep-` ni `print-plates` en ningún sitio. El bundle
sobra.

### 5. Imágenes

- **`bolsa-cafe.png`**: pesaba **1,05 MB a 2500×2500 px** para mostrarse a
  520 px de ancho — el 45 % del peso total del sitio. Reescalada a 1040 px
  (el doble del tamaño de pantalla, para pantallas retina) y cuantizada a
  paleta de 256 colores conservando la transparencia: **1,05 MB → 130 kB**,
  sin diferencia visible (es una ilustración plana, no una foto).
- **`saco-monte-nativo.webp`**: 1065 px para un hueco de ~300 px. Reescalada
  a 700 px: **248 kB → 129 kB**.
- **Dos huérfanas borradas** (89 kB): `a5c069378eb54b89fa413504082b1aa4.jpg` y
  `png-transparent-red-berry-fruits-…-thumbnail.png`. Verificado con `grep`
  que la v2 no las referencia.
- **`width` y `height` en las 15 etiquetas `<img>`**: ninguna los declaraba, así
  que el navegador no podía reservar el hueco y la página saltaba al cargar.
- **`loading="lazy"` + `decoding="async"`** en todo lo que está por debajo del
  primer pantallazo. La foto del hero se queda en carga inmediata y además
  lleva `fetchpriority="high"`; los cuatro granos flotantes también, porque son
  decoración del propio hero.
- Los archivos se renombraron a nombres legibles (`terraza.jpg`,
  `saco-el-zapote.webp`…). Los originales traían espacios y paréntesis en el
  nombre — `…arquitetura_1 (1).jpg` — que en una URL son frágiles. La
  equivalencia está en la [tabla de imágenes](#las-12-imágenes).

### 6. Enlace muerto de "Abrir en Maps"

El botón apuntaba a `href="#visita"`, es decir, **a la propia sección donde ya
está**. No abría ningún mapa.

No se le puede dar un destino real porque todavía no hay dirección. Se dejó sin
`href` y marcado `aria-disabled="true"`: se ve exactamente igual que antes pero
ya no promete algo que no cumple. En `index.html`, junto al botón, hay un
comentario con la línea exacta que hay que poner cuando llegue la dirección.

### 7. Menú móvil

A 620 px o menos el CSS hacía `.nav a:not(.keep) { display: none }`: los
enlaces del nav **desaparecían sin nada que los sustituyera** y desde un
celular no se podía llegar a ninguna sección.

Se añadió un menú desplegable con `aria-expanded`, `aria-controls`, cierre con
`Escape` (devolviendo el foco al botón), cierre al tocar fuera y cierre al
elegir un enlace. El botón es puramente tipográfico — alterna entre "Menú" y
"Cerrar", sin icono — y el panel reutiliza el mismo papel, la misma línea fina
y la misma tipografía de la barra, para no meter vocabulario visual ajeno a
Broadsheet. Sin JavaScript el botón no aparece y la barra se envuelve en dos
líneas, así que los enlaces siguen siendo alcanzables.

### 8. SEO

Añadidos `meta description`, Open Graph completo, Twitter Card, `canonical`,
favicon, `theme-color` y **JSON-LD `CafeOrCoffeeShop`** con los tres tramos de
horario que sí constan en el copy.

En el JSON-LD **solo se declara lo verificable**: nombre, horarios y correo. La
dirección, el teléfono, las coordenadas, el rango de precios y las redes van
comentados justo debajo, listos para descomentar. Publicar en schema.org una
dirección que dice "Calle por confirmar" es peor que no publicar ninguna:
Google la indexa y después cuesta corregirla.

---

## Peso

| | Antes | Después |
|---|---|---|
| Directorio completo | 2,56 MB | **1,30 MB** |
| Primera carga (lo que baja el navegador) | 2 418 kB en 21 peticiones | **363 kB en 9 peticiones** |
| De ellas, a terceros | 77 kB (Google Fonts) | **0 kB** |

La primera carga baja un 85 %. Buena parte es el `lazy` (las fotos de más
abajo ya no se descargan de entrada), y el resto es la bolsa de café, los dos
scripts muertos y las fuentes que ahora viajan como subconjunto latino.

---

## Verificación

Las cuatro comprobaciones se hicieron con Chrome pilotado por Puppeteer,
comparando contra el concepto original servido en paralelo. Para que las
capturas fueran deterministas se activó `prefers-reduced-motion` (si no, la
marquesina y los granos flotantes nunca coinciden porque son animaciones
infinitas).

**1. Se ve idéntico al original.** ✔
Se midió la caja (`x`, `y`, ancho, alto) de **108 elementos** en las dos
versiones. Coinciden **104 exactamente**; los otros 4 son los
`h2.section-title`, que difieren en **1 px de ancho** — llevan `max-width: 18ch`
y el ancho del carácter "0" se mide con una fracción distinta entre la
compilación de Google y la de Fontsource de la misma tipografía. No cambia
ningún salto de línea. La **altura total de la página es idéntica: 8 262 px**
en las dos. En móvil (390 px) la portada coincide con la captura de referencia
salvo por el botón "Menú" nuevo.

**2. Funciona sin JavaScript.** ✔
El original se queda **sin una sola regla de estilo** (fondo blanco, nav como
texto suelto). La versión nueva conserva todos los estilos y todo el texto es
legible, gracias al `<link>` y al arreglo de los `.rise`.

**3. La tipografía carga sin red.** ✔
Bloqueando todo lo que no sea el servidor local, la versión nueva se renderiza
**byte a byte igual** que con red (diferencia de píxeles: ninguna) y las tres
caras aparecen como `loaded`. El original, en las mismas condiciones, se queda
con **cero fuentes cargadas**, cae a la sans del sistema y la página **encoge
353 px** (7 909 px en vez de 8 262).

**4. Cero CDNs externos.** ✔
Puppeteer registró **0 peticiones fuera de `localhost`**. El original hace 3
(una a `fonts.googleapis.com` y dos a `fonts.gstatic.com`). No queda ninguna
referencia a `fonts.googleapis.com`, `gstatic`, `unpkg`, `jsdelivr` ni ningún
CDN. Las únicas URLs absolutas que quedan en el HTML son el `@context` de
schema.org (un identificador, no se descarga), el dominio marcador y los
comentarios de pendientes.

---

## Datos pendientes (CL-12)

Todo lo de esta sección es **relleno del concepto**, no información real del
negocio. Es lo que hay que confirmarle al cliente en la tarea de recolección de
información antes de publicar.

### Bloqueantes

| # | Dato | Qué dice ahora | Qué hace falta |
|---|---|---|---|
| 1 | **Dirección** | "Calle por confirmar 123, Barrio Centro" — es un marcador explícito, no hay ciudad ni país | Dirección completa con ciudad y departamento |
| 2 | **Teléfono** | **No hay ninguno en todo el sitio** | Fijo y/o WhatsApp. Es el canal de contacto que más se usa en el nicho |
| 3 | **Enlace a Maps** | Botón desactivado a la espera de la dirección | URL de Google Maps del local |
| 4 | **Precios** | Los **15 precios** del menú están en formato euro (`2,50`, `3,80`) y **sin símbolo de moneda**, conviviendo con vocabulario colombiano (panela, apellido Restrepo, "cooperativa de mujeres") | Carta real en pesos colombianos |
| 5 | **Fotos** | Las 14 son de stock, de otras cafeterías | 10-20 fotos propias (ver más abajo) |
| 6 | **Dominio** | `cafenativo.com.co` es un **marcador puesto por nosotros**; el cliente todavía no tiene dominio | Dominio real. Hay que cambiarlo en `canonical`, `og:url`, `og:image`, `twitter:image` y en el JSON-LD |

### Contenido a confirmar

| # | Dato | Qué dice ahora | Qué hace falta |
|---|---|---|---|
| 7 | **Instagram** | `@cafenativo` aparece como **texto plano, sin enlace**. No hay ninguna red social enlazada en todo el sitio | Usuario real y enlace. Añadir también a `sameAs` en el JSON-LD |
| 8 | **Correo** | `hola@cafenativo.com` (`.com`, distinto del dominio marcador `.com.co`) | Confirmar el correo y que su dominio cuadre con el de la web |
| 9 | **Testimonio** | Anónimo: "— Clienta habitual, todos los sábados desde hace tres años" | Nombre real y permiso para publicarlo, o quitar la sección |
| 10 | **Las tres fincas** | "La Esperanza / Familia Restrepo", "El Zapote / Doña Amparo Ruiz", "Monte Nativo / Cooperativa de mujeres", con sus alturas, procesos, variedades y notas de cata | Leen como redactados, no como datos reales. Hay que confirmar finca por finca — y si son reales, pedir permiso a los productores para nombrarlos |
| 11 | **Horario contradictorio** | El hero dice "**Abierto todos los días, 7:30**" y las cifras "7:30 — Abrimos todos los días, festivos incluidos", pero la tabla de horarios dice sábados y domingos a las **8:30** | Corregir el copy del hero y de las cifras, o el de la tabla. Ahora mismo se contradicen y el JSON-LD sigue a la tabla |
| 12 | **Otras cifras** | "14 días máximo del tueste a tu taza", "1650 m de altura media" (que sí cuadra con la media de las tres fincas), "Leche de avena sin recargo", "descuento por devolver la bolsa" | Confirmar que son ciertas: son promesas comerciales |
| 13 | **Razón social** | El pie dice "© 2026 Café Nativo" | Nombre legal y NIT si se quieren avisos legales / política de datos |

### Las imágenes, en detalle

Hay que pedirle al cliente **10-20 fotos propias**, como exige el onboarding en
el README raíz del repositorio: *"el stock genérico destruye confianza"*. Pero
aquí el problema va más allá de que sean genéricas:

- **`bolsa-cafe.png` tiene marca de agua de "pngtree" repetida por toda la
  imagen**, y el texto de la ilustración es texto falso de IA: pone "UUTPEANQO",
  "TISIINE" y un "COFFEE" mal escrito. Es un archivo de stock sin licencia y no
  puede publicarse.
- **Los tres sacos de las fincas son producto de marcas de terceros**, con su
  logotipo perfectamente legible, presentados como si fueran el café de Café
  Nativo:
  - "La Esperanza · Familia Restrepo" → sacos de **Gómez Mora, Café de Sevilla
    (Colombia)**, lote 3177.
  - "El Zapote · Doña Amparo Ruiz" → saco de **El Ventilador, Origen Huila ·
    Laurina · 10 Kg**.
  - "Monte Nativo · Cooperativa de mujeres" → saco de **Café de El Salvador** —
    otro país, en un sitio que vende café colombiano.
- **Cuatro fotos del espacio salen de un artículo brasileño de arquitectura**
  sobre paisajismo en cafeterías (`paisagismo-em-cafeterias-10-projetos…`).
- **La misma foto se usa dos veces**: como terraza en el hero y como "fachada"
  en la sección de visita. Cuando lleguen las fotos propias hay que separarlas
  (hay un comentario marcándolo en `index.html`).

### Las 12 imágenes

| Archivo actual | Dónde sale | Archivo original |
|---|---|---|
| `terraza.jpg` | Hero **y** fachada en "Visítanos" | `paisagismo-…-arquitetura_1.jpg` |
| `granos-cafe.png` | Granos flotantes ×3 | `pngtree-some-coffee-beans-…_13807274.png` |
| `granos-hojas.webp` | Grano flotante | `roasted-coffee-beans-with-leaves-…-png.webp` |
| `saco-la-esperanza.png` | Origen 1 | `bulto_cafe-u5907.png` |
| `saco-el-zapote.webp` | Origen 2 | `10k_laurina_Mesa_de_trabajo_1-12_…webp` |
| `saco-monte-nativo.webp` | Origen 3 | `Saco-verde_6bc35081-…webp` |
| `taza-latte.jpg` | "El oficio" | `images.jpeg` |
| `salon-principal.jpg` | Galería 1 | `paisagismo-…-arquitetura_2.jpg` |
| `zona-mesas.jpg` | Galería 2 | `paisagismo-…-arquitetura_1 (1).jpg` |
| `sala-interior.jpg` | Galería 3 | `paisagismo-…-arquitetura_1 (2).jpg` |
| `terraza-noche.jpg` | Galería 4 | `360_F_302716168_KUgB5yFnZvexR5Kb1FneQAPxCEVCbYum.jpg` |
| `bolsa-cafe.png` | "Llévatelo a casa" | `pngtree-premium-design-coffee-bag-png-image_15360806.png` |

---

## Dónde tocar cada cosa

Todos los pendientes están marcados en el código con un comentario que dice
`PENDIENTE CL-12`, así que se encuentran con:

```bash
grep -n "PENDIENTE CL-12\|OJO CL-12" index.html
```

| Qué | Dónde |
|---|---|
| Dominio (canonical, OG, Twitter) | `index.html`, `<head>` |
| Dirección, teléfono, geo, redes | `index.html`, bloque comentado bajo el JSON-LD |
| Enlace de Maps | `index.html`, sección `#visita` |
| Precios | `index.html`, sección `#menu` (`<span class="ix-num">`) |
| Horarios | `index.html`, sección `#visita` **y** el JSON-LD del final |
| Fotos | `assets/img/` + los `<img>` (acordarse de actualizar `width`/`height`) |
| Colores y tipografía del sistema | `assets/ds/broadsheet.css` |
| Maqueta de esta página | El `<style>` de `index.html` |
