import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductBySlug, getRelatedProducts, products } from '@/data/products';
import ProductDetailClient from './ProductDetailClient';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.images[0].url, alt: product.images[0].alt }],
    },
  };
}

export function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }));
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);

  return <ProductDetailClient product={product} related={related} />;
}
