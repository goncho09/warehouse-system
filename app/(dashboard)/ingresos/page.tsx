import EntriesView from '@/components/entries/EntriesView';
import { prisma } from '@/lib/prisma';

export default async function EntriesPage() {
  const products = await prisma.product.findMany({
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
      id: 'asc',
    },
  });

  const cnts = dbCNTs
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
        dueDate: item.dueDate.toISOString(),
        count: item.count,
      })),
    }));

  return <EntriesView products={products} cnts={cnts} />;
}
