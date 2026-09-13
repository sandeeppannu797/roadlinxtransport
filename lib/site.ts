// Site-wide constants, including the organisation knowledge graph that
// every page carries as JSON-LD. Changes here reach all pages: run
// `pnpm verify` and record the result with `pnpm verify --update`.

export const SITE_URL = "https://roadlinxtransport.com.au";

export const GA_ID = "G-1FKRE6NQZS";

export const ADDRESS = {
  street: "5 Logrunner Place",
  suburb: "Willawong",
  state: "QLD",
  postcode: "4110",
};

export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Road%20Linx%20Transport%2C%205%20Logrunner%20Place%2C%20Willawong%20QLD%204110";

/** Google Business Profile, as shared from the profile itself. */
export const GOOGLE_PROFILE_URL = "https://share.google/BIU7Ijpf4YM2NHz5e";
export const FACEBOOK_URL = "https://www.facebook.com/roadlinxtransport.com.au";

export const ORG_JSONLD = `
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://roadlinxtransport.com.au/#organization",
  "name": "Road Linx Transport",
  "url": "https://roadlinxtransport.com.au/",
  "logo": "https://roadlinxtransport.com.au/assets/img/roadlinx-logo.png",
  "image": "https://roadlinxtransport.com.au/assets/img/roadlinx-logo.png",
  "telephone": "+61731797072",
  "email": "admin@roadlinxtransport.com.au",
  "priceRange": "$$",
  "address": { "@type": "PostalAddress", "streetAddress": "${ADDRESS.street}", "addressLocality": "${ADDRESS.suburb}", "addressRegion": "${ADDRESS.state}", "postalCode": "${ADDRESS.postcode}", "addressCountry": "AU" },
  "hasMap": "${MAPS_URL}",
  "areaServed": ["Brisbane", "Gold Coast", "Sunshine Coast", "Toowoomba", "Darling Downs", "Wide Bay", "Northern NSW", "South East Queensland"],
  "openingHours": "Mo-Su 00:00-23:59",
  "sameAs": ["${FACEBOOK_URL}"],
  "identifier": [
    { "@type": "PropertyValue", "propertyID": "ABN", "value": "25 387 822 327" },
    { "@type": "PropertyValue", "propertyID": "ACN", "value": "666 887 903" }
  ]
}
`;
