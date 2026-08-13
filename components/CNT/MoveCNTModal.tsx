'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { CNT } from '@/types/CNT';
import type { Location } from '@/types/Location';
import { toast } from 'sonner';

type Props = {
  isOpen: boolean;
  cnt: CNT | null;
  locations: Location[];
  onClose: () => void;
  onMove: (cntCode: string, targetLocationCode: string) => Promise<CNT>;
};

export default function MoveCNTModal({
  isOpen,
  cnt,
  locations,
  onClose,
  onMove,
}: Props) {
  const [targetLocationCode, setTargetLocationCode] = useState('');
  const [currentCNT, setCurrentCNT] = useState<CNT | null>(cnt);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    if (cnt) {
      setCurrentCNT(cnt);
      setTargetLocationCode('');
    }
  }, [cnt]);

  if (!isOpen || !cnt) return null;

  const pickingLocations = locations.filter(
    (location) =>
      location.type === 'PICKING' && location.code !== currentCNT?.locationCode,
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!currentCNT) {
      toast.error('CNT no seleccionado', {
        description: 'No hay ningún CNT seleccionado.',
      });
      return;
    }

    if (!targetLocationCode) {
      toast.warning('Falta seleccionar una ubicación', {
        description: 'Seleccioná una ubicación destino para continuar.',
      });
      return;
    }

    try {
      setIsMoving(true);

      const updatedCNT = await onMove(currentCNT.code, targetLocationCode);

      setCurrentCNT(updatedCNT);
      toast.success(`${updatedCNT.code} movido a ${updatedCNT.locationCode}.`);

      onClose();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : 'No se pudo mover el CNT.',
      );
    } finally {
      setIsMoving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-lg rounded-xl border"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{
            borderColor: 'var(--color-border)',
          }}
        >
          <div>
            <h2
              className="text-lg font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              Mover CNT
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
            className="rounded-lg p-2"
            style={{
              color: 'var(--color-text-secondary)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-6">
            <div>
              <p
                className="mb-1 text-sm"
                style={{
                  color: 'var(--color-text-secondary)',
                }}
              >
                Ubicación actual
              </p>

              <p
                className="font-medium"
                style={{
                  color: 'var(--color-text)',
                }}
              >
                {currentCNT?.locationCode}
              </p>
            </div>

            <div>
              <label
                htmlFor="targetLocation"
                className="mb-2 block text-sm font-medium"
                style={{
                  color: 'var(--color-text)',
                }}
              >
                Nueva ubicación
              </label>

              <select
                id="targetLocation"
                value={targetLocationCode}
                onChange={(event) => setTargetLocationCode(event.target.value)}
                required
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text)',
                }}
              >
                <option value="">Seleccionar ubicación</option>

                {pickingLocations.map((location) => (
                  <option key={location.code} value={location.code}>
                    {location.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            className="flex justify-end gap-3 border-t px-6 py-4"
            style={{
              borderColor: 'var(--color-border)',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2.5 text-sm font-medium"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isMoving}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                backgroundColor: 'var(--color-primary)',
              }}
            >
              {isMoving ? 'Moviendo...' : 'Mover CNT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
