const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

try {
  const envPath = path.join(__dirname, '../../.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      env[match[1]] = (match[2] || '').trim().replace(/^"|"$/g, '');
    }
  });

  const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY']);

  async function checkAll() {
    console.log('Testing connection to URL:', env['NEXT_PUBLIC_SUPABASE_URL']);
    
    const { data: pData, error: pErr } = await supabase.from('projects').select('*').limit(1);
    console.log('Projects table check - error:', pErr ? pErr.message : 'No error (table exists)');

    const { data: aData, error: aErr } = await supabase.from('appointments').select('*').limit(1);
    console.log('Appointments table check - error:', aErr ? aErr.message : 'No error (table exists)');

    const { data: cData, error: cErr } = await supabase.from('cars_for_sale').select('*').limit(1);
    console.log('Cars_for_sale table check - error:', cErr ? cErr.message : 'No error (table exists)');
  }
  checkAll();
} catch (err) {
  console.error('Error:', err.message);
}
