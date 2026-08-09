import type { CNT } from '../types/CNT';

export const cnts: CNT[] = [
  {
    id: 'CNT-10001',
    status: 'ACTIVO',
    locationCode: '160A0110104',
    locationType: 'PICKING',
    items: [
      {
        productId: '1',
        lot: 'L260801',
        dueDate: '2026-12-20',
        count: 24,
      },
      {
        productId: '2',
        lot: 'L260715',
        dueDate: '2027-01-10',
        count: 12,
      },
    ],
  },

  {
    id: 'CNT-10002',
    status: 'ACTIVO',
    locationCode: 'ZEP001',
    locationType: 'EN_PUERTA',
    items: [
      {
        productId: '1',
        lot: 'L260802',
        dueDate: '2027-02-15',
        count: 48,
      },
    ],
  },

  {
    id: 'CNT-10003',
    status: 'ACTIVO',
    locationCode: 'ZFL001',
    locationType: 'FLOTANTE',
    items: [
      {
        productId: '3',
        lot: 'L260721',
        dueDate: '2027-03-01',
        count: 18,
      },
    ],
  },

  {
    id: 'CNT-10004',
    status: 'FINALIZADO',
    locationCode: '160A0120102',
    locationType: 'PICKING',
    items: [],
  },
];
