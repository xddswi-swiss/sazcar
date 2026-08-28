'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

type Result = { success?: true; error?: string };

export async function runMutation(
  fn: (supabase: Awaited<ReturnType<typeof createClient>>) => PromiseLike<{ error: unknown }>,
  errorMessage: string,
  revalidate: string[]
): Promise<Result> {
  const supabase = await createClient();
  const { error } = await fn(supabase);

  if (error) {
    console.error(errorMessage, error);
    return { error: errorMessage };
  }

  revalidate.forEach((path) => revalidatePath(path));
  return { success: true };
}

export async function swapSortOrder(
  table: string,
  idA: string,
  orderA: number,
  idB: string,
  orderB: number,
  errorMessage: string,
  revalidate: string[]
): Promise<Result> {
  const supabase = await createClient();
  const { error: errA } = await supabase.from(table).update({ sort_order: orderB }).eq('id', idA);
  const { error: errB } = await supabase.from(table).update({ sort_order: orderA }).eq('id', idB);

  if (errA || errB) {
    console.error(errorMessage, errA || errB);
    return { error: errorMessage };
  }

  revalidate.forEach((path) => revalidatePath(path));
  return { success: true };
}
