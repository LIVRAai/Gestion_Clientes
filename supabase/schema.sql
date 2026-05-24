create extension if not exists pgcrypto;

create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  leader_name text not null,
  leader_whatsapp text not null,
  payment_method text not null check (payment_method in ('Nequi','Daviplata','Bancolombia','Otro')),
  payment_account text not null,
  value_per_person numeric(12,2) not null check (value_per_person > 0),
  admin_code text not null,
  public_token text not null unique default encode(gen_random_bytes(12),'hex'),
  admin_token text not null unique default encode(gen_random_bytes(16),'hex'),
  scoring_exact int not null default 3,
  scoring_winner int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists participants (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  name text not null,
  whatsapp text not null,
  created_at timestamptz not null default now(),
  unique(group_id, whatsapp)
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  external_id int unique,
  home_team text not null,
  away_team text not null,
  kickoff_at timestamptz not null,
  phase text,
  status text not null check (status in ('programado','en_vivo','finalizado')) default 'programado',
  home_score int,
  away_score int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists predictions (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  participant_id uuid not null references participants(id) on delete cascade,
  match_id uuid not null references matches(id) on delete cascade,
  home_goals int not null check (home_goals >= 0),
  away_goals int not null check (away_goals >= 0),
  points_awarded int not null default 0,
  exact_hit boolean not null default false,
  winner_hit boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(participant_id, match_id)
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  participant_id uuid not null references participants(id) on delete cascade,
  status text not null check (status in ('Pendiente','Reportado','Confirmado')) default 'Pendiente',
  note text,
  updated_by_leader boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(group_id, participant_id)
);

create index if not exists idx_participants_group on participants(group_id);
create index if not exists idx_predictions_group on predictions(group_id);
create index if not exists idx_predictions_match on predictions(match_id);
create index if not exists idx_payments_group on payments(group_id);
create index if not exists idx_matches_kickoff on matches(kickoff_at);
