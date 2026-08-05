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
