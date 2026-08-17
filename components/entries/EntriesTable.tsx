'use client';

import DataTable from '@/components/layout/DataTable';

import type { DataTableColumn } from '@/types/Table';
import type { Entry } from '@/types/Entry';
import type { Product } from '@/types/Product';

type Props = {
  entries: Entry[];
  products: Product[];
};

type EntryRow = Entry & {
  barCode: string;
  description: string;
};

export default function EntriesTable({ entries, products }: Props) {
  const rows: EntryRow[] = entries.map((entry) => {
    const product = products.find(
      (product) => product.productId === entry.productId,
    );

    return {
      ...entry,
      barCode: product?.barCode ?? 'N/A',
      description: product?.description ?? 'N/A',
    };
  });

  const columns: DataTableColumn<EntryRow>[] = [
    {
      key: 'productId',
      label: 'Product ID',
      sortable: true,
      filterable: true,
      getValue: (entry) => entry.productId,

      render: (entry) => (
        <span
          className="font-medium"
          style={{
            color: 'var(--color-text)',
          }}
        >
          {entry.productId}
        </span>
      ),
    },

    {
      key: 'lot',
      label: 'Lote',
      sortable: true,
      filterable: true,
      getValue: (entry) => entry.lot,
    },

    {
      key: 'barCode',
      label: 'Código de barras',
      sortable: true,
      filterable: true,
      getValue: (entry) => entry.barCode,
    },

    {
      key: 'description',
      label: 'Descripción',
      sortable: true,
      filterable: true,
      align: 'left',
      getValue: (entry) => entry.description,

      render: (entry) => (
        <span
          className="font-medium"
          style={{
            color: 'var(--color-text)',
          }}
        >
          {entry.description}
        </span>
      ),
    },

    {
      key: 'dueDate',
      label: 'Vencimiento',
      sortable: true,
      filterable: true,
      filterType: 'date',

      getValue: (entry) => entry.dueDate ?? '',

      render: (entry) =>
        entry.dueDate
          ? new Intl.DateTimeFormat('es-UY', {
              timeZone: 'America/Montevideo',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }).format(new Date(`${entry.dueDate}T00:00:00`))
          : 'N/A',
    },

    {
      key: 'count',
      label: 'Cantidad',
      sortable: true,
      filterable: true,
      filterType: 'number',

      getValue: (entry) => entry.count,

      render: (entry) => (
        <span
          className="font-medium"
          style={{
            color: 'var(--color-text)',
          }}
        >
          {entry.count}
        </span>
      ),
    },

    {
      key: 'cntCode',
      label: 'Contenedor',
      sortable: true,
      filterable: true,

      getValue: (entry) => entry.cntCode,

      render: (entry) => (
        <span
          className="font-medium"
          style={{
            color: 'var(--color-text)',
          }}
        >
          {entry.cntCode}
        </span>
      ),
    },

    {
      key: 'entryDate',
      label: 'Fecha ingreso',
      sortable: true,
      filterable: true,
      filterType: 'date',

      getValue: (entry) => new Date(entry.entryDate).toISOString().slice(0, 10),

      render: (entry) =>
        new Intl.DateTimeFormat('es-UY', {
          timeZone: 'America/Montevideo',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date(entry.entryDate)),
    },
  ];

  return (
    <DataTable
      data={rows}
      columns={columns}
      getRowKey={(entry) => entry.id}
      emptyMessage="Todavía no hay ingresos registrados."
    />
  );
}
