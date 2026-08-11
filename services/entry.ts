import { prisma } from '@/lib/prisma';

import {
  canReceiveEntry,
  hasCompatibleLot,
  isValidEntryCount,
  parseDueDate,
} from '@/lib/entry';

export type CreateEntryData = {
  productId: string;
  lot: string;
  dueDate: string;
  count: number;
  cntCode: string;
};

export async function createEntryRecord(data: CreateEntryData) {
  if (!isValidEntryCount(data.count)) {
    throw new Error('La cantidad debe ser un entero mayor a 0.');
  }

  const product = await prisma.product.findUnique({
    where: {
      productId: data.productId,
    },
  });

  if (!product) {
    throw new Error('El producto no existe.');
  }

  const cnt = await prisma.cNT.findUnique({
    where: {
      code: data.cntCode,
    },
    include: {
      location: true,
      items: true,
    },
  });

  if (!cnt) {
    throw new Error('El CNT no existe.');
  }

  if (!canReceiveEntry(cnt.status, cnt.location?.type ?? null)) {
    if (cnt.status !== 'ACTIVO') {
      throw new Error('El CNT está finalizado.');
    }

    throw new Error('El CNT no se encuentra en puerta.');
  }

  if (!hasCompatibleLot(cnt.items, product.id, data.lot)) {
    const existingItem = cnt.items.find(
      (item) => item.productId === product.id,
    );

    throw new Error(
      `El producto ya existe en este CNT con el lote ${existingItem?.lot}.`,
    );
  }

  const dueDate = parseDueDate(data.dueDate);

  if (!dueDate) {
    throw new Error('Fecha de vencimiento inválida.');
  }

  return prisma.$transaction(async (tx) => {
    const entry = await tx.entry.create({
      data: {
        productId: product.id,
        cntId: cnt.id,
        lot: data.lot.trim(),
        dueDate,
        count: data.count,
      },
    });

    const cntItem = await tx.cNTItem.upsert({
      where: {
        cntId_productId: {
          cntId: cnt.id,
          productId: product.id,
        },
      },

      update: {
        count: {
          increment: data.count,
        },
      },

      create: {
        cntId: cnt.id,
        productId: product.id,
        lot: data.lot.trim(),
        dueDate,
        count: data.count,
      },
    });

    return {
      entry,
      cntItem,
    };
  });
}
