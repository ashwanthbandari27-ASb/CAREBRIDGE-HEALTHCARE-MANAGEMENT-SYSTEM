create extension if not exists pgcrypto;

do $$ begin create type public.user_role as enum ('patient','doctor','admin','donor'); exception when duplicate_object then null; end $$;
do $$ begin create type public.request_status as enum ('draft','submitted','matching','contacted','confirmed','completed','cancelled'); exception when duplicate_object then null; end $$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null, full_name text not null, phone text, role user_role not null default 'patient',
  preferred_language text not null default 'English', avatar_url text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.patients (id uuid primary key default gen_random_uuid(), user_id uuid unique not null references public.users(id) on delete cascade, date_of_birth date, blood_group text, emergency_contact text, primary_doctor_id uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.doctors (id uuid primary key default gen_random_uuid(), user_id uuid unique not null references public.users(id) on delete cascade, registration_number text unique, specialization text, department text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
alter table public.patients add constraint patients_primary_doctor_fk foreign key (primary_doctor_id) references public.doctors(id);
create table if not exists public.donors (id uuid primary key default gen_random_uuid(), user_id uuid unique references public.users(id) on delete set null, blood_group text, availability boolean default true, city text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.family_members (id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.patients(id) on delete cascade, user_id uuid references public.users(id), full_name text not null, relationship text, access_level text default 'limited', created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table if not exists public.appointments (id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.patients(id), doctor_id uuid not null references public.doctors(id), scheduled_at timestamptz not null, type text not null check (type in ('video','audio','chat','in_person')), status text default 'scheduled', reason text, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.consultations (id uuid primary key default gen_random_uuid(), appointment_id uuid references public.appointments(id), patient_id uuid not null references public.patients(id), doctor_id uuid not null references public.doctors(id), started_at timestamptz, ended_at timestamptz, summary text, status text default 'scheduled', created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.prescriptions (id uuid primary key default gen_random_uuid(), consultation_id uuid references public.consultations(id), patient_id uuid not null references public.patients(id), doctor_id uuid not null references public.doctors(id), instructions text, status text default 'active', issued_at date default current_date, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.prescription_items (id uuid primary key default gen_random_uuid(), prescription_id uuid not null references public.prescriptions(id) on delete cascade, medicine_name text not null, dosage text, frequency text, duration text, instructions text, created_at timestamptz default now());
create table if not exists public.medical_records (id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.patients(id), title text not null, record_type text not null, description text, document_url text, recorded_on date default current_date, created_by uuid references public.users(id), created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.lab_reports (id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.patients(id), consultation_id uuid references public.consultations(id), test_name text not null, status text default 'pending', sample_collected_at timestamptz, resulted_at timestamptz, report_url text, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.care_plans (id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.patients(id), doctor_id uuid references public.doctors(id), title text not null, description text, start_date date default current_date, end_date date, status text default 'active', progress integer default 0 check (progress between 0 and 100), created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.care_gaps (id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.patients(id), care_plan_id uuid references public.care_plans(id), category text not null, title text not null, description text, due_at timestamptz, status text default 'pending', resolved_at timestamptz, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.follow_ups (id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.patients(id), doctor_id uuid references public.doctors(id), appointment_id uuid references public.appointments(id), due_at timestamptz not null, status text default 'scheduled', completed_at timestamptz, notes text, created_at timestamptz default now(), updated_at timestamptz default now());

create table if not exists public.emergency_profiles (id uuid primary key default gen_random_uuid(), patient_id uuid unique not null references public.patients(id), blood_group text, allergies text[] default '{}', conditions text[] default '{}', emergency_contact_name text, emergency_contact_phone text, qr_code text unique, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.emergency_access_logs (id uuid primary key default gen_random_uuid(), emergency_profile_id uuid not null references public.emergency_profiles(id), accessed_by uuid references public.users(id), reason text, created_at timestamptz default now());

create table if not exists public.blood_requests (id uuid primary key default gen_random_uuid(), patient_id uuid references public.patients(id), requested_by uuid not null references public.users(id), blood_group text not null, units integer default 1 check (units > 0), hospital text, city text, status request_status default 'submitted', needed_by timestamptz, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.blood_donors (id uuid primary key default gen_random_uuid(), donor_id uuid not null references public.donors(id), blood_group text not null, last_donation date, available_from date default current_date, city text, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.blood_request_responses (id uuid primary key default gen_random_uuid(), request_id uuid not null references public.blood_requests(id) on delete cascade, blood_donor_id uuid not null references public.blood_donors(id), status text default 'contacted', responded_at timestamptz default now(), created_at timestamptz default now());
create table if not exists public.organ_donors (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id), organs text[] not null, status text default 'interest_recorded', consent_at timestamptz, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.organ_requests (id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.patients(id), requested_by uuid not null references public.users(id), organ text not null, status text default 'submitted', notes text, created_at timestamptz default now(), updated_at timestamptz default now());

create table if not exists public.pharmacy_products (id uuid primary key default gen_random_uuid(), name text not null, category text, description text, price numeric(10,2) not null check (price >= 0), in_stock integer default 0 check (in_stock >= 0), requires_prescription boolean default false, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.medicine_orders (id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.patients(id), status text default 'placed', delivery_address text, total numeric(10,2) not null default 0, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.medicine_order_items (id uuid primary key default gen_random_uuid(), order_id uuid not null references public.medicine_orders(id) on delete cascade, product_id uuid references public.pharmacy_products(id), product_name text not null, quantity integer not null default 1 check (quantity > 0), unit_price numeric(10,2) not null, created_at timestamptz default now());
create table if not exists public.medicine_history (id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.patients(id), medicine_name text not null, dosage text, status text default 'active', started_at date, ended_at date, created_at timestamptz default now(), updated_at timestamptz default now());

create table if not exists public.notifications (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade, title text not null, message text, type text default 'info', read_at timestamptz, link text, created_at timestamptz default now());
create table if not exists public.consents (id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.patients(id), granted_to uuid references public.users(id), scope text[] default '{}', expires_at timestamptz, active boolean default true, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.audit_logs (id bigserial primary key, actor_id uuid references public.users(id), action text not null, entity_type text not null, entity_id text, details jsonb default '{}', ip_address inet, created_at timestamptz default now());

create index if not exists appointments_patient_idx on public.appointments(patient_id); create index if not exists appointments_doctor_idx on public.appointments(doctor_id);
create index if not exists care_gaps_patient_status_idx on public.care_gaps(patient_id,status); create index if not exists notifications_user_idx on public.notifications(user_id,read_at);
create index if not exists lab_reports_patient_idx on public.lab_reports(patient_id); create index if not exists prescriptions_patient_idx on public.prescriptions(patient_id);

create or replace function public.handle_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
drop trigger if exists users_updated_at on public.users; create trigger users_updated_at before update on public.users for each row execute function public.handle_updated_at();

create or replace function public.current_user_role() returns user_role language sql stable security definer set search_path=public as $$ select role from public.users where id=auth.uid() $$;
create or replace function public.is_doctor_for_patient(p_patient_id uuid) returns boolean language sql stable security definer set search_path=public as $$ select exists (select 1 from public.appointments a join public.patients p on p.id=a.patient_id join public.doctors d on d.id=a.doctor_id where a.patient_id=p_patient_id and d.user_id=auth.uid()) $$;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public.users(id,email,full_name,role) values(new.id,coalesce(new.email,''),coalesce(new.raw_user_meta_data->>'full_name','CAREBRIDGE User'),coalesce((new.raw_user_meta_data->>'role')::user_role,'patient')) on conflict(id) do nothing; if coalesce((new.raw_user_meta_data->>'role'),'patient')='patient' then insert into public.patients(user_id) select new.id where not exists(select 1 from public.patients where user_id=new.id); end if; if coalesce((new.raw_user_meta_data->>'role'),'patient')='doctor' then insert into public.doctors(user_id) select new.id where not exists(select 1 from public.doctors where user_id=new.id); end if; return new; end $$;
drop trigger if exists on_auth_user_created on auth.users; create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.users enable row level security;
alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.consultations enable row level security;
alter table public.prescriptions enable row level security;
alter table public.medical_records enable row level security;
alter table public.lab_reports enable row level security;
alter table public.care_plans enable row level security;
alter table public.care_gaps enable row level security;
alter table public.notifications enable row level security;
alter table public.blood_requests enable row level security;

create policy users_self_admin on public.users for all using (id=auth.uid() or current_user_role()='admin') with check (id=auth.uid() or current_user_role()='admin');
create policy patients_self_doctor_admin on public.patients for select using (user_id=auth.uid() or primary_doctor_id in (select id from public.doctors where user_id=auth.uid()) or current_user_role()='admin');
create policy appointments_read on public.appointments for select using (patient_id in (select id from public.patients where user_id=auth.uid()) or doctor_id in (select id from public.doctors where user_id=auth.uid()) or current_user_role()='admin');
create policy appointments_write_doctor on public.appointments for all using (doctor_id in (select id from public.doctors where user_id=auth.uid()) or current_user_role()='admin') with check (doctor_id in (select id from public.doctors where user_id=auth.uid()) or current_user_role()='admin');
create policy medical_read on public.medical_records for select using (patient_id in (select id from public.patients where user_id=auth.uid()) or is_doctor_for_patient(patient_id) or current_user_role()='admin');
create policy prescriptions_read on public.prescriptions for select using (patient_id in (select id from public.patients where user_id=auth.uid()) or doctor_id in (select id from public.doctors where user_id=auth.uid()) or current_user_role()='admin');
create policy consultations_read on public.consultations for select using (patient_id in (select id from public.patients where user_id=auth.uid()) or doctor_id in (select id from public.doctors where user_id=auth.uid()) or current_user_role()='admin');
create policy labs_read on public.lab_reports for select using (patient_id in (select id from public.patients where user_id=auth.uid()) or is_doctor_for_patient(patient_id) or current_user_role()='admin');
create policy care_plans_read on public.care_plans for select using (patient_id in (select id from public.patients where user_id=auth.uid()) or doctor_id in (select id from public.doctors where user_id=auth.uid()) or current_user_role()='admin');
create policy gaps_read on public.care_gaps for select using (patient_id in (select id from public.patients where user_id=auth.uid()) or current_user_role()='admin');
create policy notifications_self on public.notifications for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy blood_requests_read on public.blood_requests for select using (requested_by=auth.uid() or current_user_role()='admin' or current_user_role()='donor');
create policy blood_requests_write on public.blood_requests for insert with check (requested_by=auth.uid());

insert into storage.buckets(id,name,public) values ('carebridge-records','carebridge-records',false) on conflict(id) do nothing;
drop policy if exists "record download authenticated" on storage.objects;
create policy "record download authenticated" on storage.objects for select using (bucket_id='carebridge-records' and auth.role()='authenticated');
drop policy if exists "record upload authenticated" on storage.objects;
create policy "record upload authenticated" on storage.objects for insert with check (bucket_id='carebridge-records' and auth.role()='authenticated');
