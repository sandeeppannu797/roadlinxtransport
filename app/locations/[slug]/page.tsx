import { notFound } from 'next/navigation';
import { locations } from '@/content/locations';
import { LandingTemplate } from '@/components/LandingTemplate';
import { pageMetadata } from '@/lib/meta';

export const dynamicParams = false;

export function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<'/locations/[slug]'>) {
  const { slug } = await params;
  const page = locations.find((l) => l.slug === slug);
  return page ? pageMetadata(page.head) : {};
}

export default async function LocationPage({ params }: PageProps<'/locations/[slug]'>) {
  const { slug } = await params;
  const page = locations.find((l) => l.slug === slug);
  if (!page) notFound();
  return <LandingTemplate page={page} variant="location" />;
}
