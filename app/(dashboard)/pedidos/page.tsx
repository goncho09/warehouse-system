export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';

import OrdersView from '@/components/orders/OrdersView';

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: [
      {
        departureDate: 'asc',
      },
      {
        destination: 'asc',
      },
    ],
  });

  const frontendOrders = orders.map((order) => ({
    id: order.id,
    stoCode: order.stoCode,
    preparationCode: order.preparationCode,
    destination: order.destination,
    status: order.status,
    departureDate: order.departureDate.toISOString().slice(0, 10),
    category: order.category,

    items: order.items.map((item) => ({
      id: item.id,
      productId: item.product.productId,
      description: item.product.description,
      requestedCount: item.requestedCount,
      pickedCount: item.pickedCount,
      cancelledCount: item.cancelledCount,
    })),
  }));

  return <OrdersView orders={frontendOrders} />;
}
