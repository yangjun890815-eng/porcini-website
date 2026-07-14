import Image from "next/image";
import Link from "next/link";
import type { ProductCardData } from "@/lib/types";

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-brand-stone bg-white shadow-soft">
      <div className="relative aspect-[4/3] bg-brand-sand">
        {product.mainImage ? (
          <Image
            src={product.mainImage}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-brand-brown/55">
            Product image placeholder
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="text-sm font-semibold text-brand-olive">{product.category}</p>
        <h2 className="mt-2 text-2xl font-bold">{product.name}</h2>
        <p className="mt-4 text-sm leading-7 text-brand-brown/75">
          {product.shortDescription}
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs text-brand-brown/70">
          {product.grade ? (
            <span className="rounded-full bg-brand-cream px-3 py-1">
              Grade: {product.grade}
            </span>
          ) : null}
          <span className="rounded-full bg-brand-cream px-3 py-1">
            MOQ: {product.moq}
          </span>
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <span className="max-w-[55%] text-sm text-brand-brown/70">
            {product.packaging || "Bulk export packaging available"}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="rounded-full border border-brand-brown/20 px-4 py-2 text-sm font-semibold text-brand-brown hover:border-brand-brown/40"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
