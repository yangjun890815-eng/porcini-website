import { Suspense } from "react";
import { InquiryForm } from "@/components/InquiryForm";
import { getAllProducts } from "@/lib/sanity/queries";

export default async function ContactPage() {
  const products = await getAllProducts();
  const productOptions = products.map((product) => ({
    slug: product.slug,
    name: product.name
  }));

  return (
    <div className="section-space">
      <div className="container-shell">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-olive">
              Contact
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-brand-brown sm:text-5xl">
              Request a detailed quote
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-brand-brown/80">
              Fill out the form below and we will get back to you within 24 hours
              with a detailed quote.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-2xl">
            <Suspense fallback={<div className="rounded-[2rem] border border-brand-stone bg-white p-6 shadow-soft sm:p-8" />}>
              <InquiryForm products={productOptions} />
            </Suspense>
          </div>

          <div className="mx-auto mt-12 max-w-2xl rounded-[2rem] border border-brand-stone bg-brand-sand p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-olive">
              Backup Contact
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-sm font-semibold text-brand-brown">
                  WhatsApp
                </p>
                <a
                  href="https://wa.me/8613800000000"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm text-brand-brown/80 hover:text-brand-brown"
                >
                  +86 138 0000 0000
                </a>
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-brown">Email</p>
                <a
                  href="mailto:hello@porciniorigin.com"
                  className="mt-2 inline-block text-sm text-brand-brown/80 hover:text-brand-brown"
                >
                  hello@porciniorigin.com
                </a>
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-brown">
                  Working Hours
                </p>
                <p className="mt-2 text-sm text-brand-brown/80">
                  Mon-Sat, 9:00-18:00 (UTC+8)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
