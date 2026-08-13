'use server';

import { revalidatePath, refresh } from 'next/cache';

import { createEntryRecord, type CreateEntryData } from '@/services/entry';

export async function createEntry(data: CreateEntryData) {
  const result = await createEntryRecord(data);

  revalidatePath('/ingresos');
  revalidatePath('/cnt');
  revalidatePath('/stock');

  refresh();

  return result;
}
