import { prisma } from '@/lib/prisma';

function compareLocationCodes(a: string, b: string) {
  return a.localeCompare(b, 'es', {
    numeric: true,
    sensitivity: 'base',
  });
}

export async function generatePickTasks(orderId: number) {
  const tasks = await generatePickTasksForOrders([orderId]);

  return tasks.filter((task) => task.orderId === orderId);
}

export async function generatePickTasksForOrders(orderIds: number[]) {
  const uniqueOrderIds = [...new Set(orderIds)];

  if (uniqueOrderIds.length === 0) {
    return [];
  }

  /*
   * UNA consulta para traer todos los pedidos
   * junto con sus productos.
   */
  const orders = await prisma.order.findMany({
    where: {
      id: {
        in: uniqueOrderIds,
      },
    },

    include: {
      items: {
        include: {
          product: true,
        },
      },

      pickTasks: {
        select: {
          id: true,
        },
      },
    },
  });

  if (orders.length !== uniqueOrderIds.length) {
    throw new Error('No se encontraron todas las preparaciones.');
  }

  const completedOrder = orders.find((order) => order.status === 'COMPLETADO');

  if (completedOrder) {
    throw new Error(
      `La preparación ${completedOrder.preparationCode} ya está completada.`,
    );
  }

  const ordersToPlan = orders.filter((order) => order.pickTasks.length === 0);

  if (ordersToPlan.length === 0) {
    return prisma.pickTask.findMany({
      where: {
        orderId: {
          in: uniqueOrderIds,
        },
      },
    });
  }

  /*
   * Todos los productos pendientes de TODOS
   * los pedidos.
   */
  const productIds = [
    ...new Set(
      ordersToPlan.flatMap((order) =>
        order.items
          .filter(
            (item) =>
              item.requestedCount - item.pickedCount - item.cancelledCount > 0,
          )
          .map((item) => item.productId),
      ),
    ),
  ];

  if (productIds.length === 0) {
    throw new Error('Los pedidos no tienen unidades pendientes para preparar.');
  }

  /*
   * UNA consulta de stock para TODOS los productos
   * de TODOS los pedidos.
   */
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
  const stockByProduct = new Map<number, (typeof stockItems)[number][]>();

  for (const stockItem of stockItems) {
    if (!stockItem.cnt.locationCode || !stockItem.cnt.location) {
      continue;
    }

    const current = stockByProduct.get(stockItem.productId) ?? [];

    current.push(stockItem);

    stockByProduct.set(stockItem.productId, current);
  }

  /*
   * Ordenamos cada producto una sola vez por FEFO.
   */
  for (const stock of stockByProduct.values()) {
    stock.sort((a, b) => {
      const dueDateComparison = a.dueDate.getTime() - b.dueDate.getTime();

      if (dueDateComparison !== 0) {
        return dueDateComparison;
      }

      return compareLocationCodes(a.cnt.locationCode!, b.cnt.locationCode!);
    });
  }

  const tasksToCreate: {
    orderId: number;
    orderItemId: number;
    cntId: number;
    locationCode: string;
    plannedCount: number;
  }[] = [];

  for (const order of ordersToPlan) {
    for (const orderItem of order.items) {
      const pendingCount =
        orderItem.requestedCount -
        orderItem.pickedCount -
        orderItem.cancelledCount;

      if (pendingCount <= 0) {
        continue;
      }

      const availableStock = stockByProduct.get(orderItem.productId) ?? [];

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
          `Stock insuficiente para "${orderItem.product.description}" ` +
            `en ${order.preparationCode}. ` +
            `Faltan ${remaining} unidades.`,
        );
      }
    }
  }

  if (tasksToCreate.length === 0) {
    throw new Error('No se pudieron generar pickeos para los pedidos.');
  }

  await prisma.$transaction(async (tx) => {
    const existingTasks = await tx.pickTask.findMany({
      where: {
        orderId: {
          in: ordersToPlan.map((order) => order.id),
        },
      },

      select: {
        orderId: true,
      },
    });

    const existingOrderIds = new Set(existingTasks.map((task) => task.orderId));

    const newTasks = tasksToCreate.filter(
      (task) => !existingOrderIds.has(task.orderId),
    );

    if (newTasks.length === 0) {
      return;
    }

    await tx.pickTask.createMany({
      data: newTasks,
    });
  });

  return prisma.pickTask.findMany({
    where: {
      orderId: {
        in: uniqueOrderIds,
      },
    },
  });
}
