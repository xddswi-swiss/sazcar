const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Read and parse .env.local file
try {
  const envPath = path.join(__dirname, '../../.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      // Remove surrounding quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      env[key] = value.trim();
    }
  });

  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
  const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY'];

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Fehler: NEXT_PUBLIC_SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY fehlt in .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  async function createAdmin() {
    const email = 'admin@autogarage.ch';
    const password = 'AdminPassword123!'; // Default password

    console.log(`Erstelle Admin-Konto in Supabase Auth für: ${email}...`);

    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true
    });

    if (error) {
      if (error.message.includes('already exists') || error.message.includes('Conflict')) {
        console.log('Info: Das Admin-Konto existiert bereits in Supabase Auth.');
      } else {
        console.error('Fehler beim Erstellen des Admin-Kontos:', error.message);
      }
    } else {
      console.log('✅ Admin-Konto erfolgreich erstellt!');
      console.log('---------------------------------------------');
      console.log(`E-Mail-Adresse: ${email}`);
      console.log(`Passwort:       ${password}`);
      console.log('---------------------------------------------');
      console.log('Bitte loggen Sie sich unter /admin/login ein.');
    }
  }

  createAdmin();

} catch (err) {
  console.error('Fehler beim Laden der Umgebungsvariablen:', err.message);
  process.exit(1);
}
