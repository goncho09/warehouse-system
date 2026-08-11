import { afterEach, describe, expect, it } from 'vitest';

import { prisma } from '@/lib/prisma';
import { createCNTRecord } from '@/services/cnt';

const createdCNTIds: number[] = [];
const createdLocations: string[] = [];

afterEach(async () => {
  if (createdCNTIds.length > 0) {
    await prisma.entry.deleteMany({
      where: {
        cntId: {
          in: createdCNTIds,
        },
      },
    });

    await prisma.cNTItem.deleteMany({
      where: {
        cntId: {
          in: createdCNTIds,
        },
      },
    });

    await prisma.cNT.deleteMany({
      where: {
        id: {
          in: createdCNTIds,
        },
      },
    });
  }

  if (createdLocations.length > 0) {
    await prisma.location.deleteMany({
      where: {
        code: {
          in: createdLocations,
        },
      },
    });
  }

  createdCNTIds.length = 0;
  createdLocations.length = 0;
});

describe('createCNTRecord', () => {
  it('crea un CNT activo en una ubicación En puerta', async () => {
    const cnt = await createCNTRecord();

    createdCNTIds.push(cnt.id);

    if (cnt.locationCode) {
      createdLocations.push(cnt.locationCode);
    }

    expect(cnt.code).toBe(`CNT-${cnt.id.toString().padStart(6, '0')}`);

    expect(cnt.status).toBe('ACTIVO');

    expect(cnt.locationCode).toBe(`PUE${cnt.id.toString().padStart(6, '0')}`);

    expect(cnt.location).not.toBeNull();
    expect(cnt.location?.type).toBe('EN_PUERTA');
    expect(cnt.items).toHaveLength(0);
  });

  it('queda realmente guardado en la base', async () => {
    const cnt = await createCNTRecord();

    createdCNTIds.push(cnt.id);

    if (cnt.locationCode) {
      createdLocations.push(cnt.locationCode);
    }

    const saved = await prisma.cNT.findUnique({
      where: {
        id: cnt.id,
      },
      include: {
        location: true,
      },
    });

    expect(saved).not.toBeNull();
    expect(saved?.code).toBe(cnt.code);
    expect(saved?.location?.type).toBe('EN_PUERTA');
  });
});
