'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createCNT() {
  const cnt = await prisma.$transaction(async (tx) => {
    const created = await tx.cNT.create({
      data: {
        code: `TEMP-${crypto.randomUUID()}`,
        status: 'ACTIVO',
      },
    });

    const number = created.id.toString().padStart(6, '0');

    const cntCode = `CNT-${number}`;
    const locationCode = `PUE${number}`;

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

  revalidatePath('/cnt');
  revalidatePath('/ingresos');

  return cnt;
}
