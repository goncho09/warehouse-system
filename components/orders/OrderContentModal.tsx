'use client';

import { Package, X } from 'lucide-react';

import type { Order } from '@/types/Order';

type Props = {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
};

const destinationLabels: Record<Order['destination'], string> = {
  LA_BLANQUEADA: 'La Blanqueada',
  CARRASCO_NORTE: 'Carrasco Norte',
  TRES_CRUCES: 'Tres Cruces',
  SAYAGO: 'Sayago',
  CIUDAD_DE_LA_COSTA: 'Ciudad de la Costa',
  MALVIN_NORTE: 'Malvín Norte',
  AGUADA: 'Aguada',
  BRAZO_ORIENTAL: 'Brazo Oriental',
};

export default function OrderContentModal({ order, isOpen, onClose }: Props) {
  if (!isOpen || !order) {
    return null;
  }

  const totalRequested = order.items.reduce(
    (total, item) => total + item.requestedCount,
    0,
  );

  const totalPicked = order.items.reduce(
    (total, item) => total + item.pickedCount,
    0,
  );

  const totalCancelled = order.items.reduce(
    (total, item) => total + item.cancelledCount,
    0,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* Header */}
        <div
          className="flex shrink-0 items-start justify-between gap-4 border-b px-4 py-4 sm:px-6"
          style={{
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Package
                size={20}
                style={{
                  color: 'var(--color-primary)',
                }}
              />

              <h2
                className="truncate text-lg font-semibold"
                style={{
                  color: 'var(--color-text)',
                }}
              >
                {order.stoCode}
              </h2>
            </div>

            <p
              className="mt-1 text-sm"
              style={{
                color: 'var(--color-text-secondary)',
              }}
            >
              Preparación {order.preparationCode}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="shrink-0 rounded-lg p-2 transition-colors hover:bg-(--color-surface-hover)"
            style={{
              color: 'var(--color-text-secondary)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Información */}
        <div
          className="grid shrink-0 grid-cols-1 gap-4 border-b px-4 py-4 sm:grid-cols-3 sm:px-6"
          style={{
            borderColor: 'var(--color-border)',
          }}
        >
          <div>
            <p
              className="text-xs"
              style={{
                color: 'var(--color-text-muted)',
              }}
            >
              Destino
            </p>

            <p
              className="mt-1 text-sm font-medium"
              style={{
                color: 'var(--color-text)',
              }}
            >
              {destinationLabels[order.destination]}
            </p>
          </div>

          <div>
            <p
              className="text-xs"
              style={{
                color: 'var(--color-text-muted)',
              }}
            >
              Fecha de salida
            </p>

            <p
              className="mt-1 text-sm font-medium"
              style={{
                color: 'var(--color-text)',
              }}
            >
              {new Intl.DateTimeFormat('es-UY').format(
                new Date(`${order.departureDate}T00:00:00`),
              )}
            </p>
          </div>

          <div>
            <p
              className="text-xs"
              style={{
                color: 'var(--color-text-muted)',
              }}
            >
              Estado
            </p>

            <p
              className="mt-1 text-sm font-medium"
              style={{
                color: 'var(--color-text)',
              }}
            >
              {order.status === 'PENDIENTE'
                ? 'Pendiente'
                : order.status === 'EN_PROCESO'
                  ? 'En proceso'
                  : 'Completado'}
            </p>
          </div>
        </div>

        {/* Tabla */}
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-187.5">
            <thead>
              <tr
                className="border-b text-left text-xs uppercase"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-muted)',
                }}
              >
                <th className="px-4 py-4 font-medium sm:px-6">Producto</th>

                <th className="px-4 py-4 font-medium">Descripción</th>

                <th className="px-4 py-4 text-right font-medium">Solicitado</th>

                <th className="px-4 py-4 text-right font-medium">Pickeado</th>

                <th className="px-4 py-4 text-right font-medium sm:pr-6">
                  Anulado
                </th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-0"
                  style={{
                    borderColor: 'var(--color-border-light)',
                  }}
                >
                  <td
                    className="whitespace-nowrap px-4 py-4 text-sm font-medium sm:px-6"
                    style={{
                      color: 'var(--color-text)',
                    }}
                  >
                    {item.productId}
                  </td>

                  <td
                    className="px-4 py-4 text-sm"
                    style={{
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {item.description}
                  </td>

                  <td
                    className="px-4 py-4 text-right text-sm font-medium"
                    style={{
                      color: 'var(--color-text)',
                    }}
                  >
                    {item.requestedCount}
                  </td>

                  <td
                    className="px-4 py-4 text-right text-sm"
                    style={{
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {item.pickedCount}
                  </td>

                  <td
                    className="px-4 py-4 text-right text-sm sm:pr-6"
                    style={{
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {item.cancelledCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className="grid shrink-0 grid-cols-3 gap-3 border-t px-4 py-4 sm:px-6"
          style={{
            borderColor: 'var(--color-border)',
          }}
        >
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Solicitado
            </p>

            <p
              className="mt-1 font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              {totalRequested} u.
            </p>
          </div>

          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Pickeado
            </p>

            <p
              className="mt-1 font-semibold"
              style={{ color: 'var(--color-success)' }}
            >
              {totalPicked} u.
            </p>
          </div>

          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Anulado
            </p>

            <p
              className="mt-1 font-semibold"
              style={{ color: 'var(--color-danger)' }}
            >
              {totalCancelled} u.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
