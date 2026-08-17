export const dynamic = 'force-dynamic';

import LocationsView from '@/components/locations/LocationsView';
import { prisma } from '@/lib/prisma';

import type { Location } from '@/types/Location';

export default async function LocationsPage() {
  const dbLocations = await prisma.location.findMany({
    orderBy: {
      code: 'asc',
    },
  });

  const locations: Location[] = dbLocations.map((location) => ({
    code: location.code,
    type: location.type,
    chamber: location.chamber ?? '',
    row: location.row ?? '',
    position: location.position ?? '',
    height: location.height ?? '',
  }));

  return <LocationsView locations={locations} />;
}
