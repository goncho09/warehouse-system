'use client';

import { useEffect, useMemo, useState } from 'react';
import { Boxes, MapPin, PackageCheck } from 'lucide-react';

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

  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );

  const searchResults = useMemo(() => {
    const value = debouncedSearch.trim().toLowerCase();

    if (value.length < 2) {
      return [];
    }

    return products.filter((product) => {
      const barcodeMatch = product.barCode.toLowerCase() === value;

      const descriptionMatch = product.description
        .toLowerCase()
        .includes(value);

      return barcodeMatch || descriptionMatch;
    });
  }, [products, debouncedSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  );

  const records = useMemo(
    () => stock.filter((record) => record.productId === selectedProductId),
    [stock, selectedProductId],
  );

  const totalStock = records.reduce((total, record) => total + record.count, 0);

  const pickingStock = records
    .filter((record) => record.locationType === 'PICKING')
    .reduce((total, record) => total + record.count, 0);

  const pendingStock = records
    .filter((record) => record.locationType === 'EN_PUERTA')
    .reduce((total, record) => total + record.count, 0);

  return (
    <main className="p-6 md:p-8">
      <div className="mb-6">
        <p
          className="mb-1 text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Consulta de stock
        </p>

        <h1
          className="text-2xl font-semibold"
          style={{ color: 'var(--color-text)' }}
        >
          Inventario
        </h1>
      </div>

      <section
        className="mb-6 rounded-xl border p-5"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <label
          htmlFor="product"
          className="mb-2 block text-sm font-medium"
          style={{ color: 'var(--color-text)' }}
        >
          Producto
        </label>

        <section
          className="mb-6 rounded-xl border p-5"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <label
            htmlFor="product-search"
            className="mb-2 block text-sm font-medium"
            style={{ color: 'var(--color-text)' }}
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
            placeholder="Código de barras o descripción..."
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
            }}
          />

          {debouncedSearch.length >= 2 && selectedProductId === null && (
            <div
              className="mt-2 overflow-hidden rounded-lg border"
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
                      setSelectedProductId(product.id);
                      setSearch(product.description);
                    }}
                    className="
              flex w-full items-center justify-between
              border-b px-4 py-3 text-left
              transition-colors
              last:border-0
              hover:bg-(--color-surface-hover)
            "
                    style={{
                      borderColor: 'var(--color-border-light)',
                    }}
                  >
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: 'var(--color-text)' }}
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
                      className="text-xs"
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
      </section>

      {selectedProduct && (
        <>
          <section className="mb-6">
            <h2
              className="text-lg font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              {selectedProduct.description} - {selectedProduct.category}
            </h2>

            <p
              className="mt-1 text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Código: {selectedProduct.productId}
            </p>
          </section>

          <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <Boxes size={20} style={{ color: 'var(--color-primary)' }} />

              <p
                className="mt-4 text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Stock total
              </p>

              <p
                className="mt-1 text-2xl font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                {totalStock}
              </p>
            </div>

            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <PackageCheck
                size={20}
                style={{ color: 'var(--color-success)' }}
              />

              <p
                className="mt-4 text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Disponible para picking
              </p>

              <p
                className="mt-1 text-2xl font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                {pickingStock}
              </p>
            </div>

            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <MapPin size={20} style={{ color: 'var(--color-warning)' }} />

              <p
                className="mt-4 text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                En puerta
              </p>

              <p
                className="mt-1 text-2xl font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                {pendingStock}
              </p>
            </div>
          </section>

          <StockTable records={records} />
        </>
      )}
    </main>
  );
}
