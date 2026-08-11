'use server';

import { revalidatePath } from 'next/cache';

import { createEntryRecord, type CreateEntryData } from '@/services/entry';

export async function createEntry(data: CreateEntryData) {
  const result = await createEntryRecord(data);

  revalidatePath('/ingresos');
  revalidatePath('/cnt');
  revalidatePath('/stock');

  return result;
}
