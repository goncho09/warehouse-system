'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Package } from 'lucide-react';

import type { Product } from '@/types/Product';

type Props = {
  products: Product[];
};

type SortColumn =
  | 'codigoProducto'
  | 'descripcion'
  | 'categoria'
  | 'unidadesPorDisplay'
  | 'stock';

type SortDirection = 'asc' | 'desc';

type Filters = {
  codigoProducto: string;
  descripcion: string;
  categoria: string;
  unidadesPorDisplay: string;
  stock: string;
};

const initialFilters: Filters = {
  codigoProducto: '',
  descripcion: '',
  categoria: '',
  unidadesPorDisplay: '',
  stock: '',
};

function matchesText(value: string, search: string) {
  if (!search) return true;

  const normalizedValue = value.toLowerCase();
  const normalizedSearch = search.toLowerCase();

  const startsWithWildcard = normalizedSearch.startsWith('%');
  const endsWithWildcard = normalizedSearch.endsWith('%');

  const cleanSearch = normalizedSearch.replaceAll('%', '');

  if (startsWithWildcard && endsWithWildcard) {
    return normalizedValue.includes(cleanSearch);
  }

  if (startsWithWildcard) {
    return normalizedValue.endsWith(cleanSearch);
  }

  if (endsWithWildcard) {
    return normalizedValue.startsWith(cleanSearch);
  }

  return normalizedValue === cleanSearch;
}

