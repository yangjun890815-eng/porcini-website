import type { ProductDetailData } from "@/lib/types";

const specs = [
  { label: "Grade", key: "grade" },
  { label: "Size", key: "size" },
  { label: "Moisture", key: "moistureContent" },
  { label: "Packaging", key: "packaging" },
  { label: "Shelf Life", key: "shelfLife" },
  { label: "MOQ", key: "moq" },
  { label: "Lead Time", key: "leadTime" }
] as const;

export function ProductSpecGrid({ product }: { product: ProductDetailData }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {specs.map(({ label, key }) => {
        const value = product[key];

        if (!value) {
          return null;
        }

        return (
          <div
            key={label}
            className="rounded-2xl border border-brand-stone bg-brand-cream/40 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-brown/55">
              {label}
            </p>
            <p className="mt-2 text-sm font-medium text-brand-brown">{value}</p>
          </div>
        );
      })}
    </div>
  );
}

