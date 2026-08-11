import { describe, expect, it } from 'vitest';

import {
  formatCNTCode,
  formatEntryLocationCode,
  formatFloatingLocationCode,
} from '../lib/cnt';

describe('Códigos CNT', () => {
  it('genera códigos CNT correctamente', () => {
    expect(formatCNTCode(1)).toBe('CNT-000001');
    expect(formatCNTCode(25)).toBe('CNT-000025');
    expect(formatCNTCode(999)).toBe('CNT-000999');
    expect(formatCNTCode(1000)).toBe('CNT-001000');
  });

  it('genera ubicación En puerta', () => {
    expect(formatEntryLocationCode(1)).toBe('PUE000001');
    expect(formatEntryLocationCode(25)).toBe('PUE000025');
  });

  it('genera ubicación flotante', () => {
    expect(formatFloatingLocationCode(1)).toBe('Z000001');
    expect(formatFloatingLocationCode(25)).toBe('Z000025');
  });
});
