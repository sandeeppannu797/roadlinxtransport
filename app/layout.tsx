import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./styles/roadlinx.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SiteBehaviors } from "@/components/SiteBehaviors";
import { GA_ID, ORG_JSONLD, SITE_URL } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/* Site-wide head values, ported from legacy partials/head.php. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  robots: { index: true, follow: true, "max-image-preview": "large" },
  authors: [{ name: "Road Linx Transport" }],
  formatDetection: { telephone: false },
  verification: { google: "dMSRXvB9T16IeUh6aqKlybhi-aeGqoH79pWZy9n77pM" },
  openGraph: { siteName: "Road Linx Transport", type: "website", locale: "en_AU" },
  twitter: { card: "summary_large_image" },
  other: { "geo.region": "AU-QLD", "geo.placename": "Brisbane" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1F3B57",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU">
      <body>
        {/* Font preconnects, as in legacy head.php (fonts load via tokens/fonts.css). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Site-wide Organization / LocalBusiness knowledge graph (verbatim). */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ORG_JSONLD }} />
        <Header />
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
        <SiteBehaviors />
        {/* Google tag (gtag.js) */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${GA_ID}');`}
        </Script>
      </body>
    </html>
  );
}
