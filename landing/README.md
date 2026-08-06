# Stackly — Landing (SCRUM-54)

Landing page principal de Stackly. **No** comparte stack con `templates/`: es Vite + React +
TypeScript + Tailwind 3, no Astro, y se maneja con `npm` en vez de `pnpm`.

El andamiaje inicial salió de Bolt.new, pero desde entonces se le rehízo el portafolio y se le
hizo una pasada completa de contenido, accesibilidad y SEO. Queda poco del generador, así que no
asumas que algo está como está «porque lo puso Bolt».

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera dist/
npm run preview    # sirve el dist/ ya compilado, para revisar el build real
npm run typecheck  # tsc --noEmit sobre tsconfig.app.json
npm run lint       # eslint .
```

`npm run lint` no es solo estilo: la configuración de `eslint.config.js` incluye
`eslint-plugin-jsx-a11y`, así que ahí es donde se cazan los problemas de accesibilidad del JSX
(elementos interactivos sin rol, `label` sin campo asociado, handlers sobre elementos que no los
admiten). Vale la pena correrlo antes de cada deploy: la accesibilidad de esta página es parte de
lo que se vende.

`npm run preview` sirve el `dist/` ya compilado en vez del servidor de desarrollo. Es la única
forma de ver el sitio como queda de verdad en producción — con el bundle minificado y las
variables de entorno ya incrustadas.

## Despliegue (Vercel)

La landing se despliega en **Vercel** (proyecto `landing`; el enlace vive en `.vercel/`, que git
ignora). Las variables de entorno se configuran en el panel de Vercel, en Settings → Environment
Variables, no en un archivo del repositorio.

> **Nota sobre `.netlify/`:** en disco conviven `.vercel/` y `.netlify/`. Ambos están ignorados
> por git y ninguno se sube. **Manda Vercel**: `.netlify/` es residuo de un intento anterior de
> desplegar en Netlify que falló por permisos. No hay que borrar ninguna de las dos carpetas —
> son configuración local de la máquina, no del proyecto.

## Formulario de contacto (Supabase)

El formulario de la sección `#contacto` guarda los mensajes en una tabla de Supabase. Sin configurar, el formulario muestra un aviso y no rompe el resto del sitio.

> [!IMPORTANT]
> **Tarea abierta: falta correr el segundo bloque de `supabase/schema.sql` en el Supabase real.**
> El primer bloque (tabla + RLS) ya está aplicado; el segundo, el marcado
> `EJECUTAR DESPUÉS DEL SCRIPT INICIAL`, **no**. Hasta que se ejecute, la base acepta nombres
> vacíos, correos con cualquier formato y mensajes de megabytes: las validaciones solo existen en
> el navegador, y la anon key es pública, así que saltárselas es trivial. Ver
> [Orden de ejecución del SQL](#orden-de-ejecución-del-sql).

1. Crea un proyecto gratuito en [supabase.com](https://supabase.com).
2. En el SQL Editor del proyecto, corre `supabase/schema.sql` — **los dos bloques**, en el orden en que están (crea la tabla `contact_submissions` con RLS —el público solo puede insertar, no leer— y luego le añade las validaciones).
3. Copia `.env.example` a `.env` y completa con los datos del proyecto (Settings → API):
   ```
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   ```
4. Los mensajes quedan en Supabase → Table Editor → `contact_submissions`.

En **Vercel** (Settings → Environment Variables) hay que agregar esas dos mismas variables antes
de desplegar, y volver a construir para que queden dentro del bundle. Vite las incrusta en tiempo
de compilación, así que cambiarlas en el panel no surte efecto hasta el siguiente build.

> **Ojo:** nadie recibe una notificación cuando alguien envía el formulario. Los mensajes se
> quedan en la tabla hasta que alguien abra el dashboard. Por eso el copy de la sección de
> contacto promete «te escribimos por correo» y no un tiempo de respuesta concreto: revisa la
> tabla a diario, o monta una notificación (Supabase → Database Webhooks) antes de prometer más.

### Orden de ejecución del SQL

`supabase/schema.sql` está partido en dos bloques. Se corren **en este orden** y desde el SQL
Editor del proyecto:

1. **Script inicial** (líneas hasta la política `Cualquiera puede enviar el formulario`): crea la
   tabla, activa RLS y deja al público solo insertar. Ya está ejecutado en el proyecto actual.
2. **Bloque «EJECUTAR DESPUÉS DEL SCRIPT INICIAL»**: agrega restricciones `CHECK` de longitud y
   formato de correo, y reafirma los permisos del rol `anon`. **Pendiente de ejecutar.**

El segundo bloque es idempotente (`drop constraint if exists` + `add constraint`), así que se
puede correr varias veces sin recrear la tabla ni perder los mensajes que ya existan. Las
restricciones se agregan como `not valid`: aplican a todo lo que entre de ahí en adelante, pero
no revisan las filas viejas, de modo que el `alter` nunca falla por datos de prueba. Al final del
archivo quedan comentadas una consulta para detectar filas que no cumplen y los tres
`validate constraint` para activarlas del todo cuando la tabla esté limpia.

Qué imponen los `CHECK` (los mismos límites están en `LIMITES`, dentro de `src/components/CTA.tsx`):

| Campo     | Regla                                                              |
| --------- | ------------------------------------------------------------------ |
| `name`    | entre 2 y 80 caracteres **después de recortar espacios**            |
| `email`   | entre 5 y 120 caracteres y con formato `algo@algo.tld` (exige TLD)  |
| `message` | entre 10 y 1200 caracteres después de recortar espacios             |

`not null` por sí solo no impide una cadena vacía ni un espacio suelto: sin estos `CHECK` entran
filas en blanco y mensajes de megabytes.

## Anti-spam del formulario

La anon key viaja en el bundle JS público y la política de inserción es `with check (true)`, así
que cualquiera podría insertar filas. En el cliente (`src/components/CTA.tsx`) hay dos barreras:

- **Honeypot**: un campo oculto (`empresa-web`) que una persona nunca ve. Si llega lleno, el
  envío se descarta en silencio, se finge éxito y **no se inserta nada**.

  La idea es la misma que en `templates/_base/src/components/Contacto.astro`, pero **el mecanismo
  no**, y conviene no confundirlos al copiar código de un lado al otro. Allí el campo se llama
  `bot-field` y lo declara `netlify-honeypot="bot-field"`: quien filtra es **Netlify Forms**, en
  el servidor, antes de que el envío llegue a ninguna parte. Aquí no hay servidor de por medio —
  el campo se llama `empresa-web` y **lo descarta el propio React** en `src/components/CTA.tsx`,
  en el navegador del visitante.
- **Time-trap**: se rechazan los envíos que llegan en menos de 3 segundos desde que el formulario
  quedó disponible.

Ninguna de las dos es infalible desde el navegador. Si aparece spam real, el siguiente paso es
mover la inserción a una Edge Function con verificación de captcha o rate limiting por IP.

## Política de privacidad

`public/privacidad.html` es una página estática y autocontenida (sin dependencias externas) que
cubre la Ley 1581 de 2012: qué datos se recogen, para qué, dónde se almacenan (Supabase,
servidores en Canadá), por cuánto tiempo, quién responde y cómo ejercer los derechos de conocer,
actualizar, rectificar y suprimir escribiendo a `hola@stackly.dev`. Queda publicada en
`/privacidad.html` y está enlazada desde el formulario de contacto y desde el footer.

Si cambian el proveedor de base de datos, la región de los servidores o el plazo de conservación,
hay que actualizar esa página y su fecha de «última actualización».
