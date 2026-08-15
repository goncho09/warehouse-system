'use client';

import { ArrowRight, History, X } from 'lucide-react';

import type { CNT } from '@/types/CNT';

type Props = {
  isOpen: boolean;
  cnt: CNT | null;
  onClose: () => void;
};

export default function CNTHistoryModal({ isOpen, cnt, onClose }: Props) {
  if (!isOpen || !cnt) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl border"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div
          className="flex items-start justify-between gap-4 border-b px-4 py-4 sm:px-6"
          style={{
            borderColor: 'var(--color-border)',
          }}
        >
          <div>
            <h2
              className="flex items-center gap-2 text-lg font-semibold"
              style={{
                color: 'var(--color-text)',
              }}
            >
              <History size={19} />
              Historial de movimientos
            </h2>

            <p
              className="mt-1 text-sm"
              style={{
                color: 'var(--color-text-secondary)',
              }}
            >
              {cnt.code}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-lg p-2"
            style={{
              color: 'var(--color-text-secondary)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {cnt.movements.length === 0 ? (
            <div
              className="rounded-lg border p-8 text-center text-sm"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Este CNT todavía no tiene movimientos registrados.
            </div>
          ) : (
            <div className="space-y-3">
              {cnt.movements.map((movement) => (
                <div
                  key={movement.id}
                  className="rounded-lg border p-4"
                  style={{
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <span
                      className="font-medium"
                      style={{
                        color: 'var(--color-text)',
                      }}
                    >
                      {movement.fromLocationCode ?? 'Sin ubicación'}
                    </span>

                    <ArrowRight
                      size={16}
                      className="hidden sm:block"
                      style={{
                        color: 'var(--color-text-muted)',
                      }}
                    />

                    <span
                      className="font-medium"
                      style={{
                        color: 'var(--color-primary)',
                      }}
                    >
                      {movement.toLocationCode}
                    </span>
                  </div>

                  <p
                    className="mt-2 text-xs"
                    style={{
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {new Intl.DateTimeFormat('es-UY', {
                      timeZone: 'America/Montevideo',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(new Date(movement.createdAt))}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
