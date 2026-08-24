'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'E-Mail und Passwort sind erforderlich.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Return friendly message in Swiss German/German or keep Supabase error message
    return { error: 'Ungültige E-Mail-Adresse oder Passwort. Bitte überprüfen Sie Ihre Angaben.' };
  }

  redirect('/admin/dashboard');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
