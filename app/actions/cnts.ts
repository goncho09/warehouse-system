'use server';

import { revalidatePath } from 'next/cache';

import { createCNTRecord } from '@/services/cnt';

export async function createCNT() {
  const cnt = await createCNTRecord();

  revalidatePath('/cnt');
  revalidatePath('/ingresos');

  return cnt;
}
