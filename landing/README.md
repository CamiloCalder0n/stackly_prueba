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
