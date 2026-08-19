import { notFound } from 'next/navigation';
import { services } from '@/content/services';
import { LandingTemplate } from '@/components/LandingTemplate';
import { pageMetadata } from '@/lib/meta';

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<'/services/[slug]'>) {
  const { slug } = await params;
  const page = services.find((s) => s.slug === slug);
  return page ? pageMetadata(page.head) : {};
}

export default async function ServicePage({ params }: PageProps<'/services/[slug]'>) {
  const { slug } = await params;
  const page = services.find((s) => s.slug === slug);
  if (!page) notFound();
  return <LandingTemplate page={page} variant="service" />;
}
