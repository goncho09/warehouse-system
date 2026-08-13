'use server';

import { revalidatePath, refresh } from 'next/cache';

import {
  createProductRecord,
  type CreateProductData,
} from '@/services/product';

export async function createProduct(data: CreateProductData) {
  const product = await createProductRecord(data);

  revalidatePath('/productos');
  revalidatePath('/ingresos');
  revalidatePath('/stock');

  refresh();

  return product;
}
