// Site-wide constants. The JSON-LD block is copied byte-for-byte from
// legacy partials/head.php — it is the organisation knowledge graph every
// page shares. Do not reformat or "improve" it.

export const SITE_URL = 'https://roadlinxtransport.com.au';

export const GA_ID = 'G-1FKRE6NQZS';

export const ORG_JSONLD = `
{
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  "@id": "https://roadlinxtransport.com.au/#organization",
  "name": "Road Linx Transport",
  "url": "https://roadlinxtransport.com.au/",
  "logo": "https://roadlinxtransport.com.au/assets/img/roadlinx-logo.png",
  "image": "https://roadlinxtransport.com.au/assets/img/roadlinx-logo.png",
  "telephone": "+61731797072",
  "email": "admin@roadlinxtransport.com.au",
  "priceRange": "$$",
  "address": { "@type": "PostalAddress", "addressLocality": "Brisbane", "addressRegion": "QLD", "addressCountry": "AU" },
  "areaServed": ["Brisbane", "Gold Coast", "Sunshine Coast", "Toowoomba", "Darling Downs", "Wide Bay", "Northern NSW", "South East Queensland"],
  "openingHours": "Mo-Su 00:00-23:59",
  "identifier": { "@type": "PropertyValue", "propertyID": "ABN", "value": "25 387 822 327" }
}
`;
