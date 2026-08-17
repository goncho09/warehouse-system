'use client';

import DataTable from '@/components/layout/DataTable';
import StatusBadge from '../layout/ui/StatusBadge';

import type { DataTableColumn } from '@/types/Table';
import type { Product } from '@/types/Product';

type Props = {
  products: Product[];
};

const categoryLabels: Record<Product['category'], string> = {
  FOOD: 'Food',
  NO_FOOD: 'No Food',
  CONGELADO: 'Congelado',
  REFRIGERADO: 'Refrigerado',
};

const columns: DataTableColumn<Product>[] = [
  {
    key: 'productId',
    label: 'Código',
    sortable: true,
    filterable: true,
    getValue: (product) => product.productId,
    render: (product) => (
      <span
        className="font-medium"
        style={{
          color: 'var(--color-text)',
        }}
      >
        {product.productId}
      </span>
    ),
  },

  {
    key: 'barCode',
    label: 'Código de barras',
    sortable: true,
    filterable: true,
    getValue: (product) => product.barCode,
  },

  {
    key: 'description',
    label: 'Descripción',
    sortable: true,
    filterable: true,
    align: 'left',
    getValue: (product) => product.description,
    render: (product) => (
      <span
        className="font-medium"
        style={{
          color: 'var(--color-text)',
        }}
      >
        {product.description}
      </span>
    ),
  },

  {
    key: 'unitsPerDisplay',
    label: 'Display',
    sortable: true,
    filterable: true,
    getValue: (product) => product.unitsPerDisplay,
    filterType: 'number',
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

    getValue: (product) => product.category,

    render: (product) => {
      const variants = {
        FOOD: 'primary',
        NO_FOOD: 'neutral',
        CONGELADO: 'primary',
        REFRIGERADO: 'success',
      } as const;

      return (
        <StatusBadge variant={variants[product.category]}>
          {categoryLabels[product.category]}
        </StatusBadge>
      );
    },
  },
];

export default function ProductsTable({ products }: Props) {
  return (
    <DataTable
      data={products}
      columns={columns}
      getRowKey={(product) => product.id}
      emptyMessage="No se encontraron productos."
    />
  );
}
