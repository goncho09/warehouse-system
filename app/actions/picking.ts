'use server';

import { revalidatePath } from 'next/cache';

import { generatePickTasks } from '@/services/picking';

export async function startPreparation(orderId: number) {
  const tasks = await generatePickTasks(orderId);

  revalidatePath('/pedidos');

  return {
    taskCount: tasks.length,
  };
}
