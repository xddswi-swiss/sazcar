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

  async function checkCars() {
    const { data, error } = await supabase.from('cars_for_sale').select('*');
    if (error) {
      console.error('Database Error:', error);
    } else {
      console.log('Cars in DB count:', data.length);
      console.log('Cars data:', JSON.stringify(data, null, 2));
    }
  }
  checkCars();
} catch (err) {
  console.error('Error:', err.message);
}
