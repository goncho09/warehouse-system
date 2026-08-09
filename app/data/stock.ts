import type { StockRecord } from '@/types/Stock';

export const stock: StockRecord[] = [
  {
    id: 1,
    productId: 1,
    locationCode: '160A0110104',
    locationType: 'PICKING',
    count: 72,
    dueDate: '2026-10-20',
  },
  {
    id: 2,
    productId: 1,
    locationCode: '160A0120202',
    locationType: 'PICKING',
    count: 48,
    dueDate: '2026-10-20',
  },
  {
    id: 3,
    productId: 1,
    locationCode: 'ZEP001',
    locationType: 'EN_PUERTA',
    count: 24,
    dueDate: '2027-01-15',
  },

  {
    id: 4,
    productId: 2,
    locationCode: '160A0130102',
    locationType: 'PICKING',
    count: 48,
    dueDate: '2026-12-10',
  },
  {
    id: 5,
    productId: 2,
    locationCode: 'ZAV001',
    locationType: 'AVERIAS',
    count: 6,
    dueDate: '2026-12-10',
  },
];
