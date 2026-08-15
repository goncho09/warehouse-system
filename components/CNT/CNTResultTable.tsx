'use client';

import { useRef, useState } from 'react';
import { EllipsisVertical, Eye, Move, History } from 'lucide-react';

import type { CNT } from '@/types/CNT';

type Props = {
  cnt: CNT;
  onViewContent: () => void;
  onMove: () => void;
  onViewHistory: () => void;
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

export default function CNTResultTable({
  cnt,
  onViewContent,
  onMove,
  onViewHistory,
}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalUnits = cnt.items.reduce((total, item) => total + item.count, 0);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);

  function handleAction(action: () => void) {
    setIsMenuOpen(false);
    action();
  }

  return (
    <>
      <section
        className="rounded-xl border"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr
                className="border-b text-left text-xs uppercase"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-muted)',
                }}
              >
                <th className="whitespace-nowrap px-4 py-4 font-medium">
                  Código
                </th>

                <th className="whitespace-nowrap px-4 py-4 font-medium">
                  Estado
                </th>

                <th className="whitespace-nowrap px-4 py-4 font-medium">
                  Ubicación
                </th>

                <th className="whitespace-nowrap px-4 py-4 font-medium">
                  Tipo
                </th>

                <th className="whitespace-nowrap px-4 py-4 font-medium">
                  Productos
                </th>

                <th className="whitespace-nowrap px-4 py-4 font-medium">
                  Unidades
                </th>

                <th className="whitespace-nowrap px-4 py-4  font-medium">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  className="whitespace-nowrap px-4 py-4 text-sm font-semibold"
                  style={{ color: 'var(--color-text)' }}
                >
                  {cnt.code}
                </td>

                <td className="whitespace-nowrap px-4 py-4">
                  <span
                    className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{
                      backgroundColor:
                        cnt.status === 'ACTIVO'
                          ? 'var(--color-success-light)'
                          : 'var(--color-border-light)',
                      color:
                        cnt.status === 'ACTIVO'
                          ? 'var(--color-success)'
                          : 'var(--color-text-secondary)',
                    }}
                  >
                    {cnt.status === 'ACTIVO' ? 'Activo' : 'Finalizado'}
                  </span>
                </td>

                <td
                  className="whitespace-nowrap px-4 py-4 text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {cnt.locationCode}
                </td>

                <td
                  className="whitespace-nowrap px-4 py-4 text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {getLocationLabel(cnt.locationType)}
                </td>

                <td
                  className="whitespace-nowrap px-4 py-4 text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {cnt.items.length}
                </td>

                <td
                  className="whitespace-nowrap px-4 py-4 text-sm font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  {totalUnits}
                </td>

                <td className="px-4 py-4">
                  <button
                    ref={buttonRef}
                    type="button"
                    onClick={() => {
                      const rect = buttonRef.current?.getBoundingClientRect();

                      if (!rect) return;

                      setMenuPosition({
                        top: rect.bottom + 6,
                        right: window.innerWidth - rect.right,
                      });

                      setIsMenuOpen((previous) => !previous);
                    }}
                    aria-label="Acciones del CNT"
                    className="rounded-lg p-2 transition-colors hover:bg-(--color-primary-light)"
                    style={{
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <EllipsisVertical size={19} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {isMenuOpen && menuPosition && (
        <div
          className="fixed z-[100] w-56 overflow-hidden rounded-lg border py-1 text-left shadow-xl"
          style={{
            top: menuPosition.top,
            right: menuPosition.right,
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <button
            type="button"
            onClick={() => handleAction(onViewContent)}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-(--color-surface-hover)"
            style={{ color: 'var(--color-text)' }}
          >
            <Eye size={17} />
            Ver contenido
          </button>

          <button
            type="button"
            onClick={() => handleAction(onMove)}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-(--color-surface-hover)"
            style={{ color: 'var(--color-text)' }}
          >
            <Move size={17} />
            Mover CNT
          </button>

          <button
            type="button"
            onClick={() => handleAction(onViewHistory)}
            className="flex text-left w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-(--color-surface-hover)"
            style={{ color: 'var(--color-text)' }}
          >
            <History size={17} />
            Historial de movimientos
          </button>
        </div>
      )}
    </>
  );
}
