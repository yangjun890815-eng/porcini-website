import { groq } from "next-sanity";
import type { Image, PortableTextBlock } from "sanity";
import { sanityClient } from "./client";
import { hasSanityConfig } from "./env";
import type {
  AboutPageData,
  BlogPostCardData,
  BlogPostDetailData,
  HomepageData,
  ProductCardData,
  ProductDetailData,
  ProductCategory,
  SellingPoint
} from "@/lib/types";
import { productCategoryOrder } from "@/lib/types";
import { siteConfig } from "@/lib/site";
import { urlForImage } from "./image";

type SanityProductRecord = {
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  moq: string;
  mainImage?: Image;
  grade?: string;
  packaging?: string;
  size?: string;
  moistureContent?: string;
  shelfLife?: string;
  leadTime?: string;
  certifications?: string[];
  gallery?: Image[];
  fullDescription?: PortableTextBlock[];
};

type SanityHomeSettingsRecord = {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: Image;
  sellingPoints?: SellingPoint[];
  ctaLabel?: string;
  ctaHref?: string;
};

type SanityCompanyRecord = {
  companyName?: string;
  headline?: string;
  intro?: string;
  originRegions?: string[];
  factoryGallery?: Image[];
  certificates?: string[];
  qualitySteps?: string[];
  email?: string;
  whatsApp?: string;
  wechat?: string;
};

type SanityPostRecord = {
  title: string;
  slug: string;
  publishedAt?: string;
  author?: string;
  mainImage?: Image;
  body?: PortableTextBlock[];
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
};

const productCardQuery = groq`
  *[_type == "product"] | order(name asc) {
    name,
    "slug": slug.current,
    category,
    shortDescription,
    moq,
    mainImage,
    grade,
    packaging
  }
`;

const productDetailQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    name,
    "slug": slug.current,
    category,
    shortDescription,
    moq,
    mainImage,
    grade,
    packaging,
    size,
    moistureContent,
    shelfLife,
    leadTime,
    certifications,
    gallery,
    fullDescription
  }
`;

const productSlugsQuery = groq`
  *[_type == "product" && defined(slug.current)][]{
    "slug": slug.current
  }
`;

const homeSettingsQuery = groq`
  *[_type == "homeSettings"][0] {
    heroTitle,
    heroSubtitle,
    heroImage,
    sellingPoints,
    ctaLabel,
    ctaHref
  }
`;

const companyQuery = groq`
  *[_type == "company"][0] {
    companyName,
    headline,
    intro,
    originRegions,
    factoryGallery,
    certificates,
    qualitySteps,
    email,
    whatsApp,
    wechat
  }
`;

const postCardQuery = groq`
  *[_type == "post"] | order(publishedAt desc, _createdAt desc) {
    title,
    "slug": slug.current,
    publishedAt,
    author,
    mainImage,
    body,
    seoTitle,
    seoDescription,
    tags
  }
`;

const postDetailQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    publishedAt,
    author,
    mainImage,
    body,
    seoTitle,
    seoDescription,
    tags
  }
`;

const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][]{
    "slug": slug.current
  }
