'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

import PageHeader from '../layout/ui/PageHeader';
import OrdersTable from './OrdersTable';
import OrderContentModal from './OrderContentModal';

import { loadDailyOrders } from '@/app/actions/orders';

import type { Order } from '@/types/Order';

type Props = {
  orders: Order[];
};

export default function OrdersView({ orders }: Props) {
  const router = useRouter();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const departureDate = tomorrow.toISOString().slice(0, 10);

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
      <PageHeader
        eyebrow="Preparación de pedidos"
        title="Pedidos"
        actions={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
            <button
              type="button"
              onClick={handleLoadOrders}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm sm:w-auto"
              style={{
                backgroundColor: 'var(--color-primary)',
              }}
            >
              <Download size={18} />

              {isLoading ? 'Cargando...' : 'Cargar pedidos del día'}
            </button>
          </div>
        }
      />

      <div className="min-h-0 flex-1">
        <OrdersTable orders={orders} onViewOrder={setSelectedOrder} />
      </div>

      <OrderContentModal
        order={selectedOrder}
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
