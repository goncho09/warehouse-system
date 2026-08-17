'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

import PageHeader from '../layout/ui/PageHeader';

import CNTResultTable from './CNTResultTable';
import CNTContentModal from './CNTContentModal';
import MoveCNTModal from './MoveCNTModal';
import CNTHistoryModal from './CNTHistoryModal';

import { moveCNT } from '@/app/actions/cnts';

import type { CNT } from '@/types/CNT';
import type { Product } from '@/types/Product';
import type { Location } from '@/types/Location';

type Props = {
  cnts: CNT[];
  products: Product[];
  locations: Location[];
};

export default function CNTView({ cnts, products, locations }: Props) {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [selectedCNT, setSelectedCNT] = useState<CNT | null>(null);

  const [notFound, setNotFound] = useState(false);

  const [isContentModalOpen, setIsContentModalOpen] = useState(false);

  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  function handleSearch() {
    const value = search.trim().toLowerCase();

    if (!value) {
      setSelectedCNT(null);
      setNotFound(false);
      return;
    }

    const foundCNT = cnts.find((cnt) => cnt.code.toLowerCase() === value);

    setSelectedCNT(foundCNT ?? null);
    setNotFound(!foundCNT);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }

  async function handleMoveCNT(cntCode: string, targetLocationCode: string) {
    const result = await moveCNT(cntCode, targetLocationCode);

    const updated = result.cnt;
    const movement = result.movement;

    if (!updated.locationCode || !updated.location) {
      throw new Error('El CNT quedó sin ubicación.');
    }

    const updatedCNT: CNT = {
      id: updated.id,
      code: updated.code,
      status: updated.status,
      locationCode: updated.locationCode,
      locationType: updated.location.type,

      items: updated.items.map((item) => ({
        productId: String(item.productId),
        lot: item.lot,
        dueDate: item.dueDate.toISOString().slice(0, 10),
        count: item.count,
      })),

      movements: [
        {
          id: movement.id,
          fromLocationCode: movement.fromLocationCode,
          toLocationCode: movement.toLocationCode,
          createdAt: movement.createdAt.toISOString(),
        },
        ...(selectedCNT?.movements ?? []),
      ],
    };

    setSelectedCNT(updatedCNT);

    router.refresh();

    return updatedCNT;
  }

  return (
    <div className="flex h-full min-h-0 flex-col p-4 sm:p-6 md:p-8">
      <PageHeader eyebrow="Consulta de unidades logísticas" title="CNT" />

      {/* Buscador */}
      <section
        className="mb-6 rounded-xl border p-4 sm:p-5"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <label
          htmlFor="cnt-search"
          className="mb-2 block text-sm font-medium"
          style={{
            color: 'var(--color-text)',
          }}
        >
          Código CNT
        </label>

        <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{
                color: 'var(--color-text-muted)',
              }}
            />

            <input
              id="cnt-search"
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);

                if (notFound) {
                  setNotFound(false);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ej: CNT-000001"
              className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-[var(--color-primary)]"
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
            className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 sm:w-auto"
            style={{
              backgroundColor: 'var(--color-primary)',
            }}
          >
            Buscar
          </button>
        </div>

        {notFound && (
          <p
            className="mt-3 text-sm"
            style={{
              color: 'var(--color-danger)',
            }}
          >
            No se encontró ningún CNT con ese código.
          </p>
        )}
      </section>

      {/* Resultado */}
      <div className="min-h-0 flex-1">
        {selectedCNT ? (
          <CNTResultTable
            cnt={selectedCNT}
            onViewContent={() => setIsContentModalOpen(true)}
            onMove={() => setIsMoveModalOpen(true)}
            onViewHistory={() => setIsHistoryModalOpen(true)}
          />
        ) : (
          <div
            className="flex h-full min-h-40 items-center justify-center rounded-xl border p-8 text-center"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div>
              <Search
                size={30}
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
                Buscá un CNT
              </p>

              <p
                className="mt-1 text-xs"
                style={{
                  color: 'var(--color-text-secondary)',
                }}
              >
                Ingresá o escaneá el código para consultar sus datos.
              </p>
            </div>
          </div>
        )}
      </div>

      <CNTContentModal
        isOpen={isContentModalOpen}
        cnt={selectedCNT}
        products={products}
        onClose={() => setIsContentModalOpen(false)}
      />

      <MoveCNTModal
        isOpen={isMoveModalOpen}
        cnt={selectedCNT}
        locations={locations}
        onClose={() => setIsMoveModalOpen(false)}
        onMove={handleMoveCNT}
      />

      <CNTHistoryModal
        isOpen={isHistoryModalOpen}
        cnt={selectedCNT}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </div>
  );
}
