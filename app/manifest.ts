import type { MetadataRoute } from 'next';

/* Web app manifest: gives "Add to Home Screen" the right name and icon. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Road Linx Transport',
    short_name: 'Road Linx',
    description: 'Brisbane freight and transport across SE QLD and Northern NSW.',
    start_url: '/',
    display: 'browser',
    background_color: '#FFFFFF',
    theme_color: '#1F3B57',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
