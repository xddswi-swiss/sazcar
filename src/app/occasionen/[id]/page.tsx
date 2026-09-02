import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OccasionDetailClient from './OccasionDetailClient';

interface OccasionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OccasionDetailPage({ params }: OccasionDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: car } = await supabase
    .from('cars_for_sale')
    .select('*')
    .eq('id', id)
    .single();

  if (!car) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 relative">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <OccasionDetailClient car={car} />
      </main>
      <Footer />
    </div>
  );
}
