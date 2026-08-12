'use server';

import { revalidatePath } from 'next/cache';

import { createCNTRecord, moveCNTLocation } from '@/services/cnt';

export async function createCNT() {
  const cnt = await createCNTRecord();

  revalidatePath('/cnt');
  revalidatePath('/ingresos');

  return cnt;
}

export async function moveCNT(cntCode: string, targetLocationCode: string) {
  const cnt = await moveCNTLocation(cntCode, targetLocationCode);

  revalidatePath('/cnt');
  revalidatePath('/stock');
  revalidatePath('/ubicaciones');

  return cnt;
}
