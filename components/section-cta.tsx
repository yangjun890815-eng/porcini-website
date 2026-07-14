import Link from "next/link";

export function SectionCta({
  title,
  body,
  label,
  href
}: {
  title: string;
  body: string;
  label: string;
  href: string;
}) {
  return (
    <section className="section-space pt-8">
      <div className="container-shell">
        <div className="rounded-[2rem] bg-brand-brown px-8 py-10 text-white shadow-soft sm:px-12 sm:py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-cream/80">
                Inquiry CTA
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h2>
              <p className="mt-4 text-base leading-8 text-brand-cream/90">{body}</p>
            </div>
            <Link
              href={href}
              className="inline-flex rounded-full bg-white px-6 py-3 font-semibold text-brand-brown hover:bg-brand-cream"
            >
              {label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
