'use client';

import { Eye } from 'lucide-react';

import DataTable from '@/components/layout/DataTable';
import StatusBadge from '../layout/ui/StatusBadge';

import type { DataTableColumn } from '@/types/Table';
import type { Order } from '@/types/Order';

type Props = {
  orders: Order[];
  onViewOrder: (order: Order) => void;
};

type OrderRow = Order & {
  totalUnits: number;
  completedPicks: number;
  totalPicks: number;
  picksPercentage: number;
  preparationPercentage: number;
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

export default function OrdersTable({ orders, onViewOrder }: Props) {
  const rows: OrderRow[] = orders.map((order) => {
    const totalUnits = order.items.reduce(
      (total, item) => total + item.requestedCount,
      0,
    );

    const resolvedUnits = order.items.reduce(
      (total, item) => total + item.pickedCount + item.cancelledCount,
      0,
    );

    const preparationPercentage =
      totalUnits === 0 ? 0 : Math.round((resolvedUnits / totalUnits) * 100);

    return {
      ...order,
      totalUnits,

      // Después salen de PickTask.
      completedPicks: 0,
      totalPicks: 0,
      picksPercentage: 0,

      preparationPercentage,
    };
  });

  const columns: DataTableColumn<OrderRow>[] = [
    {
      key: 'stoCode',
      label: 'STO',
      sortable: true,
      filterable: true,
      getValue: (order) => order.stoCode,

      render: (order) => (
        <span
          className="font-medium"
          style={{
            color: 'var(--color-text)',
          }}
        >
          {order.stoCode}
        </span>
      ),
    },

    {
      key: 'preparationCode',
      label: 'Preparación',
      sortable: true,
      filterable: true,
      getValue: (order) => order.preparationCode,
    },

    {
      key: 'destination',
      label: 'Destino',
      sortable: true,
      filterable: true,
      filterType: 'select',

      filterOptions: [
        {
          label: 'La Blanqueada',
          value: 'LA_BLANQUEADA',
        },
        {
          label: 'Carrasco Norte',
          value: 'CARRASCO_NORTE',
        },
        {
          label: 'Tres Cruces',
          value: 'TRES_CRUCES',
        },
        {
          label: 'Sayago',
          value: 'SAYAGO',
        },
        {
          label: 'Ciudad de la Costa',
          value: 'CIUDAD_DE_LA_COSTA',
        },
        {
          label: 'Malvín Norte',
          value: 'MALVIN_NORTE',
        },
        {
          label: 'Aguada',
          value: 'AGUADA',
        },
        {
          label: 'Brazo Oriental',
          value: 'BRAZO_ORIENTAL',
        },
      ],

      getValue: (order) => order.destination,

      render: (order) => destinationLabels[order.destination],
    },

    {
      key: 'category',
      label: 'Categoría',
      sortable: true,
      filterable: true,
      filterType: 'select',

      filterOptions: [
        {
          label: 'Food',
          value: 'FOOD',
        },
        {
          label: 'No Food',
          value: 'NO_FOOD',
        },
        {
          label: 'Congelado',
          value: 'CONGELADO',
        },
        {
          label: 'Refrigerado',
          value: 'REFRIGERADO',
        },
      ],

      getValue: (order) => order.category,

      render: (order) => {
        const variants = {
          FOOD: 'primary',
          NO_FOOD: 'neutral',
          CONGELADO: 'primary',
          REFRIGERADO: 'success',
        } as const;

        return (
          <StatusBadge variant={variants[order.category]}>
            {categoryLabels[order.category]}
          </StatusBadge>
        );
      },
    },

    {
      key: 'departureDate',
      label: 'Salida',
      sortable: true,
      filterable: true,
      filterType: 'date',

      getValue: (order) => order.departureDate,

      render: (order) =>
        new Intl.DateTimeFormat('es-UY', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(new Date(`${order.departureDate}T00:00:00`)),
    },

    {
      key: 'totalUnits',
      label: 'Unidades',
      sortable: true,
      filterable: true,
      filterType: 'number',

      getValue: (order) => order.totalUnits,

      render: (order) => (
        <span
          className="font-medium"
          style={{
            color: 'var(--color-text)',
          }}
        >
          {order.totalUnits.toLocaleString('es-UY')}
        </span>
      ),
    },

    {
      key: 'completedPicks',
      label: 'Pickeos',
      sortable: true,
      filterable: false,

      getValue: (order) => order.completedPicks,

      render: (order) => `${order.completedPicks} / ${order.totalPicks}`,
    },

    {
      key: 'picksPercentage',
      label: 'Pickeos %',
      sortable: true,
      filterable: false,

      getValue: (order) => order.picksPercentage,

      render: (order) => <ProgressCell percentage={order.picksPercentage} />,
    },

    {
      key: 'preparationPercentage',
      label: 'Preparación',
      sortable: true,
      filterable: false,

      getValue: (order) => order.preparationPercentage,

      render: (order) => (
        <ProgressCell percentage={order.preparationPercentage} successAt100 />
      ),
    },

    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      filterable: true,
      filterType: 'select',

      filterOptions: [
        {
          label: 'Pendiente',
          value: 'PENDIENTE',
        },
        {
          label: 'En proceso',
          value: 'EN_PROCESO',
        },
        {
          label: 'Completado',
          value: 'COMPLETADO',
        },
      ],

      getValue: (order) => order.status,

      render: (order) => {
        const variants = {
          PENDIENTE: 'warning',
          EN_PROCESO: 'primary',
          COMPLETADO: 'success',
        } as const;

        const labels = {
          PENDIENTE: 'Pendiente',
          EN_PROCESO: 'En proceso',
          COMPLETADO: 'Completado',
        };

        return (
          <StatusBadge variant={variants[order.status]}>
            {labels[order.status]}
          </StatusBadge>
        );
      },
    },

    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      filterable: false,

      getValue: () => '',

      render: (order) => (
        <button
          type="button"
          onClick={() => onViewOrder(order)}
          aria-label={`Ver pedido ${order.stoCode}`}
          title="Ver contenido"
          className="rounded-lg p-2 transition-colors hover:bg-(--color-primary-light)"
          style={{
            color: 'var(--color-text-secondary)',
          }}
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  return (
    <DataTable
      data={rows}
      columns={columns}
      getRowKey={(order) => order.id}
      emptyMessage="Todavía no hay pedidos cargados."
    />
  );
}

function ProgressCell({
  percentage,
  successAt100 = false,
}: {
  percentage: number;
  successAt100?: boolean;
}) {
  const isComplete = successAt100 && percentage === 100;

  return (
    <div className="flex items-center justify-center gap-2">
      <div
        className="h-1.5 w-20 overflow-hidden rounded-full"
        style={{
          backgroundColor: 'var(--color-border-light)',
        }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${percentage}%`,
            backgroundColor: isComplete
              ? 'var(--color-success)'
              : 'var(--color-primary)',
          }}
        />
      </div>

      <span
        className="min-w-8 text-xs font-medium"
        style={{
          color: isComplete
            ? 'var(--color-success)'
            : 'var(--color-text-secondary)',
        }}
      >
        {percentage}%
      </span>
    </div>
  );
}
