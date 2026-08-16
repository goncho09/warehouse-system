'use server';

import { revalidatePath } from 'next/cache';

import { generateDailyOrders } from '@/services/order';

export async function loadDailyOrders(departureDate: string) {
  const date = new Date(`${departureDate}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Fecha de salida inválida.');
  }

  const orders = await generateDailyOrders(date);

  revalidatePath('/pedidos');

  return {
    createdCount: orders.length,
  };
}
