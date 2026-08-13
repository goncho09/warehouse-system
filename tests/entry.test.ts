import { describe, expect, it } from 'vitest';

import {
  calculateTotalUnits,
  canReceiveEntry,
  isCompatibleCNTItem,
  isValidEntryCount,
  isValidEntryQuantities,
  parseDueDate,
} from '../lib/entry';

describe('Cantidad de ingreso', () => {
  it('acepta enteros mayores a 0', () => {
    expect(isValidEntryCount(1)).toBe(true);
    expect(isValidEntryCount(24)).toBe(true);
    expect(isValidEntryCount(100)).toBe(true);
  });

  it('rechaza cero', () => {
    expect(isValidEntryCount(0)).toBe(false);
  });

  it('rechaza negativos', () => {
    expect(isValidEntryCount(-1)).toBe(false);
    expect(isValidEntryCount(-100)).toBe(false);
  });

  it('rechaza decimales', () => {
    expect(isValidEntryCount(1.5)).toBe(false);
  });
});

describe('CNT para recepción', () => {
  it('acepta un CNT activo en En puerta', () => {
    expect(canReceiveEntry('ACTIVO', 'EN_PUERTA')).toBe(true);
  });

  it('rechaza un CNT finalizado', () => {
    expect(canReceiveEntry('FINALIZADO', 'EN_PUERTA')).toBe(false);
  });

  it('rechaza picking', () => {
    expect(canReceiveEntry('ACTIVO', 'PICKING')).toBe(false);
  });

  it('rechaza flotante', () => {
    expect(canReceiveEntry('ACTIVO', 'FLOTANTE')).toBe(false);
  });

  it('rechaza averías', () => {
    expect(canReceiveEntry('ACTIVO', 'AVERIAS')).toBe(false);
  });

  it('rechaza CNT sin ubicación', () => {
    expect(canReceiveEntry('ACTIVO', null)).toBe(false);
  });
});

describe('Compatibilidad de producto dentro del CNT', () => {
  const items = [
    {
      productId: 1,
      lot: 'L123',
      dueDate: new Date('2026-08-29T00:00:00'),
    },
  ];

  it('acepta un producto que todavía no existe en el CNT', () => {
    expect(isCompatibleCNTItem(items, 2, 'L999', '2026-09-10')).toBe(true);
  });

  it('acepta el mismo producto con el mismo lote y vencimiento', () => {
    expect(isCompatibleCNTItem(items, 1, 'L123', '2026-08-29')).toBe(true);
  });

  it('ignora mayúsculas y minúsculas del lote', () => {
    expect(isCompatibleCNTItem(items, 1, 'l123', '2026-08-29')).toBe(true);
  });

  it('ignora espacios al comparar lotes', () => {
    expect(isCompatibleCNTItem(items, 1, '  L123  ', '2026-08-29')).toBe(true);
  });

  it('rechaza el mismo producto con otro lote', () => {
    expect(isCompatibleCNTItem(items, 1, 'L999', '2026-08-29')).toBe(false);
  });

  it('rechaza el mismo producto y lote con otro vencimiento', () => {
    expect(isCompatibleCNTItem(items, 1, 'L123', '2026-08-30')).toBe(false);
  });
});

describe('Fecha de vencimiento', () => {
  it('convierte una fecha válida', () => {
    const result = parseDueDate('2027-12-20');

    expect(result).toBeInstanceOf(Date);
    expect(result?.getFullYear()).toBe(2027);
    expect(result?.getMonth()).toBe(11);
    expect(result?.getDate()).toBe(20);
  });

  it('rechaza una fecha inválida', () => {
    expect(parseDueDate('esto-no-es-fecha')).toBeNull();
  });

  it('rechaza una fecha vacía', () => {
    expect(parseDueDate('')).toBeNull();
  });
});

describe('Displays y unidades', () => {
  it('calcula el total correctamente', () => {
    expect(calculateTotalUnits(3, 5, 24)).toBe(77);
  });

  it('permite ingresar solamente unidades sueltas', () => {
    expect(calculateTotalUnits(0, 5, 24)).toBe(5);

    expect(isValidEntryQuantities(0, 5, 24)).toBe(true);
  });

  it('permite ingresar solamente displays', () => {
    expect(calculateTotalUnits(3, 0, 24)).toBe(72);

    expect(isValidEntryQuantities(3, 0, 24)).toBe(true);
  });

  it('rechaza cero displays y cero unidades', () => {
    expect(isValidEntryQuantities(0, 0, 24)).toBe(false);
  });

  it('rechaza cantidades negativas', () => {
    expect(isValidEntryQuantities(-1, 0, 24)).toBe(false);

    expect(isValidEntryQuantities(0, -1, 24)).toBe(false);
  });

  it('rechaza cantidades decimales', () => {
    expect(isValidEntryQuantities(1.5, 0, 24)).toBe(false);

    expect(isValidEntryQuantities(0, 2.5, 24)).toBe(false);
  });

  it('rechaza unidades sueltas iguales al tamaño del display', () => {
    expect(isValidEntryQuantities(0, 24, 24)).toBe(false);
  });

  it('rechaza unidades sueltas mayores al tamaño del display', () => {
    expect(isValidEntryQuantities(1, 30, 24)).toBe(false);
  });

  it('acepta como máximo display menos una unidad', () => {
    expect(isValidEntryQuantities(0, 23, 24)).toBe(true);
  });
});

describe('Compatibilidad de producto dentro del CNT', () => {
  const items = [
    {
      productId: 1,
      lot: 'L123',
      dueDate: new Date('2026-08-29T00:00:00'),
    },
  ];

  it('acepta un producto que todavía no existe', () => {
    expect(isCompatibleCNTItem(items, 2, 'OTRO', '2026-09-10')).toBe(true);
  });

  it('acepta mismo producto, lote y vencimiento', () => {
    expect(isCompatibleCNTItem(items, 1, 'L123', '2026-08-29')).toBe(true);
  });

  it('ignora mayúsculas y espacios del lote', () => {
    expect(isCompatibleCNTItem(items, 1, '  l123  ', '2026-08-29')).toBe(true);
  });

  it('rechaza mismo producto con otro lote', () => {
    expect(isCompatibleCNTItem(items, 1, 'L999', '2026-08-29')).toBe(false);
  });

  it('rechaza mismo producto y lote con otro vencimiento', () => {
    expect(isCompatibleCNTItem(items, 1, 'L123', '2026-08-14')).toBe(false);
  });
});
