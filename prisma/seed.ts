import 'dotenv/config';
import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // UBICACIONES ESPECIALES

  await prisma.location.upsert({
    where: { code: 'ZEP001' },
    update: {},
    create: {
      code: 'ZEP001',
      type: 'EN_PUERTA',
    },
  });

  await prisma.location.upsert({
    where: { code: 'PUE001' },
    update: {},
    create: {
      code: 'PUE001',
      type: 'FLOTANTE',
    },
  });

  await prisma.location.upsert({
    where: { code: '160A0910101' },
    update: {},
    create: {
      code: '160A0910101',
      type: 'AVERIAS',
      chamber: '160',
      row: '091',
      position: '01',
      height: '01',
    },
  });

  // UBICACIONES DE PICKING

  await prisma.location.upsert({
    where: { code: '160A0110104' },
    update: {},
    create: {
      code: '160A0110104',
      type: 'PICKING',
      chamber: '160',
      row: '011',
      position: '01',
      height: '04',
    },
  });

  await prisma.location.upsert({
    where: { code: '160A0110204' },
    update: {},
    create: {
      code: '160A0110204',
      type: 'PICKING',
      chamber: '160',
      row: '011',
      position: '02',
      height: '04',
    },
  });

  // PRODUCTOS

  await prisma.product.upsert({
    where: { productId: 'PRD-1001' },
    update: {},
    create: {
      productId: 'PRD-1001',
      barCode: '7731234567890',
      description: 'Coca-Cola 1.5L',
      category: 'FOOD',
      unitsPerDisplay: 6,
    },
  });

  await prisma.product.upsert({
    where: { productId: 'PRD-1002' },
    update: {},
    create: {
      productId: 'PRD-1002',
      barCode: '7731234567891',
      description: 'Red Bull 250ml',
      category: 'FOOD',
      unitsPerDisplay: 24,
    },
  });

  await prisma.product.upsert({
    where: { productId: 'PRD-1003' },
    update: {},
    create: {
      productId: 'PRD-1003',
      barCode: '7731234567892',
      description: 'Helado Chocolate 1L',
      category: 'CONGELADO',
      unitsPerDisplay: 6,
    },
  });

  console.log('Seed completado');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
