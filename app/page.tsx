import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FeaturedProductCard } from "@/components/featured-product-card";
import { SectionCta } from "@/components/section-cta";
import { SellingPointCard } from "@/components/selling-point-card";
import { getHomepageData } from "@/lib/sanity/queries";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `Premium Dried Porcini Mushrooms Supplier | ${siteConfig.name}`,
  description:
    "Source export-grade dried porcini mushrooms with traceable origin, flexible packaging, and buyer-focused support for Europe and North America."
};

export const revalidate = 120;

export default async function HomePage() {
  const homepage = await getHomepageData();

  return (
    <div>
      <section className="overflow-hidden bg-brand-cream/60">
        <div className="container-shell grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-brand-olive/10 px-4 py-2 text-sm font-semibold text-brand-olive">
              {homepage.hero.badge}
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-brand-brown sm:text-5xl">
                {homepage.hero.title}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-brand-brown/80">
                {homepage.hero.subtitle}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-brand-brown px-6 py-3 font-semibold text-white hover:bg-brand-brown/90"
              >
                Get a Free Quote
              </Link>
              <Link
                href="/products"
                className="rounded-full border border-brand-brown/20 bg-white px-6 py-3 font-semibold text-brand-brown hover:border-brand-brown/40"
              >
                Explore Products
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-hero-grain" />
            <div className="relative overflow-hidden rounded-[2rem] shadow-soft">
              <Image
                src={homepage.hero.image}
                alt="Dried porcini mushrooms arranged on a tray"
                width={1200}
                height={900}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-olive">
              Why buyers choose us
            </p>
            <h2 className="mt-3 text-3xl font-bold text-brand-brown sm:text-4xl">
              Built for importer requirements, not just product display
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {homepage.sellingPoints.map((point) => (
              <SellingPointCard key={point.title} point={point} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="container-shell">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-olive">
                Featured products
              </p>
              <h2 className="mt-2 text-3xl font-bold">Featured Products</h2>
            </div>
            <Link href="/products" className="font-semibold text-brand-brown">
              View all
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {homepage.featuredProducts.map((product) => (
              <FeaturedProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-[2rem] bg-brand-sand p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-olive">
              Company snapshot
            </p>
            <h2 className="mt-3 text-3xl font-bold text-brand-brown">
              {homepage.companyIntro.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-brand-brown/80">
              {homepage.companyIntro.body}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {homepage.companyIntro.regions.map((region) => (
              <div
                key={region}
                className="rounded-3xl border border-brand-stone bg-white p-6 text-center shadow-soft"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-olive">
                  Origin
                </p>
                <p className="mt-3 text-2xl font-bold text-brand-brown">{region}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionCta
        title={homepage.cta.title}
        body={homepage.cta.body}
        label={homepage.cta.label}
        href={homepage.cta.href}
      />
    </div>
  );
}
