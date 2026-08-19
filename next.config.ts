import type { NextConfig } from 'next';

/*
 * Redirect contract. The legacy .htaccess 301s every *.php URL to its
 * extensionless form, so those paths are still indexed and linked from
 * offsite. url-inventory.txt lists them as the pages that must keep
 * resolving; scripts/verify-parity.mjs checks every one.
 */
const nextConfig: NextConfig = {
  async redirects() {
    // statusCode 301 rather than `permanent: true`, which emits a 308.
    // Both are permanent, but 301 is what these URLs have always returned
    // and what url-inventory.txt specifies.
    return [
      // Directory indexes collapse to the directory itself.
      { source: '/index.php', destination: '/', statusCode: 301 },
      { source: '/locations/index.php', destination: '/locations', statusCode: 301 },
      { source: '/services/index.php', destination: '/services', statusCode: 301 },
      { source: '/blog/index.php', destination: '/blog', statusCode: 301 },
      // Everything else drops the extension, as .htaccess did.
      { source: '/:path*.php', destination: '/:path*', statusCode: 301 },
    ];
  },
};

export default nextConfig;
