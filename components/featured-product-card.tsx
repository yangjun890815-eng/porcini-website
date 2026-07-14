import Image from "next/image";
import Link from "next/link";
import type { ProductCardData } from "@/lib/types";

export function FeaturedProductCard({
  product
}: {
  product: ProductCardData;
}) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-brand-stone bg-white shadow-soft">
      <div className="relative aspect-[4/3] bg-brand-sand">
        {product.mainImage ? (
          <Image
            src={product.mainImage}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-brand-brown/50">
            Product image placeholder
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-olive">
          {product.category}
        </p>
        <h3 className="mt-3 text-2xl font-bold">{product.name}</h3>
        <p className="mt-4 text-sm leading-7 text-brand-brown/75">
          {product.shortDescription}
        </p>
        <div className="mt-6 flex items-center justify-between gap-3">
          <span className="text-sm text-brand-brown/70">MOQ: {product.moq}</span>
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

