export const dynamic = 'force-dynamic';

import OrdersView from '@/components/orders/OrdersView';
import { prisma } from '@/lib/prisma';

import type { Order } from '@/types/Order';

export default async function OrdersPage() {
  const dbOrders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },

      pickTasks: true,
    },

    orderBy: {
      preparationCode: 'asc',
    },
  });

  const frontendOrders: Order[] = dbOrders.map((order) => ({
    id: order.id,
    stoCode: order.stoCode,
    preparationCode: order.preparationCode,
    destination: order.destination,
    category: order.category,
    status: order.status,
    departureDate: order.departureDate.toISOString().slice(0, 10),

    items: order.items.map((item) => ({
      id: item.id,

      productId: item.product.productId,

      description: item.product.description,

      requestedCount: item.requestedCount,

      pickedCount: item.pickedCount,

      cancelledCount: item.cancelledCount,
    })),
    pickTasks: order.pickTasks.map((task) => ({
      id: task.id,

      plannedCount: task.plannedCount,

      pickedCount: task.pickedCount,

      cancelledCount: task.cancelledCount,

      status: task.status,
    })),
  }));

  return <OrdersView orders={frontendOrders} />;
}
