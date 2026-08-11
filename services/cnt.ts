import { prisma } from '@/lib/prisma';

import { formatCNTCode, formatEntryLocationCode } from '@/lib/cnt';

export async function createCNTRecord() {
  return prisma.$transaction(async (tx) => {
    const created = await tx.cNT.create({
      data: {
        code: `TEMP-${crypto.randomUUID()}`,
        status: 'ACTIVO',
      },
    });

    const cntCode = formatCNTCode(created.id);
    const locationCode = formatEntryLocationCode(created.id);

    await tx.location.create({
      data: {
        code: locationCode,
        type: 'EN_PUERTA',
      },
    });

    return tx.cNT.update({
      where: {
        id: created.id,
      },
      data: {
        code: cntCode,
        locationCode,
      },
      include: {
        location: true,
        items: true,
      },
    });
  });
}
