'use client';

import { Package } from 'lucide-react';

import Modal from '../layout/ui/Modal';
import OrderItemsTable from './OrderItemsTable';

import { formatDate } from '@/lib/date';

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

const categoryLabels: Record<Order['category'], string> = {
  FOOD: 'Food',
  NO_FOOD: 'No Food',
  CONGELADO: 'Congelado',
  REFRIGERADO: 'Refrigerado',
};

const statusLabels: Record<Order['status'], string> = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En proceso',
  COMPLETADO: 'Completado',
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="5xl"
      title={
        <span className="flex items-center gap-2">
          <Package
            size={20}
            style={{
              color: 'var(--color-primary)',
            }}
          />

          {order.stoCode}
        </span>
      }
      subtitle={`Preparación ${order.preparationCode}`}
      footer={
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p
              className="text-xs"
              style={{
                color: 'var(--color-text-muted)',
              }}
            >
              Solicitado
            </p>

            <p
              className="mt-1 font-semibold"
              style={{
                color: 'var(--color-text)',
              }}
            >
              {totalRequested.toLocaleString('es-UY')} u.
            </p>
          </div>

          <div>
            <p
              className="text-xs"
              style={{
                color: 'var(--color-text-muted)',
              }}
            >
              Pickeado
            </p>

            <p
              className="mt-1 font-semibold"
              style={{
                color: 'var(--color-success)',
              }}
            >
              {totalPicked.toLocaleString('es-UY')} u.
            </p>
          </div>

          <div>
            <p
              className="text-xs"
              style={{
                color: 'var(--color-text-muted)',
              }}
            >
              Anulado
            </p>

            <p
              className="mt-1 font-semibold"
              style={{
                color: 'var(--color-danger)',
              }}
            >
              {totalCancelled.toLocaleString('es-UY')} u.
            </p>
          </div>
        </div>
      }
    >
      <div
        className="grid shrink-0 grid-cols-1 gap-4 border-b px-4 py-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4"
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
            Categoría
          </p>

          <p
            className="mt-1 text-sm font-medium"
            style={{
              color: 'var(--color-text)',
            }}
          >
            {categoryLabels[order.category]}
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
            {formatDate(order.departureDate)}
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
            {statusLabels[order.status]}
          </p>
        </div>
      </div>

      <div className="min-h-0 p-4 sm:p-6">
        <OrderItemsTable items={order.items} />
      </div>
    </Modal>
  );
}
