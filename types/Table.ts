import type { ReactNode } from 'react';

export type DataTableFilterOption = {
  label: string;
  value: string;
};

export type DataTableColumn<T> = {
  key: string;
  label: string;

  sortable?: boolean;
  filterable?: boolean;

  filterType?: 'text' | 'select' | 'number' | 'date';
  filterOptions?: DataTableFilterOption[];

  align?: 'left' | 'center' | 'right';

  getValue: (row: T) => string | number;
  render?: (row: T) => ReactNode;
};
