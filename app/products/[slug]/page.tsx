import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductSpecGrid } from "@/components/product-spec-grid";
import { SectionCta } from "@/components/section-cta";
import { getProductBySlug, getProductSlugs } from "@/lib/sanity/queries";
import { siteConfig } from "@/lib/site";

export const revalidate = 120;

export async function generateStaticParams() {
  return getProductSlugs();
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: `Product Not Found | ${siteConfig.name}`
    };
  }

  return {
    title: `${product.name} Wholesale | ${siteConfig.name}`,
    description:
      product.shortDescription ||
      `Wholesale ${product.name} with export packaging and sourcing support from ${siteConfig.name}.`,
    openGraph: {
      title: `${product.name} Wholesale | ${siteConfig.name}`,
      description: product.shortDescription,
      images: product.mainImage ? [product.mainImage] : [siteConfig.defaultOgImage]
    }
  };
}

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const images = product.gallery.length
    ? product.gallery
    : product.mainImage
      ? [product.mainImage]
      : [];

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: siteConfig.name
    },
    image: images,
    additionalProperty: [
      product.grade ? { "@type": "PropertyValue", name: "Grade", value: product.grade } : null,
      product.size ? { "@type": "PropertyValue", name: "Size", value: product.size } : null,
      product.moq ? { "@type": "PropertyValue", name: "MOQ", value: product.moq } : null
    ].filter(Boolean)
  };

  return (
    <div className="section-space">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData)
        }}
      />
      <div className="container-shell">
        <div className="mb-8">
          <Link
            href="/products"
            className="text-sm font-semibold text-brand-brown/70 hover:text-brand-brown"
          >
            ← Back to products
          </Link>
        </div>
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-brand-sand shadow-soft">
              {product.mainImage ? (
                <Image
                  src={product.mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-brand-brown/55">
                  Product image placeholder
                </div>
              )}
            </div>
            {images.length > 1 ? (
              <div className="grid grid-cols-3 gap-4">
                {images.slice(0, 3).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-sand"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} gallery ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-olive">
              {product.category}
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-brand-brown sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-5 text-lg leading-8 text-brand-brown/80">
              {product.shortDescription}
            </p>
            <div className="mt-8 rounded-[2rem] border border-brand-stone bg-white p-6 shadow-soft">
              <ProductSpecGrid product={product} />
            </div>
            {product.certifications.length ? (
              <div className="mt-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-olive">
                  Certifications
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {product.certifications.map((certification) => (
                    <span
                      key={certification}
                      className="rounded-full bg-brand-cream px-4 py-2 text-sm font-medium text-brand-brown"
                    >
                      {certification}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-brand-brown px-6 py-3 font-semibold text-white hover:bg-brand-brown/90"
              >
                Send Inquiry
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-brand-brown/20 bg-white px-6 py-3 font-semibold text-brand-brown hover:border-brand-brown/40"
              >
                Request Sample
              </Link>
            </div>
          </div>
        </div>

        <section className="mt-16 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-brand-stone bg-white p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-olive">
              Full Description
            </p>
            <div className="rich-text mt-6">
              {product.fullDescription.length ? (
                <PortableText value={product.fullDescription} />
              ) : (
                <p>
                  Detailed description will appear here once your Sanity product
                  content is populated.
                </p>
              )}
            </div>
          </div>
          <div className="rounded-[2rem] bg-brand-sand p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-olive">
              Buyer Notes
            </p>
            <h2 className="mt-3 text-3xl font-bold text-brand-brown">
              Suitable for importer and foodservice programs
            </h2>
            <p className="mt-4 text-base leading-8 text-brand-brown/80">
              Use this template to surface common buyer details such as cut
              style, grade expectations, packaging format, and sampling needs.
            </p>
          </div>
        </section>
      </div>

      <SectionCta
        title={`Need a quote for ${product.name}?`}
        body="Send your target market, package format, and volume plan. We will reply with specs and trade terms suited to your order."
        label="Get a Quote"
        href="/contact"
      />
    </div>
  );
}
