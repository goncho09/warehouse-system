import LocationsView from '@/components/locations/LocationsView';
import type { Location } from '@/types/Location';

export default function LocationsPage() {
  const locations: Location[] = [
    {
      code: 'A1A1A1A1',
      type: 'PICKING',
      chamber: 'A1',
      row: '1',
      position: '1',
      height: '1',
    },
  ];
  return <LocationsView locations={locations} />;
}
