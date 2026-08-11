import EntriesView from '@/components/entries/EntriesView';
import { prisma } from '@/lib/prisma';

export default async function EntriesPage() {
  const dbEntries = await prisma.entry.findMany({
    include: {
      product: true,
      cnt: true,
    },
    orderBy: {
      entryDate: 'desc',
    },
  });

  const entries = dbEntries.map((entry) => ({
    id: entry.id,
    productId: entry.product.productId,
    lot: entry.lot,
    dueDate: entry.dueDate.toISOString().slice(0, 10),
    count: entry.count,
    cntCode: entry.cnt.code,
    entryDate: entry.entryDate.toISOString(),
  }));

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

  return <EntriesView products={products} cnts={cnts} entries={entries} />;
}
