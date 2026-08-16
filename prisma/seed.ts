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
    const n = index + 1;

    return {
      productId: `PRD-${(1000 + n).toString()}`,
      barCode: `77312345${(67000 + n).toString().padStart(5, '0')}`,
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

function categoryForChamber(chamber: string): Category {
  switch (chamber) {
    case '160':
      return 'FOOD';
    case '161':
      return 'NO_FOOD';
    case '162':
      return 'REFRIGERADO';
    default:
      return 'CONGELADO';
  }
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

async function main() {
  console.log('🧹 Limpiando base de datos...');

  // Orden por claves foráneas.
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cNTMovement.deleteMany();
  await prisma.entry.deleteMany();
  await prisma.cNTItem.deleteMany();
  await prisma.cNT.deleteMany();
  await prisma.location.deleteMany();
  await prisma.product.deleteMany();

  console.log('📍 Creando ubicaciones...');

  const pickingLocations = makePickingLocations();

  await prisma.location.createMany({
    data: [
      ...pickingLocations,
      {
        code: '160A0910101',
        type: 'AVERIAS',
        chamber: '160',
        row: '091',
        position: '01',
        height: '01',
      },
      {
        code: '160A0900101',
        type: 'AVERIAS',
        chamber: '160',
        row: '090',
        position: '01',
        height: '01',
      },
      ...Array.from({ length: 8 }, (_, index) => ({
        code: `PUE${(index + 1).toString().padStart(6, '0')}`,
        type: 'EN_PUERTA' as const,
      })),
      ...Array.from({ length: 2 }, (_, index) => ({
        code: `Z${(index + 1).toString().padStart(6, '0')}`,
        type: 'FLOTANTE' as const,
      })),
    ],
  });

  console.log('📦 Creando productos...');

  const productSeeds = buildProducts();

  await prisma.product.createMany({
    data: productSeeds,
  });

  const products = await prisma.product.findMany();
  const productByCode = Object.fromEntries(
    products.map((product) => [product.productId, product]),
  );

  console.log('📦 Creando CNT de picking...');

  // Usamos 12 CNT por categoría. Hay muchas ubicaciones libres para poder moverlos.
  const cntByCategory: Record<Category, { id: number; code: string }[]> = {
    FOOD: [],
    NO_FOOD: [],
    REFRIGERADO: [],
    CONGELADO: [],
  };

  let cntNumber = 1;

  for (const category of [
    'FOOD',
    'NO_FOOD',
    'REFRIGERADO',
    'CONGELADO',
  ] as const) {
    const chamber =
      category === 'FOOD'
        ? '160'
        : category === 'NO_FOOD'
          ? '161'
          : category === 'REFRIGERADO'
            ? '162'
            : '163';

    const categoryLocations = pickingLocations
      .filter((location) => location.chamber === chamber)
      .slice(0, 12);

    for (const location of categoryLocations) {
      const code = `CNT-${cntNumber.toString().padStart(6, '0')}`;

      const cnt = await prisma.cNT.create({
        data: {
          code,
          status: 'ACTIVO',
          locationCode: location.code,
        },
      });

      cntByCategory[category].push({
        id: cnt.id,
        code: cnt.code,
      });

      cntNumber += 1;
    }
  }

  console.log('🚪 Creando CNT en puerta...');

  for (let i = 0; i < 4; i += 1) {
    await prisma.cNT.create({
      data: {
        code: `CNT-${cntNumber.toString().padStart(6, '0')}`,
        status: 'ACTIVO',
        locationCode: `PUE${(i + 1).toString().padStart(6, '0')}`,
      },
    });

    cntNumber += 1;
  }

  console.log('🧾 Creando stock e ingresos...');

  async function addEntry({
    cntId,
    productCode,
    lot,
    dueDate,
    count,
  }: {
    cntId: number;
    productCode: string;
    lot: string;
    dueDate: string;
    count: number;
  }) {
    const product = productByCode[productCode];

    if (!product) {
      throw new Error(`Producto ${productCode} no encontrado.`);
    }

    const parsedDueDate = new Date(`${dueDate}T00:00:00`);

    await prisma.entry.create({
      data: {
        cntId,
        productId: product.id,
        lot,
        dueDate: parsedDueDate,
        count,
      },
    });

    await prisma.cNTItem.create({
      data: {
        cntId,
        productId: product.id,
        lot,
        dueDate: parsedDueDate,
        count,
      },
    });
  }

  const categoryIndexes: Record<Category, number> = {
    FOOD: 0,
    NO_FOOD: 0,
    REFRIGERADO: 0,
    CONGELADO: 0,
  };

  for (const product of products) {
    const category = product.category as Category;
    const pool = cntByCategory[category];

    // Cada producto existe en 2 CNT distintos para que después el picking
    // pueda completar desde más de una ubicación y aplicar FEFO.
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

    await addEntry({
      cntId: firstCnt.id,
      productCode: product.productId,
      lot: `${category.slice(0, 3)}-${productSequence.toString().padStart(3, '0')}-A`,
      dueDate: dueDateForCategory(category, productSequence),
      count: firstCount,
    });

    // Segundo CNT con vencimiento un poco posterior.
    await addEntry({
      cntId: secondCnt.id,
      productCode: product.productId,
      lot: `${category.slice(0, 3)}-${productSequence.toString().padStart(3, '0')}-B`,
      dueDate: dueDateForCategory(category, productSequence + 3),
      count: secondCount,
    });
  }

  const productCount = await prisma.product.count();
  const locationCount = await prisma.location.count();
  const cntCount = await prisma.cNT.count();
  const entryCount = await prisma.entry.count();
  const cntItemCount = await prisma.cNTItem.count();

  const stockByCategory = await Promise.all(
    (['FOOD', 'NO_FOOD', 'REFRIGERADO', 'CONGELADO'] as const).map(
      async (category) => {
        const items = await prisma.cNTItem.findMany({
          where: {
            product: {
              category,
            },
            cnt: {
              status: 'ACTIVO',
              location: {
                type: 'PICKING',
              },
            },
          },
          select: {
            count: true,
          },
        });

        return {
          category,
          stock: items.reduce((total, item) => total + item.count, 0),
        };
      },
    ),
  );

  console.log('');
  console.log('✅ Seed completado');
  console.log('--------------------------------');
  console.log(`Productos:   ${productCount}`);
  console.log(`Ubicaciones: ${locationCount}`);
  console.log(`CNT:         ${cntCount}`);
  console.log(`Ingresos:    ${entryCount}`);
  console.log(`CNT Items:   ${cntItemCount}`);
  console.log('');
  console.log('Stock PICKING por categoría:');

  for (const item of stockByCategory) {
    console.log(`${item.category.padEnd(13)} ${item.stock} unidades`);
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
