import type { NextConfig } from 'next';

/*
 * Redirect contract. The legacy .htaccess 301s every *.php URL to its
 * extensionless form, so those paths are still indexed and linked from
 * offsite. The WordPress site before it used the URLs further down.
 * scripts/verify-seo.mjs checks both sets.
 */
const nextConfig: NextConfig = {
  async redirects() {
    // statusCode 301 rather than `permanent: true`, which emits a 308.
    // Both are permanent, but 301 is what these URLs have always returned.
    return [
      // Directory indexes collapse to the directory itself.
      { source: '/index.php', destination: '/', statusCode: 301 },
      { source: '/locations/index.php', destination: '/locations', statusCode: 301 },
      { source: '/services/index.php', destination: '/services', statusCode: 301 },
      { source: '/blog/index.php', destination: '/blog', statusCode: 301 },
      // Everything else drops the extension, as .htaccess did.
      { source: '/:path*.php', destination: '/:path*', statusCode: 301 },

      // Pages of the WordPress site that preceded the PHP one. They were
      // indexed until late 2025 and may still be linked from elsewhere.
      // (Next strips the trailing slash first, so /about-us/ arrives here.)
      { source: '/about-us', destination: '/about', statusCode: 301 },
      { source: '/contact-us', destination: '/contact', statusCode: 301 },
      { source: '/our-services', destination: '/services', statusCode: 301 },
      { source: '/policies-compliance', destination: '/privacy-compliance', statusCode: 301 },
      { source: '/semi-trailer-hire', destination: '/services/semi-trailer-hire', statusCode: 301 },
      { source: '/wp-sitemap.xml', destination: '/sitemap.xml', statusCode: 301 },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
