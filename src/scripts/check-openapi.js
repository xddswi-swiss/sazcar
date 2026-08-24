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

  const url = `${env['NEXT_PUBLIC_SUPABASE_URL']}/rest/v1/`;
  
  console.log('Fetching OpenAPI spec from:', url);
  
  fetch(url, {
    headers: {
      'apikey': env['NEXT_PUBLIC_SUPABASE_ANON_KEY']
    }
  })
  .then(res => res.json())
  .then(data => {
    const definitions = data.definitions || {};
    console.log('Available tables in schema cache:', Object.keys(definitions));
  })
  .catch(err => console.error('Fetch Error:', err));
} catch (err) {
  console.error('Error:', err.message);
}
