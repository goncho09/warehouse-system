'use client';

import { ArrowRight, History } from 'lucide-react';

import Modal from '../layout/ui/Modal';
import { formatDateTime } from '@/lib/date';

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <span className="flex items-center gap-2">
          <History
            size={19}
            style={{
              color: 'var(--color-primary)',
            }}
          />
          Historial de movimientos
        </span>
      }
      subtitle={cnt.code}
    >
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
                  {formatDateTime(movement.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
