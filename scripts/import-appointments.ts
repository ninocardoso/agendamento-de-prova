import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessárias');
  console.error('Defina no arquivo .env ou exporte diretamente:');
  console.error('  export VITE_SUPABASE_URL=sua_url');
  console.error('  export VITE_SUPABASE_ANON_KEY=sua_chave');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const jsonFilePath = process.argv[2];

if (!jsonFilePath) {
  console.error('Uso: npx tsx import-appointments.ts <caminho_do_arquivo_json>');
  console.error('Exemplo: npx tsx import-appointments.ts ./backup_detran_2026-03-18.json');
  process.exit(1);
}

interface Appointment {
  id: string;
  fullName: string;
  cpf: string;
  renach: string;
  appointmentDate: string;
  appointmentTime?: string;
  location: string;
  contact?: string;
  serviceType?: string;
  category?: string;
  isFitVision?: boolean;
  isFitPsychologist?: boolean;
  isFitH572C?: boolean;
  isFitCP02A?: boolean;
  isFitLegislation?: boolean;
  examType?: string;
  isConfirmed?: boolean;
  isRequestSent?: boolean;
  hasSgaCrtCall?: boolean;
  result?: string | null;
  observations?: string;
  createdAt: string;
  updatedAt: string;
}

interface BackupData {
  appointments: Appointment[];
}

async function importAppointments() {
  console.log('Lendo arquivo JSON...');
  const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');
  const data: BackupData = JSON.parse(jsonContent);
  
  console.log(`Total de agendamentos no JSON: ${data.appointments.length}`);

  console.log('Buscando agendamentos existentes no banco...');
  const { data: existingAppointments, error: fetchError } = await supabase
    .from('appointments')
    .select('id');

  if (fetchError) {
    console.error('Erro ao buscar agendamentos:', fetchError);
    process.exit(1);
  }

  const existingIds = new Set(existingAppointments?.map(a => a.id) || []);
  console.log(`Agendamentos existentes no banco: ${existingIds.size}`);

  const appointmentsToInsert = data.appointments.filter(app => !existingIds.has(app.id));
  
  console.log(`Agendamentos para inserir: ${appointmentsToInsert.length}`);
  
  if (appointmentsToInsert.length === 0) {
    console.log('Nenhum agendamento novo para inserir. Tudo já está no banco!');
    return;
  }

  console.log('\nAgendamentos que serão inseridos:');
  appointmentsToInsert.forEach((app, i) => {
    console.log(`  ${i + 1}. ${app.fullName} - CPF: ${app.cpf} - RENACH: ${app.renach}`);
  });

  console.log('\nInserindo...');
  
  const { data: inserted, error: insertError } = await supabase
    .from('appointments')
    .insert(appointmentsToInsert)
    .select();

  if (insertError) {
    console.error('Erro ao inserir agendamentos:', insertError);
    process.exit(1);
  }

  console.log(`\nSucesso! ${inserted?.length || appointmentsToInsert.length} agendamentos inseridos.`);
}

importAppointments().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
