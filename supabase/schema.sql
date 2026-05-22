create extension if not exists pgcrypto;

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
  notas text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nombre text not null,
  categoria text,
  precio numeric(12,2) not null default 0,
  estado text not null default 'Activo' check (estado in ('Activo','Inactivo')),
  descripcion text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.compras (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  producto_id uuid not null references public.productos(id) on delete restrict,
  fecha_compra date not null,
  cantidad integer not null check (cantidad > 0),
  valor_unitario numeric(12,2) not null check (valor_unitario >= 0),
  valor_total numeric(12,2) not null check (valor_total >= 0),
  notas text,
  created_at timestamptz default now()
);

create table if not exists public.tareas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  tipo text not null check (tipo in ('llamada','WhatsApp','email','reunión')),
  estado text not null check (estado in ('pendiente','completada')),
  fecha_vencimiento date not null,
  notas text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);



create table if not exists public.mensajes_etapa (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  etapa text not null check (etapa in ('Atracción','Profundización','Fidelización','Retención','Recaptura')),
  mensaje text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
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
alter table public.productos enable row level security;
alter table public.compras enable row level security;
alter table public.tareas enable row level security;
alter table public.historial_acciones enable row level security;
alter table public.mensajes_etapa enable row level security;

drop policy if exists "clientes_owner" on public.clientes;
drop policy if exists "productos_owner" on public.productos;
drop policy if exists "compras_owner" on public.compras;
drop policy if exists "tareas_owner" on public.tareas;
drop policy if exists "historial_owner" on public.historial_acciones;
drop policy if exists "mensajes_owner" on public.mensajes_etapa;

create policy "clientes_owner" on public.clientes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "productos_owner" on public.productos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "compras_owner" on public.compras for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tareas_owner" on public.tareas for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "historial_owner" on public.historial_acciones for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "mensajes_owner" on public.mensajes_etapa for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
