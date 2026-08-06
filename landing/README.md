# Stackly — Landing (SCRUM-54)

Landing page principal de Stackly. Traída de Bolt.new; **no** comparte stack con `templates/` (Vite + React + TypeScript + Tailwind 3, no Astro).

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera dist/
npm run typecheck
```

## Formulario de contacto (Supabase)

El formulario de la sección `#contacto` guarda los mensajes en una tabla de Supabase. Sin configurar, el formulario muestra un aviso y no rompe el resto del sitio.

1. Crea un proyecto gratuito en [supabase.com](https://supabase.com).
2. En el SQL Editor del proyecto, corre `supabase/schema.sql` (crea la tabla `contact_submissions` con RLS: el público solo puede insertar, no leer).
3. Copia `.env.example` a `.env` y completa con los datos del proyecto (Settings → API):
   ```
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   ```
4. Los mensajes quedan en Supabase → Table Editor → `contact_submissions`.

En el hosting (Netlify/Cloudflare Pages), agrega las mismas variables de entorno antes de hacer deploy.

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
  envío se descarta en silencio, se finge éxito y **no se inserta nada**. Mismo patrón que usa
  `templates/_base/src/components/Contacto.astro`.
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
