'use client';

import { useState } from 'react';
import {
  Search,
  MapPin,
  Boxes,
  Package,
  CircleCheck,
  TriangleAlert,
} from 'lucide-react';

import CNTItemsTable from './CNTItemsTable';

import type { CNT } from '@/types/CNT';
import type { Product } from '@/types/Product';

type Props = {
  cnts: CNT[];
  products: Product[];
};

function getLocationLabel(type: CNT['locationType']) {
  switch (type) {
    case 'PICKING':
      return 'Picking';
    case 'EN_PUERTA':
      return 'En puerta';
    case 'FLOTANTE':
      return 'Flotante';
    case 'AVERIAS':
      return 'Averías';
  }
}

export default function CNTView({ cnts, products }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCNT, setSelectedCNT] = useState<CNT | null>(null);
  const [notFound, setNotFound] = useState(false);

  function handleSearch() {
    const value = search.trim().toLowerCase();

    if (!value) {
      setSelectedCNT(null);
      setNotFound(false);
      return;
    }

    const foundCNT = cnts.find((cnt) => cnt.id.toLowerCase() === value);

    setSelectedCNT(foundCNT ?? null);
    setNotFound(!foundCNT);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }

  const totalUnits =
    selectedCNT?.items.reduce((total, item) => total + item.count, 0) ?? 0;

  const totalProducts = selectedCNT?.items.length ?? 0;

  return (
    <main className="p-6 md:p-8">
      {/* Encabezado */}
      <section className="mb-6">
        <p
          className="mb-1 text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Consulta de unidades logísticas
        </p>

        <h1
          className="text-2xl font-semibold"
          style={{ color: 'var(--color-text)' }}
        >
          CNT
        </h1>
      </section>

      {/* Buscador */}
      <section
        className="mb-6 rounded-xl border p-5"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <label
          htmlFor="cnt-search"
          className="mb-2 block text-sm font-medium"
          style={{ color: 'var(--color-text)' }}
        >
          Código CNT
        </label>

        <div className="flex max-w-xl gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-text-muted)' }}
            />

            <input
              id="cnt-search"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ej: CNT-10001"
              className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-primary)',
            }}
          >
            Buscar
          </button>
        </div>

        {notFound && (
          <p className="mt-3 text-sm" style={{ color: 'var(--color-danger)' }}>
            No se encontró ningún CNT con ese código.
          </p>
        )}
      </section>

      {/* Resultado */}
      {selectedCNT && (
        <>
          <section className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Unidad logística
              </p>

              <h2
                className="mt-1 text-xl font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                {selectedCNT.id}
              </h2>
            </div>

            <span
              className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
              style={{
                backgroundColor:
                  selectedCNT.status === 'ACTIVO'
                    ? 'var(--color-success-light)'
                    : 'var(--color-border-light)',
                color:
                  selectedCNT.status === 'ACTIVO'
                    ? 'var(--color-success)'
                    : 'var(--color-text-secondary)',
              }}
            >
              {selectedCNT.status === 'ACTIVO' ? (
                <CircleCheck size={15} />
              ) : (
                <TriangleAlert size={15} />
              )}

              {selectedCNT.status === 'ACTIVO' ? 'Activo' : 'Finalizado'}
            </span>
          </section>

          {/* Resumen */}
          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <MapPin size={20} style={{ color: 'var(--color-primary)' }} />

              <p
                className="mt-4 text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Ubicación
              </p>

              <p
                className="mt-1 font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                {selectedCNT.locationCode}
              </p>
            </div>

            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <Boxes
                size={20}
                style={{
                  color:
                    selectedCNT.locationType === 'PICKING'
                      ? 'var(--color-success)'
                      : selectedCNT.locationType === 'EN_PUERTA'
                        ? 'var(--color-warning)'
                        : 'var(--color-danger)',
                }}
              />

              <p
                className="mt-4 text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Tipo de ubicación
              </p>

              <p
                className="mt-1 font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                {getLocationLabel(selectedCNT.locationType)}
              </p>
            </div>

            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <Package size={20} style={{ color: 'var(--color-primary)' }} />

              <p
                className="mt-4 text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Productos
              </p>

              <p
                className="mt-1 text-2xl font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                {totalProducts}
              </p>
            </div>

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
                Unidades
              </p>

              <p
                className="mt-1 text-2xl font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                {totalUnits}
              </p>
            </div>
          </section>

          {/* Contenido */}
          <section>
            <div className="mb-3">
              <h3
                className="font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                Contenido del CNT
              </h3>

              <p
                className="mt-1 text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Productos almacenados actualmente
              </p>
            </div>

            <CNTItemsTable items={selectedCNT.items} products={products} />
          </section>
        </>
      )}
    </main>
  );
}
