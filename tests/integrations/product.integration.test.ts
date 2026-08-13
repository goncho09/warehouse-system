import { afterEach, describe, expect, it } from 'vitest';

import { prisma } from '../../lib/prisma';
import { createProductRecord } from '../../services/product';

const createdProductIds: number[] = [];

afterEach(async () => {
  if (createdProductIds.length > 0) {
    await prisma.product.deleteMany({
      where: {
        id: {
          in: createdProductIds,
        },
      },
    });
  }

  createdProductIds.length = 0;
});

describe('createProductRecord', () => {
  it('crea un producto en la base', async () => {
    const unique = crypto.randomUUID();

    const product = await createProductRecord({
      productId: `TEST-${unique}`,
      barCode: `BAR-${unique}`,
      description: 'Producto de integración',
      category: 'FOOD',
      unitsPerDisplay: 12,
    });

    createdProductIds.push(product.id);

    const saved = await prisma.product.findUnique({
      where: {
        id: product.id,
      },
    });

    expect(saved).not.toBeNull();
    expect(saved?.productId).toBe(product.productId);
    expect(saved?.barCode).toBe(product.barCode);
    expect(saved?.description).toBe('Producto de integración');
    expect(saved?.unitsPerDisplay).toBe(12);
  });

  it('normaliza espacios antes de guardar', async () => {
    const unique = crypto.randomUUID();

    const product = await createProductRecord({
      productId: `  TEST-${unique}  `,
      barCode: `  BAR-${unique}  `,
      description: '  Producto con espacios  ',
      category: 'FOOD',
      unitsPerDisplay: 6,
    });

    createdProductIds.push(product.id);

    expect(product.productId).toBe(`TEST-${unique}`);
    expect(product.barCode).toBe(`BAR-${unique}`);
    expect(product.description).toBe('Producto con espacios');
  });

  it('rechaza un productId duplicado', async () => {
    const unique = crypto.randomUUID();

    const first = await createProductRecord({
      productId: `TEST-${unique}`,
      barCode: `BAR-A-${unique}`,
      description: 'Producto A',
      category: 'FOOD',
      unitsPerDisplay: 12,
    });

    createdProductIds.push(first.id);

    await expect(
      createProductRecord({
        productId: first.productId,
        barCode: `BAR-B-${unique}`,
        description: 'Producto B',
        category: 'FOOD',
        unitsPerDisplay: 6,
      }),
    ).rejects.toThrow('Ya existe un producto con ese código.');
  });

  it('rechaza un código de barras duplicado', async () => {
    const unique = crypto.randomUUID();

    const first = await createProductRecord({
      productId: `TEST-A-${unique}`,
      barCode: `BAR-${unique}`,
      description: 'Producto A',
      category: 'FOOD',
      unitsPerDisplay: 12,
    });

    createdProductIds.push(first.id);

    await expect(
      createProductRecord({
        productId: `TEST-B-${unique}`,
        barCode: first.barCode,
        description: 'Producto B',
        category: 'FOOD',
        unitsPerDisplay: 6,
      }),
    ).rejects.toThrow('Ya existe un producto con ese código de barras.');
  });
});
