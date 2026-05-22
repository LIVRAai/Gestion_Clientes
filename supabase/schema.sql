create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nombre text not null,
  celular text not null,
  email text,
  empresa text,
  etapa_ciclo_vida text not null check (etapa_ciclo_vida in ('Atracción','Profundización','Fidelización','Retención','Recaptura')),
  estado text not null check (estado in ('Nuevo','Contactado','Interesado','Cliente activo','En riesgo','Inactivo','Recuperado')),
  origen text,
  ultima_compra date,
  valor_ultima_compra numeric(12,2) default 0,
  valor_estimado_recompra numeric(12,2) default 0,
  fecha_ultimo_contacto date,
  notas text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create table if not exists public.tareas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  tipo text not null check (tipo in ('llamada','WhatsApp','email','reunión')),
  estado text not null check (estado in ('pendiente','completada')),
  fecha_vencimiento date not null,
  notas text,
  created_at timestamptz default now()
);
create table if not exists public.historial_acciones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  accion text not null,
  detalle text,
  created_at timestamptz default now()
);
alter table public.clientes enable row level security;
alter table public.tareas enable row level security;
alter table public.historial_acciones enable row level security;
create policy "clientes_owner" on public.clientes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tareas_owner" on public.tareas for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "historial_owner" on public.historial_acciones for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
insert into public.clientes (user_id,nombre,celular,email,empresa,etapa_ciclo_vida,estado,origen,ultima_compra,valor_ultima_compra,valor_estimado_recompra,fecha_ultimo_contacto,notas)
values
  ('00000000-0000-0000-0000-000000000000','María López','3001112233','maria@acme.com','Acme SAS','Retención','Cliente activo','Instagram','2026-03-10',800000,1200000,'2026-05-01','Interés en plan anual');
