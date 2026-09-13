import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Spectral, Spline_Sans_Mono } from "next/font/google";
import Script from "next/script";
import "./styles/roadlinx.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SiteBehaviors } from "@/components/SiteBehaviors";
import { GA_ID, ORG_JSONLD, SITE_URL } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/* Self-hosted at build time; the CSS reads them through app/styles/tokens/typography.css. */
const spectral = Spectral({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-spectral" });
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken" });
const splineMono = Spline_Sans_Mono({ subsets: ["latin"], variable: "--font-spline-mono" });

/*
 * Site-wide head values. Robots is deliberately not set here: pageMetadata()
 * sets it on every page, and leaving it off the layout keeps the 404 page
 * down to the single noindex tag Next gives it. Icons come from the
 * app/favicon.ico, app/icon.png and app/apple-icon.png file conventions.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    <html lang="en-AU" className={`${spectral.variable} ${hanken.variable} ${splineMono.variable}`}>
      <body>
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
