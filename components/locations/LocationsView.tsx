'use client';

import { useState } from 'react';
import { MapPinned, Plus } from 'lucide-react';

import PageHeader from '../layout/ui/PageHeader';
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

  return (
    <div className="flex h-full min-h-0 flex-col p-4 sm:p-6 md:p-8">
      <PageHeader
        eyebrow="Organización del depósito"
        title="Ubicaciones"
        actions={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div
              className="flex items-center justify-center gap-2 rounded-lg border px-3 py-2"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <MapPinned size={18} />

              <span className="text-sm">
                {locationsList.length}{' '}
                {locationsList.length === 1 ? 'ubicación' : 'ubicaciones'}
                {' · '}
                {pickingCount} picking
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:w-auto"
              style={{
                backgroundColor: 'var(--color-primary)',
              }}
            >
              <Plus size={18} />
              Nueva ubicación
            </button>
          </div>
        }
      />

      <div className="min-h-0 flex-1">
        <LocationsTable locations={locationsList} />
      </div>

      <LocationModal
        isOpen={isModalOpen}
        locations={locationsList}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateLocation}
      />
    </div>
  );
}
