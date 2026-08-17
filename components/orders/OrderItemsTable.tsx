'use client';

import DataTable from '@/components/layout/DataTable';

import type { DataTableColumn } from '@/types/Table';
import type { OrderItem } from '@/types/Order';

type Props = {
  items: OrderItem[];
};

const columns: DataTableColumn<OrderItem>[] = [
  {
    key: 'productId',
    label: 'Producto',
    sortable: true,
    filterable: true,

    getValue: (item) => item.productId,

    render: (item) => (
      <span
        className="font-medium"
        style={{
          color: 'var(--color-text)',
        }}
      >
        {item.productId}
      </span>
    ),
  },

  {
    key: 'description',
    label: 'Descripción',
    sortable: true,
    filterable: true,
    align: 'left',

    getValue: (item) => item.description,

    render: (item) => (
      <span
        className="font-medium"
        style={{
          color: 'var(--color-text)',
        }}
      >
        {item.description}
      </span>
    ),
  },

  {
    key: 'requestedCount',
    label: 'Solicitado',
    sortable: true,
    filterable: true,
    filterType: 'number',

    getValue: (item) => item.requestedCount,

    render: (item) => (
      <span
        className="font-medium"
        style={{
          color: 'var(--color-text)',
        }}
      >
        {item.requestedCount.toLocaleString('es-UY')}
      </span>
    ),
  },

  {
    key: 'pickedCount',
    label: 'Pickeado',
    sortable: true,
    filterable: true,
    filterType: 'number',

    getValue: (item) => item.pickedCount,

    render: (item) => (
      <span
        className="font-medium"
        style={{
          color:
            item.pickedCount > 0
              ? 'var(--color-success)'
              : 'var(--color-text-secondary)',
        }}
      >
        {item.pickedCount.toLocaleString('es-UY')}
      </span>
    ),
  },

  {
    key: 'cancelledCount',
    label: 'Anulado',
    sortable: true,
    filterable: true,
    filterType: 'number',

    getValue: (item) => item.cancelledCount,

    render: (item) => (
      <span
        className="font-medium"
        style={{
          color:
            item.cancelledCount > 0
              ? 'var(--color-danger)'
              : 'var(--color-text-secondary)',
        }}
      >
        {item.cancelledCount.toLocaleString('es-UY')}
      </span>
    ),
  },
];

export default function OrderItemsTable({ items }: Props) {
  return (
    <DataTable
      data={items}
      columns={columns}
      getRowKey={(item) => item.id}
      emptyMessage="Este pedido no contiene productos."
    />
  );
}
