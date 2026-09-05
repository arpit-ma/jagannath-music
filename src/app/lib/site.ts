/** Live site URL used for sitemap, robots, and SEO. Set NEXT_PUBLIC_SITE_URL in .env.local */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.shreejagannathmusic.com"
).replace(/\/$/, "");

export const BUSINESS = {
  name: "Shree Jagannath Music",
  legalName: "Shree Jagannath Music",
  description:
    "Musical instruments and professional audio equipment store in Bilaspur, Chhattisgarh. Guitars, drums, keyboards, microphones, headphones, and more.",
  phone: "+917974024513",
  phones: ["+917974024513", "+916268960042", "+919827844349"],
  email: undefined as string | undefined,
  address: {
    streetAddress: "Shop No. EG 19, Rajiv Plaza, Old Bus Stand Road",
    addressLocality: "Bilaspur",
    addressRegion: "Chhattisgarh",
    postalCode: "495001",
    addressCountry: "IN",
  },
  geo: {
    // Approximate — update if you have exact coordinates from Google Maps
    latitude: 22.0796,
    longitude: 82.1391,
  },
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:30",
      closes: "20:30",
    },
  ],
  priceRange: "₹₹",
  sameAs: [
    "https://maps.app.goo.gl/PQwEgyWEyrNg3FNd7?g_st=ac",
  ],
} as const;