export default function ProductsTable({ products }: Props) {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  type SortRule = {
    column: SortColumn;
    direction: SortDirection;
  };

  const [sortRules, setSortRules] = useState<SortRule[]>([]);

  function handleFilterChange(column: keyof Filters, value: string) {
    setFilters((previous) => ({
      ...previous,
      [column]: value,
    }));
  }

  function handleSort(column: SortColumn) {
    setSortRules((previousRules) => {
      const existingRule = previousRules.find((rule) => rule.column === column);

      // No estaba ordenando por esta columna → agregar ASC
      if (!existingRule) {
        return [
          ...previousRules,
          {
            column,
            direction: 'asc',
          },
        ];
      }

      // ASC → DESC
      if (existingRule.direction === 'asc') {
        return previousRules.map((rule) =>
          rule.column === column ? { ...rule, direction: 'desc' } : rule,
        );
      }

      // DESC → quitar criterio
      return previousRules.filter((rule) => rule.column !== column);
    });
  }

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesCode = matchesText(
        product.codigoProducto,
        filters.codigoProducto,
      );

      const matchesName = matchesText(product.descripcion, filters.descripcion);

      const matchesCategory = matchesText(product.categoria, filters.categoria);

      const matchesDisplay =
        !filters.unidadesPorDisplay ||
        product.unidadesPorDisplay === Number(filters.unidadesPorDisplay);

      const matchesStock =
        !filters.stock || product.stock === Number(filters.stock);

      return (
        matchesCode &&
        matchesName &&
        matchesCategory &&
        matchesDisplay &&
        matchesStock
      );
    });

    if (sortRules.length === 0) {
      return result;
    }

    return [...result].sort((a, b) => {
      for (const rule of sortRules) {
        const valueA = a[rule.column];
        const valueB = b[rule.column];

        let comparison = 0;

        if (typeof valueA === 'number' && typeof valueB === 'number') {
          comparison = valueA - valueB;
        } else {
          comparison = String(valueA).localeCompare(String(valueB));
        }

        if (comparison !== 0) {
          return rule.direction === 'asc' ? comparison : -comparison;
        }
      }

      return 0;
    });
  }, [products, filters, sortRules]);

  function SortIcon({ column }: { column: SortColumn }) {
    const index = sortRules.findIndex((rule) => rule.column === column);

    if (index === -1) {
      return <ArrowUpDown size={14} />;
    }

    const rule = sortRules[index];

    return (
      <span className="flex items-center gap-1">
        {rule.direction === 'asc' ? (
          <ArrowUp size={14} />
        ) : (
          <ArrowDown size={14} />
        )}

        {sortRules.length > 1 && (
          <span
            className="text-[10px] font-semibold"
            style={{ color: 'var(--color-primary)' }}
          >
            {index + 1}
          </span>
        )}
      </span>
    );
  }

  return (
    <section
      className="overflow-hidden rounded-xl border"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className="border-b"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <th className="px-4 pt-4 text-left">
                <button
                  onClick={() => handleSort('codigoProducto')}
                  className="flex items-center gap-2 text-xs font-medium uppercase"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Código
                  <SortIcon column="codigoProducto" />
                </button>
              </th>

              <th className="px-4 pt-4 text-left">
                <button
                  onClick={() => handleSort('descripcion')}
                  className="flex items-center gap-2 text-xs font-medium uppercase"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Descripción
                  <SortIcon column="descripcion" />
                </button>
              </th>

              <th className="px-4 pt-4 text-left">
                <button
                  onClick={() => handleSort('categoria')}
                  className="flex items-center gap-2 text-xs font-medium uppercase"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Categoría
                  <SortIcon column="categoria" />
                </button>
              </th>

              <th className="px-4 pt-4 text-left">
                <button
                  onClick={() => handleSort('unidadesPorDisplay')}
                  className="flex items-center gap-2 text-xs font-medium uppercase"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Display
                  <SortIcon column="unidadesPorDisplay" />
                </button>
              </th>

              <th className="px-4 pt-4 text-left">
                <button
                  onClick={() => handleSort('stock')}
                  className="flex items-center gap-2 text-xs font-medium uppercase"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Stock
                  <SortIcon column="stock" />
                </button>
              </th>
            </tr>

            <tr
              className="border-b"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <th className="p-4">
                <input
                  value={filters.codigoProducto}
                  onChange={(event) =>
                    handleFilterChange('codigoProducto', event.target.value)
                  }
                  placeholder="%código%"
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                  style={{
                    borderColor: 'var(--color-border)',
                  }}
                />
              </th>

              <th className="p-4">
                <input
                  value={filters.descripcion}
                  onChange={(event) =>
                    handleFilterChange('descripcion', event.target.value)
                  }
                  placeholder="%nombre%"
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                  style={{
                    borderColor: 'var(--color-border)',
                  }}
                />
              </th>

              <th className="p-4">
                <input
                  value={filters.categoria}
                  onChange={(event) =>
                    handleFilterChange('categoria', event.target.value)
                  }
                  placeholder="FOOD"
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                  style={{
                    borderColor: 'var(--color-border)',
                  }}
                />
              </th>

              <th className="p-4">
                <input
                  type="number"
                  value={filters.unidadesPorDisplay}
                  onChange={(event) =>
                    handleFilterChange('unidadesPorDisplay', event.target.value)
                  }
                  placeholder="24"
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                  style={{
                    borderColor: 'var(--color-border)',
                  }}
                />
              </th>

              <th className="p-4">
                <input
                  type="number"
                  value={filters.stock}
                  onChange={(event) =>
                    handleFilterChange('stock', event.target.value)
                  }
                  placeholder="96"
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                  style={{
                    borderColor: 'var(--color-border)',
                  }}
                />
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b last:border-0"
                style={{
                  borderColor: 'var(--color-border-light)',
                }}
              >
                <td
                  className="px-4 py-4 text-sm"
                  style={{
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {product.codigoProducto}
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      <Package size={18} />
                    </div>

                    <span
                      className="text-sm font-medium"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {product.descripcion}
                    </span>
                  </div>
                </td>

                <td
                  className="px-4 py-4 text-sm"
                  style={{
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {product.categoria}
                </td>

                <td
                  className="px-4 py-4 text-sm"
                  style={{
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {product.unidadesPorDisplay}
                </td>

                <td
                  className="px-4 py-4 text-sm font-medium"
                  style={{
                    color:
                      product.stock === 0
                        ? 'var(--color-danger)'
                        : 'var(--color-text)',
                  }}
                >
                  {product.stock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div
          className="p-8 text-center text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          No se encontraron productos.
        </div>
      )}
    </section>
  );
}
