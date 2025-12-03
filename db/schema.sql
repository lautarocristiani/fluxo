-- ================================================================
-- FLUXO - FIELD SERVICE MANAGEMENT (FSM) SCHEMA
-- ================================================================

-- 1. SETUP & EXTENSIONS
create extension if not exists "uuid-ossp";

create type user_role as enum ('dispatcher', 'technician');
create type order_status as enum ('pending', 'in_progress', 'completed');

-- ================================================================
-- 2. TABLES
-- ================================================================

-- PROFILES (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  first_name text,
  last_name text,
  role user_role default 'technician',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SERVICE TEMPLATES (RJSF Definitions)
create table public.service_templates (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  schema_definition jsonb not null,
  ui_schema_definition jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- WORK ORDERS (Transactional Data)
create table public.work_orders (
  id uuid default uuid_generate_v4() primary key,
  status order_status default 'pending',
  template_id uuid references public.service_templates(id) not null,
  assignee_id uuid references public.profiles(id),
  customer_name text not null,
  customer_address text not null,
  form_data jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- ================================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ================================================================

alter table public.profiles enable row level security;
alter table public.service_templates enable row level security;
alter table public.work_orders enable row level security;

-- PROFILES POLICIES
create policy "Public profiles are viewable by everyone" 
  on public.profiles for select using (true);

create policy "Users can update own profile" 
  on public.profiles for update using (auth.uid() = id);

-- TEMPLATES POLICIES
create policy "Templates are viewable by authenticated users" 
  on public.service_templates for select to authenticated using (true);

-- WORK ORDERS POLICIES
create policy "Enable read access for all authenticated users"
  on public.work_orders for select to authenticated using (true);

create policy "Enable insert/update for authenticated users"
  on public.work_orders for all to authenticated using (true);

-- ================================================================
-- 4. AUTOMATION (TRIGGERS)
-- ================================================================

-- Auto-create profile on SignUp using Metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, first_name, last_name)
  values (
    new.id,
    new.email,
    'technician', -- Default role
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ================================================================
-- 5. STORAGE
-- ================================================================

insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

  -- BUCKET: WORK-EVIDENCE
insert into storage.buckets (id, name, public) 
values ('work-evidence', 'work-evidence', true)
on conflict (id) do nothing;

create policy "Technicians can upload evidence"
  on storage.objects for insert
  with check ( bucket_id = 'work-evidence' and auth.role() = 'authenticated' );

create policy "Evidence is publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'work-evidence' );