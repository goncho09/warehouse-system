import { describe, expect, it } from 'vitest';

import { getTotalStock, groupStockByLocation } from '../lib/stock';

describe('Agrupamiento de stock', () => {
  it('mantiene productos en ubicaciones diferentes separados', () => {
    const result = groupStockByLocation([
      {
        id: 1,
        productId: 'PRD-1001',
        locationCode: '160A0110104',
        locationType: 'PICKING',
        count: 10,
        dueDate: '2026-12-20',
      },
      {
        id: 2,
        productId: 'PRD-1001',
        locationCode: '160A0110204',
        locationType: 'PICKING',
        count: 20,
        dueDate: '2026-12-20',
      },
    ]);

    expect(result).toHaveLength(2);
  });

  it('suma el mismo producto en la misma ubicación', () => {
    const result = groupStockByLocation([
      {
        id: 1,
        productId: 'PRD-1001',
        locationCode: '160A0110104',
        locationType: 'PICKING',
        count: 10,
        dueDate: '2026-12-20',
      },
      {
        id: 2,
        productId: 'PRD-1001',
        locationCode: '160A0110104',
        locationType: 'PICKING',
        count: 20,
        dueDate: '2026-12-20',
      },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].count).toBe(30);
  });

  it('no mezcla productos diferentes', () => {
    const result = groupStockByLocation([
      {
        id: 1,
        productId: 'PRD-1001',
        locationCode: '160A0110104',
        locationType: 'PICKING',
        count: 10,
        dueDate: '2026-12-20',
      },
      {
        id: 2,
        productId: 'PRD-1002',
        locationCode: '160A0110104',
        locationType: 'PICKING',
        count: 20,
        dueDate: '2026-12-20',
      },
    ]);

    expect(result).toHaveLength(2);
  });
});

describe('Total de stock', () => {
  it('suma todas las cantidades', () => {
    const total = getTotalStock([
      {
        id: 1,
        productId: 'PRD-1001',
        locationCode: 'PUE000001',
        locationType: 'EN_PUERTA',
        count: 24,
        dueDate: '2026-12-20',
      },
      {
        id: 2,
        productId: 'PRD-1001',
        locationCode: '160A0110104',
        locationType: 'PICKING',
        count: 12,
        dueDate: '2026-12-20',
      },
    ]);

    expect(total).toBe(36);
  });

  it('devuelve 0 si no hay stock', () => {
    expect(getTotalStock([])).toBe(0);
  });
});
