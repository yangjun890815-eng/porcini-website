export const siteConfig = {
  name: "Porcini Origin",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000",
  description:
    "Premium dried porcini mushroom supplier for European and North American importers, wholesalers, and food manufacturers.",
  defaultOgImage:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
};

