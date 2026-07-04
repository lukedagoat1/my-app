import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, relatedTo, products, type Product } from "@/lib/products";
import { readListings } from "@/lib/listings";
import ProductDetail from "./ProductDetail";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

// Custom listing ids aren't known at build time — render them on demand.
export const dynamicParams = true;

async function resolveProduct(id: string): Promise<Product | undefined> {
  return getProduct(id) ?? (await readListings()).custom.find((p) => p.id === id);
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = await resolveProduct(id);
  if (!p) return { title: "Product not found" };
  return {
    title: `${p.title} — ${p.brand}`,
    description: `${p.blurb} Authentic ${p.brand}, ${p.condition.toLowerCase()}. ${p.rating}★ from ${p.reviews} reviews.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await resolveProduct(id);
  if (!product) notFound();
  const related = relatedTo(product, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.image || undefined,
    description: product.description ?? product.blurb,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      itemCondition: /new|sealed/i.test(product.condition)
        ? "https://schema.org/NewCondition"
        : "https://schema.org/UsedCondition",
    },
    ...(product.reviews > 0 && {
      aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviews },
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={product} related={related} />
    </>
  );
}
