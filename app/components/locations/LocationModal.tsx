'use client';

import { X } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { Location } from '@/types/Location';

type Props = {
  isOpen: boolean;
  locations: Location[];
  onClose: () => void;
  onCreate: (location: Location) => void;
};

type FormData = {
  chamber: string;
  row: string;
  position: string;
  height: string;
};

const initialFormData: FormData = {
  chamber: '',
  row: '',
  position: '',
  height: '',
};

export default function LocationModal({
  isOpen,
  locations,
  onClose,
  onCreate,
}: Props) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState('');

  const generatedCode = useMemo(() => {
    const { chamber, row, position, height } = formData;

    if (!chamber || !row || !position || !height) {
      return '';
    }

    return `${chamber}A${row}${position}${height}`;
  }, [formData]);

  if (!isOpen) return null;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!generatedCode) return;

    const alreadyExists = locations.some(
      (location) => location.code.toLowerCase() === generatedCode.toLowerCase(),
    );

    if (alreadyExists) {
      setError('Ya existe una ubicación con este código.');
      return;
    }

    const newLocation: Location = {
      code: generatedCode,
      type: 'PICKING',
      chamber: formData.chamber,
      row: formData.row,
      position: formData.position,
      height: formData.height,
    };

    onCreate(newLocation);

    setFormData(initialFormData);
    setError('');
    onClose();
  }

  function handleClose() {
    setFormData(initialFormData);
    setError('');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-xl rounded-xl border"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div>
            <h2
              className="text-lg font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              Nueva ubicación
            </h2>

            <p
              className="mt-1 text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Crear una nueva ubicación de picking
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 transition-colors hover:bg-[var(--color-surface-hover)]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="chamber"
                className="mb-2 block text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Cámara
              </label>

              <input
                id="chamber"
                name="chamber"
                type="text"
                required
                value={formData.chamber}
                onChange={handleChange}
                placeholder="160"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="row"
                className="mb-2 block text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Fila
              </label>

              <input
                id="row"
                name="row"
                type="text"
                required
                value={formData.row}
                onChange={handleChange}
                placeholder="011"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="position"
                className="mb-2 block text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Posición
              </label>

              <input
                id="position"
                name="position"
                type="text"
                required
                value={formData.position}
                onChange={handleChange}
                placeholder="01"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="height"
                className="mb-2 block text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Altura
              </label>

              <input
                id="height"
                name="height"
                type="text"
                required
                value={formData.height}
                onChange={handleChange}
                placeholder="04"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            <div className="sm:col-span-2">
              <p
                className="mb-2 text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Código generado
              </p>

              <div
                className="rounded-lg border px-4 py-3"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <span
                  className="font-medium"
                  style={{
                    color: generatedCode
                      ? 'var(--color-primary)'
                      : 'var(--color-text-muted)',
                  }}
                >
                  {generatedCode || 'Completá todos los campos'}
                </span>
              </div>

              {error && (
                <p
                  className="mt-2 text-sm"
                  style={{ color: 'var(--color-danger)' }}
                >
                  {error}
                </p>
              )}
            </div>
          </div>

          <div
            className="flex justify-end gap-3 border-t px-6 py-4"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-(--color-surface-hover)"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Crear ubicación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
