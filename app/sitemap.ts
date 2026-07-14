import type { MetadataRoute } from "next";
import { getPostSlugs, getProductSlugs } from "@/lib/sanity/queries";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, postSlugs] = await Promise.all([
    getProductSlugs(),
    getPostSlugs()
  ]);

  const staticRoutes = ["", "/about", "/blog", "/contact", "/products"].map(
    (path) => ({
      url: `${siteConfig.siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const
    })
  );

  const productRoutes = productSlugs.map(({ slug }) => ({
    url: `${siteConfig.siteUrl}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const
  }));

  const postRoutes = postSlugs.map(({ slug }) => ({
    url: `${siteConfig.siteUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const
  }));

  return [...staticRoutes, ...productRoutes, ...postRoutes];
}
