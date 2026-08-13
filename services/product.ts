import { prisma } from '@/lib/prisma';
import { validateProductFields } from '@/lib/product';

export type CreateProductData = {
  productId: string;
  barCode: string;
  description: string;
  category: 'FOOD' | 'NO_FOOD' | 'CONGELADO' | 'REFRIGERADO';
  unitsPerDisplay: number;
};

export async function createProductRecord(data: CreateProductData) {
  const validated = validateProductFields(data);

  const existingProductId = await prisma.product.findUnique({
    where: {
      productId: validated.productId,
    },
  });

  if (existingProductId) {
    throw new Error('Ya existe un producto con ese código.');
  }

  const existingBarcode = await prisma.product.findUnique({
    where: {
      barCode: validated.barCode,
    },
  });

  if (existingBarcode) {
    throw new Error('Ya existe un producto con ese código de barras.');
  }

  return prisma.product.create({
    data: {
      productId: validated.productId,
      barCode: validated.barCode,
      description: validated.description,
      category: data.category,
      unitsPerDisplay: validated.unitsPerDisplay,
    },
  });
}
