import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, relatedTo, products } from "@/lib/products";
import ProductDetail from "./ProductDetail";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) return { title: "Product not found" };
  return {
    title: `${p.title} — ${p.brand}`,
    description: `${p.blurb} Authentic ${p.brand}, ${p.condition.toLowerCase()}. ${p.rating}★ from ${p.reviews} reviews.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  const related = relatedTo(product, 4);
  return <ProductDetail product={product} related={related} />;
}
