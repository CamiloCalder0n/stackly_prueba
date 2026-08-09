create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table contact_submissions enable row level security;

-- El formulario público solo puede insertar. Nadie con la anon key
-- puede leer, editar o borrar mensajes de otras personas.
create policy "Cualquiera puede enviar el formulario"
  on contact_submissions
  for insert
  to anon
  with check (true);


-- ============================================================================
-- EJECUTAR DESPUÉS DEL SCRIPT INICIAL
-- ----------------------------------------------------------------------------
-- Todo lo de abajo es idempotente: se puede correr las veces que haga falta
-- sin recrear la tabla ni perder los datos que ya existen.
--
-- Por qué hace falta: `not null` NO impide cadenas vacías, así que hoy entran
-- filas con nombre y mensaje en blanco (o de megabytes). Los CHECK cierran eso
-- del lado del servidor, que es el único que un bot no puede saltarse.
--
-- Se agregan como `not valid`: se aplican a TODO lo que entre de aquí en
-- adelante, pero no revisan las filas viejas, así que el ALTER nunca falla
-- aunque haya pruebas guardadas. Al final hay un bloque opcional para
-- validarlas cuando la tabla esté limpia.
-- ============================================================================

-- Longitudes máximas: deben coincidir con LIMITES en src/components/CTA.tsx.
alter table contact_submissions drop constraint if exists contact_submissions_name_check;
alter table contact_submissions
  add constraint contact_submissions_name_check
  check (char_length(btrim(name)) between 2 and 80) not valid;

-- Formato mínimo de correo: algo@algo.tld (el type="email" del navegador
-- acepta `a@b`, sin TLD; esto no).
alter table contact_submissions drop constraint if exists contact_submissions_email_check;
alter table contact_submissions
  add constraint contact_submissions_email_check
  check (
    char_length(btrim(email)) between 5 and 120
    and btrim(email) ~ '^[^[:space:]@]+@[^[:space:]@]+\.[A-Za-z]{2,}$'
  ) not valid;

alter table contact_submissions drop constraint if exists contact_submissions_message_check;
alter table contact_submissions
  add constraint contact_submissions_message_check
  check (char_length(btrim(message)) between 10 and 1200) not valid;

-- El rol público solo debe poder insertar. Explícito por si alguna vez se
-- otorgó de más (RLS ya lo bloquea, pero esto lo deja sin ambigüedad).
revoke select, update, delete on contact_submissions from anon;
grant insert on contact_submissions to anon;

-- ----------------------------------------------------------------------------
-- OPCIONAL — solo cuando confirmes que las filas existentes cumplen los CHECK.
-- Si alguna no cumple, VALIDATE falla y te dice cuál; bórrala y repite.
-- ----------------------------------------------------------------------------
-- select * from contact_submissions
-- where char_length(btrim(name)) not between 2 and 80
--    or char_length(btrim(message)) not between 10 and 1200
--    or btrim(email) !~ '^[^[:space:]@]+@[^[:space:]@]+\.[A-Za-z]{2,}$';
--
-- alter table contact_submissions validate constraint contact_submissions_name_check;
-- alter table contact_submissions validate constraint contact_submissions_email_check;
-- alter table contact_submissions validate constraint contact_submissions_message_check;
