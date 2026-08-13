export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';

import ProductsView from '@/components/products/ProductsView';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      description: 'asc',
    },
  });

  return <ProductsView products={products} />;
}
