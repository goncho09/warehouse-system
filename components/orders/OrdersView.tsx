'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';

import { loadDailyOrders } from '@/app/actions/orders';
import type { Order } from '@/types/Order';

import OrderContentModal from './OrderContentModal';

type Props = {
  orders: Order[];
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

export default function OrdersView({ orders }: Props) {
  const router = useRouter();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [departureDate, setDepartureDate] = useState(
    tomorrow.toISOString().slice(0, 10),
  );

  const [isLoading, setIsLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  async function handleLoadOrders() {
    try {
      setIsLoading(true);

      const result = await loadDailyOrders(departureDate);

      if (result.createdCount === 0) {
        toast.info('Pedidos ya cargados', {
          description:
            'Todas las subcentrales ya tienen pedido para esa fecha.',
        });

        return;
      }

      toast.success('Pedidos cargados', {
        description: `Se generaron ${result.createdCount} pedidos.`,
      });

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los pedidos.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col p-4 sm:p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p
            className="mb-1 text-sm"
            style={{
              color: 'var(--color-text-secondary)',
            }}
          >
            Preparación de pedidos
          </p>

          <h1
            className="text-2xl font-semibold"
            style={{
              color: 'var(--color-text)',
            }}
          >
            Pedidos
          </h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div>
            <label
              htmlFor="departureDate"
              className="mb-1 block text-xs font-medium"
              style={{
                color: 'var(--color-text-secondary)',
              }}
            >
              Fecha de salida
            </label>

            <div className="relative">
              <CalendarDays
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{
                  color: 'var(--color-text-muted)',
                }}
              />

              <input
                id="departureDate"
                type="date"
                value={departureDate}
                onChange={(event) => setDepartureDate(event.target.value)}
                className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleLoadOrders}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 self-end rounded-lg px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              backgroundColor: 'var(--color-primary)',
            }}
          >
            <Download size={18} />

            {isLoading ? 'Cargando...' : 'Cargar pedidos del día'}
          </button>
        </div>
      </div>

      <div
        className="min-h-0 flex-1 overflow-auto rounded-xl border"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <table className="w-full min-w-max">
          <thead>
            <tr
              className="border-b text-left text-xs uppercase"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
            >
              <th className="px-4 py-4 font-medium">STO</th>
              <th className="px-4 py-4 font-medium">Preparación</th>
              <th className="px-4 py-4 font-medium">Destino</th>
              <th className="px-4 py-4 font-medium">Categoría</th>
              <th className="px-4 py-4 font-medium">Unidades</th>
              <th className="px-4 py-4 font-medium">Estado</th>
              <th className="px-4 py-4 font-medium">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b last:border-0"
                style={{
                  borderColor: 'var(--color-border-light)',
                }}
              >
                <td
                  className="px-4 py-4 text-sm font-medium"
                  style={{
                    color: 'var(--color-text)',
                  }}
                >
                  {order.stoCode}
                </td>

                <td
                  className="px-4 py-4 text-sm"
                  style={{
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {order.preparationCode}
                </td>

                <td
                  className="px-4 py-4 text-sm"
                  style={{
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {destinationLabels[order.destination]}
                </td>

                <td
                  className="px-4 py-4 text-sm"
                  style={{
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {order.category === 'FOOD'
                    ? 'Food'
                    : order.category === 'NO_FOOD'
                      ? 'No Food'
                      : order.category === 'CONGELADO'
                        ? 'Congelado'
                        : 'Refrigerado'}
                </td>

                <td
                  className="px-4 py-4 text-sm font-medium"
                  style={{
                    color: 'var(--color-text)',
                  }}
                >
                  {order.items.reduce(
                    (total, item) => total + item.requestedCount,
                    0,
                  )}
                </td>

                <td className="px-4 py-4">
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: 'var(--color-warning-light)',
                      color: 'var(--color-warning)',
                    }}
                  >
                    Pendiente
                  </span>
                </td>

                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    aria-label={`Ver pedido ${order.stoCode}`}
                    title="Ver contenido"
                    className="rounded-lg p-2 transition-colors hover:bg-(--color-primary-light)"
                    style={{
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div
            className="p-10 text-center text-sm"
            style={{
              color: 'var(--color-text-secondary)',
            }}
          >
            Todavía no hay pedidos cargados.
          </div>
        )}
      </div>

      <OrderContentModal
        order={selectedOrder}
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
