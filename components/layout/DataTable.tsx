'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

import type { DataTableColumn } from '@/types/Table';

type SortRule = {
  key: string;
  direction: 'asc' | 'desc';
};

type Props<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (row: T) => string | number;
  emptyMessage?: string;
};

function matchesText(value: string | number, filter: string) {
  const normalizedValue = String(value).toLowerCase();
  const normalizedFilter = filter.trim().toLowerCase();

  if (!normalizedFilter) {
    return true;
  }

  if (normalizedFilter.startsWith('%') && normalizedFilter.endsWith('%')) {
    const text = normalizedFilter.slice(1, -1);

    return normalizedValue.includes(text);
  }

  if (normalizedFilter.endsWith('%')) {
    const text = normalizedFilter.slice(0, -1);

    return normalizedValue.startsWith(text);
  }

  if (normalizedFilter.startsWith('%')) {
    const text = normalizedFilter.slice(1);

    return normalizedValue.endsWith(text);
  }

  return normalizedValue.includes(normalizedFilter);
}

export default function DataTable<T>({
  data,
  columns,
  getRowKey,
  emptyMessage = 'No hay datos para mostrar.',
}: Props<T>) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortRules, setSortRules] = useState<SortRule[]>([]);

  function handleFilterChange(key: string, value: string) {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function handleSort(key: string) {
    setSortRules((previous) => {
      const existingIndex = previous.findIndex((rule) => rule.key === key);

      if (existingIndex === -1) {
        return [
          ...previous,
          {
            key,
            direction: 'asc',
          },
        ];
      }

      const existing = previous[existingIndex];

      if (existing.direction === 'asc') {
        return previous.map((rule, index) =>
          index === existingIndex
            ? {
                ...rule,
                direction: 'desc',
              }
            : rule,
        );
      }

      return previous.filter((_, index) => index !== existingIndex);
    });
  }

  function getSortRule(key: string) {
    return sortRules.find((rule) => rule.key === key);
  }

  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter((row) =>
      columns.every((column) => {
        if (!column.filterable) {
          return true;
        }

        const filter = filters[column.key] ?? '';

        if (!filter) {
          return true;
        }

        if (column.filterType === 'select') {
          return String(column.getValue(row)) === filter;
        }

        if (column.filterType === 'number') {
          return Number(column.getValue(row)) === Number(filter);
        }

        if (column.filterType === 'date') {
          return String(column.getValue(row)) === filter;
        }

        return matchesText(column.getValue(row), filter);
      }),
    );

    if (sortRules.length === 0) {
      return filtered;
    }

    return [...filtered].sort((a, b) => {
      for (const rule of sortRules) {
        const column = columns.find((column) => column.key === rule.key);

        if (!column) {
          continue;
        }

        const valueA = column.getValue(a);
        const valueB = column.getValue(b);

        let comparison = 0;

        if (typeof valueA === 'number' && typeof valueB === 'number') {
          comparison = valueA - valueB;
        } else {
          comparison = String(valueA).localeCompare(String(valueB), 'es', {
            numeric: true,
            sensitivity: 'base',
          });
        }

        if (comparison !== 0) {
          return rule.direction === 'asc' ? comparison : -comparison;
        }
      }

      return 0;
    });
  }, [data, columns, filters, sortRules]);

  function getAlignmentClass(align: 'left' | 'center' | 'right' = 'center') {
    if (align === 'left') {
      return 'text-left';
    }

    if (align === 'right') {
      return 'text-right';
    }

    return 'text-center';
  }

  return (
    <section
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
        <table className="w-full min-w-max">
          <thead
            className="sticky top-0 z-10"
            style={{
              backgroundColor: 'var(--color-surface)',
            }}
          >
            <tr
              className="border-b text-left text-xs uppercase"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
            >
              {columns.map((column) => {
                const sortRule = getSortRule(column.key);

                return (
                  <th
                    key={column.key}
                    className="whitespace-nowrap px-4 py-4 font-medium"
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(column.key)}
                        className="flex w-full items-center justify-center gap-2"
                      >
                        {column.label}

                        {!sortRule && <ChevronsUpDown size={14} />}

                        {sortRule?.direction === 'asc' && <ArrowUp size={14} />}

                        {sortRule?.direction === 'desc' && (
                          <ArrowDown size={14} />
                        )}
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                );
              })}
            </tr>

            <tr
              className="border-b"
              style={{
                borderColor: 'var(--color-border)',
              }}
            >
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3">
                  {column.filterable ? (
                    column.filterType === 'select' ? (
                      <select
                        value={filters[column.key] ?? ''}
                        onChange={(event) =>
                          handleFilterChange(column.key, event.target.value)
                        }
                        className="w-full min-w-24 rounded-md border px-2 py-2 text-sm font-normal outline-none sm:min-w-28 sm:px-3"
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                      >
                        <option value="">Todos</option>

                        {column.filterOptions?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : column.filterType === 'number' ? (
                      <input
                        type="number"
                        value={filters[column.key] ?? ''}
                        onChange={(event) =>
                          handleFilterChange(column.key, event.target.value)
                        }
                        placeholder="Cantidad..."
                        className="w-full min-w-24 rounded-md border px-2 py-2 text-sm font-normal outline-none sm:min-w-28 sm:px-3"
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                      />
                    ) : column.filterType === 'date' ? (
                      <input
                        type="date"
                        value={filters[column.key] ?? ''}
                        onChange={(event) =>
                          handleFilterChange(column.key, event.target.value)
                        }
                        className="w-full min-w-32 rounded-md border px-2 py-2 text-sm font-normal outline-none sm:px-3"
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={filters[column.key] ?? ''}
                        onChange={(event) =>
                          handleFilterChange(column.key, event.target.value)
                        }
                        placeholder={`Filtrar ${column.label.toLowerCase()}...`}
                        className="w-full min-w-24 rounded-md border px-2 py-2 text-sm font-normal outline-none sm:min-w-28 sm:px-3"
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                      />
                    )
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredAndSortedData.map((row) => (
              <tr
                key={getRowKey(row)}
                className="border-b last:border-0"
                style={{
                  borderColor: 'var(--color-border-light)',
                }}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`whitespace-nowrap px-4 py-4 text-sm ${getAlignmentClass(
                      column.align,
                    )}`}
                    style={{
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {column.render ? column.render(row) : column.getValue(row)}
                  </td>
                ))}
              </tr>
            ))}

            {filteredAndSortedData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-10 text-center text-sm"
                  style={{
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
