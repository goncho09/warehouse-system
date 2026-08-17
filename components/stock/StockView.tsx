'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Boxes,
  MapPin,
  PackageCheck,
  TriangleAlert,
  CircleOff,
} from 'lucide-react';

import PageHeader from '../layout/ui/PageHeader';
import StockTable from './StockTable';

import type { Product } from '@/types/Product';
import type { StockRecord } from '@/types/Stock';

type Props = {
  products: Product[];
  stock: StockRecord[];
};

export default function StockView({ products, stock }: Props) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const searchResults = useMemo(() => {
    const value = debouncedSearch.trim().toLowerCase();

    if (value.length < 2) {
      return [];
    }

    return products.filter((product) => {
      const barcodeMatch = product.barCode.toLowerCase() === value;

      const productIdMatch = product.productId.toLowerCase().includes(value);

      const descriptionMatch = product.description
        .toLowerCase()
        .includes(value);

      return barcodeMatch || productIdMatch || descriptionMatch;
    });
  }, [products, debouncedSearch]);

  const selectedProduct = products.find(
    (product) => product.productId === selectedProductId,
  );

  const records = useMemo(() => {
    if (!selectedProduct) {
      return [];
    }

    return stock.filter(
      (record) => record.productId === selectedProduct.productId,
    );
  }, [stock, selectedProduct]);

  const totalStock = records.reduce((total, record) => total + record.count, 0);

  const pickingStock = records
    .filter((record) => record.locationType === 'PICKING')
    .reduce((total, record) => total + record.count, 0);

  const pendingStock = records
    .filter((record) => record.locationType === 'EN_PUERTA')
    .reduce((total, record) => total + record.count, 0);

  const floatingStock = records
    .filter((record) => record.locationType === 'FLOTANTE')
    .reduce((total, record) => total + record.count, 0);

  const damagedStock = records
    .filter((record) => record.locationType === 'AVERIAS')
    .reduce((total, record) => total + record.count, 0);

  return (
    <div className="flex h-full min-h-0 flex-col p-4 sm:p-6 md:p-8">
      <PageHeader eyebrow="Consulta de stock" title="Inventario" />

      {/* Buscador */}
      <section
        className="relative mb-6 rounded-xl border p-4 sm:p-5"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <label
          htmlFor="product-search"
          className="mb-2 block text-sm font-medium"
          style={{
            color: 'var(--color-text)',
          }}
        >
          Buscar producto
        </label>

        <input
          id="product-search"
          type="text"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setSelectedProductId(null);
          }}
          placeholder="Código, código de barras o descripción..."
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-primary)]"
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
          }}
        />

        {debouncedSearch.length >= 2 && selectedProductId === null && (
          <div
            className="absolute left-4 right-4 top-[calc(100%-12px)] z-20 max-h-72 overflow-y-auto rounded-lg border shadow-lg sm:left-5 sm:right-5"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            {searchResults.length > 0 ? (
              searchResults.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    setSelectedProductId(product.productId);

                    setSearch(product.description);
                  }}
                  className="flex w-full items-center justify-between gap-4 border-b px-4 py-3 text-left transition-colors last:border-0 hover:bg-(--color-surface-hover)"
                  style={{
                    borderColor: 'var(--color-border-light)',
                  }}
                >
                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-medium"
                      style={{
                        color: 'var(--color-text)',
                      }}
                    >
                      {product.description}
                    </p>

                    <p
                      className="mt-0.5 text-xs"
                      style={{
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {product.productId}
                    </p>
                  </div>

                  <span
                    className="shrink-0 text-xs"
                    style={{
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {product.barCode}
                  </span>
                </button>
              ))
            ) : (
              <p
                className="px-4 py-3 text-sm"
                style={{
                  color: 'var(--color-text-secondary)',
                }}
              >
                No se encontraron productos.
              </p>
            )}
          </div>
        )}
      </section>

      {selectedProduct ? (
        <>
          {/* Producto seleccionado */}
          <section className="mb-6">
            <h2
              className="text-lg font-semibold"
              style={{
                color: 'var(--color-text)',
              }}
            >
              {selectedProduct.description}
            </h2>

            <p
              className="mt-1 text-sm"
              style={{
                color: 'var(--color-text-secondary)',
              }}
            >
              {selectedProduct.productId}
              {' · '}
              {selectedProduct.category}
            </p>
          </section>

          {/* Resumen */}
          <section className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
            <StockCard
              icon={Boxes}
              title="Stock total"
              value={totalStock}
              color="var(--color-primary)"
            />

            <StockCard
              icon={PackageCheck}
              title="Picking"
              value={pickingStock}
              color="var(--color-success)"
            />

            <StockCard
              icon={MapPin}
              title="En puerta"
              value={pendingStock}
              color="var(--color-warning)"
            />

            <StockCard
              icon={CircleOff}
              title="Flotante"
              value={floatingStock}
              color="var(--color-danger)"
            />

            <StockCard
              icon={TriangleAlert}
              title="Averías"
              value={damagedStock}
              color="var(--color-danger)"
            />
          </section>

          <div className="min-h-0 flex-1">
            <StockTable records={records} />
          </div>
        </>
      ) : (
        <div
          className="flex flex-1 items-center justify-center rounded-xl border p-8 text-center"
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          <div>
            <Boxes
              size={32}
              className="mx-auto mb-3"
              style={{
                color: 'var(--color-text-muted)',
              }}
            />

            <p
              className="text-sm font-medium"
              style={{
                color: 'var(--color-text)',
              }}
            >
              Seleccioná un producto
            </p>

            <p
              className="mt-1 text-xs"
              style={{
                color: 'var(--color-text-secondary)',
              }}
            >
              Buscá por código, código de barras o descripción.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

type StockCardProps = {
  icon: React.ComponentType<{
    size?: number;
    style?: React.CSSProperties;
  }>;
  title: string;
  value: number;
  color: string;
};

function StockCard({ icon: Icon, title, value, color }: StockCardProps) {
  return (
    <div
      className="rounded-xl border p-4 sm:p-5"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <Icon
        size={20}
        style={{
          color,
        }}
      />

      <p
        className="mt-4 text-sm"
        style={{
          color: 'var(--color-text-secondary)',
        }}
      >
        {title}
      </p>

      <p
        className="mt-1 text-xl font-semibold sm:text-2xl"
        style={{
          color: 'var(--color-text)',
        }}
      >
        {value.toLocaleString('es-UY')}
      </p>
    </div>
  );
}