`;

const fallbackProducts: ProductDetailData[] = [
  {
    name: "Whole Dried Porcini",
    slug: "whole-dried-porcini",
    category: "Whole",
    shortDescription:
      "Hand-selected whole caps and stems for premium retail and foodservice buyers.",
    moq: "100 kg",
    mainImage:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80",
    grade: "A",
    packaging: "5 kg carton or custom private label packs",
    size: "3-5 cm caps",
    moistureContent: "< 12%",
    shelfLife: "24 months",
    leadTime: "10-15 days",
    certifications: ["HACCP", "ISO22000", "FDA"],
    gallery: [
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80"
    ],
    fullDescription: [
      {
        _key: "whole-1",
        _type: "block",
        style: "normal",
        markDefs: [],
        children: [
          {
            _key: "whole-1-child",
            _type: "span",
            marks: [],
            text: "Whole dried porcini selected for premium import programs, retail packing, and menu-driven foodservice applications."
          }
        ]
      }
    ]
  },
  {
    name: "Sliced Dried Porcini",
    slug: "sliced-dried-porcini",
    category: "Sliced",
    shortDescription:
      "Even slicing for consistent rehydration and production use in sauces and soups.",
    moq: "80 kg",
    mainImage:
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1200&q=80",
    grade: "A/B",
    packaging: "10 kg bulk cartons",
    size: "3-6 mm slices",
    moistureContent: "< 12%",
    shelfLife: "24 months",
    leadTime: "12-18 days",
    certifications: ["HACCP", "EU Export Documentation"],
    gallery: [
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1200&q=80"
    ],
    fullDescription: [
      {
        _key: "sliced-1",
        _type: "block",
        style: "normal",
        markDefs: [],
        children: [
          {
            _key: "sliced-1-child",
            _type: "span",
            marks: [],
            text: "Sliced material is prepared for stable cooking performance and easier batching in soups, sauces, and seasoning lines."
          }
        ]
      }
    ]
  },
  {
    name: "Porcini Powder",
    slug: "porcini-powder",
    category: "Powder",
    shortDescription:
      "Fine mushroom powder for seasoning blends, ready meals, and food manufacturing.",
    moq: "50 kg",
    mainImage:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80",
    grade: "Custom mesh",
    packaging: "1 kg foil bags / 20 kg drums",
    size: "60-100 mesh",
    moistureContent: "< 10%",
    shelfLife: "18 months",
    leadTime: "7-12 days",
    certifications: ["HACCP", "ISO22000"],
    gallery: [
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80"
    ],
    fullDescription: [
      {
        _key: "powder-1",
        _type: "block",
        style: "normal",
        markDefs: [],
        children: [
          {
            _key: "powder-1-child",
            _type: "span",
            marks: [],
            text: "Porcini powder delivers strong mushroom aroma for seasoning systems, savory blends, and industrial food processing."
          }
        ]
      }
    ]
  },
  {
    name: "Mixed Wild Mushrooms",
    slug: "mixed-wild-mushrooms",
    category: "Mixed",
    shortDescription:
      "Balanced mixed mushroom cuts designed for importers seeking value-driven foodservice blends.",
    moq: "100 kg",
    mainImage:
      "https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=1200&q=80",
    grade: "Custom blend",
    packaging: "10 kg export cartons",
    size: "Mixed cuts",
    moistureContent: "< 12%",
    shelfLife: "24 months",
    leadTime: "10-20 days",
    certifications: ["HACCP"],
    gallery: [
      "https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=1200&q=80"
    ],
    fullDescription: [
      {
        _key: "mixed-1",
        _type: "block",
        style: "normal",
        markDefs: [],
        children: [
          {
            _key: "mixed-1-child",
            _type: "span",
            marks: [],
            text: "Mixed wild mushroom programs combine flexibility and cost control for distributors, kitchens, and prepared food makers."
          }
        ]
      }
    ]
  }
];

const fallbackHomepageData: HomepageData = {
  hero: {
    badge: "Straight from Yunnan and Sichuan mountain origins",
    title: "Premium Dried Porcini Mushrooms for Importers, Wholesalers, and Food Manufacturers",
    subtitle:
      "Porcini Origin supplies export-ready dried boletus edulis with traceable sourcing, practical MOQ options, and custom packaging for European and North American buyers.",
    image: siteConfig.defaultOgImage
  },
  sellingPoints: [
    {
      title: "Origin Traceable",
      description:
        "Source from Yunnan and Sichuan collection zones with documented batch control."
    },
    {
      title: "Flexible Packaging",
      description:
        "Support bulk cartons, retail-ready private label packs, and custom specifications."
    },
    {
      title: "Commercial MOQ",
      description:
        "Match sampling, pilot orders, and wholesale replenishment with practical MOQ planning."
    },
    {
      title: "Export Ready",
      description:
        "Built for importers needing stable supply, documentation support, and quick shipment coordination."
    }
  ],
  featuredProducts: fallbackProducts.slice(0, 3).map(toProductCardData),
  companyIntro: {
    title: "Wild mushroom sourcing with a supplier mindset",
    body:
      "We position Porcini Origin as a focused export partner for dried porcini and related wild mushroom formats, serving importers, distributors, and foodservice supply chains.",
    regions: ["Yunnan", "Sichuan", "China"]
  },
  cta: {
    label: "Get a Free Quote",
    href: "/contact",
    title: "Need pricing, specs, or sample support?",
    body:
      "Share your target market, product format, and packaging request. We will shape a quote around your buying program."
  }
};

const fallbackAboutPageData: AboutPageData = {
  companyName: "Porcini Origin",
  headline: "Sourcing premium dried porcini from mountain origins in Southwest China",
  intro:
    "Porcini Origin is positioned as a SOHO export supplier focused on dried boletus edulis and practical buyer support for importers, restaurant supply chains, wholesalers, and food manufacturers. We combine origin access from Yunnan and Sichuan with export-minded communication, stable specifications, and flexible packaging options.",
  originRegions: ["Yunnan", "Sichuan", "China"],
  factoryGallery: [
    "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80"
  ],
  certificates: ["HACCP", "ISO22000", "FDA Registration", "Organic Certificate"],
  qualitySteps: [
    "Harvesting and raw material sorting",
    "Cleaning and defect removal",
    "Cutting or sizing to specification",
    "Controlled drying",
    "Final QC and metal detection",
    "Packing and export carton preparation"
  ],
  contact: {
    email: "hello@porciniorigin.com",
    whatsApp: "+86 138 0000 0000",
    wechat: "porcini-origin"
  }
};

const fallbackPosts: BlogPostDetailData[] = [
  {
    title: "How to Choose Premium Dried Porcini",
    slug: "how-to-choose-premium-dried-porcini",
    publishedAt: "2026-07-01T08:00:00.000Z",
    author: "Porcini Origin Team",
    mainImage:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "A buyer-focused checklist for evaluating aroma, cut consistency, moisture level, and export packing quality in dried porcini shipments.",
    seoTitle: "How to Choose Premium Dried Porcini",
    seoDescription:
      "Learn how importers can evaluate quality, aroma, cut consistency, and packaging when sourcing dried porcini mushrooms.",
    tags: ["Buying Guide", "Quality"],
    body: [
      {
        _key: "post-1",
        _type: "block",
        style: "normal",
        markDefs: [],
        children: [
          {
            _key: "post-1-child",
            _type: "span",
            marks: [],
            text: "Premium dried porcini buying starts with aroma, clean appearance, low moisture, and packaging that protects product integrity during export."
          }
        ]
      }
    ]
  },
  {
    title: "Porcini Mushroom Grades Explained",
    slug: "porcini-mushroom-grades-explained",
    publishedAt: "2026-07-03T08:00:00.000Z",
    author: "Porcini Origin Team",
    mainImage:
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Understand how grade A, B, and custom industrial specs affect import pricing, visual quality, and end-use suitability.",
    seoTitle: "Porcini Mushroom Grades Explained",
    seoDescription:
      "A clear breakdown of dried porcini grade differences for importers, wholesalers, and foodservice buyers.",
    tags: ["Grades", "Wholesale"],
    body: [
      {
        _key: "post-2",
        _type: "block",
        style: "normal",
        markDefs: [],
        children: [
          {
            _key: "post-2-child",
            _type: "span",
            marks: [],
            text: "Grade decisions affect yield expectations, visual presentation, and whether a product is best suited to retail, horeca, or ingredient manufacturing."
          }
        ]
      }
    ]
  },
  {
    title: "Shelf Life and Storage Tips for Dried Mushrooms",
    slug: "shelf-life-and-storage-tips-for-dried-mushrooms",
    publishedAt: "2026-07-05T08:00:00.000Z",
    author: "Porcini Origin Team",
    mainImage:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Storage, humidity, and packaging guidance to help buyers maintain aroma and shelf life across international shipments.",
    seoTitle: "Shelf Life and Storage Tips for Dried Mushrooms",
    seoDescription:
      "Best practices for preserving dried mushroom quality through warehousing, transport, and customer delivery.",
    tags: ["Storage", "Logistics"],
    body: [
      {
        _key: "post-3",
        _type: "block",
        style: "normal",
        markDefs: [],
        children: [
          {
            _key: "post-3-child",
            _type: "span",
            marks: [],
            text: "Controlled humidity, sealed packs, and stock rotation are core practices for protecting dried mushroom quality through import and distribution."
          }
        ]
      }
    ]
  }
];

function toImageUrl(image?: Image | null) {
  return urlForImage(image)?.width(1400).height(1000).url() || undefined;
}

function toPostExcerpt(blocks?: PortableTextBlock[], fallback = "") {
  const firstBlock = blocks?.find((block) => block._type === "block") as
    | (PortableTextBlock & {
        children?: Array<{
          _type?: string;
          text?: string;
        }>;
      })
    | undefined;
  const firstChild = firstBlock?.children?.find((child) => child._type === "span");
  return firstChild?.text || fallback;
}

function toProductCardData(product: ProductDetailData): ProductCardData {
  return {
    name: product.name,
    slug: product.slug,
    category: product.category,
    shortDescription: product.shortDescription,
    moq: product.moq,
    mainImage: product.mainImage,
    grade: product.grade,
    packaging: product.packaging
  };
}

function normalizeProduct(record: SanityProductRecord): ProductDetailData {
  return {
    name: record.name,
    slug: record.slug,
    category: record.category,
    shortDescription: record.shortDescription,
    moq: record.moq,
    mainImage: toImageUrl(record.mainImage),
    grade: record.grade,
    packaging: record.packaging,
    size: record.size,
    moistureContent: record.moistureContent,
    shelfLife: record.shelfLife,
    leadTime: record.leadTime,
    certifications: record.certifications || [],
    gallery: (record.gallery || [])
      .map((image) => toImageUrl(image))
      .filter((image): image is string => Boolean(image)),
    fullDescription: record.fullDescription || []
  };
}

function normalizePost(record: SanityPostRecord): BlogPostDetailData {
  const excerpt = record.seoDescription || toPostExcerpt(record.body, "");

  return {
    title: record.title,
    slug: record.slug,
    publishedAt: record.publishedAt || new Date().toISOString(),
    author: record.author || "Porcini Origin Team",
    mainImage: toImageUrl(record.mainImage),
    excerpt,
    seoTitle: record.seoTitle,
    seoDescription: record.seoDescription,
    tags: record.tags || [],
    body: record.body || []
  };
}

function sortProductsByCategory(products: ProductDetailData[]) {
  return [...products].sort((left, right) => {
    const leftIndex = productCategoryOrder.indexOf(left.category as ProductCategory);
    const rightIndex = productCategoryOrder.indexOf(right.category as ProductCategory);
    const safeLeftIndex = leftIndex === -1 ? productCategoryOrder.length : leftIndex;
    const safeRightIndex =
      rightIndex === -1 ? productCategoryOrder.length : rightIndex;

    if (safeLeftIndex !== safeRightIndex) {
      return safeLeftIndex - safeRightIndex;
    }

    return left.name.localeCompare(right.name);
  });
}

export async function getHomepageData(): Promise<HomepageData> {
  const featuredProducts = await getHomepagePreviewProducts();

  if (!hasSanityConfig) {
    return {
      ...fallbackHomepageData,
      featuredProducts
    };
  }

  try {
    const [homeSettings, company] = await Promise.all([
      sanityClient.fetch<SanityHomeSettingsRecord | null>(homeSettingsQuery),
      sanityClient.fetch<SanityCompanyRecord | null>(companyQuery)
    ]);

    return {
      hero: {
        badge: fallbackHomepageData.hero.badge,
        title: homeSettings?.heroTitle || fallbackHomepageData.hero.title,
        subtitle:
          homeSettings?.heroSubtitle || fallbackHomepageData.hero.subtitle,
        image: toImageUrl(homeSettings?.heroImage) || fallbackHomepageData.hero.image
      },
      sellingPoints:
        homeSettings?.sellingPoints?.length
          ? homeSettings.sellingPoints
          : fallbackHomepageData.sellingPoints,
      featuredProducts,
      companyIntro: {
        title: company?.headline || fallbackHomepageData.companyIntro.title,
        body: company?.intro || fallbackHomepageData.companyIntro.body,
        regions:
          company?.originRegions?.length
            ? company.originRegions
            : fallbackHomepageData.companyIntro.regions
      },
      cta: {
        label: homeSettings?.ctaLabel || fallbackHomepageData.cta.label,
        href: homeSettings?.ctaHref || fallbackHomepageData.cta.href,
        title: fallbackHomepageData.cta.title,
        body: fallbackHomepageData.cta.body
      }
    };
  } catch {
    return {
      ...fallbackHomepageData,
      featuredProducts
    };
  }
}

export async function getAboutPageData(): Promise<AboutPageData> {
  if (!hasSanityConfig) {
    return fallbackAboutPageData;
  }

  try {
    const company = await sanityClient.fetch<SanityCompanyRecord | null>(companyQuery);

    if (!company) {
      return fallbackAboutPageData;
    }

    return {
      companyName: company.companyName || fallbackAboutPageData.companyName,
      headline: company.headline || fallbackAboutPageData.headline,
      intro: company.intro || fallbackAboutPageData.intro,
      originRegions:
        company.originRegions?.length
          ? company.originRegions
          : fallbackAboutPageData.originRegions,
      factoryGallery:
        company.factoryGallery?.length
          ? company.factoryGallery
              .map((image) => toImageUrl(image))
              .filter((image): image is string => Boolean(image))
          : fallbackAboutPageData.factoryGallery,
      certificates:
        company.certificates?.length
          ? company.certificates
          : fallbackAboutPageData.certificates,
      qualitySteps:
        company.qualitySteps?.length
          ? company.qualitySteps
          : fallbackAboutPageData.qualitySteps,
      contact: {
        email: company.email || fallbackAboutPageData.contact.email,
        whatsApp: company.whatsApp || fallbackAboutPageData.contact.whatsApp,
        wechat: company.wechat || fallbackAboutPageData.contact.wechat
      }
    };
  } catch {
    return fallbackAboutPageData;
  }
}

export async function getHomepagePreviewProducts() {
  const products = await getAllProducts();
  return products.slice(0, 3);
}

export async function getAllProducts(): Promise<ProductCardData[]> {
  const products = await getAllProductDetails();
  return products.map(toProductCardData);
}

export async function getProductOptions() {
  const products = await getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
    name: product.name
  }));
}

export async function getAllProductDetails(): Promise<ProductDetailData[]> {
  if (!hasSanityConfig) {
    return sortProductsByCategory(fallbackProducts);
  }

  try {
    const products = await sanityClient.fetch<SanityProductRecord[]>(productCardQuery);
    if (!products?.length) {
      return sortProductsByCategory(fallbackProducts);
    }

    return sortProductsByCategory(products.map(normalizeProduct));
  } catch {
    return sortProductsByCategory(fallbackProducts);
  }
}

export async function getProductBySlug(slug: string) {
  const fallbackProduct =
    fallbackProducts.find((product) => product.slug === slug) || null;

  if (!hasSanityConfig) {
    return fallbackProduct;
  }

  try {
    const product = await sanityClient.fetch<SanityProductRecord | null>(
      productDetailQuery,
      { slug }
    );
    return product ? normalizeProduct(product) : fallbackProduct;
  } catch {
    return fallbackProduct;
  }
}

export async function getProductSlugs() {
  if (!hasSanityConfig) {
    return fallbackProducts.map((product) => ({ slug: product.slug }));
  }

  try {
    const slugs = await sanityClient.fetch<Array<{ slug: string }>>(productSlugsQuery);
    return slugs?.length ? slugs : fallbackProducts.map((product) => ({ slug: product.slug }));
  } catch {
    return fallbackProducts.map((product) => ({ slug: product.slug }));
  }
}

export async function getAllPosts(): Promise<BlogPostCardData[]> {
  if (!hasSanityConfig) {
    return fallbackPosts;
  }

  try {
    const posts = await sanityClient.fetch<SanityPostRecord[]>(postCardQuery);
    if (!posts?.length) {
      return fallbackPosts;
    }

    return posts.map(normalizePost);
  } catch {
    return fallbackPosts;
  }
}

export async function getPostBySlug(slug: string) {
  const fallbackPost = fallbackPosts.find((post) => post.slug === slug) || null;

  if (!hasSanityConfig) {
    return fallbackPost;
  }

  try {
    const post = await sanityClient.fetch<SanityPostRecord | null>(postDetailQuery, {
      slug
    });

    return post ? normalizePost(post) : fallbackPost;
  } catch {
    return fallbackPost;
  }
}

export async function getPostSlugs() {
  if (!hasSanityConfig) {
    return fallbackPosts.map((post) => ({ slug: post.slug }));
  }

  try {
    const slugs = await sanityClient.fetch<Array<{ slug: string }>>(postSlugsQuery);
    return slugs?.length ? slugs : fallbackPosts.map((post) => ({ slug: post.slug }));
  } catch {
    return fallbackPosts.map((post) => ({ slug: post.slug }));
  }
}
