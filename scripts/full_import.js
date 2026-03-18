import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Environment variables VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY are missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BACKUP_DIR = 'C:\\Users\\cardo\\Downloads';
const backupFiles = [
  'backup_detran_2026-03-18.json',
  'backup_detran_2026-03-17.json',
  'backup_detran_2026-03-06.json',
  'backup_detran_2026-03-05.json',
  'backup_detran_2026-03-03.json'
];

async function fullImport() {
  try {
    const allAppsMap = new Map();
    const allTicketsMap = new Map();

    for (const fileName of backupFiles) {
      const filePath = path.join(BACKUP_DIR, fileName);
      if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${fileName}, skipping.`);
        continue;
      }

      console.log(`Processing ${fileName}...`);
      const rawData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(rawData);
      
      const apps = data.appointments || (Array.isArray(data) ? data : []);
      const tix = data.tickets || [];

      apps.forEach(app => {
        if (app.id) {
          // Keep newest or merge? Let's keep existing if it's more complete, 
          // but usually the latest backup is the best.
          allAppsMap.set(app.id, { ...allAppsMap.get(app.id), ...app });
        }
      });

      tix.forEach(ticket => {
        if (ticket.id) {
          allTicketsMap.set(ticket.id, { ...allTicketsMap.get(ticket.id), ...ticket });
        }
      });
    }

    const finalApps = Array.from(allAppsMap.values());
    const finalTickets = Array.from(allTicketsMap.values());
    
    console.log(`Total unique appointments: ${finalApps.length}`);
    console.log(`Total unique tickets: ${finalTickets.length}`);

    // Import appointments
    const BATCH_SIZE = 50;
    for (let i = 0; i < finalApps.length; i += BATCH_SIZE) {
      const batch = finalApps.slice(i, i + BATCH_SIZE).map(app => ({
        ...app,
        examType: app.examType === 'Rua' ? 'Prova de Rua' : (app.examType || 'Legislação'),
        updatedAt: app.updatedAt || new Date().toISOString()
      }));
      
      const { error } = await supabase.from('appointments').upsert(batch);
      if (error) console.error(`Error importing appointments batch:`, error);
      else console.log(`Imported appointments batch ${Math.floor(i/BATCH_SIZE) + 1}`);
    }

    // Import tickets
    for (let i = 0; i < finalTickets.length; i += BATCH_SIZE) {
      const batch = finalTickets.slice(i, i + BATCH_SIZE).map(ticket => ({
        ...ticket,
        updatedAt: ticket.updatedAt || new Date().toISOString()
      }));
      
      const { error } = await supabase.from('tickets').upsert(batch);
      if (error) console.error(`Error importing tickets batch:`, error);
      else console.log(`Imported tickets batch ${Math.floor(i/BATCH_SIZE) + 1}`);
    }

    console.log('Final sync completed successfully.');
  } catch (error) {
    console.error('Critical error during import:', error);
  }
}

fullImport();
