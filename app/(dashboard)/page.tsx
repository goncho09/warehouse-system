export const dynamic = 'force-dynamic';

import { Package, Boxes, Container, DoorOpen, ArrowRight } from 'lucide-react';

import { prisma } from '@/lib/prisma';

export default async function Home() {
  const [
    productCount,
    activeCNTCount,
    cntInDoorCount,
    stockAggregate,
    recentEntries,
    recentMovements,
  ] = await Promise.all([
    prisma.product.count(),

    prisma.cNT.count({
      where: {
        status: 'ACTIVO',
      },
    }),

    prisma.cNT.count({
      where: {
        status: 'ACTIVO',
        location: {
          type: 'EN_PUERTA',
        },
      },
    }),

    prisma.cNTItem.aggregate({
      _sum: {
        count: true,
      },
    }),

    prisma.entry.findMany({
      take: 5,
      orderBy: {
        entryDate: 'desc',
      },
      include: {
        product: true,
        cnt: true,
      },
    }),

    prisma.cNTMovement.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        cnt: true,
      },
    }),
  ]);

  const totalStock = stockAggregate._sum.count ?? 0;

  const stats = [
    {
      title: 'Productos',
      value: productCount.toLocaleString('es-UY'),
      description: 'Productos registrados',
      icon: Package,
      color: 'var(--color-primary)',
      background: 'var(--color-primary-light)',
    },
    {
      title: 'Stock total',
      value: totalStock.toLocaleString('es-UY'),
      description: 'Unidades almacenadas',
      icon: Boxes,
      color: 'var(--color-primary)',
      background: 'var(--color-primary-light)',
    },
    {
      title: 'CNT activos',
      value: activeCNTCount.toLocaleString('es-UY'),
      description: 'Contenedores activos',
      icon: Container,
      color: 'var(--color-success)',
      background: 'var(--color-success-light)',
    },
    {
      title: 'CNT en puerta',
      value: cntInDoorCount.toLocaleString('es-UY'),
      description: 'Pendientes de ubicar',
      icon: DoorOpen,
      color: 'var(--color-warning)',
      background: 'var(--color-warning-light)',
    },
  ];

  return (
    <div className="min-w-0 p-4 sm:p-6 md:p-8">
      <section className="mb-8">
        <p
          className="mb-1 text-sm font-medium"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Resumen del depósito
        </p>

        <h2
          className="text-2xl font-semibold"
          style={{ color: 'var(--color-text)' }}
        >
          Dashboard
        </h2>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border p-5"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: stat.background,
                  color: stat.color,
                }}
              >
                <Icon size={20} strokeWidth={1.8} />
              </div>

              <p
                className="mb-1 text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {stat.title}
              </p>

              <p
                className="text-2xl font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                {stat.value}
              </p>

              <p
                className="mt-2 text-xs"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {stat.description}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Últimos ingresos */}
        <div
          className="rounded-xl border"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div
            className="border-b px-4 py-5 sm:px-6"
            style={{
              borderColor: 'var(--color-border)',
            }}
          >
            <h3
              className="font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              Últimos ingresos
            </h3>

            <p
              className="mt-1 text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Mercadería recibida recientemente
            </p>
          </div>

          <div className="px-4 sm:px-6">
            {recentEntries.length === 0 ? (
              <p
                className="py-8 text-center text-sm"
                style={{
                  color: 'var(--color-text-secondary)',
                }}
              >
                No hay ingresos registrados.
              </p>
            ) : (
              recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col gap-2 border-b py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                  style={{
                    borderColor: 'var(--color-border-light)',
                  }}
                >
                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-medium"
                      style={{
                        color: 'var(--color-text)',
                      }}
                    >
                      {entry.product.description}
                    </p>

                    <p
                      className="mt-1 text-xs"
                      style={{
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {entry.cnt.code} · Lote {entry.lot}
                    </p>
                  </div>

                  <div className="shrink-0 text-left sm:text-right">
                    <p
                      className="text-sm font-medium"
                      style={{
                        color: 'var(--color-text)',
                      }}
                    >
                      {entry.count} unidades
                    </p>

                    <p
                      className="mt-1 text-xs"
                      style={{
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {new Intl.DateTimeFormat('es-UY', {
                        timeZone: 'America/Montevideo',
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      }).format(entry.entryDate)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Últimos movimientos */}
        <div
          className="rounded-xl border"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div
            className="border-b px-4 py-5 sm:px-6"
            style={{
              borderColor: 'var(--color-border)',
            }}
          >
            <h3
              className="font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              Últimos movimientos
            </h3>

            <p
              className="mt-1 text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Cambios recientes de ubicación
            </p>
          </div>

          <div className="px-4 sm:px-6">
            {recentMovements.length === 0 ? (
              <p
                className="py-8 text-center text-sm"
                style={{
                  color: 'var(--color-text-secondary)',
                }}
              >
                No hay movimientos registrados.
              </p>
            ) : (
              recentMovements.map((movement) => (
                <div
                  key={movement.id}
                  className="border-b py-4 last:border-0"
                  style={{
                    borderColor: 'var(--color-border-light)',
                  }}
                >
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: 'var(--color-text)',
                    }}
                  >
                    {movement.cnt.code}
                  </p>

                  <div
                    className="mt-2 flex flex-wrap items-center gap-2 text-sm"
                    style={{
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <span>{movement.fromLocationCode ?? 'Sin ubicación'}</span>

                    <ArrowRight size={15} />

                    <span
                      style={{
                        color: 'var(--color-primary)',
                      }}
                    >
                      {movement.toLocationCode}
                    </span>
                  </div>

                  <p
                    className="mt-2 text-xs"
                    style={{
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {new Intl.DateTimeFormat('es-UY', {
                      timeZone: 'America/Montevideo',
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(movement.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
