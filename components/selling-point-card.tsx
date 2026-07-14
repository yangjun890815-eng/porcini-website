import type { SellingPoint } from "@/lib/types";

export function SellingPointCard({ point }: { point: SellingPoint }) {
  return (
    <article className="rounded-3xl border border-brand-stone bg-white p-6 shadow-soft">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-olive/10 text-lg font-bold text-brand-olive">
        {point.title.charAt(0)}
      </div>
      <h3 className="mt-5 text-xl font-bold text-brand-brown">{point.title}</h3>
      <p className="mt-3 text-sm leading-7 text-brand-brown/75">
        {point.description}
      </p>
    </article>
  );
}

