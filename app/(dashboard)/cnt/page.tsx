import CNTView from '@/components/CNT/CNTView';
import { prisma } from '@/lib/prisma';

import type { CNT } from '@/types/CNT';
import type { Product } from '@/types/Product';

export default async function CNTPage() {
  const dbProducts = await prisma.product.findMany({
    orderBy: {
      description: 'asc',
    },
  });

  const dbCNTs = await prisma.cNT.findMany({
    include: {
      location: true,

      items: {
        include: {
          product: true,
        },
      },
    },

    orderBy: {
      code: 'asc',
    },
  });

  const products: Product[] = dbProducts.map((product) => ({
    id: product.id,
    productId: product.productId,
    barCode: product.barCode,
    description: product.description,
    category: product.category,
    unitsPerDisplay: product.unitsPerDisplay,
  }));

  const cnts: CNT[] = dbCNTs
    .filter((cnt) => cnt.location && cnt.locationCode)
    .map((cnt) => ({
      id: cnt.id,
      code: cnt.code,
      status: cnt.status,

      locationCode: cnt.locationCode!,
      locationType: cnt.location!.type,

      items: cnt.items.map((item) => ({
        productId: item.product.productId,
        lot: item.lot,
        dueDate: item.dueDate.toISOString().slice(0, 10),
        count: item.count,
      })),
    }));

  return <CNTView cnts={cnts} products={products} />;
}
