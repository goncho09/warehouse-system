'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

type CreateProductData = {
  productId: string;
  barCode: string;
  description: string;
  category: 'FOOD' | 'NO_FOOD' | 'CONGELADO' | 'REFRIGERADO';
  unitsPerDisplay: number;
};

export async function createProduct(data: CreateProductData) {
  const product = await prisma.product.create({
    data: {
      productId: data.productId,
      barCode: data.barCode,
      description: data.description,
      category: data.category,
      unitsPerDisplay: data.unitsPerDisplay,
    },
  });

  revalidatePath('/productos');

  return product;
}
