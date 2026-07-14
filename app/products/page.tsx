import type { Metadata } from "next";
import { ProductCategorySection } from "@/components/product-category-section";
import { getAllProducts } from "@/lib/sanity/queries";
import { productCategoryOrder } from "@/lib/types";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `Dried Porcini Mushrooms Wholesale | ${siteConfig.name}`,
  description:
    "Browse whole, sliced, powdered, and mixed dried porcini formats for B2B buying programs, foodservice supply, and wholesale distribution."
};

export const revalidate = 120;

export default async function ProductsPage() {
  const products = await getAllProducts();
  const groupedProducts = productCategoryOrder.map((category) => ({
    category,
    products: products.filter((product) => product.category === category)
  }));

  return (
    <div className="section-space">
      <div className="container-shell">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-olive">
            Products
          </p>
          <h1 className="mt-3 text-4xl font-extrabold">Porcini Product Range</h1>
          <p className="mt-4 text-lg leading-8 text-brand-brown/80">
            Explore wholesale-ready dried porcini formats sorted by product
            style and backed by flexible packaging and exporter-friendly specs.
          </p>
        </div>
        {groupedProducts.map(({ category, products: categoryProducts }) => (
          <ProductCategorySection
            key={category}
            category={category}
            products={categoryProducts}
          />
        ))}
      </div>
    </div>
  );
}
