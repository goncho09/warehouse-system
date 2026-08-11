'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

type CreateEntryData = {
  productId: string;
  lot: string;
  dueDate: string;
  count: number;
  cntCode: string;
};

export async function createEntry(data: CreateEntryData) {
  if (data.count < 1) {
    throw new Error('La cantidad debe ser mayor a 0.');
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

  if (cnt.status !== 'ACTIVO') {
    throw new Error('El CNT está finalizado.');
  }

  if (!cnt.location || cnt.location.type !== 'EN_PUERTA') {
    throw new Error('El CNT no se encuentra en puerta.');
  }

  const existingItem = cnt.items.find((item) => item.productId === product.id);

  if (
    existingItem &&
    existingItem.lot.toLowerCase() !== data.lot.trim().toLowerCase()
  ) {
    throw new Error(
      `El producto ya existe en este CNT con el lote ${existingItem.lot}.`,
    );
  }

  const dueDate = new Date(`${data.dueDate}T00:00:00`);

  if (Number.isNaN(dueDate.getTime())) {
    throw new Error('Fecha de vencimiento inválida.');
  }

  const result = await prisma.$transaction(async (tx) => {
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

  revalidatePath('/ingresos');
  revalidatePath('/cnt');
  revalidatePath('/stock');

  return result;
}
