import type { InventoryRecord } from '@/types/Inventory';

export const inventory: InventoryRecord[] = [
  {
    id: 1,
    productId: 1,
    ubicationCode: '160A0110104',
    ubicationType: 'PICKING',
    count: 72,
    dueDate: '2026-10-20',
  },
  {
    id: 2,
    productId: 1,
    ubicationCode: '160A0120202',
    ubicationType: 'PICKING',
    count: 48,
    dueDate: '2026-10-20',
  },
  {
    id: 3,
    productId: 1,
    ubicationCode: 'ZEP001',
    ubicationType: 'EN_PUERTA',
    count: 24,
    dueDate: '2027-01-15',
  },

  {
    id: 4,
    productId: 2,
    ubicationCode: '160A0130102',
    ubicationType: 'PICKING',
    count: 48,
    dueDate: '2026-12-10',
  },
  {
    id: 5,
    productId: 2,
    ubicationCode: 'ZAV001',
    ubicationType: 'AVERIAS',
    count: 6,
    dueDate: '2026-12-10',
  },
];
