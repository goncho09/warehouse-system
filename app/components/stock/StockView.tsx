'use client';

import { useMemo, useState } from 'react';
import { Boxes, MapPin, PackageCheck } from 'lucide-react';

import StockTable from './StockTable';

import type { Product } from '@/types/Product';
import type { StockRecord } from '@/types/Stock';

type Props = {
  products: Product[];
  stock: StockRecord[];
};

export default function StockView({ products, stock }: Props) {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    products[0]?.id ?? null,
  );

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

        <select
          id="product"
          value={selectedProductId ?? ''}
          onChange={(event) => setSelectedProductId(Number(event.target.value))}
          className="w-full rounded-lg border px-3 py-2.5 text-sm md:max-w-xl"
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.productId} - {product.description}
            </option>
          ))}
        </select>
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
