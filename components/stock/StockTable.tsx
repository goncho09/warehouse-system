'use client';

import DataTable from '@/components/layout/DataTable';
import StatusBadge from '../layout/ui/StatusBadge';

import type { DataTableColumn } from '@/types/Table';
import type { StockRecord } from '@/types/Stock';

type Props = {
  records: StockRecord[];
};

const locationTypeLabels: Record<StockRecord['locationType'], string> = {
  PICKING: 'Picking',
  EN_PUERTA: 'En puerta',
  FLOTANTE: 'Flotante',
  AVERIAS: 'Averías',
};

const columns: DataTableColumn<StockRecord>[] = [
  {
    key: 'locationCode',
    label: 'Ubicación',
    sortable: true,
    filterable: true,
    getValue: (record) => record.locationCode,
    render: (record) => (
      <span
        className="font-medium"
        style={{
          color: 'var(--color-text)',
        }}
      >
        {record.locationCode}
      </span>
    ),
  },

  {
    key: 'locationType',
    label: 'Tipo',
    sortable: true,
    filterable: true,
    filterType: 'select',

    filterOptions: [
      { label: 'Picking', value: 'PICKING' },
      { label: 'En puerta', value: 'EN_PUERTA' },
      { label: 'Flotante', value: 'FLOTANTE' },
      { label: 'Averías', value: 'AVERIAS' },
    ],

    getValue: (record) => record.locationType,

    render: (record) => {
      const styles = {
        PICKING: {
          backgroundColor: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
        },

        EN_PUERTA: {
          backgroundColor: 'var(--color-warning-light)',
          color: 'var(--color-warning)',
        },

        FLOTANTE: {
          backgroundColor: 'var(--color-danger-light)',
          color: 'var(--color-danger)',
        },

        AVERIAS: {
          backgroundColor: 'var(--color-danger-light)',
          color: 'var(--color-danger)',
        },
      };

      return (
        <span
          className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
          style={styles[record.locationType]}
        >
          {locationTypeLabels[record.locationType]}
        </span>
      );
    },
  },

  {
    key: 'count',
    label: 'Cantidad',
    sortable: true,
    filterable: true,
    filterType: 'number',

    getValue: (record) => record.count,

    render: (record) => (
      <span
        className="font-medium"
        style={{
          color: 'var(--color-text)',
        }}
      >
        {record.count}
      </span>
    ),
  },

  {
    key: 'dueDate',
    label: 'Vencimiento',
    sortable: true,
    filterable: true,
    filterType: 'date',

    getValue: (record) => record.dueDate ?? '',

    render: (record) => {
      const variants = {
        PICKING: 'primary',
        EN_PUERTA: 'warning',
        FLOTANTE: 'danger',
        AVERIAS: 'danger',
      } as const;

      return (
        <StatusBadge variant={variants[record.locationType]}>
          {locationTypeLabels[record.locationType]}
        </StatusBadge>
      );
    },
  },
];

export default function StockTable({ records }: Props) {
  return (
    <DataTable
      data={records}
      columns={columns}
      getRowKey={(record) => `${record.productId}-${record.locationCode}`}
      emptyMessage="No se encontró stock."
    />
  );
}
