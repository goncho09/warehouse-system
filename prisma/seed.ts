import 'dotenv/config';

import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

type Category = 'FOOD' | 'NO_FOOD' | 'CONGELADO' | 'REFRIGERADO';

type ProductSeed = {
  productId: string;
  barCode: string;
  description: string;
  category: Category;
  unitsPerDisplay: number;
};

type PickingCNTSeed = {
  code: string;
  status: 'ACTIVO';
  locationCode: string;
  category: Category;
};

const FOOD_NAMES = [
  'Coca-Cola 1.5L',
  'Coca-Cola Zero 1.5L',
  'Pepsi 500ml',
  'Sprite 600ml',
  'Fanta Naranja 600ml',
  'Agua Salus 600ml',
  'Agua Salus 1.5L',
  'Red Bull 250ml',
  'Monster Energy 473ml',
  'Papas Lays Clásicas 105g',
  'Papas Lays Jamón 105g',
  'Doritos 140g',
  'Cheetos 120g',
  'Galletitas Oreo 118g',
  'Galletitas Bridge 140g',
  'Galletitas María 170g',
  'Alfajor Portezuelo Chocolate',
  'Alfajor Portezuelo Blanco',
  'Alfajor Milka Triple',
  'Chocolate Milka 100g',
  'Chocolate Cadbury 90g',
  'Budín Chocolate 200g',
  'Budín Vainilla 200g',
  'Café Instantáneo 170g',
  'Yerba Canarias 1kg',
  'Yerba Baldo 1kg',
  'Arroz 1kg',
  'Fideos Spaghetti 500g',
  'Harina 1kg',
  'Azúcar 1kg',
  'Aceite de Girasol 900ml',
  'Atún al Natural 170g',
  'Mayonesa 500g',
  'Ketchup 500g',
  'Salsa de Tomate 340g',
  'Cerveza Sin Alcohol 355ml',
];

const NO_FOOD_NAMES = [
  'Detergente Magistral 500ml',
  'Detergente Cif 500ml',
  'Papel Higiénico x4',
  'Papel Higiénico x12',
  'Jabón Dove 90g',
  'Jabón Rexona 90g',
  'Shampoo Sedal 340ml',
  'Acondicionador Sedal 340ml',
  'Desodorante Rexona 150ml',
  'Lavandina 1L',
  'Limpiador Cif 750ml',
  'Esponja de Cocina x3',
  'Bolsas de Residuos x20',
  'Rollo de Cocina x2',
  'Pasta Dental 90g',
  'Cepillo Dental',
];

const REFRIGERATED_NAMES = [
  'Leche Conaprole Entera 1L',
  'Leche Conaprole Descremada 1L',
  'Yogur Conaprole Frutilla 1L',
  'Yogur Conaprole Vainilla 1L',
  'Muzzarella 500g',
  'Queso Dambo 500g',
  'Jamón Cocido 500g',
  'Manteca 200g',
  'Postre Chocolate 120g',
  'Crema de Leche 250ml',
];

const FROZEN_NAMES = [
  'Helado Chocolate 1L',
  'Helado Vainilla 1L',
  'Hamburguesas Congeladas x4',
  'Hamburguesas Congeladas x12',
  'Papas Fritas Congeladas 1kg',
  'Pizza Congelada Muzzarella',
  'Nuggets de Pollo 400g',
  'Milanesas Congeladas 500g',
  'Vegetales Congelados 500g',
  'Empanadas Congeladas x6',
];

const CATEGORIES = ['FOOD', 'NO_FOOD', 'REFRIGERADO', 'CONGELADO'] as const;

