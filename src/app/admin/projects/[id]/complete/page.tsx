import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import CompleteProjectForm from './CompleteProjectForm';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CompleteProjectPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-[600px] mx-auto">
      <CompleteProjectForm project={project} />
    </div>
  );
}
