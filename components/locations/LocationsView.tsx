'use client';

import { useState } from 'react';
import { MapPinned, Plus } from 'lucide-react';

import LocationsTable from './LocationsTable';
import LocationModal from './LocationModal';

import type { Location } from '@/types/Location';

type Props = {
  locations: Location[];
};

export default function LocationsView({ locations }: Props) {
  const [locationsList, setLocationsList] = useState<Location[]>(locations);

  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleCreateLocation(location: Location) {
    setLocationsList((previous) => [...previous, location]);
  }

  const pickingCount = locationsList.filter(
    (location) => location.type === 'PICKING',
  ).length;

  const specialCount = locationsList.length - pickingCount;

  return (
    <main className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p
            className="mb-1 text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Organización del depósito
          </p>

          <h1
            className="text-2xl font-semibold"
            style={{ color: 'var(--color-text)' }}
          >
            Ubicaciones
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 rounded-lg border px-3 py-2"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <MapPinned size={18} />
            <span className="text-sm">{locationsList.length} ubicaciones</span>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            style={{
              backgroundColor: 'var(--color-primary)',
            }}
          >
            <Plus size={18} />
            Nueva ubicación
          </button>
        </div>
      </div>

      <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* tus 3 cards */}
      </section>

      <LocationsTable locations={locationsList} />

      <LocationModal
        isOpen={isModalOpen}
        locations={locationsList}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateLocation}
      />
    </main>
  );
}