function buildProducts(): ProductSeed[] {
  const all = [
    ...FOOD_NAMES.map((description) => ({
      description,
      category: 'FOOD' as const,
    })),

    ...NO_FOOD_NAMES.map((description) => ({
      description,
      category: 'NO_FOOD' as const,
    })),

    ...REFRIGERATED_NAMES.map((description) => ({
      description,
      category: 'REFRIGERADO' as const,
    })),

    ...FROZEN_NAMES.map((description) => ({
      description,
      category: 'CONGELADO' as const,
    })),
  ];

  return all.map((item, index) => {
    const number = index + 1;

    return {
      productId: `PRD-${1000 + number}`,

      barCode: `77312345${(67000 + number).toString().padStart(5, '0')}`,

      description: item.description,

      category: item.category,

      unitsPerDisplay:
        item.category === 'FOOD'
          ? [6, 10, 12, 20, 24][index % 5]
          : item.category === 'NO_FOOD'
            ? [6, 12, 24][index % 3]
            : [6, 8, 10, 12][index % 4],
    };
  });
}

function makePickingLocations() {
  const chambers = ['160', '161', '162', '163'];

  const rows = ['011', '012', '013', '014', '015', '016'];

  const positions = ['01', '02', '03'];

  const heights = ['01', '02'];

  return chambers.flatMap((chamber) =>
    rows.flatMap((row) =>
      positions.flatMap((position) =>
        heights.map((height) => ({
          code: `${chamber}A${row}${position}${height}`,
          type: 'PICKING' as const,
          chamber,
          row,
          position,
          height,
        })),
      ),
    ),
  );
}

function makeDoorLocations() {
  return Array.from(
    {
      length: 8,
    },
    (_, index) => ({
      code: `PUE${(index + 1).toString().padStart(6, '0')}`,

      type: 'EN_PUERTA' as const,

      chamber: null,
      row: null,
      position: null,
      height: null,
    }),
  );
}

