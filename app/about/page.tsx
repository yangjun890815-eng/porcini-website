import type { Metadata } from "next";
import Image from "next/image";
import { SectionCta } from "@/components/section-cta";
import { getAboutPageData } from "@/lib/sanity/queries";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.name}`,
  description:
    "Learn about Porcini Origin, our sourcing story in Yunnan and Sichuan, quality control process, and export support for dried porcini buyers."
};

export default async function AboutPage() {
  const about = await getAboutPageData();
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: about.companyName,
    description: about.intro,
    email: about.contact.email
  };

  return (
    <div className="section-space">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      <div className="container-shell">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-olive">
            About Us
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-brand-brown sm:text-5xl">
            {about.headline}
          </h1>
          <p className="mt-6 text-lg leading-8 text-brand-brown/80">
            {about.intro}
          </p>
        </div>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          {about.originRegions.map((region) => (
            <article
              key={region}
              className="rounded-[1.75rem] border border-brand-stone bg-white p-6 shadow-soft"
            >
              <p className="text-sm uppercase tracking-[0.2em] text-brand-olive">
                Origin
              </p>
              <h2 className="mt-3 text-2xl font-bold text-brand-brown">{region}</h2>
            </article>
          ))}
        </section>

        <section className="mt-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-olive">
              Factory and origin
            </p>
            <h2 className="mt-3 text-3xl font-bold text-brand-brown">
              Product, place, and process in one sourcing story
            </h2>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {about.factoryGallery.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-brand-sand shadow-soft"
              >
                <Image
                  src={image}
                  alt={`Factory or origin view ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-brand-stone bg-white p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-olive">
              Certificates
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {about.certificates.map((certificate) => (
                <span
                  key={certificate}
                  className="rounded-full bg-brand-cream px-4 py-2 text-sm font-medium text-brand-brown"
                >
                  {certificate}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-brand-sand p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-olive">
              Working contact
            </p>
            <div className="mt-6 space-y-4 text-sm text-brand-brown/80">
              <p>Email: {about.contact.email}</p>
              <p>WhatsApp: {about.contact.whatsApp}</p>
              <p>WeChat: {about.contact.wechat}</p>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-olive">
            Quality control
          </p>
          <h2 className="mt-3 text-3xl font-bold text-brand-brown">
            From harvest to export carton
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {about.qualitySteps.map((step, index) => (
              <div
                key={step}
                className="rounded-[1.5rem] border border-brand-stone bg-white p-5 shadow-soft"
              >
                <p className="text-sm font-semibold text-brand-olive">
                  Step {index + 1}
                </p>
                <p className="mt-3 text-sm leading-7 text-brand-brown/80">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <SectionCta
        title="Need a supplier profile for your procurement review?"
        body="Ask for specs, quality documents, private label packaging, and current lead-time guidance through the inquiry page."
        label="Get a Free Quote"
        href="/contact"
      />
    </div>
  );
}
