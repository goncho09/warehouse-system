import { describe, expect, it } from 'vitest';

import {
  isValidUnitsPerDisplay,
  normalizeProductText,
  validateProductFields,
} from '../lib/product';

describe('Producto - normalización', () => {
  it('elimina espacios al inicio y al final', () => {
    expect(normalizeProductText('  PRD-1001  ')).toBe('PRD-1001');
  });
});

describe('Producto - unidades por display', () => {
  it('acepta enteros mayores a cero', () => {
    expect(isValidUnitsPerDisplay(1)).toBe(true);
    expect(isValidUnitsPerDisplay(6)).toBe(true);
    expect(isValidUnitsPerDisplay(24)).toBe(true);
  });

  it('rechaza cero', () => {
    expect(isValidUnitsPerDisplay(0)).toBe(false);
  });

  it('rechaza negativos', () => {
    expect(isValidUnitsPerDisplay(-1)).toBe(false);
  });

  it('rechaza decimales', () => {
    expect(isValidUnitsPerDisplay(1.5)).toBe(false);
  });
});

describe('Producto - campos obligatorios', () => {
  it('valida un producto correcto', () => {
    const result = validateProductFields({
      productId: '  PRD-1001 ',
      barCode: ' 7731234567890 ',
      description: ' Coca-Cola 1.5L ',
      unitsPerDisplay: 6,
    });

    expect(result).toEqual({
      productId: 'PRD-1001',
      barCode: '7731234567890',
      description: 'Coca-Cola 1.5L',
      unitsPerDisplay: 6,
    });
  });

  it('rechaza productId vacío', () => {
    expect(() =>
      validateProductFields({
        productId: '   ',
        barCode: '7731234567890',
        description: 'Producto',
        unitsPerDisplay: 6,
      }),
    ).toThrow('El código del producto es obligatorio.');
  });

  it('rechaza código de barras vacío', () => {
    expect(() =>
      validateProductFields({
        productId: 'PRD-1001',
        barCode: '   ',
        description: 'Producto',
        unitsPerDisplay: 6,
      }),
    ).toThrow('El código de barras es obligatorio.');
  });

  it('rechaza descripción vacía', () => {
    expect(() =>
      validateProductFields({
        productId: 'PRD-1001',
        barCode: '7731234567890',
        description: '   ',
        unitsPerDisplay: 6,
      }),
    ).toThrow('La descripción es obligatoria.');
  });

  it('rechaza display inválido', () => {
    expect(() =>
      validateProductFields({
        productId: 'PRD-1001',
        barCode: '7731234567890',
        description: 'Producto',
        unitsPerDisplay: 0,
      }),
    ).toThrow('Las unidades por display deben ser mayores a 0.');
  });
});