function makeFloatingLocations() {
  return Array.from(
    {
      length: 2,
    },
    (_, index) => ({
      code: `Z${(index + 1).toString().padStart(6, '0')}`,

      type: 'FLOTANTE' as const,

      chamber: null,
      row: null,
      position: null,
      height: null,
    }),
  );
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function dueDateForCategory(category: Category, offset: number) {
  const base = new Date('2026-08-15T00:00:00');

  const days =
    category === 'REFRIGERADO'
      ? 10 + offset * 3
      : category === 'CONGELADO'
        ? 120 + offset * 12
        : category === 'FOOD'
          ? 90 + offset * 15
          : 500 + offset * 30;

  base.setDate(base.getDate() + days);

  return base.toISOString().slice(0, 10);
}

function chamberForCategory(category: Category) {
  switch (category) {
    case 'FOOD':
      return '160';

    case 'NO_FOOD':
      return '161';

    case 'REFRIGERADO':
      return '162';

    case 'CONGELADO':
      return '163';
  }
}

async function main() {
  /*
   * =========================================================
   * LIMPIEZA
   * =========================================================
   */

  console.log('🧹 Limpiando base de datos...');

  await prisma.cNT.updateMany({
    data: {
      blockedBySessionId: null,
    },
  });

  await prisma.location.updateMany({
    data: {
      blockedOrderId: null,
      blockedBySessionId: null,
    },
  });

  /*
   * Eliminación respetando dependencias.
   */
  await prisma.pickTask.deleteMany();
  await prisma.pickingSession.deleteMany();

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  await prisma.cNTMovement.deleteMany();
  await prisma.entry.deleteMany();
  await prisma.cNTItem.deleteMany();
  await prisma.cNT.deleteMany();

  await prisma.location.deleteMany();
  await prisma.product.deleteMany();

  /*
   * =========================================================
   * UBICACIONES
   * =========================================================
   */

  console.log('📍 Creando ubicaciones...');

  const pickingLocations = makePickingLocations();

  const doorLocations = makeDoorLocations();

  const floatingLocations = makeFloatingLocations();

  const damagedLocations = [
    {
      code: '160A0910101',
      type: 'AVERIAS' as const,
      chamber: '160',
      row: '091',
      position: '01',
      height: '01',
    },

    {
      code: '160A0900101',
      type: 'AVERIAS' as const,
      chamber: '160',
      row: '090',
      position: '01',
      height: '01',
    },
  ];

  await prisma.location.createMany({
    data: [
      ...pickingLocations,
      ...doorLocations,
      ...floatingLocations,
      ...damagedLocations,
    ],
  });

  /*
   * =========================================================
   * PRODUCTOS
   * =========================================================
   */

  console.log('📦 Creando productos...');

  const productSeeds = buildProducts();

  await prisma.product.createMany({
    data: productSeeds,
  });

  /*
   * Necesitamos los IDs generados para CNTItem/Entry.
   */
  const products = await prisma.product.findMany({
    orderBy: {
      id: 'asc',
    },
  });

  /*
   * =========================================================
   * TODOS LOS CNT
   * =========================================================
   */

  console.log('📦 Creando CNT...');

  let cntNumber = 1;

  const pickingCNTSeeds: PickingCNTSeed[] = [];

  for (const category of CATEGORIES) {
    const chamber = chamberForCategory(category);

    const categoryLocations = pickingLocations
      .filter((location) => location.chamber === chamber)
      .slice(0, 12);

    for (const location of categoryLocations) {
      pickingCNTSeeds.push({
        code: `CNT-${cntNumber.toString().padStart(6, '0')}`,

        status: 'ACTIVO',

        locationCode: location.code,

        category,
      });

      cntNumber += 1;
    }
  }

  /*
   * CNT EN PUERTA
   */
  const doorCNTSeeds = doorLocations.slice(0, 4).map((location) => {
    const seed = {
      code: `CNT-${cntNumber.toString().padStart(6, '0')}`,

      status: 'ACTIVO' as const,

      locationCode: location.code,
    };

    cntNumber += 1;

    return seed;
  });

  /*
   * CNT FLOTANTES
   */
  const floatingCNTSeeds = floatingLocations.map((location) => {
    const seed = {
      code: `CNT-${cntNumber.toString().padStart(6, '0')}`,

      status: 'ACTIVO' as const,

      locationCode: location.code,
    };

    cntNumber += 1;

    return seed;
  });

  /*
   * CNT AVERÍAS
   */
  const damagedCNTSeeds = damagedLocations.map((location) => {
    const seed = {
      code: `CNT-${cntNumber.toString().padStart(6, '0')}`,

      status: 'ACTIVO' as const,

      locationCode: location.code,
    };

    cntNumber += 1;

    return seed;
  });

  await prisma.cNT.createMany({
    data: [
      ...pickingCNTSeeds.map((seed) => ({
        code: seed.code,
        status: seed.status,
        locationCode: seed.locationCode,
      })),
      ...doorCNTSeeds,
      ...floatingCNTSeeds,
      ...damagedCNTSeeds,
    ],
  });

  const pickingCNTs = await prisma.cNT.findMany({
    where: {
      code: {
        in: pickingCNTSeeds.map((seed) => seed.code),
      },
    },

    select: {
      id: true,
      code: true,
    },
  });

  const pickingCNTByCode = new Map(pickingCNTs.map((cnt) => [cnt.code, cnt]));

  const cntByCategory: Record<
    Category,
    {
      id: number;
      code: string;
    }[]
  > = {
    FOOD: [],
    NO_FOOD: [],
    REFRIGERADO: [],
    CONGELADO: [],
  };

  for (const seed of pickingCNTSeeds) {
    const cnt = pickingCNTByCode.get(seed.code);

    if (!cnt) {
      throw new Error(`CNT ${seed.code} no encontrado después del createMany.`);
    }

    cntByCategory[seed.category].push({
      id: cnt.id,
      code: cnt.code,
    });
  }

  /*
   * =========================================================
   * STOCK + INGRESOS
   * =========================================================
   */

  console.log('🧾 Creando stock e ingresos...');

  const categoryIndexes: Record<Category, number> = {
    FOOD: 0,
    NO_FOOD: 0,
    REFRIGERADO: 0,
    CONGELADO: 0,
  };

  const entrySeeds: {
    cntId: number;
    productId: number;
    lot: string;
    dueDate: Date;
    count: number;
  }[] = [];

  const cntItemSeeds: {
    cntId: number;
    productId: number;
    lot: string;
    dueDate: Date;
    count: number;
  }[] = [];

  for (const product of products) {
    const category = product.category as Category;

    const pool = cntByCategory[category];

    if (pool.length === 0) {
      throw new Error(`No hay CNT para la categoría ${category}.`);
    }

    const firstIndex = categoryIndexes[category] % pool.length;

    const secondIndex = (firstIndex + 5) % pool.length;

    categoryIndexes[category] += 1;

    const firstCnt = pool[firstIndex];

    const secondCnt = pool[secondIndex];

    const baseStock =
      category === 'FOOD'
        ? randomBetween(260, 420)
        : category === 'NO_FOOD'
          ? randomBetween(140, 230)
          : randomBetween(70, 130);

    const firstCount = Math.floor(baseStock * 0.55);

    const secondCount = baseStock - firstCount;

    const productSequence = Number(product.productId.split('-')[1]) - 1000;

    const firstDueDate = new Date(
      `${dueDateForCategory(category, productSequence)}T00:00:00`,
    );

    const secondDueDate = new Date(
      `${dueDateForCategory(category, productSequence + 3)}T00:00:00`,
    );

    const firstLot =
      `${category.slice(0, 3)}-` +
      `${productSequence.toString().padStart(3, '0')}-A`;

    const secondLot =
      `${category.slice(0, 3)}-` +
      `${productSequence.toString().padStart(3, '0')}-B`;

    /*
     * Entry = historial de ingreso.
     */
    entrySeeds.push(
      {
        cntId: firstCnt.id,
        productId: product.id,
        lot: firstLot,
        dueDate: firstDueDate,
        count: firstCount,
      },

      {
        cntId: secondCnt.id,
        productId: product.id,
        lot: secondLot,
        dueDate: secondDueDate,
        count: secondCount,
      },
    );

    /*
     * CNTItem = stock físico actual.
     */
    cntItemSeeds.push(
      {
        cntId: firstCnt.id,
        productId: product.id,
        lot: firstLot,
        dueDate: firstDueDate,
        count: firstCount,
      },

      {
        cntId: secondCnt.id,
        productId: product.id,
        lot: secondLot,
        dueDate: secondDueDate,
        count: secondCount,
      },
    );
  }

  await prisma.entry.createMany({
    data: entrySeeds,
  });

  await prisma.cNTItem.createMany({
    data: cntItemSeeds,
  });

  /*
   * =========================================================
   * RESUMEN
   * =========================================================
   */

  const [
    productCount,
    locationCount,
    cntCount,
    entryCount,
    cntItemCount,
    locationsByType,
    stockItems,
  ] = await Promise.all([
    prisma.product.count(),

    prisma.location.count(),

    prisma.cNT.count(),

    prisma.entry.count(),

    prisma.cNTItem.count(),

    prisma.location.groupBy({
      by: ['type'],

      _count: {
        _all: true,
      },
    }),

    prisma.cNTItem.findMany({
      where: {
        cnt: {
          status: 'ACTIVO',

          location: {
            type: 'PICKING',
          },
        },
      },

      select: {
        count: true,

        product: {
          select: {
            category: true,
          },
        },
      },
    }),
  ]);

  const stockByCategory: Record<Category, number> = {
    FOOD: 0,
    NO_FOOD: 0,
    REFRIGERADO: 0,
    CONGELADO: 0,
  };

  for (const item of stockItems) {
    stockByCategory[item.product.category] += item.count;
  }

  console.log('');
  console.log('✅ Seed completado');

  console.log('--------------------------------');

  console.log(`Productos:    ${productCount}`);

  console.log(`Ubicaciones:  ${locationCount}`);

  console.log(`CNT:          ${cntCount}`);

  console.log(`Ingresos:     ${entryCount}`);

  console.log(`CNT Items:    ${cntItemCount}`);

  console.log('');
  console.log('Ubicaciones por tipo:');

  for (const item of locationsByType) {
    console.log(`${item.type.padEnd(13)} ${item._count._all}`);
  }

  console.log('');

  console.log('Stock PICKING por categoría:');

  for (const category of CATEGORIES) {
    console.log(`${category.padEnd(13)} ${stockByCategory[category]} unidades`);
  }
}

main()
  .catch((error) => {
    console.error('❌ Error ejecutando seed:');

    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
