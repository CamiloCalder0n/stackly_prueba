import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Sin esto, el fallo se ve como "el formulario no funciona" y nadie sabe por qué.
  console.warn(
    '[supabase] Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. ' +
      'El formulario de contacto quedará deshabilitado. Revisa el .env (y las variables del hosting).'
  );
}

/**
 * Cliente público. Solo se usa para insertar en `contact_submissions`:
 * no hay login, así que apagamos todo lo de sesiones para no escribir en
 * localStorage ni levantar timers de refresco de token.
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      })
    : null;
