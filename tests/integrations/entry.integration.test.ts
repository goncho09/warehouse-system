import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { prisma } from '@/lib/prisma';
import { createCNTRecord } from '@/services/cnt';
import { createEntryRecord } from '@/services/entry';

let productDbId: number;
let cntId: number;
let cntCode: string;
let locationCode: string;

beforeEach(async () => {
  const unique = crypto.randomUUID();

  const product = await prisma.product.create({
    data: {
      productId: `TEST-${unique}`,
      barCode: `TEST-BAR-${unique}`,
      description: 'Producto integration test',
      category: 'FOOD',
      unitsPerDisplay: 12,
    },
  });

  productDbId = product.id;

  const cnt = await createCNTRecord();

  cntId = cnt.id;
  cntCode = cnt.code;
  locationCode = cnt.locationCode!;
});

afterEach(async () => {
  await prisma.entry.deleteMany({
    where: {
      cntId,
    },
  });

  await prisma.cNTItem.deleteMany({
    where: {
      cntId,
    },
  });

  await prisma.cNT.deleteMany({
    where: {
      id: cntId,
    },
  });

  await prisma.location.deleteMany({
    where: {
      code: locationCode,
    },
  });

  await prisma.product.deleteMany({
    where: {
      id: productDbId,
    },
  });
});

describe('createEntryRecord', () => {
  it('crea Entry y CNTItem', async () => {
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id: productDbId,
      },
    });

    await createEntryRecord({
      productId: product.productId,
      lot: 'L123',
      dueDate: '2099-12-20',
      count: 12,
      cntCode,
    });

    const entries = await prisma.entry.findMany({
      where: {
        cntId,
      },
    });

    const items = await prisma.cNTItem.findMany({
      where: {
        cntId,
      },
    });

    expect(entries).toHaveLength(1);
    expect(entries[0].count).toBe(12);

    expect(items).toHaveLength(1);
    expect(items[0].count).toBe(12);
    expect(items[0].lot).toBe('L123');
  });

  it('suma cantidad si entra nuevamente el mismo producto y lote', async () => {
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id: productDbId,
      },
    });

    await createEntryRecord({
      productId: product.productId,
      lot: 'L123',
      dueDate: '2099-12-20',
      count: 12,
      cntCode,
    });

    await createEntryRecord({
      productId: product.productId,
      lot: 'L123',
      dueDate: '2099-12-20',
      count: 6,
      cntCode,
    });

    const item = await prisma.cNTItem.findFirstOrThrow({
      where: {
        cntId,
        productId: product.id,
      },
    });

    expect(item.count).toBe(18);

    const entries = await prisma.entry.count({
      where: {
        cntId,
      },
    });

    expect(entries).toBe(2);
  });

  it('rechaza otro lote para el mismo producto', async () => {
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id: productDbId,
      },
    });

    await createEntryRecord({
      productId: product.productId,
      lot: 'L123',
      dueDate: '2099-12-20',
      count: 12,
      cntCode,
    });

    await expect(
      createEntryRecord({
        productId: product.productId,
        lot: 'L999',
        dueDate: '2099-12-20',
        count: 6,
        cntCode,
      }),
    ).rejects.toThrow('El producto ya existe en este CNT con el lote L123.');
  });

  it('rechaza cantidad cero', async () => {
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id: productDbId,
      },
    });

    await expect(
      createEntryRecord({
        productId: product.productId,
        lot: 'L123',
        dueDate: '2099-12-20',
        count: 0,
        cntCode,
      }),
    ).rejects.toThrow();
  });
});

it('rechaza otro vencimiento para el mismo producto y lote', async () => {
  const product = await prisma.product.findUniqueOrThrow({
    where: {
      id: productDbId,
    },
  });

  await createEntryRecord({
    productId: product.productId,
    lot: 'L123',
    dueDate: '2099-12-20',
    count: 12,
    cntCode,
  });

  await expect(
    createEntryRecord({
      productId: product.productId,
      lot: 'L123',
      dueDate: '2099-12-21',
      count: 6,
      cntCode,
    }),
  ).rejects.toThrow(
    'El producto ya existe en este CNT con vencimiento 2099-12-20.',
  );

  const item = await prisma.cNTItem.findFirstOrThrow({
    where: {
      cntId,
      productId: product.id,
    },
  });

  expect(item.count).toBe(12);
});
