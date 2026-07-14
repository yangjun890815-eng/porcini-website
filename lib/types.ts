import type { PortableTextBlock } from "sanity";

export const productCategoryOrder = [
  "Whole",
  "Sliced",
  "Powder",
  "Mixed"
] as const;

export type ProductCategory = (typeof productCategoryOrder)[number];

export type ProductCardData = {
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  moq: string;
  mainImage?: string;
  grade?: string;
  packaging?: string;
};

export type ProductDetailData = ProductCardData & {
  size?: string;
  moistureContent?: string;
  shelfLife?: string;
  leadTime?: string;
  certifications: string[];
  fullDescription: PortableTextBlock[];
  gallery: string[];
};

export type SellingPoint = {
  title: string;
  description: string;
};

export type HomepageData = {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    image: string;
  };
  sellingPoints: SellingPoint[];
  featuredProducts: ProductCardData[];
  companyIntro: {
    title: string;
    body: string;
    regions: string[];
  };
  cta: {
    label: string;
    href: string;
    title: string;
    body: string;
  };
};

export type AboutPageData = {
  companyName: string;
  headline: string;
  intro: string;
  originRegions: string[];
  factoryGallery: string[];
  certificates: string[];
  qualitySteps: string[];
  contact: {
    email: string;
    whatsApp: string;
    wechat: string;
  };
};

export type BlogPostCardData = {
  title: string;
  slug: string;
  publishedAt: string;
  author: string;
  mainImage?: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
};

export type BlogPostDetailData = BlogPostCardData & {
  body: PortableTextBlock[];
};
