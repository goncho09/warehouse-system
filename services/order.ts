import { randomUUID } from 'node:crypto';

import { prisma } from '@/lib/prisma';

import { generatePickTasksForOrders } from '@/services/picking';

const DESTINATIONS = [
  'LA_BLANQUEADA',
  'CARRASCO_NORTE',
  'TRES_CRUCES',
  'SAYAGO',
  'CIUDAD_DE_LA_COSTA',
  'MALVIN_NORTE',
  'AGUADA',
  'BRAZO_ORIENTAL',
] as const;

const CATEGORIES = ['FOOD', 'NO_FOOD', 'CONGELADO', 'REFRIGERADO'] as const;

type Category = (typeof CATEGORIES)[number];

type Destination = (typeof DESTINATIONS)[number];

type OrderLine = {
  productId: number;
  requestedCount: number;
};

type OrderPlan = {
  destination: Destination;
  category: Category;
  lines: OrderLine[];
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[]) {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

function targetForCategory(category: Category) {
  switch (category) {
    case 'FOOD':
      return randomInt(2500, 3000);

    case 'NO_FOOD':
      return randomInt(700, 1000);

    case 'REFRIGERADO':
    case 'CONGELADO':
      return randomInt(200, 300);
  }
}

function lineCountForCategory(category: Category, availableProducts: number) {
  const desired =
    category === 'FOOD'
      ? randomInt(20, 28)
      : category === 'NO_FOOD'
        ? randomInt(8, 12)
        : randomInt(5, 8);

  return Math.min(desired, availableProducts);
}

function generateOrderLines<
  T extends {
    id: number;
    stock: number;
  },
>(products: T[], category: Category) {
  const target = targetForCategory(category);

  const selected = shuffle(products).slice(
    0,
    lineCountForCategory(category, products.length),
  );

  let remaining = Math.min(
    target,
    selected.reduce((total, product) => total + product.stock, 0),
  );

  const lines: OrderLine[] = [];

  const productById = new Map(selected.map((product) => [product.id, product]));

  for (let index = 0; index < selected.length; index += 1) {
    const product = selected[index];

    const remainingProducts = selected.length - index;

    if (remaining <= 0) {
      break;
    }

    const ideal = Math.ceil(remaining / remainingProducts);

    const jittered = Math.max(
      1,
      Math.round(ideal * (randomInt(80, 120) / 100)),
    );

    const maxForThisLine =
      remainingProducts === 1
        ? remaining
        : Math.max(1, remaining - (remainingProducts - 1));

    const requestedCount = Math.min(product.stock, jittered, maxForThisLine);

    if (requestedCount <= 0) {
      continue;
    }

    lines.push({
      productId: product.id,

      requestedCount,
    });

    remaining -= requestedCount;
  }

  if (remaining > 0) {
    for (const line of lines) {
      if (remaining <= 0) {
        break;
      }

      const product = productById.get(line.productId);

      if (!product) {
        continue;
      }

      const extraCapacity = product.stock - line.requestedCount;

      if (extraCapacity <= 0) {
        continue;
      }

      const extra = Math.min(extraCapacity, remaining);

      line.requestedCount += extra;

      remaining -= extra;
    }
  }

  return lines;
}

export async function generateDailyOrders(departureDate: Date) {
  const normalizedDate = new Date(departureDate);

  normalizedDate.setHours(0, 0, 0, 0);

  const existingOrders = await prisma.order.findMany({
    where: {
      departureDate: normalizedDate,
    },

    select: {
      destination: true,
      category: true,
    },
  });

  const existingKeys = new Set(
    existingOrders.map((order) => `${order.destination}-${order.category}`),
  );

  const stockItems = await prisma.cNTItem.findMany({
    where: {
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

    select: {
      count: true,

      product: {
        select: {
          id: true,
          category: true,
        },
      },
    },
  });

  const productStock = new Map<
    number,
    {
      id: number;
      category: Category;
      stock: number;
    }
  >();

  for (const item of stockItems) {
    const existing = productStock.get(item.product.id);

    if (existing) {
      existing.stock += item.count;

      continue;
    }

    productStock.set(item.product.id, {
      id: item.product.id,

      category: item.product.category as Category,

      stock: item.count,
    });
  }

  const productsWithStock = [...productStock.values()];

  if (productsWithStock.length === 0) {
    throw new Error('No hay productos con stock disponible en picking.');
  }

  /*
   * Agrupamos los productos por categoría una vez.
   */
  const productsByCategory: Record<Category, typeof productsWithStock> = {
    FOOD: [],
    NO_FOOD: [],
    CONGELADO: [],
    REFRIGERADO: [],
  };

  for (const product of productsWithStock) {
    productsByCategory[product.category].push(product);
  }

  const plans: OrderPlan[] = [];

  for (const destination of DESTINATIONS) {
    for (const category of CATEGORIES) {
      const key = `${destination}-${category}`;

      if (existingKeys.has(key)) {
        continue;
      }

      const categoryProducts = productsByCategory[category];

      if (categoryProducts.length === 0) {
        continue;
      }

      const lines = generateOrderLines(categoryProducts, category);

      if (lines.length === 0) {
        continue;
      }

      plans.push({
        destination,
        category,
        lines,
      });
    }
  }

  if (plans.length === 0) {
    return [];
  }

  const createdOrders = await prisma.order.createManyAndReturn({
    data: plans.map((plan) => ({
      stoCode: `TEMP-STO-${randomUUID()}`,

      preparationCode: `TEMP-PREP-${randomUUID()}`,

      destination: plan.destination,

      category: plan.category,

      departureDate: normalizedDate,

      status: 'PENDIENTE' as const,
    })),

    select: {
      id: true,
      destination: true,
      category: true,
    },
  });

  const orderByKey = new Map(
    createdOrders.map((order) => [
      `${order.destination}-${order.category}`,
      order,
    ]),
  );

  await Promise.all(
    createdOrders.map((order) => {
      const number = order.id.toString().padStart(6, '0');

      return prisma.order.update({
        where: {
          id: order.id,
        },

        data: {
          stoCode: `STO-${number}`,

          preparationCode: `PREP-${number}`,
        },
      });
    }),
  );

  const orderItemSeeds = plans.flatMap((plan) => {
    const order = orderByKey.get(`${plan.destination}-${plan.category}`);

    if (!order) {
      throw new Error(
        `No se encontró el pedido ${plan.destination}-${plan.category}.`,
      );
    }

    return plan.lines.map((line) => ({
      orderId: order.id,

      productId: line.productId,

      requestedCount: line.requestedCount,

      pickedCount: 0,

      cancelledCount: 0,
    }));
  });

  await prisma.orderItem.createMany({
    data: orderItemSeeds,
  });

  const createdOrderIds = createdOrders.map((order) => order.id);

  await generatePickTasksForOrders(createdOrderIds);

  /*
   * =====================================================
   * 8. RESPUESTA FINAL
   * =====================================================
   */

  return prisma.order.findMany({
    where: {
      id: {
        in: createdOrderIds,
      },
    },

    include: {
      items: {
        include: {
          product: true,
        },
      },

      pickTasks: true,
    },

    orderBy: {
      id: 'asc',
    },
  });
}
