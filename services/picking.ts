import { prisma } from '@/lib/prisma';

function compareLocationCodes(a: string, b: string) {
  return a.localeCompare(b, 'es', {
    numeric: true,
    sensitivity: 'base',
  });
}

export async function generatePickTasks(orderId: number) {
  /*
   * Primero traemos el pedido.
   *
   * No necesitamos mantener una transacción abierta
   * mientras hacemos todas las consultas y cálculos.
   */
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },

    include: {
      items: {
        include: {
          product: true,
        },
      },

      pickTasks: true,
    },
  });

  if (!order) {
    throw new Error('La preparación no existe.');
  }

  if (order.status === 'COMPLETADO') {
    throw new Error('La preparación ya está completada.');
  }

  /*
   * Si ya fueron generados, no hacemos nada.
   */
  if (order.pickTasks.length > 0) {
    return order.pickTasks;
  }

  const pendingItems = order.items.filter(
    (item) => item.requestedCount - item.pickedCount - item.cancelledCount > 0,
  );

  if (pendingItems.length === 0) {
    throw new Error('El pedido no tiene unidades pendientes para preparar.');
  }

  const productIds = pendingItems.map((item) => item.productId);

  const stockItems = await prisma.cNTItem.findMany({
    where: {
      productId: {
        in: productIds,
      },

      count: {
        gt: 0,
      },

      cnt: {
        status: 'ACTIVO',

        location: {
          is: {
            type: 'PICKING',
          },
        },
      },
    },

    include: {
      cnt: {
        include: {
          location: true,
        },
      },
    },
  });

  /*
   * Agrupamos el stock por producto.
   */
  const stockByProduct = new Map<number, typeof stockItems>();

  for (const stockItem of stockItems) {
    const current = stockByProduct.get(stockItem.productId) ?? [];

    current.push(stockItem);

    stockByProduct.set(stockItem.productId, current);
  }

  const tasksToCreate: {
    orderId: number;
    orderItemId: number;
    cntId: number;
    locationCode: string;
    plannedCount: number;
  }[] = [];

  for (const orderItem of pendingItems) {
    const pendingCount =
      orderItem.requestedCount -
      orderItem.pickedCount -
      orderItem.cancelledCount;

    const availableStock = [...(stockByProduct.get(orderItem.productId) ?? [])]
      .filter((item) => item.cnt.locationCode && item.cnt.location)
      .sort((a, b) => {
        /*
         * FEFO:
         * vence antes → se usa antes.
         */
        const dueDateComparison = a.dueDate.getTime() - b.dueDate.getTime();

        if (dueDateComparison !== 0) {
          return dueDateComparison;
        }

        /*
         * Si vence igual, usamos el orden
         * físico de ubicación.
         */
        return compareLocationCodes(a.cnt.locationCode!, b.cnt.locationCode!);
      });

    let remaining = pendingCount;

    for (const stockItem of availableStock) {
      if (remaining <= 0) {
        break;
      }

      const plannedCount = Math.min(stockItem.count, remaining);

      if (plannedCount <= 0) {
        continue;
      }

      tasksToCreate.push({
        orderId: order.id,

        orderItemId: orderItem.id,

        cntId: stockItem.cntId,

        locationCode: stockItem.cnt.locationCode!,

        plannedCount,
      });

      remaining -= plannedCount;
    }

    if (remaining > 0) {
      throw new Error(
        `Stock insuficiente para "${orderItem.product.description}". ` +
          `Faltan ${remaining} unidades para generar la preparación.`,
      );
    }
  }

  if (tasksToCreate.length === 0) {
    throw new Error('No se pudieron generar pickeos para el pedido.');
  }

  await prisma.$transaction(async (tx) => {
    const existingTasks = await tx.pickTask.count({
      where: {
        orderId,
      },
    });

    if (existingTasks > 0) {
      return;
    }

    await tx.pickTask.createMany({
      data: tasksToCreate,
    });
  });

  return prisma.pickTask.findMany({
    where: {
      orderId,
    },
  });
}
