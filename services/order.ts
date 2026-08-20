import { prisma } from '@/lib/prisma';
import { generatePickTasks } from '@/services/picking';

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

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
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

  const lines: {
    productId: number;
    requestedCount: number;
  }[] = [];

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

      const product = selected.find(
        (candidate) => candidate.id === line.productId,
      );

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

  const products = await prisma.product.findMany({
    include: {
      cntItems: {
        include: {
          cnt: {
            include: {
              location: true,
            },
          },
        },
      },
    },
  });

  const productsWithStock = products
    .map((product) => {
      const stock = product.cntItems
        .filter(
          (item) =>
            item.cnt.status === 'ACTIVO' &&
            item.cnt.location?.type === 'PICKING',
        )
        .reduce((total, item) => total + item.count, 0);

      return {
        ...product,
        stock,
      };
    })
    .filter((product) => product.stock > 0);

  if (productsWithStock.length === 0) {
    throw new Error('No hay productos con stock disponible en picking.');
  }

  const createdOrders = [];

  for (const destination of DESTINATIONS) {
    for (const category of CATEGORIES) {
      const key = `${destination}-${category}`;

      if (existingKeys.has(key)) {
        continue;
      }

      const categoryProducts = productsWithStock.filter(
        (product) => product.category === category,
      );

      if (categoryProducts.length === 0) {
        continue;
      }

      const lines = generateOrderLines(categoryProducts, category);

      if (lines.length === 0) {
        continue;
      }

      const order = await prisma.$transaction(async (tx) => {
        const temporaryOrder = await tx.order.create({
          data: {
            stoCode: `TEMP-STO-${crypto.randomUUID()}`,

            preparationCode: `TEMP-PREP-${crypto.randomUUID()}`,

            destination,
            category,
            departureDate: normalizedDate,

            status: 'PENDIENTE',
          },
        });

        const number = temporaryOrder.id.toString().padStart(6, '0');

        const updatedOrder = await tx.order.update({
          where: {
            id: temporaryOrder.id,
          },

          data: {
            stoCode: `STO-${number}`,

            preparationCode: `PREP-${number}`,
          },
        });

        await tx.orderItem.createMany({
          data: lines.map((line) => ({
            orderId: updatedOrder.id,

            productId: line.productId,

            requestedCount: line.requestedCount,

            pickedCount: 0,
            cancelledCount: 0,
          })),
        });

        return updatedOrder;
      });

      await generatePickTasks(order.id);

      const createdOrder = await prisma.order.findUniqueOrThrow({
        where: {
          id: order.id,
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

      createdOrders.push(createdOrder);
      existingKeys.add(key);
    }
  }

  return createdOrders;
}
