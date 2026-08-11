import { describe, expect, it } from 'vitest';

import {
  canReceiveEntry,
  hasCompatibleLot,
  isValidEntryCount,
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

describe('Lotes de productos', () => {
  const items = [
    {
      productId: 1,
      lot: 'L123',
    },
  ];

  it('acepta un producto que todavía no existe en el CNT', () => {
    expect(hasCompatibleLot(items, 2, 'L999')).toBe(true);
  });

  it('acepta el mismo producto con el mismo lote', () => {
    expect(hasCompatibleLot(items, 1, 'L123')).toBe(true);
  });

  it('ignora mayúsculas y minúsculas del lote', () => {
    expect(hasCompatibleLot(items, 1, 'l123')).toBe(true);
  });

  it('ignora espacios al comparar lotes', () => {
    expect(hasCompatibleLot(items, 1, '  L123  ')).toBe(true);
  });

  it('rechaza el mismo producto con otro lote', () => {
    expect(hasCompatibleLot(items, 1, 'L999')).toBe(false);
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
