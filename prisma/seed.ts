import 'dotenv/config';

import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🧹 Limpiando base de datos...');

  // IMPORTANTE: orden por claves foráneas
  await prisma.entry.deleteMany();
  await prisma.cNTItem.deleteMany();
  await prisma.cNT.deleteMany();
  await prisma.location.deleteMany();
  await prisma.product.deleteMany();

  // =========================================================
  // UBICACIONES
  // =========================================================

  console.log('📍 Creando ubicaciones...');

  await prisma.location.createMany({
    data: [
      // -------------------------
      // PICKING - FILA 011
      // -------------------------
      {
        code: '160A0110101',
        type: 'PICKING',
        chamber: '160',
        row: '011',
        position: '01',
        height: '01',
      },
      {
        code: '160A0110102',
        type: 'PICKING',
        chamber: '160',
        row: '011',
        position: '01',
        height: '02',
      },
      {
        code: '160A0110103',
        type: 'PICKING',
        chamber: '160',
        row: '011',
        position: '01',
        height: '03',
      },
      {
        code: '160A0110104',
        type: 'PICKING',
        chamber: '160',
        row: '011',
        position: '01',
        height: '04',
      },
      {
        code: '160A0110201',
        type: 'PICKING',
        chamber: '160',
        row: '011',
        position: '02',
        height: '01',
      },
      {
        code: '160A0110202',
        type: 'PICKING',
        chamber: '160',
        row: '011',
        position: '02',
        height: '02',
      },
      {
        code: '160A0110203',
        type: 'PICKING',
        chamber: '160',
        row: '011',
        position: '02',
        height: '03',
      },
      {
        code: '160A0110204',
        type: 'PICKING',
        chamber: '160',
        row: '011',
        position: '02',
        height: '04',
      },

      // -------------------------
      // PICKING - FILA 012
      // -------------------------
      {
        code: '160A0120101',
        type: 'PICKING',
        chamber: '160',
        row: '012',
        position: '01',
        height: '01',
      },
      {
        code: '160A0120102',
        type: 'PICKING',
        chamber: '160',
        row: '012',
        position: '01',
        height: '02',
      },
      {
        code: '160A0120201',
        type: 'PICKING',
        chamber: '160',
        row: '012',
        position: '02',
        height: '01',
      },
      {
        code: '160A0120202',
        type: 'PICKING',
        chamber: '160',
        row: '012',
        position: '02',
        height: '02',
      },

      // -------------------------
      // PICKING - FILA 013
      // -------------------------
      {
        code: '160A0130101',
        type: 'PICKING',
        chamber: '160',
        row: '013',
        position: '01',
        height: '01',
      },
      {
        code: '160A0130102',
        type: 'PICKING',
        chamber: '160',
        row: '013',
        position: '01',
        height: '02',
      },
      {
        code: '160A0130201',
        type: 'PICKING',
        chamber: '160',
        row: '013',
        position: '02',
        height: '01',
      },
      {
        code: '160A0130202',
        type: 'PICKING',
        chamber: '160',
        row: '013',
        position: '02',
        height: '02',
      },

      // -------------------------
      // AVERÍAS FIJAS
      // -------------------------
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

      // -------------------------
      // EN PUERTA
      // Una por CNT
      // -------------------------
      {
        code: 'PUE000001',
        type: 'EN_PUERTA',
      },
      {
        code: 'PUE000002',
        type: 'EN_PUERTA',
      },
      {
        code: 'PUE000003',
        type: 'EN_PUERTA',
      },
      {
        code: 'PUE000004',
        type: 'EN_PUERTA',
      },

      // -------------------------
      // FLOTANTES
      // Una por CNT
      // -------------------------
      {
        code: 'Z000001',
        type: 'FLOTANTE',
      },
      {
        code: 'Z000002',
        type: 'FLOTANTE',
      },
    ],
  });

  // =========================================================
  // PRODUCTOS
  // =========================================================

  console.log('📦 Creando productos...');

  await prisma.product.createMany({
    data: [
      {
        productId: 'PRD-1001',
        barCode: '7731234567890',
        description: 'Coca-Cola 1.5L',
        category: 'FOOD',
        unitsPerDisplay: 6,
      },
      {
        productId: 'PRD-1002',
        barCode: '7731234567891',
        description: 'Red Bull 250ml',
        category: 'FOOD',
        unitsPerDisplay: 24,
      },
      {
        productId: 'PRD-1003',
        barCode: '7731234567892',
        description: 'Helado Chocolate 1L',
        category: 'CONGELADO',
        unitsPerDisplay: 6,
      },
      {
        productId: 'PRD-1004',
        barCode: '7731234567893',
        description: 'Budín Chocolate 200g',
        category: 'FOOD',
        unitsPerDisplay: 12,
      },
      {
        productId: 'PRD-1005',
        barCode: '7731234567894',
        description: 'Agua Salus 600ml',
        category: 'FOOD',
        unitsPerDisplay: 12,
      },
      {
        productId: 'PRD-1006',
        barCode: '7731234567895',
        description: 'Pepsi 500ml',
        category: 'FOOD',
        unitsPerDisplay: 12,
      },
      {
        productId: 'PRD-1007',
        barCode: '7731234567896',
        description: 'Sprite 600ml',
        category: 'FOOD',
        unitsPerDisplay: 12,
      },
      {
        productId: 'PRD-1008',
        barCode: '7731234567897',
        description: 'Papas Lays Clásicas 105g',
        category: 'FOOD',
        unitsPerDisplay: 10,
      },
      {
        productId: 'PRD-1009',
        barCode: '7731234567898',
        description: 'Galletitas Oreo 118g',
        category: 'FOOD',
        unitsPerDisplay: 12,
      },
      {
        productId: 'PRD-1010',
        barCode: '7731234567899',
        description: 'Alfajor Portezuelo Chocolate',
        category: 'FOOD',
        unitsPerDisplay: 24,
      },
      {
        productId: 'PRD-1011',
        barCode: '7731234567900',
        description: 'Leche Conaprole Entera 1L',
        category: 'REFRIGERADO',
        unitsPerDisplay: 12,
      },
      {
        productId: 'PRD-1012',
        barCode: '7731234567901',
        description: 'Yogur Conaprole Frutilla 1L',
        category: 'REFRIGERADO',
        unitsPerDisplay: 6,
      },
      {
        productId: 'PRD-1013',
        barCode: '7731234567902',
        description: 'Muzzarella 500g',
        category: 'REFRIGERADO',
        unitsPerDisplay: 8,
      },
      {
        productId: 'PRD-1014',
        barCode: '7731234567903',
        description: 'Hamburguesas Congeladas x4',
        category: 'CONGELADO',
        unitsPerDisplay: 12,
      },
      {
        productId: 'PRD-1015',
        barCode: '7731234567904',
        description: 'Papas Fritas Congeladas 1kg',
        category: 'CONGELADO',
        unitsPerDisplay: 10,
      },
      {
        productId: 'PRD-1016',
        barCode: '7731234567905',
        description: 'Pizza Congelada Muzzarella',
        category: 'CONGELADO',
        unitsPerDisplay: 8,
      },
      {
        productId: 'PRD-1017',
        barCode: '7731234567906',
        description: 'Detergente Magistral 500ml',
        category: 'NO_FOOD',
        unitsPerDisplay: 12,
      },
      {
        productId: 'PRD-1018',
        barCode: '7731234567907',
        description: 'Papel Higiénico x4',
        category: 'NO_FOOD',
        unitsPerDisplay: 12,
      },
      {
        productId: 'PRD-1019',
        barCode: '7731234567908',
        description: 'Jabón Dove 90g',
        category: 'NO_FOOD',
        unitsPerDisplay: 24,
      },
      {
        productId: 'PRD-1020',
        barCode: '7731234567909',
        description: 'Shampoo Sedal 340ml',
        category: 'NO_FOOD',
        unitsPerDisplay: 6,
      },
      {
        productId: 'PRD-1021',
        barCode: '7731234567910',
        description: 'Monster Energy 473ml',
        category: 'FOOD',
        unitsPerDisplay: 12,
      },
      {
        productId: 'PRD-1022',
        barCode: '7731234567911',
        description: 'Chocolate Milka 100g',
        category: 'FOOD',
        unitsPerDisplay: 20,
      },
      {
        productId: 'PRD-1023',
        barCode: '7731234567912',
        description: 'Cerveza Sin Alcohol 355ml',
        category: 'FOOD',
        unitsPerDisplay: 24,
      },
      {
        productId: 'PRD-1024',
        barCode: '7731234567913',
        description: 'Café Instantáneo 170g',
        category: 'FOOD',
        unitsPerDisplay: 6,
      },
    ],
  });

  // Traemos los productos para obtener sus IDs internos
  const products = await prisma.product.findMany();

  const productByCode = Object.fromEntries(
    products.map((product) => [product.productId, product]),
  );

  // =========================================================
  // CNTS
  // =========================================================

  console.log('📦 Creando CNT...');

  // EN PUERTA
  const cnt1 = await prisma.cNT.create({
    data: {
      code: 'CNT-000001',
      status: 'ACTIVO',
      locationCode: 'PUE000001',
    },
  });

  const cnt2 = await prisma.cNT.create({
    data: {
      code: 'CNT-000002',
      status: 'ACTIVO',
      locationCode: 'PUE000002',
    },
  });

  const cnt3 = await prisma.cNT.create({
    data: {
      code: 'CNT-000003',
      status: 'ACTIVO',
      locationCode: 'PUE000003',
    },
  });

  // PICKING
  const cnt4 = await prisma.cNT.create({
    data: {
      code: 'CNT-000004',
      status: 'ACTIVO',
      locationCode: '160A0110101',
    },
  });

  const cnt5 = await prisma.cNT.create({
    data: {
      code: 'CNT-000005',
      status: 'ACTIVO',
      locationCode: '160A0110204',
    },
  });

  const cnt6 = await prisma.cNT.create({
    data: {
      code: 'CNT-000006',
      status: 'ACTIVO',
      locationCode: '160A0120101',
    },
  });

  const cnt7 = await prisma.cNT.create({
    data: {
      code: 'CNT-000007',
      status: 'ACTIVO',
      locationCode: '160A0130202',
    },
  });

  // FLOTANTE
  const cnt8 = await prisma.cNT.create({
    data: {
      code: 'CNT-000008',
      status: 'ACTIVO',
      locationCode: 'Z000001',
    },
  });

  const cnt9 = await prisma.cNT.create({
    data: {
      code: 'CNT-000009',
      status: 'ACTIVO',
      locationCode: 'Z000002',
    },
  });

  // AVERÍAS
  const cnt10 = await prisma.cNT.create({
    data: {
      code: 'CNT-000010',
      status: 'ACTIVO',
      locationCode: '160A0910101',
    },
  });

  const cnt11 = await prisma.cNT.create({
    data: {
      code: 'CNT-000011',
      status: 'ACTIVO',
      locationCode: '160A0900101',
    },
  });

  // FINALIZADO
  // Lo dejamos visible para poder probar validaciones.
  const cnt12 = await prisma.cNT.create({
    data: {
      code: 'CNT-000012',
      status: 'FINALIZADO',
      locationCode: 'PUE000004',
    },
  });

  // =========================================================
  // HELPER PARA INGRESOS
  // =========================================================

  async function addEntry({
    cntId,
    productCode,
    lot,
    dueDate,
    count,
    entryDate,
  }: {
    cntId: number;
    productCode: string;
    lot: string;
    dueDate: string;
    count: number;
    entryDate?: Date;
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
        ...(entryDate ? { entryDate } : {}),
      },
    });

    await prisma.cNTItem.upsert({
      where: {
        cntId_productId: {
          cntId,
          productId: product.id,
        },
      },
      update: {
        count: {
          increment: count,
        },
      },
      create: {
        cntId,
        productId: product.id,
        lot,
        dueDate: parsedDueDate,
        count,
      },
    });
  }

  // =========================================================
  // INGRESOS + CONTENIDO DE CNT
  // =========================================================

  console.log('🧾 Creando ingresos...');

  // CNT-000001 - EN PUERTA
  await addEntry({
    cntId: cnt1.id,
    productCode: 'PRD-1001',
    lot: 'CC-260801',
    dueDate: '2027-02-15',
    count: 18,
  });

  await addEntry({
    cntId: cnt1.id,
    productCode: 'PRD-1002',
    lot: 'RB-260810',
    dueDate: '2027-01-20',
    count: 48,
  });

  await addEntry({
    cntId: cnt1.id,
    productCode: 'PRD-1004',
    lot: 'BUD-260812',
    dueDate: '2026-09-15',
    count: 24,
  });

  // Segundo ingreso SAME product/lote/vencimiento
  // Sirve para comprobar que CNTItem suma cantidades.
  await addEntry({
    cntId: cnt1.id,
    productCode: 'PRD-1004',
    lot: 'BUD-260812',
    dueDate: '2026-09-15',
    count: 6,
  });

  // CNT-000002 - EN PUERTA
  await addEntry({
    cntId: cnt2.id,
    productCode: 'PRD-1005',
    lot: 'SAL-260801',
    dueDate: '2027-03-01',
    count: 36,
  });

  await addEntry({
    cntId: cnt2.id,
    productCode: 'PRD-1008',
    lot: 'LAY-260805',
    dueDate: '2026-11-30',
    count: 20,
  });

  await addEntry({
    cntId: cnt2.id,
    productCode: 'PRD-1009',
    lot: 'ORE-260806',
    dueDate: '2026-12-15',
    count: 24,
  });

  // CNT-000003 - EN PUERTA
  await addEntry({
    cntId: cnt3.id,
    productCode: 'PRD-1011',
    lot: 'LEC-260812',
    dueDate: '2026-08-28',
    count: 24,
  });

  await addEntry({
    cntId: cnt3.id,
    productCode: 'PRD-1012',
    lot: 'YOG-260812',
    dueDate: '2026-08-23',
    count: 12,
  });

  // CNT-000004 - PICKING
  await addEntry({
    cntId: cnt4.id,
    productCode: 'PRD-1006',
    lot: 'PEP-260720',
    dueDate: '2027-01-10',
    count: 42,
  });

  await addEntry({
    cntId: cnt4.id,
    productCode: 'PRD-1007',
    lot: 'SPR-260725',
    dueDate: '2027-01-15',
    count: 30,
  });

  // CNT-000005 - PICKING
  await addEntry({
    cntId: cnt5.id,
    productCode: 'PRD-1010',
    lot: 'POR-260801',
    dueDate: '2026-11-20',
    count: 72,
  });

  await addEntry({
    cntId: cnt5.id,
    productCode: 'PRD-1022',
    lot: 'MIL-260730',
    dueDate: '2027-02-01',
    count: 40,
  });

  // CNT-000006 - PICKING
  await addEntry({
    cntId: cnt6.id,
    productCode: 'PRD-1014',
    lot: 'HAM-260710',
    dueDate: '2027-04-10',
    count: 24,
  });

  await addEntry({
    cntId: cnt6.id,
    productCode: 'PRD-1015',
    lot: 'PFC-260715',
    dueDate: '2027-05-01',
    count: 30,
  });

  // CNT-000007 - PICKING
  await addEntry({
    cntId: cnt7.id,
    productCode: 'PRD-1017',
    lot: 'MAG-260501',
    dueDate: '2028-01-01',
    count: 36,
  });

  await addEntry({
    cntId: cnt7.id,
    productCode: 'PRD-1018',
    lot: 'PH-260520',
    dueDate: '2029-06-01',
    count: 48,
  });

  // CNT-000008 - FLOTANTE
  await addEntry({
    cntId: cnt8.id,
    productCode: 'PRD-1021',
    lot: 'MON-260801',
    dueDate: '2027-03-25',
    count: 24,
  });

  // CNT-000009 - FLOTANTE
  await addEntry({
    cntId: cnt9.id,
    productCode: 'PRD-1024',
    lot: 'CAF-260601',
    dueDate: '2028-01-15',
    count: 12,
  });

  // CNT-000010 - AVERÍAS
  await addEntry({
    cntId: cnt10.id,
    productCode: 'PRD-1003',
    lot: 'HEL-260601',
    dueDate: '2026-09-01',
    count: 5,
  });

  // CNT-000011 - AVERÍAS
  await addEntry({
    cntId: cnt11.id,
    productCode: 'PRD-1019',
    lot: 'DOV-260601',
    dueDate: '2028-06-01',
    count: 7,
  });

  // =========================================================
  // RESUMEN
  // =========================================================

  const productCount = await prisma.product.count();
  const locationCount = await prisma.location.count();
  const cntCount = await prisma.cNT.count();
  const entryCount = await prisma.entry.count();
  const cntItemCount = await prisma.cNTItem.count();

  console.log('');
  console.log('✅ Seed completado');
  console.log('---------------------------');
  console.log(`Productos:   ${productCount}`);
  console.log(`Ubicaciones: ${locationCount}`);
  console.log(`CNT:         ${cntCount}`);
  console.log(`Ingresos:    ${entryCount}`);
  console.log(`CNT Items:   ${cntItemCount}`);
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
