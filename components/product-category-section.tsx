import type { ProductCardData } from "@/lib/types";
import { ProductCard } from "./product-card";

export function ProductCategorySection({
  category,
  products
}: {
  category: string;
  products: ProductCardData[];
}) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="mt-14">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-olive">
            {category}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-brand-brown">
            {category} Dried Porcini
          </h2>
        </div>
        <span className="rounded-full bg-brand-cream px-4 py-2 text-sm font-medium text-brand-brown/80">
          {products.length} product{products.length > 1 ? "s" : ""}
        </span>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}

