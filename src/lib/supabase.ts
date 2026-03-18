import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  
  return supabaseInstance;
};

// Export a dummy object for types if needed, but we'll use getSupabase() in the app
export const supabase = getSupabase();

// Deploy Configuration - SQL para criar a tabela no Supabase SQL Editor:
/*
-- Tabela de configurações do app
create table app_config (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text not null,
  description text,
  "createdAt" timestamp with time zone default now(),
  "updatedAt" timestamp with time zone default now()
);

-- Inserir configuração de deploy
insert into app_config (key, value, description) values 
('deploy_command', 'npm run deploy', 'Comando para fazer deploy do projeto'),
('deploy_description', 'Executa build, commit e push para main', 'Descrição do processo de deploy'),
('repo_url', 'https://github.com/ninocardoso/agendamento-de-prova.git', 'URL do repositório'),
('vercel_url', 'https://agendamento-de-prova.vercel.app', 'URL do site hospedado na Vercel');

-- Permitir acesso público
alter table app_config enable row level security;
create policy "Public Access" on app_config for all using (true) with check (true);
*/

export interface AppConfig {
  id: string;
  key: string;
  value: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export const saveDeployConfig = async (config: Partial<AppConfig>) => {
  const supabaseClient = getSupabase();
  if (!supabaseClient) return { error: 'Supabase não configurado' };
  
  const { error } = await supabaseClient
    .from('app_config')
    .upsert({
      key: config.key,
      value: config.value,
      description: config.description,
      updatedAt: new Date().toISOString()
    }, { onConflict: 'key' });
  
  return { error };
};

export const getDeployConfig = async () => {
  const supabaseClient = getSupabase();
  if (!supabaseClient) return { data: null, error: 'Supabase não configurado' };
  
  const { data, error } = await supabaseClient
    .from('app_config')
    .select('*')
    .in('key', ['deploy_command', 'deploy_description', 'repo_url', 'vercel_url']);
  
  return { data, error };
};

/**
 * SQL para criar as tabelas no Supabase SQL Editor:
 * 
 * create table appointments (
 *   id uuid primary key default gen_random_uuid(),
 *   "fullName" text not null,
 *   cpf text not null,
 *   renach text not null,
 *   "appointmentDate" text not null,
 *   location text not null,
 *   contact text,
 *   "isFitVision" boolean default false,
 *   "isFitPsychologist" boolean default false,
 *   "isFitH572C" boolean default false,
 *   "isFitCP02A" boolean default false,
 *   "isFitLegislation" boolean default false,
 *   "isConfirmed" boolean default false,
 *   "isRequestSent" boolean default false,
 *   "result" text,
 *   observations text,
 *   "appointmentTime" text,
 *   "serviceType" text,
 *   category text,
 *   "examType" text,
 *   "hasSgaCrtCall" boolean default false,
 *   "createdAt" timestamp with time zone default now(),
 *   "updatedAt" timestamp with time zone default now()
 * );
 * 
 * create table tickets (
 *   id uuid primary key default gen_random_uuid(),
 *   "appointmentId" uuid references appointments(id),
 *   "studentName" text not null,
 *   "studentCpf" text not null,
 *   "studentRenach" text not null,
 *   type text not null,
 *   status text not null,
 *   description text not null,
 *   observations text,
 *   "createdAt" timestamp with time zone default now(),
 *   "updatedAt" timestamp with time zone default now()
 * );
 * 
 * create table app_config (
 *   id uuid primary key default gen_random_uuid(),
 *   key text not null unique,
 *   value text not null,
 *   description text,
 *   "createdAt" timestamp with time zone default now(),
 *   "updatedAt" timestamp with time zone default now()
 * );
 * 
 * -- Se as tabelas já existirem, rode estes comandos para atualizar as colunas:
 * alter table appointments add column if not exists "hasSgaCrtCall" boolean default false;
 * alter table appointments add column if not exists "isRequestSent" boolean default false;
 * alter table appointments add column if not exists "result" text;
 * alter table appointments add column if not exists "updatedAt" timestamp with time zone default now();
 * 
 * -- Políticas de segurança
 * alter table appointments enable row level security;
 * alter table tickets enable row level security;
 * alter table app_config enable row level security;
 * create policy "Public Access" on appointments for all using (true) with check (true);
 * create policy "Public Access" on tickets for all using (true) with check (true);
 * create policy "Public Access" on app_config for all using (true) with check (true);
 * 
 * -- Inserir configuração de deploy inicial
 * insert into app_config (key, value, description) values 
 * ('deploy_command', 'npm run deploy', 'Comando para fazer deploy do projeto'),
 * ('deploy_description', 'Executa build, commit e push para main', 'Descrição do processo de deploy'),
 * ('repo_url', 'https://github.com/ninocardoso/agendamento-de-prova.git', 'URL do repositório'),
 * ('vercel_url', 'https://agendamento-de-prova.vercel.app', 'URL do site hospedado na Vercel');
 */
