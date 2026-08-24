import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Warning: Supabase environment variables are missing.');
  }

  return createBrowserClient(
    supabaseUrl || 'https://dummy.supabase.co',
    supabaseAnonKey || 'dummy'
  );
}
