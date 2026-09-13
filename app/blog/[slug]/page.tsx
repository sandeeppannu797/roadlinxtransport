import { notFound } from 'next/navigation';
import { blogPosts } from '@/content/blog';
import { LandingTemplate } from '@/components/LandingTemplate';
import { pageMetadata } from '@/lib/meta';

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const page = blogPosts.find((p) => p.slug === slug);
  return page ? pageMetadata(page.head, page.article) : {};
}

export default async function BlogPost({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const page = blogPosts.find((p) => p.slug === slug);
  if (!page) notFound();
  return <LandingTemplate page={page} variant="blog" />;
}
