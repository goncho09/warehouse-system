import { prisma } from '@/lib/prisma';

import { formatCNTCode, formatEntryLocationCode } from '@/lib/cnt';

export async function createCNTRecord() {
  return prisma.$transaction(async (tx) => {
    const created = await tx.cNT.create({
      data: {
        code: `TEMP-${crypto.randomUUID()}`,
        status: 'ACTIVO',
      },
    });

    const cntCode = formatCNTCode(created.id);
    const locationCode = formatEntryLocationCode(created.id);

    await tx.location.create({
      data: {
        code: locationCode,
        type: 'EN_PUERTA',
      },
    });

    return tx.cNT.update({
      where: {
        id: created.id,
      },
      data: {
        code: cntCode,
        locationCode,
      },
      include: {
        location: true,
        items: true,
      },
    });
  });
}

export async function moveCNTLocation(
  cntCode: string,
  targetLocationCode: string,
) {
  const cnt = await prisma.cNT.findUnique({
    where: {
      code: cntCode,
    },
    include: {
      location: true,
    },
  });

  if (!cnt) {
    throw new Error('El CNT no existe.');
  }

  if (cnt.status !== 'ACTIVO') {
    throw new Error('El CNT está finalizado.');
  }

  if (!cnt.location) {
    throw new Error('El CNT no tiene una ubicación asignada.');
  }

  const targetLocation = await prisma.location.findUnique({
    where: {
      code: targetLocationCode,
    },
  });

  if (!targetLocation) {
    throw new Error('La ubicación destino no existe.');
  }

  if (targetLocation.type !== 'PICKING') {
    throw new Error('La ubicación destino no es de picking.');
  }

  const oldLocation = cnt.location;

  return prisma.$transaction(async (tx) => {
    const updatedCNT = await tx.cNT.update({
      where: {
        id: cnt.id,
      },
      data: {
        locationCode: targetLocation.code,
      },
      include: {
        location: true,
        items: true,
        movements: true,
      },
    });

    const movement = await tx.cNTMovement.create({
      data: {
        cntId: cnt.id,
        fromLocationCode: oldLocation.code,
        toLocationCode: targetLocation.code,
      },
    });

    if (oldLocation.type === 'EN_PUERTA' || oldLocation.type === 'FLOTANTE') {
      await tx.location.delete({
        where: {
          code: oldLocation.code,
        },
      });
    }

    return {
      cnt: updatedCNT,
      movement,
    };
  });
}
