'use client';

import DataTable from '@/components/layout/DataTable';
import StatusBadge from '../layout/ui/StatusBadge';

import type { DataTableColumn } from '@/types/Table';
import type { Location } from '@/types/Location';

type Props = {
  locations: Location[];
};

const locationLabels: Record<Location['type'], string> = {
  PICKING: 'Picking',
  EN_PUERTA: 'En puerta',
  FLOTANTE: 'Flotante',
  AVERIAS: 'Averías',
};

const columns: DataTableColumn<Location>[] = [
  {
    key: 'code',
    label: 'Código',
    sortable: true,
    filterable: true,
    getValue: (location) => location.code,
    render: (location) => (
      <span
        className="font-medium"
        style={{
          color: 'var(--color-text)',
        }}
      >
        {location.code}
      </span>
    ),
  },
  {
    key: 'type',
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

    getValue: (location) => location.type,

    render: (location) => {
      const variants = {
        PICKING: 'primary',
        EN_PUERTA: 'warning',
        FLOTANTE: 'danger',
        AVERIAS: 'danger',
      } as const;

      return (
        <StatusBadge variant={variants[location.type]}>
          {locationLabels[location.type]}
        </StatusBadge>
      );
    },
  },
  {
    key: 'chamber',
    label: 'Cámara',
    sortable: true,
    filterable: true,
    getValue: (location) => location.chamber || '-',
  },
  {
    key: 'row',
    label: 'Fila',
    sortable: true,
    filterable: true,
    getValue: (location) => location.row || '-',
  },
  {
    key: 'position',
    label: 'Posición',
    sortable: true,
    filterable: true,
    getValue: (location) => location.position || '-',
  },
  {
    key: 'height',
    label: 'Altura',
    sortable: true,
    filterable: true,
    getValue: (location) => location.height || '-',
  },
];

export default function LocationsTable({ locations }: Props) {
  return (
    <DataTable
      data={locations}
      columns={columns}
      getRowKey={(location) => location.code}
      emptyMessage="No se encontraron ubicaciones."
    />
  );
}
