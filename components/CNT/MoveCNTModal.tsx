'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import Modal from '../layout/ui/Modal';

import type { CNT } from '@/types/CNT';
import type { Location } from '@/types/Location';

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
  const [isMoving, setIsMoving] = useState(false);

  if (!isOpen || !cnt) {
    return null;
  }

  const pickingLocations = locations.filter(
    (location) =>
      location.type === 'PICKING' && location.code !== cnt.locationCode,
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!targetLocationCode) {
      toast.warning('Falta seleccionar una ubicación', {
        description: 'Seleccioná una ubicación destino para continuar.',
      });
      return;
    }

    try {
      setIsMoving(true);

      const updatedCNT = await onMove(cnt!.code, targetLocationCode);

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

  function handleClose() {
    if (isMoving) return;

    setTargetLocationCode('');
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="lg"
      title="Mover CNT"
      subtitle={cnt.code}
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isMoving}
            className="w-full rounded-lg border px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="move-cnt-form"
            disabled={isMoving}
            className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            style={{
              backgroundColor: 'var(--color-primary)',
            }}
          >
            {isMoving ? 'Moviendo...' : 'Mover CNT'}
          </button>
        </div>
      }
    >
      <form
        id="move-cnt-form"
        onSubmit={handleSubmit}
        className="space-y-5 p-4 sm:p-6"
      >
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
            {cnt.locationCode}
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
            disabled={isMoving}
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
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
      </form>
    </Modal>
  );
}
