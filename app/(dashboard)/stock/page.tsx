export const dynamic = 'force-dynamic';

import StockView from '@/components/stock/StockView';
import { prisma } from '@/lib/prisma';

import type { StockRecord } from '@/types/Stock';
import type { Product } from '@/types/Product';

export default async function StockPage() {
  const dbProducts = await prisma.product.findMany({
    orderBy: {
      description: 'asc',
    },
  });

  const dbItems = await prisma.cNTItem.findMany({
    include: {
      product: true,
      cnt: {
        include: {
          location: true,
        },
      },
    },
  });

  const products: Product[] = dbProducts.map((product: Product) => ({
    id: product.id,
    productId: product.productId,
    barCode: product.barCode,
    description: product.description,
    category: product.category,
    unitsPerDisplay: product.unitsPerDisplay,
  }));

  const grouped = new Map<string, StockRecord>();

  for (const item of dbItems) {
    if (!item.cnt.location) continue;

    const productId = item.product.productId;
    const locationCode = item.cnt.location.code;
    const locationType = item.cnt.location.type;

    const key = `${productId}-${locationCode}`;

    const current = grouped.get(key);

    if (current) {
      current.count += item.count;
    } else {
      grouped.set(key, {
        id: item.id,
        productId,
        locationCode,
        locationType,
        count: item.count,
        dueDate: item.dueDate.toISOString().slice(0, 10),
      });
    }
  }

  const stock = Array.from(grouped.values());

  return <StockView products={products} stock={stock} />;
}
